import { axiosPrivate } from "../../libs/instance"

/**
 * Ambil file attachment sebagai blob.
 *
 * Endpoint-nya butuh Authorization header, jadi file tidak bisa dipasang
 * langsung ke <img src> / <iframe src>. Diambil sebagai blob lalu dibungkus
 * object URL — cara ini juga dipakai untuk tombol download.
 */
export const disposalAttachmentFile = async (attachmentId: number): Promise<Blob> => {
  const res = await axiosPrivate.get(
    `/transactions/disposal/attachments/${attachmentId}/file`,
    { responseType: "blob" }
  )
  return res.data
}
