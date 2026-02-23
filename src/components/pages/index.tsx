import BalanceCard from "../molecules/card/informationCard";
import CyrcleChart from "../organisms/dashboard/cyrcleChart";
import TableChart from "../organisms/dashboard/tableChart";


export default function MainPage() {
  return (
    <div className="w-full">
      <section className="flex justify-between gap-4 items-center my-4">
        <BalanceCard title={"Saving"} balance={45000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={45000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={45000} className="w-1/4" />
        <BalanceCard title={"Saving"} balance={45000} className="w-1/4" />
      </section>
      <section className="flex justify-between gap-4">
        <TableChart className="w-2/3" />
        <CyrcleChart
          className="w-1/3"
          categories={[
            { name: 'Housing', value: 2000, color: '#6366f1' },
            { name: 'Transportation', value: 500, color: '#a5b4fc' },
            { name: 'Utilities', value: 300, color: '#ddd6fe' },
            { name: 'Savings', value: 1000, color: '#10b981' },
          ]}
          total={3800}
          highlightedCategory={{
            name: 'Housing',
            percentage: 53,
            amount: 2000
          }} />
      </section>
      <section className="flex justify-between gap-4 mt-4">
        {/* <DisposalList items={contactsData} className="w-1/3"/>
        <RecentTransactions transactions={transactions} className="w-2/3"/> */}
      </section>
    </div>
  )
}
