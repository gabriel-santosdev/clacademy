interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

/** Link absoluto para o site (NUXT_PUBLIC_SITE_URL). */
export function siteLink(path: string) {
  return new URL(path, useRuntimeConfig().public.siteUrl).toString()
}

/**
 * Envia um e-mail pelo Resend (https://resend.com). Sem NUXT_EMAIL_RESEND_API_KEY,
 * só imprime no terminal — útil para testar os fluxos localmente.
 * Nunca lança erro: uma falha de e-mail não deve derrubar cadastro ou pagamento.
 */
export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  const { email } = useRuntimeConfig()
  if (!email.resendApiKey) {
    console.info(`\n[email] (não enviado: Resend não configurado)\nPara: ${msg.to}\nAssunto: ${msg.subject}\n${msg.text}\n`)
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${email.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: email.from,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    })
    if (!res.ok) {
      console.error(`[email] Resend respondeu ${res.status} ao enviar "${msg.subject}":`, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error(`[email] Falha ao enviar "${msg.subject}":`, err)
    return false
  }
}

/** Envia para um usuário pelo id (usado nos avisos de pagamento). */
export async function emailUser(userId: number, build: (user: { name: string }) => Omit<EmailMessage, 'to'>) {
  const db = await useDb()
  const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, userId) })
  if (!user) return false
  return sendEmail({ to: user.email, ...build(user) })
}

// ── Modelos ─────────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

interface Template {
  subject: string
  greeting: string
  paragraphs: string[]
  button?: { label: string; url: string }
  footnote?: string
}

function render(t: Template): Omit<EmailMessage, 'to'> {
  const paragraphs = t.paragraphs.map((p) => `<p style="margin:0 0 16px">${esc(p)}</p>`).join('')
  const button = t.button
    ? `<p style="margin:24px 0"><a href="${esc(t.button.url)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">${esc(t.button.label)}</a></p>
       <p style="margin:0 0 16px;font-size:13px;color:#666">Se o botão não funcionar, copie e cole este endereço no navegador:<br><a href="${esc(t.button.url)}" style="color:#666;word-break:break-all">${esc(t.button.url)}</a></p>`
    : ''
  const footnote = t.footnote ? `<p style="margin:16px 0 0;font-size:13px;color:#666">${esc(t.footnote)}</p>` : ''

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:#111">
<div style="max-width:520px;margin:0 auto;padding:32px 16px">
  <p style="margin:0 0 24px;font-size:18px;font-weight:700;letter-spacing:.5px">CL ACADEMY</p>
  <div style="background:#fff;border-radius:12px;padding:28px;font-size:15px;line-height:1.55">
    <p style="margin:0 0 16px;font-weight:600">${esc(t.greeting)}</p>
    ${paragraphs}${button}${footnote}
  </div>
  <p style="margin:16px 0 0;font-size:12px;color:#888;text-align:center">CL Academy · Este é um e-mail automático.</p>
</div></body></html>`

  const text = [
    t.greeting,
    '',
    ...t.paragraphs.flatMap((p) => [p, '']),
    ...(t.button ? [`${t.button.label}: ${t.button.url}`, ''] : []),
    ...(t.footnote ? [t.footnote] : []),
  ].join('\n')

  return { subject: t.subject, html, text }
}

export const emailTemplates = {
  verifyEmail: (name: string, url: string) =>
    render({
      subject: 'Confirme seu e-mail · CL Academy',
      greeting: `Olá, ${firstName(name)}!`,
      paragraphs: ['Que bom ter você na CL Academy. Para ativar sua conta, confirme seu e-mail clicando no botão abaixo.'],
      button: { label: 'Confirmar meu e-mail', url },
      footnote: 'O link vale por 48 horas. Se você não criou esta conta, ignore este e-mail.',
    }),

  resetPassword: (name: string, url: string) =>
    render({
      subject: 'Redefinir sua senha · CL Academy',
      greeting: `Olá, ${firstName(name)}!`,
      paragraphs: ['Recebemos um pedido para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.'],
      button: { label: 'Criar nova senha', url },
      footnote: 'O link vale por 1 hora. Se não foi você, ignore este e-mail — sua senha continua a mesma.',
    }),

  paymentConfirmed: (name: string, planName: string, amount: string, validUntil: string) =>
    render({
      subject: 'Pagamento confirmado ✅ · CL Academy',
      greeting: `Olá, ${firstName(name)}!`,
      paragraphs: [`Recebemos seu pagamento de ${amount} do plano ${planName}.`, `Seu plano está ativo até ${validUntil}. Bons treinos!`],
      button: { label: 'Abrir o app', url: siteLink('/app/aluno') },
    }),

  newCharge: (name: string, planName: string, amount: string, dueDate: string) =>
    render({
      subject: `Mensalidade disponível: ${amount} · CL Academy`,
      greeting: `Olá, ${firstName(name)}!`,
      paragraphs: [
        `Sua mensalidade do plano ${planName} já está disponível.`,
        `Valor: ${amount} · Vencimento: ${dueDate}`,
        'No app você encontra a chave Pix e as instruções de pagamento.',
      ],
      button: { label: 'Ver como pagar', url: siteLink('/app/aluno/plano') },
    }),

  paymentOverdue: (name: string) =>
    render({
      subject: 'Mensalidade em atraso · CL Academy',
      greeting: `Olá, ${firstName(name)}!`,
      paragraphs: [
        'Não identificamos o pagamento da sua mensalidade.',
        'Regularize para continuar acessando seus treinos. Se você já pagou, desconsidere este aviso ou fale com a gente.',
      ],
      button: { label: 'Regularizar pagamento', url: siteLink('/app/aluno/plano') },
    }),
}
