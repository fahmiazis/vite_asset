import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import { useParams } from 'react-router-dom'
import InfoCard from '../../../molecules/card/infoCard'
import Head from '../../../molecules/head'
import Links from '../../../atoms/links'
import type { Children } from '../../../../models/menu/detail'
import { MenuChildrenTable } from '../../../organisms/menu/detail/table'

export default function DetailMenu() {
    const { id } = useParams()
    const { data } = useMenuDetail(id || '')

    const menu = data?.data

    return (
        <section className='bg-white rounded-xl p-2 py-4 space-y-4'>
            <div className='flex justify-between items-center'>
                <Head label='Detail Menu' />
                <Links href={`/dashboard/menu/update/${id}`} className='px-6 p-1'>Edit</Links>
            </div>

            {menu && (
                <>
                    <section className='grid grid-cols-2 gap-3'>
                        <InfoCard Label='Name' value={menu.name} />
                        <InfoCard Label='Icon Name' value={menu.icon_name} />
                        <InfoCard Label='Path' value={menu.path} />
                        <InfoCard Label='Status' value={menu.status} />
                    </section>

                    <div>
                        {menu.children && menu.children.length > 0 && (
                            <div>
                                <p className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-2'>
                                    Sub Menu ({menu.children.length})
                                </p>
                                <MenuChildrenTable data={menu.children} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}