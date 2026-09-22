import { axiosPrivate } from "../../libs/instance"
import type {
  CreateStockOpnameConditionMasterPayload,
  CreateStockOpnamePhysicalStatusMasterPayload,
  stockOpnameConditionMasterCreateProps,
  stockOpnameConditionMasterListProps,
  stockOpnamePhysicalStatusMasterCreateProps,
  stockOpnamePhysicalStatusMasterListProps,
} from "../../models/stockOpname/statusMaster"

const BASE_URL = "/transactions/stock-opname/status-master"

export const getStockOpnamePhysicalStatusMasters = async (): Promise<stockOpnamePhysicalStatusMasterListProps> => {
  const res = await axiosPrivate.get(`${BASE_URL}/physical-status`)
  return res.data
}

export const createStockOpnamePhysicalStatusMaster = async (
  payload: CreateStockOpnamePhysicalStatusMasterPayload
): Promise<stockOpnamePhysicalStatusMasterCreateProps> => {
  const res = await axiosPrivate.post(`${BASE_URL}/physical-status`, payload)
  return res.data
}

export const deleteStockOpnamePhysicalStatusMaster = async (id: number) => {
  const res = await axiosPrivate.delete(`${BASE_URL}/physical-status/${id}`)
  return res.data
}

export const getStockOpnameConditionMasters = async (): Promise<stockOpnameConditionMasterListProps> => {
  const res = await axiosPrivate.get(`${BASE_URL}/condition`)
  return res.data
}

export const createStockOpnameConditionMaster = async (
  payload: CreateStockOpnameConditionMasterPayload
): Promise<stockOpnameConditionMasterCreateProps> => {
  const res = await axiosPrivate.post(`${BASE_URL}/condition`, payload)
  return res.data
}

export const deleteStockOpnameConditionMaster = async (id: number) => {
  const res = await axiosPrivate.delete(`${BASE_URL}/condition/${id}`)
  return res.data
}
