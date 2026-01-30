import Cookies from 'js-cookie'

export const getAccessTokenClient = () =>
  Cookies.get('accessToken') ?? null

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
