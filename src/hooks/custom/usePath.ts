import { useLocation } from 'react-router-dom'

export const useIsCrypto = () => {
  const { pathname } = useLocation()
  return pathname.startsWith('/crypto')
}
