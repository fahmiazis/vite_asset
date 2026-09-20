import { axiosPrivate } from "../../libs/instance"
import type { stockOpnameConfigProps, UpdateStockOpnameConfigPayload } from "../../models/stockOpname/config"

export const getStockOpnameConfig = async (): Promise<stockOpnameConfigProps> => {
  const res = await axiosPrivate.get("/transactions/stock-opname/config")
  return res.data
}

export const updateStockOpnameConfig = async (
  payload: UpdateStockOpnameConfigPayload
): Promise<stockOpnameConfigProps> => {
  const res = await axiosPrivate.put("/transactions/stock-opname/config", payload)
  return res.data
}
