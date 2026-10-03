import { useQuery } from "@tanstack/react-query"
import { assetQRCodes } from "../../../services/asset/qr"

/** asset_number → isi QR terenkripsi, untuk aset di halaman tab QR Code */
export const useAssetQRCodes = (assetNumbers: string[]) =>
  useQuery({
    queryKey: ["asset-qr-codes", assetNumbers],
    queryFn: async () => {
      const codes = await assetQRCodes(assetNumbers)
      return new Map(codes.map((code) => [code.asset_number, code.qr_payload]))
    },
    enabled: assetNumbers.length > 0,
    // isi QR deterministik per aset, tidak perlu di-refetch
    staleTime: Infinity,
    retry: false,
  })
