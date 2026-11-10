import type { TrainingGoal, TrainingLevel } from '#shared/utils/constants'
export type Audience = 'all' | 'mine' | 'selected'

export const coachingApi = {
  sendFeedback: (logId: number, feedback: string) => $fetch(`/api/coach/logs/${logId}/feedback`, { method: 'POST', body: { feedback } }),
  setCoach: (alunoId: number, coachId: number | null) => $fetch(`/api/coach/students/${alunoId}`, { method: 'PATCH', body: { coachId } }),
  setProfile: (alunoId: number, body: { trainingLevel?: TrainingLevel | null; trainingGoal?: TrainingGoal | null }) =>
    $fetch(`/api/coach/students/${alunoId}`, { method: 'PATCH', body }),
  broadcast: (body: { audience: Audience; title: string; body?: string; userIds?: number[] }) =>
    $fetch('/api/coach/notify', { method: 'POST', body }),
}
