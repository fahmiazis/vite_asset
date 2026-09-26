import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAssetList } from "../../../hooks/query/asset/list";
import { useDashboardSummary } from "../../../hooks/query/dashboard/summary";
import type { listAssetsState } from "../../../models/asset/list";
import BalanceCard from "../../molecules/card/informationCard";
import RecentTransactions from "../../organisms/dashboard/activityTable";
import CyrcleChart from "../../organisms/dashboard/cyrcleChart";
import DisposalList from "../../organisms/dashboard/disposalTable";
import TableChart from "../../organisms/dashboard/tableChart";
import { transactionTypeMeta } from "../../../utils/transactionType";

/** jumlah aset di section Assets */
const ASSET_LIMIT = 50;

export const contactsData = [
  {
    id: '1',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://id.pinterest.com/pin/109916047145058564',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '2',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '2',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '2',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Asus',
    description: 'it developer',
    avatar: 'https://i.pinimg.com/1200x/a2/27/cf/a227cf12ed7f282fb1dc9ab203192f51.jpg',
    avatarBgColor: '#8b5cf6',
  },
];

interface DisposalItem {
  id: string
  name: string
  description: string
  avatar: string
  avatarBgColor?: string
}

function generateColorFromString(str: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
    '#14b8a6', '#0ea5e9', '#84cc16', '#f59e0b',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function assetListToDisposalItems(assets: listAssetsState[]): DisposalItem[] {
  return assets.map((asset) => ({
    // nomor aset dipakai untuk membuka detail (/dashboard/asset/:number)
    id: asset.asset_number,
    name: asset.asset_name,
    description: asset.category_name ?? asset.description ?? '-',
    avatar: '',
    avatarBgColor: generateColorFromString(asset.asset_name),
  }))
}

export default function MainPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const { data: assets } = useAssetList({ page: 1, limit: ASSET_LIMIT })
  const { data: summary, isLoading } = useDashboardSummary()

  const values = summary?.data.asset_values
  const monthCounts = summary?.data.month_counts ?? []
  const monthTotal = monthCounts.reduce((sum, c) => sum + c.count, 0)

  // Kartu atas memakai asset_values bulan berjalan saja. Baris bulan ini baru
  // ada setelah penyusutan bulan ini dihitung — kalau belum, beri tahu user
  // alih-alih menampilkan nol tanpa keterangan.
  const period = values
    ? (() => {
        const [y, m] = values.period.split("-").map(Number)
        return new Date(y, m - 1, 1).toLocaleDateString(i18n.language, { month: "long", year: "numeric" })
      })()
    : ""
  const valueHint = values
    ? values.total_assets > 0
      ? t("dashboardPage.cards.period", { period })
      : t("dashboardPage.cards.notCalculated", { period })
    : undefined

  return (
    <div className="w-full">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          title={t("label.dashboard.totalAssets")}
          balance={values?.total_assets ?? 0}
          className="h-full"
          showCurrency={false}
          showArrow={false}
          hint={valueHint}
        />

        <BalanceCard
          title={t("label.dashboard.totalAcquisVal")}
          balance={values?.acquisition_value ?? 0}
          className="h-full"
          showCurrency={true}
          showArrow={false}
          hint={valueHint}
        />

        <BalanceCard
          title={t("label.dashboard.totalBookVal")}
          balance={values?.book_value ?? 0}
          className="h-full"
          showCurrency={true}
          showArrow={false}
          hint={valueHint}
        />

        <BalanceCard
          title={t("label.dashboard.totalDepreVal")}
          balance={values?.accumulated_depreciation ?? 0}
          className="h-full"
          showCurrency={true}
          showArrow={false}
          hint={valueHint}
        />
      </section>
      <section className="flex justify-between gap-4 mt-2">
        <TableChart className="w-2/3" flow={summary?.data.flow ?? []} />
        <CyrcleChart
          className="w-1/3"
          title={t("dashboardPage.monthTotal.title")}
          centerLabel={t("dashboardPage.monthTotal.center")}
          showArrow={false}
          categories={monthCounts.map((c) => {
            const meta = transactionTypeMeta(c.transaction_type)
            return { name: meta.label, value: c.count, color: meta.color }
          })}
          total={monthTotal}
        />
      </section>
      <section className="flex justify-between gap-4 mt-4">
        {assets && (
          <DisposalList
            title={t("dashboardPage.assets.title", { count: assets.data.data.length })}
            items={assetListToDisposalItems(assets.data.data)}
            onArrowClick={() => navigate("/dashboard/asset")}
            onItemClick={(item) => navigate(`/dashboard/asset/${item.id}`)}
            className="w-1/3"
          />
        )}
        <RecentTransactions
          transactions={summary?.data.recent ?? []}
          isLoading={isLoading}
          className="w-2/3"
        />
      </section>
    </div>
  )
}
