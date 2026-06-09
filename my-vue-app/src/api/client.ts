import type { ApiResponse } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'susakin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const REQUEST_TIMEOUT_MS = 30_000

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Server không phản hồi. Thử lại sau vài giây.', 408)
    }
    throw new ApiError('Không kết nối được server. Kiểm tra mạng hoặc backend.', 0)
  } finally {
    window.clearTimeout(timeoutId)
  }

  let json: ApiResponse<T>
  try {
    json = await res.json()
  } catch {
    throw new ApiError('Phản hồi không hợp lệ từ server', res.status)
  }

  if (!res.ok || !json.success) {
    throw new ApiError(json.message || 'Đã xảy ra lỗi', res.status)
  }

  return json.data
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
