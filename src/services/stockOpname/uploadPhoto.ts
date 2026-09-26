import { axiosPrivate } from "../../libs/instance"
import type { stockOpnameDetailProps } from "../../models/stockOpname/detail"

export const uploadStockOpnamePhoto = async (
  transactionNumber: string,
  assetId: number,
  file: File
): Promise<stockOpnameDetailProps> => {
  const formData = new FormData()
  formData.append("asset_id", String(assetId))
  formData.append("file", file)
  // Dipakai backend buat validasi "maks 10 hari" dari tanggal modified file,
  // bukan EXIF (banyak foto forward/kompres yang EXIF-nya udah hilang).
  formData.append("file_modified_at", String(file.lastModified))

  const res = await axiosPrivate.post<stockOpnameDetailProps>(
    "/transactions/stock-opname/draft/photo/upload",
    formData,
    {
      params: { transaction_number: transactionNumber },
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return res.data
}
