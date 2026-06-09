import { api } from './client'
import type {
  LessonProgress,
  User,
  UserVocabulary,
  VocabStatus,
} from '../types'

export const usersApi = {
  getMe: () => api.get<User>('/api/users/me'),

  updateMe: (name: string, grade: number) =>
    api.put<User>('/api/users/me', { name, grade }),

  getMyProgress: () =>
    api.get<LessonProgress[]>('/api/users/me/progress'),

  getMyVocabularies: (status?: VocabStatus, topicId?: number) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (topicId) params.set('topicId', String(topicId))
    const qs = params.toString()
    return api.get<UserVocabulary[]>(
      `/api/users/me/vocabularies${qs ? `?${qs}` : ''}`,
    )
  },

  saveVocabulary: (vocabularyId: number) =>
    api.post<UserVocabulary>('/api/users/me/vocabularies', { vocabularyId }),

  updateVocabulary: (id: number, status: VocabStatus) =>
    api.put<UserVocabulary>(`/api/users/me/vocabularies/${id}`, { status }),

  deleteVocabulary: (id: number) =>
    api.delete<null>(`/api/users/me/vocabularies/${id}`),
}
