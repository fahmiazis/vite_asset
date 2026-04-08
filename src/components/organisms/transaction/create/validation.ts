import { z } from "zod"

export const detailSchema = z.object({
  branch_code: z.string().min(1, "Kode cabang wajib diisi"),
  quantity: z.number({ message: "Harus angka" }).min(1, "Min 1"),
  requester_name: z.string().min(1, "Nama pemohon wajib diisi"),
  notes: z.string().optional(),
})

export const itemSchema = z.object({
  item_name: z.string().min(1, "Nama item wajib diisi"),
  category_id: z.number({ message: "Pilih kategori" }).min(1, "Pilih kategori"),
  quantity: z.number({ message: "Harus angka" }).min(1, "Min 1"),
  unit_price: z.number({ message: "Harus angka" }).min(1, "Harga wajib diisi"),
  branch_code: z.string().min(1, "Kode cabang wajib diisi"),
  notes: z.string().optional(),
  details: z.array(detailSchema).optional(),
})

export const procurementSchema = z.object({
  transaction_date: z.string().min(1, "Tanggal wajib diisi"),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "Minimal 1 item"),
})

export type ProcurementFormValues = z.infer<typeof procurementSchema>
export type ItemFormValues = z.infer<typeof itemSchema>
export type DetailFormValues = z.infer<typeof detailSchema>

export interface ProcurementPayload {
  transaction_date: string
  notes: string
  items: {
    item_name: string
    category_id: number
    quantity: number
    unit_price: number
    branch_code: string
    notes: string
    details?: {
      branch_code: string
      quantity: number
      requester_name: string
      notes: string
    }[]
  }[]
}