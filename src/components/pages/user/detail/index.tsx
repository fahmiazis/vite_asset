import React from 'react'
import { useParams } from 'react-router-dom'
import { useUserDetail } from '../../../../hooks/query/user/detail'

export default function DetailUser() {
  const { id } = useParams()
  const { data } = useUserDetail(id || '')

  console.log('data ==>', data)
  return (
    <div>
      detail user dimari {id}
      <p>nama usernya adalah : {data?.data.fullname}</p>
    </div>
  )
}
