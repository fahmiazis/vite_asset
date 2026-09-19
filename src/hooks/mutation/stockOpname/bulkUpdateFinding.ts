import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bulkUpdateStockOpnameFinding } from "../../../services/stockOpname/bulkUpdateFinding"
import type { BulkUpdateStockOpnameFindingRequest } from "../../../models/stockOpname/bulkUpdateFinding"

interface UseBulkUpdateStockOpnameFindingParams {
  transactionNumber: string
}

// Dipakai autosave grid "Lengkapi Data" — dipanggil dari timer, bukan dari
// tombol submit, jadi sengaja gak ada toast di sini. Status simpan
// (saving/saved/error) ditangani sendiri oleh komponen pemanggil lewat
// hasil mutateAsync, biar bisa ditampilkan di indikator kecil, bukan toast
// yang muncul tiap 8 detik.
export function useBulkUpdateStockOpnameFinding({ transactionNumber }: UseBulkUpdateStockOpnameFindingParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BulkUpdateStockOpnameFindingRequest) =>
      bulkUpdateStockOpnameFinding(transactionNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
    },
  })
}
