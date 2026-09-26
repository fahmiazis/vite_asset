import { useEffect, useRef } from "react"

/**
 * Mencegah satu aksi terkirim dua kali karena klik beruntun.
 *
 * Tombol yang di-disable lewat `isPending` saja tidak cukup: nilainya baru
 * berlaku setelah React render ulang, sehingga dua klik dalam satu frame masih
 * bisa lolos berdua. Untuk aksi transaksi akibatnya nyata — request pertama
 * memindahkan stage, request kedua ditolak backend, dan pesan error itulah yang
 * dibaca user padahal aksinya berhasil.
 *
 * Penjaganya memakai ref karena nilainya berubah seketika, tanpa menunggu
 * render. Dilepas lagi setelah request selesai supaya aksi yang gagal tetap
 * bisa dicoba ulang tanpa menutup dialog.
 */
export function useSingleSubmit(isPending: boolean) {
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = isPending
  }, [isPending])

  /**
   * bungkus handler submit: panggilan kedua diabaikan selama masih berjalan.
   *
   * Kalau handler mengembalikan promise (mis. lewat withStageEmail), penjaga
   * dilepas begitu promise-nya selesai — termasuk saat dialog email
   * dibatalkan, di mana isPending tidak pernah berubah sehingga effect di atas
   * tidak akan melepasnya.
   */
  return function guard(action: () => void | Promise<unknown>) {
    return () => {
      if (firedRef.current || isPending) return
      firedRef.current = true
      const result = action()
      if (result instanceof Promise) {
        result.catch(() => {}).finally(() => {
          firedRef.current = false
        })
      }
    }
  }
}
