import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckListIcon, Clock01Icon, Menu01Icon, PencilEdit02Icon } from 'hugeicons-react'
import { useMutationList } from '../../../hooks/query/mutation/list'
import ListHeader from '../../organisms/common/listHeader'
import { StatCards } from '../../organisms/common/statCards'
import { MutationTable } from '../../organisms/mutation/table'
import { ListTabs } from '../../organisms/common/listTabs'
import { defaultDateRange } from '../../../utils/dateRange'

/** hanya membaca `total`, jadi cukup ambil satu baris per hitungan */
const COUNT_ONLY = { page: 1, limit: 1 }

/**
 * Tab penyaring pengajuan, seluruhnya disaring server-side. "Menunggu Saya"
 * ditentukan backend dari hak akses role terhadap route stage berjalan; khusus
 * stage penerimaan, yang dicocokkan adalah cabang TUJUAN mutasi.
 */
const STAGE_TABS = [
  { key: 'all', stages: '' },
  { key: 'waiting', stages: '' },
  { key: 'draft', stages: 'DRAFT' },
  { key: 'approval', stages: 'APPROVAL' },
  { key: 'process', stages: 'MUTATION_RECEIVING,EXECUTE_MUTATION' },
  { key: 'finished', stages: 'FINISHED' },
  { key: 'rejected', stages: 'REJECTED' },
] as const

export default function MutationPage() {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<string>('all')
  // Rentang dua bulan: awal bulan kemarin s/d akhir bulan berjalan.
  const [dateRange, setDateRange] = useState(defaultDateRange)

  const activeStages = STAGE_TABS.find((tab) => tab.key === activeTab)?.stages ?? ''
  const waitingOnly = activeTab === 'waiting'

  const { data, isLoading } = useMutationList({
    page: 1,
    limit: 10,
    current_stage: activeStages || undefined,
    waiting_for_me: waitingOnly || undefined,
    ...dateRange,
  })

  // Rentang tanggal ikut dikirim ke penghitung supaya angka tab dan kartu
  // menggambarkan periode yang sama dengan isi tabel.
  const countBase = { ...COUNT_ONLY, ...dateRange }

  // Angka ringkasan diambil dari server per stage, bukan dihitung dari baris
  // yang sedang tampil — daftarnya paginasi, jadi menghitung dari halaman
  // berjalan akan salah begitu datanya lebih dari satu halaman.
  const all = useMutationList(countBase)
  const waiting = useMutationList({ ...countBase, waiting_for_me: true })
  const draft = useMutationList({ ...countBase, current_stage: 'DRAFT' })
  const approval = useMutationList({ ...countBase, current_stage: 'APPROVAL' })
  const process = useMutationList({
    ...countBase,
    current_stage: 'MUTATION_RECEIVING,EXECUTE_MUTATION',
  })
  const finished = useMutationList({ ...countBase, current_stage: 'FINISHED' })
  const rejected = useMutationList({ ...countBase, current_stage: 'REJECTED' })

  // total keseluruhan, bukan total tab aktif — kartu ringkasan harus tetap
  // menggambarkan seluruh data walau tabnya sedang menyaring
  const total = all.data?.data?.total ?? 0

  const counts: Record<string, number> = {
    all: total,
    waiting: waiting.data?.data?.total ?? 0,
    draft: draft.data?.data?.total ?? 0,
    approval: approval.data?.data?.total ?? 0,
    process: process.data?.data?.total ?? 0,
    finished: finished.data?.data?.total ?? 0,
    rejected: rejected.data?.data?.total ?? 0,
  }

  const tabs = STAGE_TABS.map((tab) => ({
    label: t(`transaksiTable.tabs.${tab.key}`),
    value: tab.key,
    count: counts[tab.key] ?? 0,
  }))
  const isLoadingStats =
    isLoading || draft.isLoading || approval.isLoading || finished.isLoading

  const share = (value: number) =>
    total > 0 ? t('listStats.ofTotal', { percent: Math.round((value / total) * 100) }) : undefined

  const stats = [
    {
      color: 'gray' as const,
      icon: <Menu01Icon size={15} />,
      value: total,
      label: t('listStats.total'),
    },
    {
      color: 'gray' as const,
      icon: <PencilEdit02Icon size={15} />,
      value: draft.data?.data?.total ?? 0,
      label: t('listStats.draft'),
      hint: share(draft.data?.data?.total ?? 0),
    },
    {
      color: 'yellow' as const,
      icon: <Clock01Icon size={15} />,
      value: approval.data?.data?.total ?? 0,
      label: t('listStats.onApproval'),
      hint: share(approval.data?.data?.total ?? 0),
    },
    {
      color: 'green' as const,
      icon: <CheckListIcon size={15} />,
      value: finished.data?.data?.total ?? 0,
      label: t('listStats.finished'),
      hint: share(finished.data?.data?.total ?? 0),
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t('mutationList.title')}
        subtitle={t('mutationList.subtitle', { count: total })}
        createHref="/dashboard/mutation/create"
        createLabel={t('mutationList.create')}
      />

      <StatCards items={stats} isLoading={isLoadingStats} />

      <ListTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <MutationTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={() => setDateRange(defaultDateRange())}
      />
    </div>
  )
}
