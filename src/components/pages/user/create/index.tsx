import Head from '../../../molecules/head'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useState } from 'react'
import type { UpdateUserRequest } from '../../../../models/users/update'
import { useCreateUser } from '../../../../hooks/mutation/user/useCreateuser'
import toast from 'react-hot-toast'

export default function CreateUsers() {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    fullname: '',
    username: '',
    email: '',
    password: '',
  })

  const updateUserMutation = useCreateUser({
    redirectOnSuccess: true,
    redirectPath: '/dashboard/user',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: UpdateUserRequest = {}

    if (formData.username && formData.username) {
      payload.username = formData.username.trim()
    }

    if (formData.fullname && formData.fullname) {
      payload.fullname = formData.fullname.trim()
    }

    if (formData.email && formData.email) {
      payload.email = formData.email.trim()
    }

    if (formData.password && formData.password) {
      payload.password = formData.password.trim()
    }

    if (Object.keys(payload).length === 0) {
      toast.error('Please change at least one field')
      return
    }

    updateUserMutation.mutate({
      payload,
    })
  }
  return (
    <div>
      <Head label={`Create User`} />
      <section className='flex gap-4 mt-4'>
        <div className='w-1/2 flex flex-col gap-4'>
          <Inputs label={'Fullname'} value={formData.fullname || ''} onChange={(value) => setFormData(prev => ({ ...prev, fullname: value }))} />
          <Inputs label={'Username'} value={formData.username || ''} onChange={(value) => setFormData(prev => ({ ...prev, username: value }))} />
        </div>
        <div className='w-1/2 flex flex-col gap-4'>
          <Inputs label={'Email'} value={formData.email || ''} onChange={(value) => setFormData(prev => ({ ...prev, email: value }))} />
          <Inputs label={'Password'} value={formData.password || ''} onChange={(value) => setFormData(prev => ({ ...prev, password: value }))} />
        </div>
      </section>
      <div className='mt-6 flex gap-2'>
        <Buttons
          label={updateUserMutation.isPending ? 'Create...' : 'Create User'}
          disable={updateUserMutation.isPending}
          onClick={handleSubmit} />
      </div>
    </div>
  )
}
