import { useState } from 'react'
import { Selects } from '../../../molecules/input/selects'
import { useRoleList } from '../../../../hooks/query/role/list'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { roleListToSelectOptions } from '../../../../utils/role'
import { menuChildrenToSelectOptions, menuListToSelectOptions } from '../../../../utils/menu'
import Buttons from '../../../atoms/buttons'
import { useAssignMenus } from '../../../../hooks/mutation/menu/useAssignMenus'
import toast from 'react-hot-toast'
import { Inputs } from '../../../molecules/input/inputs'
import Head from '../../../molecules/head'

type MenuType = 'parent' | 'child'

export default function AssignMenuPage() {
    const [menuType, setMenuType] = useState<MenuType>('parent')
    const [permissionInput, setPermissionInput] = useState<string>('')
    const [selectedPermission, setSelectedPermission] = useState<string[]>([])
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedMenu, setSelectedMenu] = useState<string>('')

    const { data: roleList } = useRoleList()
    const { data: menuList } = useMenuList()

    const assignMenusMutation = useAssignMenus({
        roleId: selectedRole,
        onSuccess: () => {
            setSelectedMenu('')
            setSelectedPermission([])
            setPermissionInput('')
        },
    })

    const handleMenuTypeChange = (type: MenuType) => {
        setMenuType(type)
        setSelectedMenu('')
    }

    const handlePermissionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const trimmed = permissionInput.trim()
            if (trimmed && !selectedPermission.includes(trimmed)) {
                setSelectedPermission([...selectedPermission, trimmed])
            }
            setPermissionInput('')
        }
        if (e.key === 'Backspace' && permissionInput === '' && selectedPermission.length > 0) {
            setSelectedPermission(selectedPermission.slice(0, -1))
        }
    }

    const removePermission = (tag: string) => {
        setSelectedPermission(selectedPermission.filter((p) => p !== tag))
    }

    const handleSubmit = () => {
        if (!selectedRole) return toast.error('Please select a role')
        if (!selectedMenu) return toast.error('Please select a menu')
        if (selectedPermission.length === 0) return toast.error('Please add at least one permission')

        assignMenusMutation.mutate({
            menus: [{ menu_id: selectedMenu, permissions: selectedPermission }],
        })
    }

    // TODO: ganti dengan hook yang sesuai
    const parentOptions = menuList ? menuListToSelectOptions(menuList.data) : []
    const childOptions = menuList ? menuChildrenToSelectOptions(menuList.data) : []

    const menuOptions = menuType === 'parent' ? parentOptions : childOptions

    const isSubmitting = assignMenusMutation.isPending

    return (
        <div className='space-y-4'>
            <Head label='Menu Assignment' className='mb-4'/>
            {/* Toggle Parent / Child */}
            <div className='flex gap-2'>
                {(['parent', 'child'] as MenuType[]).map((type) => (
                    <button
                        key={type}
                        type='button'
                        onClick={() => handleMenuTypeChange(type)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize
                            ${menuType === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <section className='flex gap-4 justify-between'>
                <div className='w-1/2 space-y-1'>
                    {roleList && (
                        <Selects
                            label='Select Role'
                            value={selectedRole}
                            options={roleListToSelectOptions(roleList.data)}
                            onChange={setSelectedRole}
                        />
                    )}
                    <Selects
                        label={`Select Menu (${menuType})`}
                        value={selectedMenu}
                        options={menuOptions}
                        onChange={setSelectedMenu}
                    />
                </div>

                <div className='w-1/2'>
                    <Inputs
                        label='Access'
                        value={permissionInput}
                        onChange={setPermissionInput}
                        placeholder='Type and press Enter...'
                        onKeyDown={handlePermissionKeyDown}
                    />
                    {selectedPermission.length > 0 && (
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {selectedPermission.map((tag) => (
                                <span
                                    key={tag}
                                    className='flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full'
                                >
                                    {tag}
                                    <button
                                        type='button'
                                        onClick={() => removePermission(tag)}
                                        className='ml-1 text-blue-500 hover:text-red-500 transition-colors'
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Buttons
                label={isSubmitting ? 'Assigning...' : 'Assign Menu'}
                className='mx-auto mt-4'
                onClick={handleSubmit}
                disable={isSubmitting || !selectedRole || !selectedMenu || selectedPermission.length === 0}
            />
        </div>
    )
}