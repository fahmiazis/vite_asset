import { useMyProfile } from '../../../hooks/query/auth/myProfile'
import BaseUserInformation from '../../organisms/user/detail/userInformationSection'
import UserAssetsSection from '../../organisms/user/detail/userAssetsSection'
import UserBranchesSection from '../../organisms/user/detail/userBranchesSection'
import ChangePasswordSection from '../../organisms/user/detail/changePasswordSection'

/**
 * Profil user yang login — versi self-service dari detail user:
 * tanpa pengaturan role, homebase & cabang hanya ditampilkan.
 */
export default function ProfilePage() {
  const { data, isLoading } = useMyProfile()
  const user = data?.data

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap justify-between gap-4'>
        <BaseUserInformation data={user} self className='w-full lg:w-2/4' />
        <ChangePasswordSection userId={user?.id || ''} self className='w-full lg:flex-1 min-w-0 h-fit' />
      </div>

      <div className='flex flex-wrap gap-4'>
        <UserAssetsSection userId={user?.id || ''} readOnly className='w-full md:flex-1 min-w-0' />
        <UserBranchesSection userId={user?.id || ''} readOnly className='w-full md:flex-1 min-w-0' />
      </div>
    </div>
  )
}
