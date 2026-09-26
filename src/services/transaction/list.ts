import { axiosPrivate } from "../../libs/instance";
import type { transactionListProps } from "../../models/transaction/list";

export interface TransactionListParams {
  page?: number
  limit?: number
  status?: string
  /** boleh beberapa stage sekaligus, dipisah koma */
  current_stage?: string
  /** hanya pengajuan yang menunggu tindakan user yang sedang login */
  waiting_for_me?: boolean
  /** tanggal transaksi, format YYYY-MM-DD */
  start_date?: string
  end_date?: string
}

export const transactionList = async (
  params: TransactionListParams = {}
): Promise<transactionListProps> => {
  const {
    page = 1,
    limit = 10,
    status,
    current_stage,
    waiting_for_me,
    start_date,
    end_date,
  } = params

  const res = await axiosPrivate.get(`/transactions/procurement`, {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(current_stage ? { current_stage } : {}),
      ...(waiting_for_me ? { waiting_for_me: true } : {}),
      ...(start_date ? { start_date } : {}),
      ...(end_date ? { end_date } : {}),
    },
  })

  if (!res) {
    throw new Error('fail to get list tranxaction')
  }

  return res.data
}
