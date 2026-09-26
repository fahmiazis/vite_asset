import { axiosPrivate } from "../../libs/instance";
import type { disposalListProps } from "../../models/disposal/list";

export interface DisposalListParams {
  page: number
  limit: number
  /** filter yang didukung backend (dto.DisposalListFilter) */
  disposal_type?: string
  status?: string
  current_stage?: string
  created_by?: string
  start_date?: string
  end_date?: string
  /** kata kunci: nomor transaksi, catatan, nomor/nama aset di dalamnya */
  search?: string
  /** true = hanya pengajuan yang menunggu tindakan user yang sedang login */
  waiting_for_me?: boolean
}

export const disposalList = async (params: DisposalListParams): Promise<disposalListProps> => {
  const { page, limit, ...filters } = params

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  // hanya kirim filter yang terisi
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.append(key, String(value))
  })

  const res = await axiosPrivate.get(`/transactions/disposal?${query.toString()}`)

  if (!res) {
    throw new Error("fail to get list disposal")
  }

  return res.data
}
