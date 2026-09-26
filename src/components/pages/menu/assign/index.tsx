import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Selects } from '../../../molecules/input/selects'
import { useRoleList } from '../../../../hooks/query/role/list'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { useRoleMenus } from '../../../../hooks/query/role/roleMenus'
import { usePermissionCatalog } from '../../../../hooks/query/menu/permissionCatalog'
import { roleListToSelectOptions } from '../../../../utils/role'
import { menuChildrenToSelectOptions, menuListToSelectOptions } from '../../../../utils/menu'
import Buttons from '../../../atoms/buttons'
import { useAssignMenus } from '../../../../hooks/mutation/menu/useAssignMenus'
import Head from '../../../molecules/head'
import type { RoleMenuState } from '../../../../models/roles/roleMenus'

type MenuType = 'main menu' | 'sub menu'

/** Ratakan pohon role menus jadi map menuId → permissions */
function flattenRoleMenus(menus: RoleMenuState[]): Record<string, string[]> {
    const result: Record<string, string[]> = {}

    const walk = (items: RoleMenuState[]) => {
        items.forEach((item) => {
            if (item.permissions?.length) result[item.id] = item.permissions
            if (item.children?.length) walk(item.children)
        })
    }

    walk(menus)
    return result
}

export default function AssignMenuPage() {
    const [menuType, setMenuType] = useState<MenuType>('main menu')
    const [selectedPermission, setSelectedPermission] = useState<string[]>([])
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedMenu, setSelectedMenu] = useState<string>('')

    const { data: roleList } = useRoleList()
    const { data: menuList } = useMenuList()
    const { data: catalog } = usePermissionCatalog()
    // hak akses role saat ini — wajib ikut dikirim, karena backend mengganti
    // SELURUH assignment role (menu yang tidak dikirim akan dicabut)
    const { data: roleMenusData, isLoading: loadingRoleMenus } = useRoleMenus(selectedRole)

    const existing = useMemo(
        () => (roleMenusData?.data ? flattenRoleMenus(roleMenusData.data) : {}),
        [roleMenusData]
    )

    const assignMenusMutation = useAssignMenus({
        roleId: selectedRole,
        redirectOnSuccess: false,
        onSuccess: () => {
            setSelectedMenu('')
            setSelectedPermission([])
        },
    })

    const handleRoleChange = (roleId: string) => {
        setSelectedRole(roleId)
        setSelectedMenu('')
        setSelectedPermission([])
    }

    const handleMenuChange = (menuId: string) => {
        setSelectedMenu(menuId)
        // tampilkan permission yang sudah dimiliki role untuk menu ini
        setSelectedPermission(existing[menuId] ?? [])
    }

    const handleMenuTypeChange = (type: MenuType) => {
        setMenuType(type)
        setSelectedMenu('')
        setSelectedPermission([])
    }

    const togglePermission = (value: string) => {
        setSelectedPermission((prev) =>
            prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
        )
    }

    const handleSubmit = () => {
        if (!selectedRole) return toast.error('Pilih role terlebih dahulu')
        if (!selectedMenu) return toast.error('Pilih menu terlebih dahulu')
        if (selectedPermission.length === 0) return toast.error('Pilih minimal satu hak akses')
        if (loadingRoleMenus) return toast.error('Menunggu data hak akses role...')

        // Gabung dengan assignment yang sudah ada supaya tidak ada yang tercabut
        const merged = { ...existing, [selectedMenu]: selectedPermission }

        assignMenusMutation.mutate({
            menus: Object.entries(merged).map(([menu_id, permissions]) => ({
                menu_id,
                permissions,
            })),
        })
    }

    // Hak akses yang relevan untuk menu terpilih, dari tabel menu_permissions
    const menuPermissionOptions = useMemo(() => {
        if (!catalog || !selectedMenu) return []

        const allowed = catalog.data.menus.find((m) => m.menu_id === selectedMenu)?.values ?? []
        const meta = new Map(
            catalog.data.groups
                .flatMap((group) => group.permissions)
                .map((permission) => [permission.value, permission])
        )

        return allowed.map(
            (value) =>
                meta.get(value) ?? {
                    id: value,
                    value,
                    label: value,
                    description: '',
                    module: '',
                }
        )
    }, [catalog, selectedMenu])

    const parentOptions = menuList ? menuListToSelectOptions(menuList.data) : []
    const childOptions = menuList ? menuChildrenToSelectOptions(menuList.data) : []
    const menuOptions = menuType === 'main menu' ? parentOptions : childOptions

    const isSubmitting = assignMenusMutation.isPending
    const otherMenuCount = Object.keys(existing).filter((id) => id !== selectedMenu).length

    return (
        <div className='space-y-4'>
            <Head label='Menu Assignment' className='mb-4' />

            <div className='flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800'>
                <svg className='w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <p className='text-xs text-indigo-700 dark:text-indigo-400'>
                    Halaman ini mengatur satu menu dalam satu waktu.{' '}
                    {selectedRole ? (
                        <>
                            Untuk mengatur seluruh hak akses role sekaligus, buka{' '}
                            <Link
                                to={`/dashboard/role/${selectedRole}`}
                                className='underline underline-offset-2 font-medium'
                            >
                                halaman hak akses role
                            </Link>
                            .
                        </>
                    ) : (
                        'Untuk mengatur seluruh hak akses role sekaligus, buka detail role dari halaman Role.'
                    )}
                </p>
            </div>

            {/* Toggle Parent / Child */}
            <div className='flex gap-2'>
                {(['main menu', 'sub menu'] as MenuType[]).map((type) => (
                    <button
                        key={type}
                        type='button'
                        onClick={() => handleMenuTypeChange(type)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize
                            ${menuType === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <section className='flex flex-wrap gap-4 justify-between'>
                <div className='w-full md:w-[48%] space-y-1'>
                    {roleList && (
                        <Selects
                            label='Select Role'
                            value={selectedRole}
                            options={roleListToSelectOptions(roleList.data)}
                            onChange={handleRoleChange}
                        />
                    )}
                    <Selects
                        label={`Select Menu (${menuType})`}
                        value={selectedMenu}
                        options={menuOptions}
                        onChange={handleMenuChange}
                    />

                    {selectedRole && !loadingRoleMenus && (
                        <p className='text-xs text-gray-400 pt-1'>
                            {otherMenuCount} menu lain milik role ini akan dipertahankan.
                        </p>
                    )}
                </div>

                <div className='w-full md:w-[48%]'>
                    <p className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
                        Hak Akses
                    </p>

                    {!catalog ? (
                        <p className='text-xs text-gray-400'>Memuat daftar hak akses...</p>
                    ) : !selectedMenu ? (
                        <p className='text-xs text-gray-400'>Pilih menu dulu untuk melihat hak akses yang tersedia.</p>
                    ) : menuPermissionOptions.length === 0 ? (
                        <p className='text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg'>
                            Belum ada hak akses yang dipetakan ke menu ini. Tambahkan lewat
                            halaman hak akses role, atau langsung di tabel{' '}
                            <span className='font-mono'>menu_permissions</span>.
                        </p>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1'>
                            {menuPermissionOptions.map((permission) => (
                                <label
                                    key={permission.value}
                                    className='flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors'
                                    title={permission.description}
                                >
                                    <input
                                        type='checkbox'
                                        checked={selectedPermission.includes(permission.value)}
                                        onChange={() => togglePermission(permission.value)}
                                        className='w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                    />
                                    <span className='min-w-0'>
                                        <span className='block text-xs text-gray-800 dark:text-gray-200 truncate'>
                                            {permission.label}
                                        </span>
                                        <span className='block text-xs text-gray-400 font-mono truncate'>
                                            {permission.value}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Buttons
                label={isSubmitting ? 'Assigning...' : 'Assign Menu'}
                className='mx-auto mt-4'
                onClick={handleSubmit}
                disable={
                    isSubmitting ||
                    loadingRoleMenus ||
                    !selectedRole ||
                    !selectedMenu ||
                    selectedPermission.length === 0
                }
            />
        </div>
    )
}
