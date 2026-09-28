import { axiosPrivate } from "../../libs/instance"
import type {
  ReviseStockOpnameByApproverRequest,
  ReviseStockOpnameRequest,
  ReviseStockOpnameResponse,
} from "../../models/stockOpname/revise"

export const reviseStockOpnameByApprover = async (
  transactionNumber: string,
  payload: ReviseStockOpnameByApproverRequest
): Promise<ReviseStockOpnameResponse> => {
  const res = await axiosPrivate.post<ReviseStockOpnameResponse>(
    "/transactions/stock-opname/approval/revise",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}

export const reviseStockOpnameByExecutor = async (
  transactionNumber: string,
  payload: ReviseStockOpnameRequest
): Promise<ReviseStockOpnameResponse> => {
  const res = await axiosPrivate.post<ReviseStockOpnameResponse>(
    "/transactions/stock-opname/execute/revise",
    payload,
    { params: { transaction_number: transactionNumber } }
  )
  return res.data
}
