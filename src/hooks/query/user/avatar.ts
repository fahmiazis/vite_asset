import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { userAvatarBlob } from "../../../services/users/profile"

/**
 * Object URL foto profil user. Endpoint-nya ber-auth sehingga tidak bisa
 * dipasang langsung ke <img src>. `null` kalau user tidak punya foto.
 */
export const useUserAvatar = (userId?: string, hasAvatar?: boolean) => {
  const { data: blob, isLoading } = useQuery({
    queryKey: ["user-avatar", userId],
    queryFn: () => userAvatarBlob(userId!),
    enabled: !!userId && !!hasAvatar,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const [url, setUrl] = useState<string | null>(null)

  // dibuat & dibebaskan di effect yang sama — aman untuk StrictMode
  useEffect(() => {
    if (!hasAvatar || !blob) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob, hasAvatar])

  return { url, isLoading: !!hasAvatar && isLoading }
}
