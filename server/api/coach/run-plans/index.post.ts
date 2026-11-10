export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const data = await readValidatedBody(event, runPlanSchema.parse)
  return saveRunPlan(data, { createdBy: me.id })
})
