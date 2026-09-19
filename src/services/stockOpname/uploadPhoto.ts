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
