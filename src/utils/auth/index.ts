import Cookies from 'js-cookie'

export const getAccessTokenClient = () =>
  Cookies.get('access_token') ?? null

export const setCookie = (key: string, value: string) => {
  Cookies.set(key, value, {
    sameSite: 'strict',
    secure: true,
  })
}

export const deleteCookie = (key: string) => {
  Cookies.remove(key)
}

export const getCookie = (key: string) => {
  return Cookies.get(key)
}

export function getRolesFromToken(): string[] {
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(c => c.trim().startsWith('token='))
  if (!tokenCookie) return []

  const token = tokenCookie.split('=')[1]?.trim()
  if (!token) return []

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.roles ?? []
  } catch {
    return []
  }
}
