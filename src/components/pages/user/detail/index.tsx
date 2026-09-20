import { useParams } from 'react-router-dom'
import { useUserDetail } from '../../../../hooks/query/user/detail'
import BaseUserInformation from '../../../organisms/user/detail/userInformationSection'
import RoleAssignmentSection from '../../../organisms/user/detail/roleAssignmentSection'
import DisposalList from '../../../organisms/dashboard/disposalTable'
import { contactsData } from '../../dashboard'

export default function DetailUser() {
  const { id } = useParams()
  const { data, isLoading } = useUserDetail(id || '')

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
        <BaseUserInformation data={data?.data} className='w-full lg:w-2/4' />
        <RoleAssignmentSection user={data?.data} className='w-full lg:flex-1' />
      </div>

      <div className='flex flex-wrap gap-4'>
        <DisposalList items={contactsData} title='Assets History' className='w-full md:flex-1' />
        <DisposalList items={contactsData} title='Assets History' className='w-full md:flex-1' />
      </div>
    </div>
  )
}
