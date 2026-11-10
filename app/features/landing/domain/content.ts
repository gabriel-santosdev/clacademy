/** Conteúdo institucional da landing. Editar textos aqui, não nos componentes. Sem travessões. */

const TAGLINE = 'onde o movimento vira experiência'
const DEFAULT_INSTAGRAM = 'clacademyyy'

const NAV_LINKS = [
  { href: '#app', label: 'O app' },
  { href: '#diferenca', label: 'Diferença' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#planos', label: 'Planos' },
  { href: '#faq', label: 'Dúvidas' },
]

const TICKER = ['Personal', 'Força', 'Hipertrofia', 'Mobilidade', 'CL Run', '5K', '10K', '21K', 'Pace', 'Eventos CL']

export type DemoScreen = 'today' | 'log' | 'plan' | 'progress'

const DEMO_TABS: { key: DemoScreen; label: string; title: string; text: string; hint: string }[] = [
  {
    key: 'today',
    label: 'Treino do dia',
    title: 'Abriu o app, o treino está lá.',
    text: 'Séries, carga e descanso que o seu professor montou pra você. Vai marcando cada exercício enquanto treina.',
    hint: 'Toque nos exercícios para marcar',
  },
  {
    key: 'log',
    label: 'Esforço e retorno',
    title: 'Diz como foi. Alguém lê.',
    text: 'Terminou, marca o esforço de 1 a 10 e escreve como se sentiu. Seu professor vê no painel dele e responde em cima daquele treino.',
    hint: 'Arraste o esforço e envie',
  },
  {
    key: 'plan',
    label: 'Planilha de corrida',
    title: 'A semana inteira na mão.',
    text: 'Rodagem, tiro e longão com distância e pace alvo. A planilha é montada para a sua prova, do primeiro 5K à meia maratona.',
    hint: 'Toque nos dias da semana',
  },
  {
    key: 'progress',
    label: 'Evolução',
    title: 'Dá pra ver que está melhorando.',
    text: 'Km por semana, pace médio e frequência em gráfico. Conectou o Strava, suas corridas entram sozinhas.',
    hint: 'Troque entre km e treinos',
  },
]

/** Comparativo com apps de ficha comuns. Não citar concorrentes pelo nome. */
const COMPARE = [
  {
    icon: 'pi-comments',
    topic: 'Retorno',
    before: 'Você manda print da ficha no WhatsApp e fica esperando.',
    after: 'Cada treino registrado cai no painel do professor, que responde ali mesmo.',
  },
  {
    icon: 'pi-gauge',
    topic: 'Esforço',
    before: 'Ninguém sabe se o treino foi leve ou se você quase não terminou.',
    after: 'Você marca o esforço de 1 a 10 e a carga da semana seguinte é ajustada com base nisso.',
  },
  {
    icon: 'pi-th-large',
    topic: 'Tudo junto',
    before: 'Um app para a ficha, outro para a corrida, outro para os avisos.',
    after: 'Treino de força, planilha de corrida e avisos dos eventos no mesmo lugar.',
  },
  {
    icon: 'pi-sync',
    topic: 'Corrida',
    before: 'Copiar distância e pace do relógio na mão, toda vez.',
    after: 'Conectou o Strava, a corrida aparece sozinha no seu histórico.',
  },
  {
    icon: 'pi-mobile',
    topic: 'Instalar',
    before: 'Procurar na loja, baixar, liberar espaço no celular.',
    after: 'Instala pelo navegador em segundos e abre o treino do dia mesmo sem internet.',
  },
  {
    icon: 'pi-users',
    topic: 'Quem acompanha',
    before: 'Um professor que você nunca viu pessoalmente.',
    after: 'O seu professor da CL Academy, que conhece o seu treino e o seu objetivo.',
  },
]

export interface Service {
  key: 'personal' | 'corrida' | 'eventos'
  title: string
  kicker: string
  text: string
  tags: string[]
}

/** Foco comercial: personal e assessoria de corrida. Aulas coletivas só nos eventos. */
const SERVICES: Service[] = [
  {
    key: 'personal',
    kicker: 'Serviço principal',
    title: 'Personal trainer',
    text: 'Treino individual montado para o seu objetivo, com acompanhamento de perto e ajuste semana a semana pelo app.',
    tags: ['Força', 'Hipertrofia', 'Emagrecimento', 'Mobilidade'],
  },
  {
    key: 'corrida',
    kicker: 'Serviço principal',
    title: 'Assessoria CL Run',
    text: 'Planilha semanal com rodagem, tiro e longão, ajustada ao seu ritmo e à sua prova. Do primeiro 5K à meia maratona.',
    tags: ['5K a 21K', 'Pace alvo', 'Strava'],
  },
  {
    key: 'eventos',
    kicker: 'Para a comunidade',
    title: 'Eventos CL Academy',
    text: 'De tempos em tempos a gente junta todo mundo: aulão de funcional, dança e corrida, com parceiros e sorteios.',
    tags: ['Aulões', 'Funcional', 'Dança', 'Corrida'],
  },
]

const STEPS = [
  { title: 'Escolha o plano', text: 'Personal ou assessoria de corrida. A conta sai em menos de um minuto.' },
  { title: 'Receba o treino', text: 'Seu professor monta a ficha e a planilha e manda direto para o app.' },
  { title: 'Treine e registre', text: 'Marque o que fez, diga como foi e veja o retorno chegar.' },
]

const FAQ = [
  {
    q: 'Preciso baixar o app em alguma loja?',
    a: 'Não. O app da CL Academy instala direto pelo navegador, sem App Store ou Play Store. Ocupa pouquíssimo espaço, abre em tela cheia e se atualiza sozinho.',
  },
  {
    q: 'Funciona no iPhone?',
    a: 'Funciona. Abra o site no Safari, toque em Compartilhar e depois em "Adicionar à Tela de Início". Para receber notificações no iPhone, instale dessa forma.',
  },
  {
    q: 'Consigo ver meu treino sem internet?',
    a: 'Consegue. Depois de aberto uma vez, o treino do dia e seus dados ficam salvos no aparelho.',
  },
  {
    q: 'Como funciona o personal?',
    a: 'Você tem acompanhamento individual: o professor monta a ficha para o seu objetivo, manda pelo app e ajusta a cada semana com base no que você registra.',
  },
  {
    q: 'E as aulas coletivas?',
    a: 'Elas acontecem nos eventos CL Academy, abertos à comunidade. As datas são divulgadas no Instagram e chegam como aviso no app.',
  },
  {
    q: 'O que é esse esforço de 1 a 10?',
    a: 'É a escala de esforço percebido. Ao registrar o treino você diz o quanto ele pesou. Com isso o professor sabe se pode subir a carga ou se é hora de aliviar.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Você escolhe o plano e a periodicidade (mensal, trimestral, semestral ou anual) e paga por Pix, boleto ou cartão. Alguns planos têm dias grátis para experimentar.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Pode. O cancelamento é feito pelo próprio app e o acesso continua até o fim do período já pago.',
  },
  {
    q: 'Uso relógio com Strava. Dá para integrar?',
    a: 'Dá. Conecte sua conta Strava no perfil e as corridas são importadas automaticamente para o histórico.',
  },
]

export const LANDING = {
  tagline: TAGLINE,
  instagram: DEFAULT_INSTAGRAM,
  nav: NAV_LINKS,
  ticker: TICKER,
  demo: DEMO_TABS,
  compare: COMPARE,
  services: SERVICES,
  steps: STEPS,
  faq: FAQ,
}
