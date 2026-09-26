/**
 * Tipe cabang.
 *
 * Kolom `branchs.branch_type` adalah varchar biasa, bukan enum, dan backend
 * hanya memvalidasi `required` — tidak ada daftar nilai yang sah. Akibatnya
 * data sempat terisi nama cabang ("Lampung Selatan") karena field-nya dulu
 * berupa input bebas.
 *
 * "HO" dipakai backend sebagai penanda kantor pusat: procurement mengizinkan
 * user HO membuat item untuk cabang lain
 * (services/procurement_service.go — `isHO := homebase.Branch.BranchType == "HO"`).
 * Jadi nilainya harus persis, huruf besar semua.
 */
export const branchType = [
  { id: 'HO', value: 'HO', label: 'HO (Kantor Pusat)' },
  { id: 'SUB BRANCH', value: 'SUB BRANCH', label: 'Sub Branch (Cabang)' },
]
