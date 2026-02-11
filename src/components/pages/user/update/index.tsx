import React, { useEffect, useState } from 'react'
import { Inputs } from '../../../molecules/input/inputs'
import { useParams } from 'react-router-dom'
import { useUserDetail } from '../../../../hooks/query/user/detail'
import Head from '../../../molecules/head'
import Buttons from '../../../atoms/buttons'
import type { UpdateUserRequest } from '../../../../models/users/update'
import { useUpdateUser } from '../../../../hooks/mutation/user/useUpdateUser'
import toast from 'react-hot-toast'

export default function UpdateUser() {
    const { id } = useParams()
    const { data } = useUserDetail(id || '')

    const [formData, setFormData] = useState<UpdateUserRequest>({
        fullname: '',
        username: '',
        email: '',
    })

    useEffect(() => {
        if (data?.data) {
            setFormData({
                fullname: data.data.fullname || '',
                username: data.data.username || '',
                email: data.data.email || '',
            })
        }
    }, [data])

    const updateUserMutation = useUpdateUser({
        redirectOnSuccess: true,
        redirectPath: '/dashboard/user',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const payload: UpdateUserRequest = {}

        if (formData.username && formData.username !== data?.data.username) {
            payload.username = formData.username.trim()
        }

        if (formData.fullname && formData.fullname !== data?.data.fullname) {
            payload.fullname = formData.fullname.trim()
        }

        if (formData.email && formData.email !== data?.data.email) {
            payload.email = formData.email.trim()
        }

        if (Object.keys(payload).length === 0) {
            toast.error('Please change at least one field')
            return
        }

        updateUserMutation.mutate({
            userId: id || '',
            payload,
        })
    }
    return (
        <div>
            <Head label={`Update User ${data?.data.fullname}`} />
            <section className='flex gap-4 mt-4'>
                <Inputs label={'New Fullname'} value={formData.fullname || ''} onChange={(value) => setFormData(prev => ({ ...prev, fullname: value }))} />
                <Inputs label={'New Username'} value={formData.username || ''} onChange={(value) => setFormData(prev => ({ ...prev, username: value }))} />
                <Inputs label={'New Email'} value={formData.email || ''} onChange={(value) => setFormData(prev => ({ ...prev, email: value }))} />
            </section>
            <div className='mt-6 flex gap-2'>
                <Buttons
                    label={updateUserMutation.isPending ? 'Updating...' : 'Update User'}
                    disable={updateUserMutation.isPending}
                    onClick={handleSubmit} />
            </div>
        </div>
    )
}
