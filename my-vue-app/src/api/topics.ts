import { api } from './client'
import type { Lesson, Topic, Vocabulary } from '../types'

export const topicsApi = {
  getAll: () => api.get<Topic[]>('/api/topics'),

  getById: (id: number) => api.get<Topic>(`/api/topics/${id}`),

  getVocabularies: (id: number, keyword?: string) => {
    const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''
    return api.get<Vocabulary[]>(`/api/topics/${id}/vocabularies${params}`)
  },

  getLessons: (id: number, type?: string) => {
    const params = type ? `?type=${type}` : ''
    return api.get<Lesson[]>(`/api/topics/${id}/lessons${params}`)
  },
}
