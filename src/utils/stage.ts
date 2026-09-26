/**
 * Ubah nama stage backend jadi teks yang enak dibaca.
 * ASSET_VERIFICATION → Asset Verification
 *
 * Nama stage sengaja dibiarkan English di semua bahasa — itu identitas nilai
 * di database, sama perlakuannya dengan stage disposal (lihat
 * utils/disposalStage.ts).
 */
export function formatStage(stage?: string | null): string {
  if (!stage) return "-"

  return stage
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
