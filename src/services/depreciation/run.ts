import { axiosPrivate } from "../../libs/instance"

export interface RunDepreciationResponse {
  status: string
  message: string
  data: {
    period: string
    /** aset yang benar-benar dihitung; yang sudah dihitung di period ini dilewati */
    processed_assets: number
  }
}

/** period: YYYY-MM */
export const runDepreciation = async (period: string): Promise<RunDepreciationResponse> => {
  const res = await axiosPrivate.post("/depreciation/calculate", { period })

  if (!res) {
    throw new Error("fail to run depreciation")
  }

  return res.data
}
