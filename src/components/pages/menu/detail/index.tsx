import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import { useParams } from 'react-router-dom'
import InfoCard from '../../../molecules/card/infoCard'
import Head from '../../../molecules/head'
import Links from '../../../atoms/links'

export default function DetailMenu() {
    const { id } = useParams()

    const { data } = useMenuDetail(id || '')

    return (
        <section className='bg-white rounded-xl p-2 py-4'>
            <div className='flex justify-between items-center'>
                <Head label='Detail Menu' />
                <Links href={`/dashboard/menu/${id}/update`} className='px-6 p-1'>Edit</Links>
            </div>
            {data && (
                <section className='grid grid-cols-2 gap-4 items-center'>
                    <InfoCard Label={'Name'} value={data?.data.name} />
                    <InfoCard Label={'Icon Name'} value={data?.data.icon_name} />
                </section>
            )}
        </section>
    )
}
