import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Head from "../../../molecules/head"
import { useCreateRole } from "../../../../hooks/mutation/role/useCreateRole"

export default function CreateRole() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const { mutate: createRole, isPending } = useCreateRole()

  const trimmedName = name.trim()
  const nameTooShort = trimmedName.length > 0 && trimmedName.length < 2

  const handleSubmit = () => {
    if (!trimmedName) return toast.error("Nama role wajib diisi")
    if (nameTooShort) return toast.error("Nama role minimal 2 karakter")

    createRole({ name: trimmedName, description: description.trim() })
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50"

  return (
    <section className="space-y-4">
      <Head label="Buat Role" />

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4 max-w-2xl">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
            Nama role <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            className={inputClass}
            placeholder="admin, manager, staff..."
            maxLength={50}
          />
          {nameTooShort && (
            <p className="text-xs text-red-500">Nama role minimal 2 karakter</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
            Deskripsi
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            className={`${inputClass} resize-none`}
            placeholder="Penjelasan singkat peran ini"
          />
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            Role dibuat tanpa hak akses. Setelah tersimpan, buka detail role untuk
            mengatur menu dan permission-nya.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => navigate("/dashboard/role")}
            disabled={isPending}
            className="px-5 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !trimmedName || nameTooShort}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : "Buat Role"}
          </button>
        </div>
      </div>
    </section>
  )
}
