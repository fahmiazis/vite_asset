import { axiosPrivate } from "../../libs/instance"
import type { StockOpnameTemplateUploadResponse } from "../../models/stockOpname/template"

export const uploadStockOpnameTemplate = async (
  transactionNumber: string,
  file: File
): Promise<StockOpnameTemplateUploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await axiosPrivate.post<StockOpnameTemplateUploadResponse>(
    "/transactions/stock-opname/draft/template/upload",
    formData,
    {
      params: { transaction_number: transactionNumber },
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return res.data
}
