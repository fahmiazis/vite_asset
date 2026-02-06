import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserDetail } from '../../../../hooks/query/user/detail'
import BaseUserInformation from '../../../organisms/user/detail/userInformationSection'
import DisposalList from '../../../organisms/dashboard/disposalTable'
import { contactsData } from '../../dashboard'

export default function DetailUser() {
  const { id } = useParams()
  const { data } = useUserDetail(id || '')

  console.log('data ==>', data?.data)
  return (
    <div className='flex justify-between gap-4'>
      <BaseUserInformation data={data?.data} className='w-2/4'/>
      <DisposalList items={contactsData} title='Assets History' className="w-1/4"/>
      <DisposalList items={contactsData} title='Assets History' className="w-1/4"/>
    </div>
  )
}
