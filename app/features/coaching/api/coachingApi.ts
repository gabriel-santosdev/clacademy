export type Audience = 'all' | 'mine' | 'selected'

export const coachingApi = {
  sendFeedback: (logId: number, feedback: string) => $fetch(`/api/coach/logs/${logId}/feedback`, { method: 'POST', body: { feedback } }),
  setCoach: (alunoId: number, coachId: number | null) => $fetch(`/api/coach/students/${alunoId}`, { method: 'PATCH', body: { coachId } }),
  broadcast: (body: { audience: Audience; title: string; body?: string; userIds?: number[] }) =>
    $fetch('/api/coach/notify', { method: 'POST', body }),
}
