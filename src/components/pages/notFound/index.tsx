import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { useDarkMode } from '../../../hooks/useDarkMode'
import { logout } from '../../../utils/auth/logout'

// Kosakata web asset buat "tembok kata" di background, ala halaman 404 Vercel
const VOCABULARY = [
  'Stock Opname', 'Depresiasi', 'Mutasi', 'Disposal', 'Peminjaman', 'Pengembalian',
  'Homebase', 'Branch', 'Kategori Aset', 'Nilai Buku', 'Nilai Perolehan', 'Serial Number',
  'Approval', 'Kondisi Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang', 'Ditemukan',
  'QR Code', 'Tag Aset', 'Garansi', 'Vendor', 'Purchase Order', 'Invoice', 'Laptop',
  'Printer', 'AC Split', 'Proyektor', 'Genset', 'Kendaraan Dinas', 'Meja Kerja', 'Kursi',
  'Server Rack', 'Router', 'Switch', 'UPS', 'Monitor', 'Scanner', 'Brankas', 'Lemari Arsip',
  'Masa Manfaat', 'Garis Lurus', 'Saldo Menurun', 'Akumulasi Penyusutan', 'Lokasi Fisik',
  'PIC Aset', 'Custodian', 'Attachment', 'Berita Acara', 'Audit Trail', 'Revisi',
  'Submit', 'Draft', 'Pending', 'Approved', 'Rejected', 'Asset Register', 'Cost Center',
  'Tanggal Perolehan', 'Write Off', 'Lelang', 'Hibah', 'Rotasi', 'Relokasi', 'Maintenance',
  'Kalibrasi', 'Inventaris', 'Sertifikat', 'Tanah', 'Bangunan', 'Mesin', 'Peralatan Kantor',
]

const BRANCH_CODES = ['JKT', 'BDG', 'SBY', 'MDN', 'SMG', 'MKS', 'DPS', 'YGY', 'PLM', 'BPN']

const WORD_COUNT = 1400
const GLOW_COUNT = 18

type Word = { text: string; strong: boolean }

function randomItem<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomWord(): string {
  const roll = Math.random()
  if (roll < 0.12) {
    return `AST-${2020 + Math.floor(Math.random() * 7)}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
  }
  if (roll < 0.18) {
    return `${randomItem(BRANCH_CODES)}-${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`
  }
  return randomItem(VOCABULARY)
}

function getLoggedInEmail(): string | null {
  const raw = Cookies.get('user')
  if (!raw || !Cookies.get('access_token')) return null
  try {
    const user = JSON.parse(raw)
    return user?.email ?? user?.username ?? null
  } catch {
    return null
  }
}

export default function NotFound() {
  const navigate = useNavigate()
  // Dipanggil biar class "dark" ikut kepasang walau user langsung mendarat di sini
  useDarkMode()

  const words = useMemo<Word[]>(
    () => Array.from({ length: WORD_COUNT }, () => ({ text: randomWord(), strong: Math.random() < 0.08 })),
    []
  )
  const email = useMemo(getLoggedInEmail, [])
  const [glowing, setGlowing] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      const next = new Set<number>()
      while (next.size < GLOW_COUNT) next.add(Math.floor(Math.random() * WORD_COUNT))
      setGlowing(next)
    }, 1400)
    return () => clearInterval(interval)
  }, [])

  const handleSwitchUser = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-blue-50 dark:bg-black text-gray-900 dark:text-white">
      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-6 h-14 border-b border-blue-200/70 dark:border-zinc-800 bg-blue-50 dark:bg-black">
        <button
          onClick={() => navigate(email ? '/dashboard' : '/login')}
          className="text-sm md:text-base font-bold tracking-tight hover:opacity-70 transition-opacity"
        >
          Asset Management
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-sm md:text-base font-semibold">Not Found</span>
        <span className="w-8" />
      </header>

      <main className="relative flex-1 overflow-hidden">
        {/* Tembok kata */}
        <div
          aria-hidden
          className="absolute inset-0 px-2 py-1 text-[11px] leading-[1.35] break-words select-none text-slate-400/70 dark:text-zinc-700"
        >
          {words.map((word, i) => (
            <span
              key={i}
              className={`transition-colors duration-700 ${
                glowing.has(i)
                  ? 'text-blue-600 dark:text-white font-semibold'
                  : word.strong
                    ? 'text-slate-600 dark:text-zinc-400 font-semibold'
                    : ''
              }`}
            >
              {word.text}{' '}
            </span>
          ))}
        </div>

        {/* Vignette biar tengah lebih kebaca */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(239,246,255,0.92)_0%,rgba(239,246,255,0.55)_35%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_35%,transparent_70%)]"
        />

        {/* Konten utama */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 animate-[nf-fade-up_0.6s_ease-out]">
          <h1 className="text-[6rem] md:text-[9rem] font-bold leading-none tracking-tighter">404</h1>
          <p className="mt-6 text-base md:text-xl font-medium">
            {email ? (
              <>You're logged in as <span className="font-bold">{email}</span>.</>
            ) : (
              <>Aset yang kamu cari nggak ada di register.</>
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {email ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black font-semibold hover:opacity-85 transition-opacity"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleSwitchUser}
                  className="px-6 py-3 rounded-full border border-gray-900/20 dark:border-white/25 bg-white/70 dark:bg-black/60 backdrop-blur font-semibold hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                >
                  Log In as a Different User
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-full bg-gray-900 text-white dark:bg-white dark:text-black font-semibold hover:opacity-85 transition-opacity"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
