import { useState } from 'react'
import { Selects } from '../../../molecules/input/selects'
import { useRoleList } from '../../../../hooks/query/role/list'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { roleListToSelectOptions } from '../../../../utils/role'
import { menuListToSelectOptions } from '../../../../utils/menu'
import Buttons from '../../../atoms/buttons'
import { useAssignMenus } from '../../../../hooks/mutation/menu/useAssignMenus'
import toast from 'react-hot-toast'
import { Inputs } from '../../../molecules/input/inputs'

export default function AssignMenuPage() {
    const [permissionInput, setPermissionInput] = useState<string>('')
    const [selectedPermission, setSelectedPermission] = useState<string[]>([])
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedMenu, setSelectedMenu] = useState<string>('')

    const { data: roleList, isLoading: isLoadingRoles } = useRoleList()
    const { data: menuList, isLoading: isLoadingMenus } = useMenuList()

    const assignMenusMutation = useAssignMenus({
        roleId: selectedRole,
        onSuccess: () => {
            setSelectedMenu('')
            setSelectedPermission([])
            setPermissionInput('')
        },
    })

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
        if (!selectedRole) {
            toast.error('Please select a role')
            return
        }
        if (!selectedMenu) {
            toast.error('Please select a menu')
            return
        }
        if (selectedPermission.length === 0) {
            toast.error('Please select at least one permission')
            return
        }

        assignMenusMutation.mutate({
            menus: [{ menu_id: selectedMenu, permissions: selectedPermission }],
        })
    }

    const isSubmitting = assignMenusMutation.isPending

    return (
        <div>
            <section className='flex gap-4 justify-between'>
                <div className='w-1/2'>
                    {roleList && (
                        <Selects
                            label='Select Role'
                            value={selectedRole}
                            options={roleListToSelectOptions(roleList.data)}
                            onChange={setSelectedRole}
                        />
                    )}
                    {menuList && (
                        <Selects
                            label='Select Menu'
                            value={selectedMenu}
                            options={menuListToSelectOptions(menuList.data)}
                            onChange={setSelectedMenu}
                        />
                    )}
                </div>

                <div className='w-1/2'>
                    <Inputs
                        label='Access'
                        value={permissionInput}
                        onChange={setPermissionInput}
                        placeholder='Type and press Enter...'
                        onKeyDown={handlePermissionKeyDown}
                    />
                    {/* Tags */}
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