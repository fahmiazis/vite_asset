import { useBranchList } from '../../../hooks/query/branch/list'
import Head from '../../molecules/head'
import { BranchTable } from '../../organisms/branch'

export default function BranchPage() {
    const { data, isLoading } = useBranchList()
    return (
        <div>
            <Head label='Branch' />
            <section className='mt-4'>
                {isLoading ? (
                    <p>sabar!!.....</p>
                ) : data ? (
                    <BranchTable data={data?.data} />
                ) : null}
            </section>
        </div>
    )
}
