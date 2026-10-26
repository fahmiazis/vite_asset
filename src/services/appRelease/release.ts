import { axiosPrivate } from "../../libs/instance"
import type { appReleaseListProps } from "../../models/appRelease/release"

export interface CreateAppReleasePayload {
  file: File
  version_name: string
  build_number: number
  release_notes: string
}

export const appReleaseList = async (): Promise<appReleaseListProps> => {
  const res = await axiosPrivate.get(`/app-releases`)
  return res.data
}

/** URL unduhan APK — endpoint-nya tanpa auth, jadi cukup dibuka langsung */
export const appReleaseDownloadUrl = (downloadPath: string) =>
  `${axiosPrivate.defaults.baseURL ?? ""}${downloadPath}`

export const createAppRelease = async (
  payload: CreateAppReleasePayload,
  onProgress?: (percent: number) => void
) => {
  const form = new FormData()
  form.append("file", payload.file)
  form.append("version_name", payload.version_name)
  form.append("build_number", String(payload.build_number))
  form.append("release_notes", payload.release_notes)

  const res = await axiosPrivate.post(`/app-releases`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    // APK bisa puluhan MB — jangan kena timeout default 30 detik
    timeout: 0,
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
    },
  })
  return res.data
}

export const deleteAppRelease = async (id: number) => {
  const res = await axiosPrivate.delete(`/app-releases/${id}`)
  return res.data
}
