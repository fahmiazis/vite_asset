import { create } from "zustand"
import type { EmailAction, EmailTransactionType } from "../models/emailSetting/template"
import type { emailPreviewState } from "../models/emailSetting/transactionEmail"
import { getEmailPreview } from "../services/emailSetting/transactionEmail"

/**
 * Gerbang email sebelum aksi stage.
 *
 * Setiap tombol aksi (submit, approve, eksekusi, tolak, revisi, batal) tidak
 * memanggil mutasinya langsung, melainkan lewat withStageEmail():
 *
 *   1. ambil preview template untuk stage + aksi ini
 *   2. tidak ada template → aksi langsung dijalankan, tanpa dialog
 *   3. ada template → dialog email (StageEmailHost) tampil; setelah user
 *      menekan kirim, aksinya dijalankan dulu, BARU email dikirim
 *
 * Dialognya dirender sekali di MainLayout, bukan di dalam modal aksi. Modal
 * aksi dan action bar-nya bisa ter-unmount begitu stage berubah (mis. stage
 * akhir), sementara dialog masih perlu hidup untuk mengirim email dan
 * menampilkan tombol kirim ulang kalau gagal.
 */

export interface StageEmailContext {
  transactionType: EmailTransactionType
  /** kosong saat membuat agreement — nomornya baru ada dari hasil `run` */
  transactionNumber: string
  action: EmailAction
  /** anggota agreement yang akan dibuat, untuk menghitung penerima */
  memberNumbers?: string[]
  /** ambil nomor transaksi dari hasil `run` (agreement baru) */
  resolveNumber?: (result: unknown) => string | undefined
}

export interface StageEmailRequest {
  context: StageEmailContext
  preview: emailPreviewState
  run: () => Promise<unknown>
  /** melepas promise withStageEmail — true kalau aksinya dijalankan & berhasil */
  settle: (done: boolean) => void
}

interface StageEmailState {
  preparing: boolean
  request: StageEmailRequest | null
  setPreparing: (value: boolean) => void
  open: (request: StageEmailRequest) => void
  close: () => void
}

export const useStageEmailStore = create<StageEmailState>((set) => ({
  preparing: false,
  request: null,
  setPreparing: (preparing) => set({ preparing }),
  open: (request) => set({ request, preparing: false }),
  close: () => set({ request: null }),
}))

// Satu gerbang aktif dalam satu waktu. Klik beruntun saat preview masih
// dimuat (tombol modal belum ter-disable karena mutasinya belum mulai) tidak
// boleh membuka dua dialog.
let busy = false

/**
 * Jalankan `run` lewat gerbang email. Promise-nya selesai setelah aksi
 * dijalankan (atau dibatalkan dari dialog), tidak menunggu email terkirim.
 * Tidak pernah reject — error aksi sudah ditangani hook mutasinya sendiri.
 *
 * `run` wajib me-reject kalau aksinya gagal (pakai mutateAsync), supaya email
 * tidak terkirim untuk aksi yang tidak terjadi.
 */
export async function withStageEmail(
  context: StageEmailContext,
  run: () => Promise<unknown>
): Promise<boolean> {
  if (busy) return false
  busy = true

  const runDirect = async () => {
    try {
      await run()
      return true
    } catch {
      return false
    }
  }

  const store = useStageEmailStore.getState()
  store.setPreparing(true)

  let preview: emailPreviewState
  try {
    preview = await getEmailPreview(context)
  } catch (error) {
    // Modul email bermasalah (mis. migrasi belum jalan) tidak boleh
    // menghentikan proses bisnis — aksinya tetap dijalankan tanpa email.
    console.warn("[stage-email] preview gagal, aksi dijalankan tanpa email", error)
    store.setPreparing(false)
    const done = await runDirect()
    busy = false
    return done
  }

  if (!preview.has_template || !preview.template_id) {
    store.setPreparing(false)
    const done = await runDirect()
    busy = false
    return done
  }

  return new Promise<boolean>((resolve) => {
    store.open({
      context,
      preview,
      run,
      settle: (done) => {
        busy = false
        resolve(done)
      },
    })
  })
}
