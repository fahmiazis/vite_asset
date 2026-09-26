import { useDeleteMenu } from "../../../hooks/mutation/menu/delete"

interface DeleteMenuModalProps {
  menuId: string
  menuName: string
  /** jumlah sub menu yang ikut terdampak, untuk peringatan */
  childCount?: number
  onCancel: () => void
}

export function DeleteMenuModal({
  menuId,
  menuName,
  childCount = 0,
  onCancel,
}: DeleteMenuModalProps) {
  const { mutate: deleteMenu, isPending } = useDeleteMenu()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 mx-auto mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Hapus menu
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Menu <span className="font-medium text-gray-700 dark:text-gray-300">"{menuName}"</span>{" "}
          akan dihapus.
        </p>

        {childCount > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mb-4">
            Menu ini punya {childCount} sub menu. Hak akses yang menempel padanya
            ikut hilang — pindahkan dulu kalau masih dipakai.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => deleteMenu(menuId)}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}
