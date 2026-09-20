import { useNavigate } from 'react-router-dom'
import { useMenuList } from '../../../hooks/query/menu/list'
import { MenuReorderPanel } from '../../organisms/menu/reorderPanel'
import Head from '../../molecules/head'

/**
 * Satu layar untuk seluruh pengelolaan menu: susunan sidebar, pembuatan,
 * pengubahan, pemindahan antar grup, penghapusan, dan pintasan ke pengaturan
 * hak akses. Tidak ada lagi pemisahan tab daftar/urutan.
 */
export default function MasterMenu() {
    const navigate = useNavigate()
    const { data, isLoading } = useMenuList()

    return (
        <section className='space-y-4'>
            <div className='flex items-start justify-between gap-3'>
                <Head label='Menu' />

                <div className='flex items-center gap-2 flex-shrink-0'>
                    <button
                        onClick={() => navigate('/dashboard/menu/assign')}
                        className='px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                    >
                        Assign Hak Akses
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/menu/create')}
                        className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors'
                    >
                        <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                        </svg>
                        Buat Menu
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                    <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white' />
                </div>
            ) : (
                <MenuReorderPanel menus={data?.data ?? []} />
            )}
        </section>
    )
}
