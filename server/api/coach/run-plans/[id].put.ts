export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, runPlanSchema.parse)
  return saveRunPlan(data, { id })
})
