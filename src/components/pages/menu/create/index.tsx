import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Head from '../../../molecules/head'
import { useCreateMenu } from '../../../../hooks/mutation/menu/useCreateMenus'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { IconPicker } from '../../../organisms/menu/iconPicker'

/**
 * Empat bentuk menu (nesting maksimal 1 level):
 * - group      : wadah di sidebar, tanpa halaman. Contoh: "Setting", "Master"
 * - standard   : menu biasa di level atas, punya halaman
 * - child      : sub menu di dalam sebuah grup
 * - permission : tidak tampil di sidebar, hanya memetakan endpoint ke permission
 */
type MenuKind = 'group' | 'standard' | 'child' | 'permission'

const KIND_LABEL: Record<MenuKind, { title: string; desc: string }> = {
    group: {
        title: 'Grup Menu',
        desc: 'Wadah di sidebar yang bisa dilipat. Tidak punya halaman sendiri.',
    },
    standard: {
        title: 'Menu',
        desc: 'Menu di level atas yang langsung membuka sebuah halaman.',
    },
    child: {
        title: 'Sub Menu',
        desc: 'Menu yang berada di dalam sebuah grup.',
    },
    permission: {
        title: 'Hak Akses',
        desc: 'Tidak tampil di sidebar. Hanya memetakan endpoint backend ke permission.',
    },
}

/** MenuKind di UI → menu_type yang dipahami backend */
const KIND_TO_TYPE: Record<MenuKind, string> = {
    group: 'group',
    standard: 'page',
    child: 'page',
    permission: 'permission',
}

export default function CreateMenu() {
    const navigate = useNavigate()
    const [kind, setKind] = useState<MenuKind>('standard')

    const [name, setName] = useState('')
    const [path, setPath] = useState('')
    const [routePath, setRoutePath] = useState('')
    const [iconName, setIconName] = useState('')
    const [parentId, setParentId] = useState('')
    const [status, setStatus] = useState('active')

    const { data: menuListData } = useMenuList()
    const { mutate: createMenu, isPending } = useCreateMenu()

    // Kandidat induk: hanya menu level atas (backend membatasi nesting 1 level)
    const parentOptions = useMemo(
        () => (menuListData?.data ?? []).filter((m) => !m.parent_id),
        [menuListData]
    )

    const isGroup = kind === 'group'
    const isChild = kind === 'child'
    const isPermission = kind === 'permission'
    // grup & permission-only tidak membuka halaman
    const needsPath = !isGroup && !isPermission

    const handleKindChange = (next: MenuKind) => {
        setKind(next)
        if (next === 'group') {
            // grup tidak punya halaman maupun endpoint
            setPath('')
            setRoutePath('')
            setParentId('')
        }
        if (next === 'permission') setPath('')
        if (next === 'standard') setParentId('')
    }

    const handleCreate = () => {
        if (!name.trim()) return toast.error('Nama menu wajib diisi')
        if (needsPath && !path.trim()) return toast.error('Path halaman wajib diisi')
        if (isPermission && !routePath.trim())
            return toast.error('Route path wajib diisi untuk menu hak akses')
        if (isChild && !parentId) return toast.error('Pilih grup induk terlebih dahulu')

        createMenu({
            name: name.trim(),
            menu_type: KIND_TO_TYPE[kind],
            path: needsPath ? path.trim() : '',
            route_path: isGroup ? '' : routePath.trim(),
            icon_name: iconName.trim() || null,
            parent_id: (isChild || isPermission) ? parentId || null : null,
            status,
        })
    }

    const inputClass =
        'w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50'
    const labelClass =
        'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5'

    return (
        <section className='space-y-4'>
            <Head label='Buat Menu' />

            <div className='bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5 max-w-3xl'>

                {/* Jenis menu */}
                <div>
                    <p className={labelClass}>Jenis Menu</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
                        {(Object.keys(KIND_LABEL) as MenuKind[]).map((k) => (
                            <button
                                key={k}
                                type='button'
                                onClick={() => handleKindChange(k)}
                                className={`text-left px-3 py-2.5 rounded-xl border transition-colors ${
                                    kind === k
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                            >
                                <span
                                    className={`block text-sm font-medium ${
                                        kind === k
                                            ? 'text-indigo-700 dark:text-indigo-400'
                                            : 'text-gray-800 dark:text-gray-200'
                                    }`}
                                >
                                    {KIND_LABEL[k].title}
                                </span>
                                <span className='block text-xs text-gray-400 mt-0.5'>
                                    {KIND_LABEL[k].desc}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grup induk */}
                {(isChild || isPermission) && (
                    <div>
                        <label className={labelClass}>
                            Grup Induk{isChild && <span className='text-red-500'> *</span>}
                        </label>
                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            disabled={isPending}
                            className={inputClass}
                        >
                            <option value=''>— Pilih grup —</option>
                            {parentOptions.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                    {!m.path ? ' (grup)' : ''}
                                </option>
                            ))}
                        </select>
                        {parentOptions.length === 0 && (
                            <p className='text-xs text-amber-600 dark:text-amber-400 mt-1'>
                                Belum ada menu level atas. Buat Grup Menu terlebih dahulu.
                            </p>
                        )}
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className={labelClass}>
                            Nama Menu <span className='text-red-500'>*</span>
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPending}
                            placeholder={isGroup ? 'Setting, Master, ...' : 'Disposal, User, ...'}
                            className={inputClass}
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Ikon</label>
                        <IconPicker value={iconName} onChange={setIconName} disabled={isPending} />
                    </div>
                </div>

                {!isGroup && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {needsPath && <div>
                            <label className={labelClass}>
                                Path Halaman (frontend) <span className='text-red-500'>*</span>
                            </label>
                            <input
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                disabled={isPending}
                                placeholder='/dashboard/disposal'
                                className={`${inputClass} font-mono`}
                            />
                        </div>}

                        <div>
                            <label className={labelClass}>
                                Route Path (backend)
                                {isPermission && <span className='text-red-500'> *</span>}
                            </label>
                            <input
                                value={routePath}
                                onChange={(e) => setRoutePath(e.target.value)}
                                disabled={isPending}
                                placeholder='/transactions/disposal'
                                className={`${inputClass} font-mono`}
                            />
                            <p className='text-xs text-gray-400 mt-1'>
                                Dipakai untuk mencocokkan hak akses ke endpoint. Kosongkan
                                kalau menu ini tidak punya endpoint sendiri.
                            </p>
                        </div>
                    </div>
                )}

                {isPermission && (
                    <div className='flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800'>
                        <svg className='w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <p className='text-xs text-amber-700 dark:text-amber-400'>
                            Menu ini <b>tidak akan tampil di sidebar</b>. Gunakan untuk endpoint
                            yang tidak punya halaman sendiri, mis. <span className='font-mono'>/transactions/mutation/draft</span>.
                            Hak aksesnya tetap diatur seperti biasa di halaman Role.
                        </p>
                    </div>
                )}

                {isGroup && (
                    <div className='flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800'>
                        <svg className='w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <p className='text-xs text-indigo-700 dark:text-indigo-400'>
                            Grup tidak perlu path karena tidak membuka halaman. Setelah dibuat,
                            pindahkan menu yang ada ke grup ini lewat tab <b>Atur Urutan</b>.
                        </p>
                    </div>
                )}

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
                        onClick={() => navigate('/dashboard/menu')}
                        disabled={isPending}
                        className='px-5 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50'
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isPending}
                        className='px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isPending ? 'Menyimpan...' : 'Buat Menu'}
                    </button>
                </div>
            </div>
        </section>
    )
}
