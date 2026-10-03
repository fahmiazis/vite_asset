import { axiosPrivate } from "../../libs/instance"

export interface AssetQRCode {
  asset_number: string
  /** nomor aset terenkripsi (AMSQR1.…) — hanya bisa dibuka backend */
  qr_payload: string
}

/** POST /assets/qr-codes — isi QR untuk aset di halaman yang sedang tampil (maks 100) */
export const assetQRCodes = async (assetNumbers: string[]): Promise<AssetQRCode[]> => {
  const res = await axiosPrivate.post(`/assets/qr-codes`, { asset_numbers: assetNumbers })
  return res.data.data
}
