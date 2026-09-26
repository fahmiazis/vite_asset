import { useQuery } from "@tanstack/react-query"
import { runDepreciationAllowed } from "../../../services/depreciation/runAllowed"

/**
 * Hak akses run_depreciation ada di menu bertipe permission ("Asset Run
 * Depreciation"), yang tidak ikut dikirim sidebar — jadi ditanyakan langsung
 * ke backend. Hanya untuk menyembunyikan tombol; pemeriksaan sebenarnya tetap
 * RequirePermission di POST /depreciation/calculate.
 */
export const useRunDepreciationAllowed = () => {
  const { data } = useQuery({
    queryKey: ["run-depreciation-allowed"],
    queryFn: runDepreciationAllowed,
    staleTime: 1000 * 60 * 5,
  })

  return data ?? false
}
