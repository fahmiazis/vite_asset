import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Head from '../../../molecules/head'
import { useMenuDetail } from '../../../../hooks/query/menu/detail'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { useUpdateMenu } from '../../../../hooks/mutation/menu/useUpdateMenus'
import { IconPicker } from '../../../organisms/menu/iconPicker'
import { MENU_TYPE, menuTypeOf } from '../../../../utils/menu/menuType'
import type { MenuType } from '../../../../models/menu/list'

export default function UpdateMenu() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: res, isLoading } = useMenuDetail(id || '')
    const { data: menuListData } = useMenuList()
    const detail = res?.data

    const [name, setName] = useState('')
    const [parentId, setParentId] = useState('')
    const [path, setPath] = useState('')
    const [routePath, setRoutePath] = useState('')
    const [iconName, setIconName] = useState('')
    const [status, setStatus] = useState('active')
    const [menuType, setMenuType] = useState<MenuType>('page')

    useEffect(() => {
        if (detail) {
            setName(detail.name ?? '')
            setMenuType(menuTypeOf(detail.menu_type))
            setParentId(detail.parent_id ?? '')
            setPath(detail.path ?? '')
            setRoutePath(detail.route_path ?? '')
            setIconName(detail.icon_name ?? '')
            setStatus(detail.status ?? 'active')
        }
    }, [detail])

    const allMenus = menuListData?.data ?? []

    // Menu ini punya sub menu? Kalau ya, ia tidak boleh dijadikan sub menu
    // (backend membatasi nesting maksimal 1 level).
    const hasChildren = useMemo(
        () => allMenus.some((m) => m.id === id && (m.children?.length ?? 0) > 0),
        [allMenus, id]
    )

    // Kandidat induk: menu level atas, selain dirinya sendiri
    const parentOptions = useMemo(
        () => allMenus.filter((m) => !m.parent_id && m.id !== id),
        [allMenus, id]
    )

    const { mutate, isPending } = useUpdateMenu(id || '')

    const handleUpdate = () => {
        if (!name.trim()) return toast.error('Nama menu wajib diisi')

        mutate({
            name: name.trim(),
            menu_type: menuType,
            parent_id: parentId || null,
            path: path.trim(),
            route_path: routePath.trim(),
            icon_name: iconName.trim() || null,
            status,
        })
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white' />
            </div>
        )
    }

    const inputClass =
        'w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50'
    const labelClass =
        'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5'

    return (
        <section className='space-y-4'>
            <Head label='Ubah Menu' />

            <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5 max-w-3xl'>

                {/* Jenis menu */}
                <div>
                    <p className={labelClass}>Jenis Menu</p>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                        {(Object.keys(MENU_TYPE) as MenuType[]).map((t) => (
                            <button
                                key={t}
                                type='button'
                                onClick={() => setMenuType(t)}
                                disabled={isPending}
                                className={`text-left px-3 py-2.5 rounded-xl border transition-colors disabled:opacity-50 ${
                                    menuType === t
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                            >
                                <span className={`block text-sm font-medium ${
                                    menuType === t
                                        ? 'text-indigo-700 dark:text-indigo-400'
                                        : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                    {MENU_TYPE[t].label}
                                </span>
                                <span className='block text-xs text-gray-400 mt-0.5'>
                                    {MENU_TYPE[t].desc}
                                </span>
                            </button>
                        ))}
                    </div>
                    {menuType === 'permission' && (
                        <p className='text-xs text-amber-600 dark:text-amber-400 mt-1.5'>
                            Menu ini tidak akan tampil di sidebar. Pastikan Route Path terisi
                            supaya hak aksesnya bisa dicocokkan backend.
                        </p>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className={labelClass}>
                            Nama Menu <span className='text-red-500'>*</span>
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPending}
                            className={inputClass}
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Ikon</label>
                        <IconPicker value={iconName} onChange={setIconName} disabled={isPending} />
                    </div>
                </div>

                {/* Grup induk */}
                <div>
                    <label className={labelClass}>Grup Induk</label>
                    <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        disabled={isPending || hasChildren}
                        className={inputClass}
                    >
                        <option value=''>— Tanpa grup (menu level atas) —</option>
                        {parentOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                                {!m.path ? ' (grup)' : ''}
                            </option>
                        ))}
                    </select>
                    {hasChildren ? (
                        <p className='text-xs text-amber-600 dark:text-amber-400 mt-1'>
                            Menu ini punya sub menu, jadi tidak bisa dipindahkan ke dalam grup
                            lain. Pindahkan dulu sub menunya.
                        </p>
                    ) : (
                        <p className='text-xs text-gray-400 mt-1'>
                            Kosongkan kalau menu ini berdiri sendiri di level atas sidebar.
                        </p>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className={labelClass}>Path Halaman (frontend)</label>
                        <input
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            disabled={isPending}
                            placeholder='/dashboard/disposal'
                            className={`${inputClass} font-mono`}
                        />
                        <p className='text-xs text-gray-400 mt-1'>
                            Kosongkan kalau menu ini hanya berfungsi sebagai grup.
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Route Path (backend)</label>
                        <input
                            value={routePath}
                            onChange={(e) => setRoutePath(e.target.value)}
                            disabled={isPending}
                            placeholder='/transactions/disposal'
                            className={`${inputClass} font-mono`}
                        />
                        <p className='text-xs text-gray-400 mt-1'>
                            Dipakai mencocokkan hak akses ke endpoint.
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <p className={labelClass}>Status</p>
                    <div className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl max-w-xs'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <button
                            type='button'
                            onClick={() => setStatus((p) => (p === 'active' ? 'inactive' : 'active'))}
                            disabled={isPending}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                status === 'active' ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                <div className='flex justify-end gap-2 pt-1'>
                    <button
                        onClick={() => navigate(-1)}
                        disabled={isPending}
                        className='px-5 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50'
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isPending}
                        className='px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>
        </section>
    )
}
