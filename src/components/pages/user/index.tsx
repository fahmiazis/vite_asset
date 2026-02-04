import React from 'react'
import { useUserList } from '../../../hooks/query/user/list'

export default function UserPage() {
    const {data} = useUserList()
    console.log('data user ==>', data)
  return (
    <div>
      user page
    </div>
  )
}
