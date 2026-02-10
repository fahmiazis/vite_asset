import { useState } from 'react'
import { MultiSelect } from '../../../molecules/input/multiSelect'
import { menuPermissions } from '../../../../constans/menuPermission'
import { Selects } from '../../../molecules/input/selects'
import { useRoleList } from '../../../../hooks/query/role/list'
import { useMenuList } from '../../../../hooks/query/menu/list'
import { roleListToSelectOptions } from '../../../../utils/role'
import { roleList } from '../../../../services/roles/list';
import { menuListToSelectOptions } from '../../../../utils/menu'
import Buttons from '../../../atoms/buttons'
import { useAssignMenus } from '../../../../hooks/mutation/menu/useAssignMenus'
import toast from 'react-hot-toast'

export default function AssignMenuPage() {
    const [selectedPermission, setSelectedPermission] = useState<string[]>([])
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedMenu, setSelectedMenu] = useState<string>('')

    const { data: roleList, isLoading: isLoadingRoles } = useRoleList()
    const { data: menuList, isLoading: isLoadingMenus } = useMenuList()

    // Mutation
    const assignMenusMutation = useAssignMenus({
        roleId: selectedRole,
        onSuccess: () => {
            // Reset form after success
            setSelectedMenu('')
            setSelectedPermission([])
            // Optional: reset role juga kalau mau
            // setSelectedRole('')
        },
    })

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

        // Prepare payload
        const payload = {
            menus: [
                {
                    menu_id: selectedMenu,
                    permissions: selectedPermission,
                },
            ],
        }

        // Submit
        assignMenusMutation.mutate(payload)
    }

    const isLoading = isLoadingRoles || isLoadingMenus
    const isSubmitting = assignMenusMutation.isPending

    return (
        <div>
            <section className='flex gap-4 justify-between'>
                <div className='w-1/2'>
                    {roleList && (
                        <Selects label={'Select Role'} value={selectedRole} options={roleListToSelectOptions(roleList.data)} onChange={setSelectedRole} />
                    )}
                    {menuList && (
                        <Selects label={'Select Menu'} value={selectedMenu} options={menuListToSelectOptions(menuList.data)} onChange={setSelectedMenu} />
                    )}
                </div>
                <div className='w-1/2'>
                    <MultiSelect
                        containerClassName='w-full'
                        label={'Access'}
                        value={selectedPermission}
                        options={menuPermissions}
                        onChange={setSelectedPermission} />
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
