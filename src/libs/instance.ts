import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import toast from 'react-hot-toast'
import qs from 'qs'
import { deleteCookie, getAccessTokenClient, getCookie, setCookie } from '../utils/auth'

/**
 * ===============================
 * ENV
 * ===============================
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const UPLOAD_BASE_URL = import.meta.env.VITE_API_UPLOAD_IMAGE
const UPLOAD_API_KEY = import.meta.env.VITE_KEY_IMAGE_ACCESS


const buildAuthorizationHeader = (token: string): string => {
  return `Bearer ${token}`
}
/**
 * ===============================
 * Refresh token state
 * ===============================
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token)
  })
  failedQueue = []
}

/**
 * ===============================
 * Helpers
 * ===============================
 */
const getCSRFToken = (): string | null =>
  localStorage.getItem('csrfToken')

const getRefreshToken = (): string | null =>
  getCookie('refreshToken') ?? null

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken()
    const csrfToken = getCSRFToken()

    if (!refreshToken || !csrfToken) {
      throw new Error('Missing refresh / csrf token')
    }

    const res = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'x-refresh-token': refreshToken,
          'x-csrf-token': csrfToken,
        },
      }
    )

    const { accessToken, refreshToken: newRefresh } = res.data ?? {}

    if (accessToken) {
      setCookie('accessToken', accessToken)
      if (newRefresh) setCookie('refreshToken', newRefresh)
      return accessToken
    }

    return null
  } catch (err) {
    console.error('Refresh token failed', err)
    return null
  }
}

/**
 * ===============================
 * AXIOS PRIVATE
 * ===============================
 */
export const axiosPrivate: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessTokenClient()
    if (token) {
      config.headers.Authorization = buildAuthorizationHeader(token)
    }
    return config
  }
)

axiosPrivate.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject })
    //     }).then((token) => {
    //       if (token) {
    //         originalRequest.headers.Authorization = `Bearer ${token}`
    //       }
    //       return axiosPrivate(originalRequest)
    //     })
    //   }

    //   originalRequest._retry = true
    //   isRefreshing = true

    //   try {
    //     const newToken = await refreshAccessToken()

    //     if (newToken) {
    //       processQueue(null, newToken)
    //       originalRequest.headers.Authorization = `Bearer ${newToken}`
    //       return axiosPrivate(originalRequest)
    //     }

    //     throw error
    //   } catch (err) {
    //     processQueue(error, null)

    //     deleteCookie('accessToken')
    //     deleteCookie('refreshToken')
    //     localStorage.removeItem('csrfToken')

    //     toast.error('Sesi kamu sudah habis, silakan login ulang')
    //     setTimeout(() => (window.location.href = '/login'), 1500)

    //     return Promise.reject(err)
    //   } finally {
    //     isRefreshing = false
    //   }
    // }

    return Promise.reject(error)
  }
)

/**
 * ===============================
 * AXIOS PUBLIC
 * ===============================
 */
export const axiosPublic: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosPublic.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    const message =
      (error.response?.data as { message?: string })?.message ??
      'Terjadi kesalahan'

    toast.error(`Error ${status}: ${message}`)
    return Promise.reject(error)
  }
)

/**
 * ===============================
 * AXIOS UPLOAD
 * ===============================
 */
export const axiosUpload: AxiosInstance = axios.create({
  baseURL: UPLOAD_BASE_URL,
  timeout: 60_000,
  headers: {
    'x-api-key': UPLOAD_API_KEY,
  },
})

/**
 * ===============================
 * QUERY BUILDER
 * ===============================
 */
export const buildQuery = <T extends Record<string, unknown>>(
  params?: T
) => (params ? `?${qs.stringify(params)}` : '')
