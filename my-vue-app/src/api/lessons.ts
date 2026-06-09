import { api } from './client'
import type { Lesson, LessonProgress, ProgressStatus } from '../types'

export const lessonsApi = {
  getById: (id: number) => api.get<Lesson>(`/api/lessons/${id}`),

  saveProgress: (id: number, status: ProgressStatus, score?: number) =>
    api.post<LessonProgress>(`/api/lessons/${id}/progress`, { status, score }),
}
