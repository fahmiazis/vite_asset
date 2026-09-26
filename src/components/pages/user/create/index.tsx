import { useState } from 'react'
import toast from 'react-hot-toast'
import Head from '../../../molecules/head'
import Buttons from '../../../atoms/buttons'
import { Inputs } from '../../../molecules/input/inputs'
import { Selects } from '../../../molecules/input/selects'
import { useCreateUser } from '../../../../hooks/mutation/user/useCreateuser'
import { useRoleList } from '../../../../hooks/query/role/list'
import { roleListToSelectOptions } from '../../../../utils/role'
import type { CreateUserRequest } from '../../../../models/users/create'

/**
 * Buat user baru.
 *
 * Backend (dto.CreateUserRequest) mewajibkan username, fullname, email,
 * password minimal 6 karakter, dan minimal satu role. Halaman ini sebelumnya
 * memakai bentuk payload update — semua field opsional dan role tidak pernah
 * dikirim — sehingga request selalu ditolak validasi.
 *
 * Satu user = satu role.
 */
export default function CreateUsers() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
  })

  const { data: roleList, isLoading: isLoadingRoles } = useRoleList()
  const roleOptions = roleList?.data ? roleListToSelectOptions(roleList.data) : []

  const createUserMutation = useCreateUser({
    redirectOnSuccess: true,
    redirectPath: '/dashboard/user',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fullname = formData.fullname.trim()
    const username = formData.username.trim()
    const email = formData.email.trim()
    const password = formData.password

    if (fullname.length < 3) return toast.error('Fullname minimal 3 karakter')
    if (username.length < 3) return toast.error('Username minimal 3 karakter')
    if (!email) return toast.error('Email wajib diisi')
    if (password.length < 6) return toast.error('Password minimal 6 karakter')
    if (!formData.role_id) return toast.error('Role wajib dipilih')

    const payload: CreateUserRequest = {
      fullname,
      username,
      email,
      password,
      role_ids: [formData.role_id],
    }

    createUserMutation.mutate({ payload })
  }

  const isPending = createUserMutation.isPending

  return (
    <form onSubmit={handleSubmit}>
      <Head label="Create User" />

      <section className="flex gap-4 mt-4">
        <div className="w-1/2 flex flex-col gap-4">
          <Inputs
            label="Fullname"
            value={formData.fullname}
            onChange={(value) => setFormData((prev) => ({ ...prev, fullname: value }))}
            placeholder="Nama lengkap"
            required
          />
          <Inputs
            label="Username"
            value={formData.username}
            onChange={(value) => setFormData((prev) => ({ ...prev, username: value }))}
            placeholder="Dipakai untuk login"
            helperText="Minimal 3 karakter. Tidak bisa diubah setelah user dibuat."
            required
          />
        </div>

        <div className="w-1/2 flex flex-col gap-4">
          <Inputs
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
            placeholder="nama@perusahaan.com"
            required
          />
          <Inputs
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
            placeholder="Minimal 6 karakter"
            required
          />
        </div>
      </section>

      <section className="mt-4 w-1/2 pr-2">
        <Selects
          label="Role"
          value={formData.role_id}
          onChange={(value) => setFormData((prev) => ({ ...prev, role_id: value }))}
          options={roleOptions}
          placeholder={isLoadingRoles ? 'Memuat role...' : 'Pilih role...'}
          helperText="Satu user hanya punya satu role. Hak aksesnya mengikuti role tersebut."
          disabled={isLoadingRoles}
          required
        />
      </section>

      <div className="mt-6 flex gap-2">
        <Buttons
          label={isPending ? 'Menyimpan...' : 'Create User'}
          disable={isPending || isLoadingRoles}
          onClick={handleSubmit}
        />
      </div>
    </form>
  )
}
