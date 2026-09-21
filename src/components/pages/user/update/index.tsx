import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Inputs } from '../../../molecules/input/inputs'
import { useUserDetail } from '../../../../hooks/query/user/detail'
import Head from '../../../molecules/head'
import Buttons from '../../../atoms/buttons'
import type { UpdateUserRequest } from '../../../../models/users/update'
import { useUpdateUser } from '../../../../hooks/mutation/user/useUpdateUser'

/**
 * Ubah data user.
 *
 * Username sengaja read-only: dto.UpdateUserRequest di backend tidak punya
 * field username, jadi apa pun yang dikirim akan diabaikan tanpa error.
 * Menampilkannya sebagai input yang bisa diketik membuat user mengira
 * perubahannya tersimpan.
 *
 * Role tidak diatur di sini — ada panel sendiri di halaman detail user.
 */
export default function UpdateUser() {
    const { id } = useParams()
    const { data, isLoading } = useUserDetail(id || '')
    const user = data?.data

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '',
                password: '',
            })
        }
    }, [user])

    const updateUserMutation = useUpdateUser({
        redirectOnSuccess: true,
        redirectPath: '/dashboard/user',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        const fullname = formData.fullname.trim()
        const email = formData.email.trim()
        const password = formData.password

        if (fullname && fullname.length < 3) {
            return toast.error('Fullname minimal 3 karakter')
        }
        if (password && password.length < 6) {
            return toast.error('Password minimal 6 karakter')
        }

        // hanya kirim yang berubah — backend menganggap string kosong
        // sebagai "tidak diubah"
        const payload: UpdateUserRequest = {}
        if (fullname && fullname !== user.fullname) payload.fullname = fullname
        if (email && email !== user.email) payload.email = email
        if (password) payload.password = password

        if (Object.keys(payload).length === 0) {
            toast.error('Belum ada yang diubah')
            return
        }

        updateUserMutation.mutate({ userId: id || '', payload })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
            </div>
        )
    }

    if (!user) return null

    return (
        <form onSubmit={handleSubmit}>
            <Head label={`Update User ${user.fullname}`} />

            <section className="flex gap-4 mt-4">
                <div className="w-1/2 flex flex-col gap-4">
                    <Inputs
                        label="Username"
                        value={user.username || ''}
                        readOnly
                        helperText="Username tidak bisa diubah."
                        inputClassName="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                    <Inputs
                        label="Fullname"
                        value={formData.fullname}
                        onChange={(value) => setFormData((prev) => ({ ...prev, fullname: value }))}
                    />
                </div>

                <div className="w-1/2 flex flex-col gap-4">
                    <Inputs
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
                    />
                    <Inputs
                        label="Password Baru"
                        type="password"
                        value={formData.password}
                        onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
                        placeholder="Kosongkan kalau tidak diganti"
                        helperText="Minimal 6 karakter."
                    />
                </div>
            </section>

            <div className="mt-6 flex gap-2">
                <Buttons
                    label={updateUserMutation.isPending ? 'Menyimpan...' : 'Update User'}
                    disable={updateUserMutation.isPending}
                    onClick={handleSubmit}
                />
            </div>
        </form>
    )
}
