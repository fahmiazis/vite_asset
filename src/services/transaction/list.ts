import { axiosPrivate } from "../../libs/instance";
import type { transactionListProps } from "../../models/transaction/list";
export const transactionList = async (): Promise<transactionListProps> => {
  const res = await axiosPrivate.get(`/transactions/procurement?page=1&limit=10`)

  if (!res) {
    throw new Error('fail to get list tranxaction')
  }

  const data = await res.data
  return data
}