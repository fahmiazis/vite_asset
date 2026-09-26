import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckListIcon, Clock01Icon, Menu01Icon, PencilEdit02Icon } from 'hugeicons-react'
import TransaksiHeader from '../../organisms/transaction/head'
import { StatCards } from '../../organisms/common/statCards'
import { TransaksiTable } from '../../organisms/transaction/table'
import { useTransactionList } from '../../../hooks/query/transaction/list'
import { defaultDateRange } from '../../../utils/dateRange'

const PAGE_SIZE = 10

/**
 * Tab penyaring pengajuan. Semuanya disaring server-side — termasuk
 * "Menunggu Saya", yang ditentukan backend dari hak akses role terhadap route
 * stage berjalan digabung cabang yang dimiliki user.
 *
 * Tab "Pending" yang lama dihapus: isinya status transaksi, sementara tab lain
 * bicara stage, jadi satu pengajuan bisa muncul di dua tab dengan arti yang
 * berbeda. "Menunggu Saya" menjawab pertanyaan yang sebenarnya dicari user.
 */
const STAGE_TABS = [
  { key: 'all', stages: '' },
  { key: 'waiting', stages: '' },
  { key: 'draft', stages: 'DRAFT' },
  { key: 'verification', stages: 'ASSET_VERIFICATION' },
  { key: 'approval', stages: 'APPROVAL' },
  { key: 'process', stages: 'PROCESS_BUDGET,EXECUTE_ASET,GR' },
  { key: 'finished', stages: 'FINISHED' },
  { key: 'rejected', stages: 'REJECTED' },
] as const

/** query khusus penghitung tab — cukup total, barisnya tidak dipakai */
const COUNT_ONLY = { page: 1, limit: 1 }

export default function TransactionPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('all')
  // Rentang dua bulan: awal bulan kemarin s/d akhir bulan berjalan. Tanpa
  // batas default, halaman memuat seluruh riwayat dan yang relevan tenggelam.
  const [dateRange, setDateRange] = useState(defaultDateRange)

  const activeStages = STAGE_TABS.find((tab) => tab.key === activeTab)?.stages ?? ''
  const waitingOnly = activeTab === 'waiting'

  const { data, isLoading } = useTransactionList({
    page: 1,
    limit: PAGE_SIZE,
    current_stage: activeStages || undefined,
    waiting_for_me: waitingOnly || undefined,
    ...dateRange,
  })

  // Rentang tanggal ikut dikirim ke penghitung supaya angka tab dan kartu
  // menggambarkan periode yang sama dengan isi tabel.
  const countBase = { ...COUNT_ONLY, ...dateRange }

  // Angka tab dihitung server-side per kelompok stage supaya tetap
  // menggambarkan keseluruhan data, bukan hanya halaman yang sedang tampil.
  const all = useTransactionList(countBase)
  const waiting = useTransactionList({ ...countBase, waiting_for_me: true })
  const draft = useTransactionList({ ...countBase, current_stage: 'DRAFT' })
  const verification = useTransactionList({
    ...countBase,
    current_stage: 'ASSET_VERIFICATION',
  })
  const approval = useTransactionList({ ...countBase, current_stage: 'APPROVAL' })
  const process = useTransactionList({
    ...countBase,
    current_stage: 'PROCESS_BUDGET,EXECUTE_ASET,GR',
  })
  const finished = useTransactionList({ ...countBase, current_stage: 'FINISHED' })
  const rejected = useTransactionList({ ...countBase, current_stage: 'REJECTED' })

  const counts: Record<string, number> = {
    all: all.data?.data.total ?? 0,
    waiting: waiting.data?.data.total ?? 0,
    draft: draft.data?.data.total ?? 0,
    verification: verification.data?.data.total ?? 0,
    approval: approval.data?.data.total ?? 0,
    process: process.data?.data.total ?? 0,
    finished: finished.data?.data.total ?? 0,
    rejected: rejected.data?.data.total ?? 0,
  }

  const tabs = STAGE_TABS.map((tab) => ({
    label: t(`transaksiTable.tabs.${tab.key}`),
    value: tab.key,
    count: counts[tab.key] ?? 0,
  }))

  const isLoadingStats =
    all.isLoading || draft.isLoading || approval.isLoading || finished.isLoading

  const share = (value: number) =>
    counts.all > 0
      ? t('listStats.ofTotal', { percent: Math.round((value / counts.all) * 100) })
      : undefined

  // Angkanya datang dari query yang sama dengan penghitung tab. Sebelumnya
  // kartu ini menampilkan nilai contoh yang di-hardcode ("Rp 4.82M", "+12% vs
  // previous quarter"), yang terbaca sebagai data sungguhan.
  const stats = [
    {
      color: 'gray' as const,
      icon: <Menu01Icon size={15} />,
      value: counts.all,
      label: t('listStats.total'),
    },
    {
      color: 'gray' as const,
      icon: <PencilEdit02Icon size={15} />,
      value: counts.draft,
      label: t('listStats.draft'),
      hint: share(counts.draft),
    },
    {
      color: 'yellow' as const,
      icon: <Clock01Icon size={15} />,
      value: counts.approval,
      label: t('listStats.onApproval'),
      hint: share(counts.approval),
    },
    {
      color: 'green' as const,
      icon: <CheckListIcon size={15} />,
      value: counts.finished,
      label: t('listStats.finished'),
      hint: share(counts.finished),
    },
  ]

  return (
    <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl'>
      <TransaksiHeader />
      <StatCards items={stats} isLoading={isLoadingStats} />
      <TransaksiTable
        data={data?.data.data ?? []}
        isLoading={isLoading}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={() => setDateRange(defaultDateRange())}
      />
    </div>
  )
}
