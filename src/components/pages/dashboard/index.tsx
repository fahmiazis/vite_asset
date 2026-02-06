import BalanceCard from "../../molecules/card/informationCard";
import RecentTransactions from "../../organisms/dashboard/activityTable";
import CyrcleChart from "../../organisms/dashboard/cyrcleChart";
import DisposalList from "../../organisms/dashboard/disposalTable";
import TableChart from "../../organisms/dashboard/tableChart";

const transactions = [
  {
    id: '1',
    date: '25 Jul 12:30',
    amount: 10,
    paymentName: 'YouTube',
    icon: '▶',
    iconBgColor: '#ff0000',
    method: 'VISA **3254',
    category: 'Subscription',
  },
  {
    id: '2',
    date: '26 Jul 15:00',
    amount: 150,
    paymentName: 'Reserved',
    icon: '━━━',
    iconBgColor: '#6b7280',
    method: 'Mastercard **2154',
    category: 'Shopping',
  },
  {
    id: '3',
    date: '27 Jul 9:00',
    amount: 80,
    paymentName: 'Yaposhka',
    icon: '🍜',
    iconBgColor: '#ec4899',
    method: 'Mastercard **2154',
    category: 'Cafe & Restaurants',
  },
  {
    id: '4',
    date: '28 Jul 14:20',
    amount: 45,
    paymentName: 'Spotify',
    icon: '♫',
    iconBgColor: '#22c55e',
    method: 'VISA **3254',
    category: 'Entertainment',
  },
  {
    id: '5',
    date: '29 Jul 10:15',
    amount: 220,
    paymentName: 'Amazon',
    icon: 'a',
    iconBgColor: '#ff9900',
    method: 'Mastercard **2154',
    category: 'Shopping',
  },
  {
    id: '6',
    date: '30 Jul 18:45',
    amount: 65,
    paymentName: 'Starbucks',
    icon: '☕',
    iconBgColor: '#00704a',
    method: 'VISA **3254',
    category: 'Cafe & Restaurants',
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
  return (
    <div className="w-full">
      <section className="flex justify-between gap-4 items-center my-4">
        <BalanceCard title={"Saving"} balance={45000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={90000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={4000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={1000000} className="w-1/4" />
      </section>
      <section className="flex justify-between gap-4">
        <TableChart className="w-2/3" />
        <CyrcleChart
          className="w-1/3"
          categories={[
            { name: 'Number of Assets', value: 2000, color: '#6366f1' },
            { name: 'Value of Assets', value: 500, color: '#a5b4fc' },
            { name: 'Net Assets Value', value: 300, color: '#ddd6fe' },
            { name: 'Purchases in Fascal Year', value: 1000, color: '#10b981' },
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
