import { useEffect, useState } from "react"
import { axiosPrivate } from "../../libs/instance"

interface AuthedBlobState {
  objectUrl: string | null
  mimeType: string | null
  isLoading: boolean
  isError: boolean
}

const IDLE: AuthedBlobState = { objectUrl: null, mimeType: null, isLoading: false, isError: false }

// Endpoint file (foto/dokumen stock opname) butuh header Authorization, jadi
// gak bisa langsung dipakai sebagai <img src>/<iframe src> — browser gak
// ngirim header itu dari tag. Hook ini fetch lewat axiosPrivate (token ikut),
// lalu ngasih blob URL yang aman dipakai di tag mana pun. Blob URL otomatis
// di-revoke pas url berubah / komponen unmount.
export function useAuthedBlobUrl(url?: string | null, enabled = true): AuthedBlobState {
  const [state, setState] = useState<AuthedBlobState>(IDLE)

  useEffect(() => {
    if (!url || !enabled) {
      setState(IDLE)
      return
    }

    let cancelled = false
    let created: string | null = null
    setState({ ...IDLE, isLoading: true })

    axiosPrivate
      .get<Blob>(url, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return
        created = URL.createObjectURL(res.data)
        setState({ objectUrl: created, mimeType: res.data.type || null, isLoading: false, isError: false })
      })
      .catch(() => {
        if (!cancelled) setState({ ...IDLE, isError: true })
      })

    return () => {
      cancelled = true
      if (created) URL.revokeObjectURL(created)
    }
  }, [url, enabled])

  return state
}
