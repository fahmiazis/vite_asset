import { useDepreList } from "../../../hooks/query/depreciation/list"
import Head from "../../molecules/head"
import { DepreciationTable } from "../../organisms/depreciation/monthly/table"

export default function DepretiationPage() {
  const { data } = useDepreList()
  return (
    <section className="py-2">
    <Head label="Depreciations" className="mb-2"/>
      {data && (
        <DepreciationTable data={data.data} />
      )}
    </section>
  )
}
