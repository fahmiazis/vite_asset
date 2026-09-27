import { axiosPrivate } from "../../libs/instance"

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback
  const match = contentDisposition.match(/filename="?([^"；;]+)"?/i)
  return match?.[1]?.trim() || fallback
}

export const downloadStockOpnameDocumentation = async (transactionNumber: string): Promise<void> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/documentation/download", {
    params: { transaction_number: transactionNumber },
    responseType: "blob",
  })

  const filename = extractFilename(
    res.headers["content-disposition"],
    `stock_opname_dokumentasi_${transactionNumber}.xlsx`
  )
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
