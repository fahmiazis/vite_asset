import { useHomebaseList } from "./list"

/**
 * Homebase aktif milik user yang login — cerminan GetUserActiveHomebase di
 * backend (`branch_type = 'homebase' AND is_active = true`).
 *
 * Dipakai untuk memfilter aset agar hanya menampilkan yang berada di cabang
 * yang sama dengan pembuat transaksi, sesuai validasi AddAssetToDisposal.
 */
export const useActiveHomebase = () => {
  const { data, isLoading, error } = useHomebaseList()

  const active = (data?.data ?? []).find(
    (item) => item.is_active && item.branch_type === "homebase"
  )

  const branchType = active?.branch?.branch_type ?? ""

  return {
    branchId: active?.branch?.id,
    branchCode: active?.branch?.branch_code,
    branchName: active?.branch?.branch_name,
    branchType,
    /** homebase aktif di kantor pusat — cerminan isHO di CreateProcurement */
    isHo: ["HO", "HEAD OFFICE"].includes(branchType.toUpperCase()),
    isLoading,
    error,
  }
}
