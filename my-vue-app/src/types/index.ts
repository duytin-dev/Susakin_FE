export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface User {
  id: number
  email: string
  name: string
  grade: number
  createdAt?: string
}

export interface AuthData {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface Topic {
  id: number
  name: string
  thumbnailUrl?: string
  orderIndex: number
}

export interface Vocabulary {
  id: number
  topicId: number
  topicName: string
  word: string
  meaningVi: string
  imageUrl?: string
  audioUrl?: string
  orderIndex: number
}

export interface Lesson {
  id: number
  topicId: number
  topicName: string
  title: string
  type: LessonType
  orderIndex: number
}

export type LessonType = 'FLASHCARD' | 'MATCHING' | 'QUIZ'
export type ProgressStatus = 'IN_PROGRESS' | 'COMPLETED'
export type VocabStatus = 'NEW' | 'LEARNING' | 'MASTERED'

export interface LessonProgress {
  id: number
  lessonId: number
  lessonTitle: string
  lessonType: LessonType
  topicId: number
  topicName: string
  status: ProgressStatus
  score?: number
  completedAt?: string
}

export interface UserVocabulary {
  id: number
  vocabularyId: number
  word: string
  meaningVi: string
  imageUrl?: string
  audioUrl?: string
  topicId: number
  topicName: string
  status: VocabStatus
  learnedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  grade: number
}
