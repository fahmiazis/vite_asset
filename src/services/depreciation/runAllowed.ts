import { axiosPrivate } from "../../libs/instance"

/** apakah user boleh menjalankan penyusutan (hak akses run_depreciation) */
export const runDepreciationAllowed = async (): Promise<boolean> => {
  const res = await axiosPrivate.get("/depreciation/calculate/allowed")
  return !!res?.data?.data?.allowed
}
