import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAssetDetail } from '../../../../hooks/query/asset/detail'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DetailAssetsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useAssetDetail(id || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  if (!data?.data) return <p className="text-sm text-gray-500">Data tidak ditemukan.</p>

  const asset = data.data
  const cv = asset.current_value

  return (
    <div className="w-full mx-auto space-y-4 py-4">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        ← Kembali
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          </div>
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-white">{asset.asset_name}</p>
            <p className="text-sm text-gray-500">{asset.asset_number} · {asset.location ?? '-'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          asset.asset_status === 'active'
            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
        }`}>
          {asset.asset_status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Nilai Perolehan', value: formatCurrency(cv.acquisition_value) },
          { label: 'Nilai Buku', value: formatCurrency(cv.book_value) },
          { label: 'Akumulasi Penyusutan', value: formatCurrency(cv.accumulated_depreciation) },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1.5">{m.label}</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Info Aset */}
      <Section title="Informasi Aset">
        <InfoGrid>
          <InfoItem label="Nomor Aset" value={asset.asset_number} />
          <InfoItem label="Nama Aset" value={asset.asset_name} />
          <InfoItem label="Kategori" value={asset.category_name} />
          <InfoItem label="Kode Cabang" value={asset.branch_code} />
          <InfoItem label="Nomor IO" value={asset.io_number} />
          <InfoItem label="Merek" value={asset.brand} />
          <InfoItem label="Satuan" value={asset.unit_of_measure} />
          <InfoItem label="Jumlah Satuan" value={asset.unit_quantity} />
          <InfoItem label="Lokasi" value={asset.location} />
          <InfoItem label="Pengelompokan" value={asset.grouping} />
          <InfoItem label="Deskripsi" value={asset.description} className="col-span-2" />
        </InfoGrid>
      </Section>

      {/* Detail Nilai */}
      <Section title="Detail Nilai & Kondisi">
        <InfoGrid>
          <InfoItem label="Tanggal Efektif" value={formatDate(cv.effective_date)} />
          <InfoItem label="Status Fisik" value={cv.physical_status} />
          <InfoItem label="Kondisi" value={cv.condition} />
          <InfoItem label="Status Aktif" value={cv.is_active ? 'Aktif' : 'Tidak Aktif'} />
        </InfoGrid>
      </Section>

      {/* Timestamps */}
      <Section title="Riwayat Perubahan">
        <InfoGrid>
          <InfoItem label="Dibuat pada" value={formatDate(asset.created_at)} />
          <InfoItem label="Diperbarui pada" value={formatDate(asset.updated_at)} />
        </InfoGrid>
      </Section>

    </div>
  )
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function InfoItem({ label, value, className = '' }: { label: string; value: any; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white">{value ?? '-'}</p>
    </div>
  )
}