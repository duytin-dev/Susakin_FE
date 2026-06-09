import { api } from './client'
import type { AuthData, LoginRequest, RegisterRequest } from '../types'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthData>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<null>('/api/auth/register', data),

  logout: () => api.post<null>('/api/auth/logout'),
}
