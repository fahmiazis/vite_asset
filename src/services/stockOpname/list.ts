import { axiosPrivate } from "../../libs/instance"
import type { stockOpnameListProps } from "../../models/stockOpname/list"

export interface StockOpnameListParams {
  page?: number
  /** dibatasi BE max 100 */
  limit?: number
  status?: string
  /** boleh beberapa stage sekaligus, dipisah koma */
  current_stage?: string
  /** hanya stock opname yang menunggu tindakan user yang sedang login */
  waiting_for_me?: boolean
  /** tanggal transaksi, format YYYY-MM-DD */
  start_date?: string
  end_date?: string
  /** nomor transaksi atau nama pembuat */
  search?: string
}

export const stockOpnameList = async (
  params: StockOpnameListParams = {}
): Promise<stockOpnameListProps> => {
  const {
    page = 1,
    limit = 10,
    status,
    current_stage,
    waiting_for_me,
    start_date,
    end_date,
    search,
  } = params

  const res = await axiosPrivate.get("/transactions/stock-opname", {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(current_stage ? { current_stage } : {}),
      ...(waiting_for_me ? { waiting_for_me: true } : {}),
      ...(start_date ? { start_date } : {}),
      ...(end_date ? { end_date } : {}),
      ...(search ? { search } : {}),
    },
  })

  if (!res) {
    throw new Error("fail to get list stock opname")
  }

  return res.data
}
