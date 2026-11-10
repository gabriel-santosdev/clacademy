import { z } from 'zod'

const body = z.object({
  theme: z.enum(['default', 'brasil']).optional(),
  showComingSoon: z.boolean().optional(),
  gymName: z.string().trim().min(1).max(80).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  instagram: z.string().trim().max(60).optional(),
  pixKey: z.string().trim().max(120).optional(),
  paymentInstructions: z.string().trim().max(1000).optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const patch = await readValidatedBody(event, body.parse)
  return saveSettings(patch)
})
