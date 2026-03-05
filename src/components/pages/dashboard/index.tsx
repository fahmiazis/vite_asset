import BalanceCard from "../../molecules/card/informationCard";
import RecentTransactions from "../../organisms/dashboard/activityTable";
import CyrcleChart from "../../organisms/dashboard/cyrcleChart";
import DisposalList from "../../organisms/dashboard/disposalTable";
import TableChart from "../../organisms/dashboard/tableChart";
import { useTranslation } from "react-i18next";

const transactions = [
  {
    id: '1',
    date: '04 March 2026',
    transactionNumber: '0001/C001/III/2026-IO',
    transaction: 'Procurement',
    icon: '🛒',
    iconBgColor: '#3b82f6',
    user: 'Budi',
    status: 'Finished',
  },
  {
    id: '2',
    date: '01 March 2026',
    transactionNumber: '0001/C001/III/2026-MTI',
    transaction: 'Mutation',
    icon: '🔄',
    iconBgColor: '#8b5cf6',
    user: 'Budi',
    status: 'Pending',
  },
  {
    id: '3',
    date: '31 Feb 2026',
    transactionNumber: "0001/C001/III/2026-DPSL",
    transaction: 'Disposal',
    icon: '🗑️',
    iconBgColor: '#ef4444',
    user: 'Adik Budi',
    status: 'In progress',
  },
  {
    id: '4',
    date: '25 Feb 2026',
    transactionNumber: "0001/C001/II/2026-OPNM",
    transaction: 'Stock Opname',
    icon: '📦',
    iconBgColor: '#10b981',
    user: 'Ibu Budi',
    status: 'In progress',
  },
  {
    id: '5',
    date: '20 Feb 2026',
    transactionNumber: '0002/C001/II/2026-OPNM',
    transaction: 'Stock Opname',
    icon: '📦',
    iconBgColor: '#10b981',
    user: 'Budi',
    status: 'Revisi',
  },
  {
    id: '6',
    date: '18 Feb 2026',
    transactionNumber: '0002/C001/III/2026-IO',
    transaction: 'Procurement',
    icon: '🛒',
    iconBgColor: '#3b82f6',
    user: 'Ayah Budi',
    status: 'Finished',
  },
];

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

export default function MainPage() {
  const { t } = useTranslation()

  const trend = {
    value: 3.2,
    isPositive: true,
    label: t("label.dashboard.vsLastMonth")
  }

  const trend2 = {
    value: 2.6,
    isPositive: false,
    label: t("label.dashboard.vsLastMonth")
  }

  return (
    <div className="w-full">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          title={t("label.dashboard.totalAssets")}
          balance={450}
          // trend={trend2}
          className="h-full"
          showCurrency={false}
        />

        <BalanceCard
          title={t("label.dashboard.totalAcquisVal")}
          balance={900}
          className="h-full"
          showCurrency={true}
        />

        <BalanceCard
          title={t("label.dashboard.totalBookVal")}
          balance={700}
          // trend={trend}
          className="h-full"
          showCurrency={true}
        />

        <BalanceCard
          title={t("label.dashboard.totalDepreVal")}
          balance={1000}
          className="h-full"
          showCurrency={true}
        />
      </section>
      <section className="flex justify-between gap-4 mt-2">
        <TableChart className="w-2/3" />
        <CyrcleChart
          className="w-1/3"
          categories={[
            { name: 'Procurement', value: 2000, color: '#6366f1' },
            { name: 'Disposal', value: 500, color: '#a5b4fc' },
            { name: 'Mutation', value: 300, color: '#ddd6fe' },
            { name: 'Stock Opname', value: 1000, color: '#10b981' },
          ]}
          total={3800}
          highlightedCategory={{
            name: 'Housing',
            percentage: 53,
            amount: 2000
          }} />
      </section>
      <section className="flex justify-between gap-4 mt-4">
        <DisposalList items={contactsData} className="w-1/3" />
        <RecentTransactions transactions={transactions} className="w-2/3" />
      </section>
    </div>
  )
}
