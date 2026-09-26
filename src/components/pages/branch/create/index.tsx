import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Inputs } from '../../../molecules/input/inputs'
import { Selects } from '../../../molecules/input/selects'
import Buttons from '../../../atoms/buttons'
import Head from '../../../molecules/head'
import { useCreateBranch } from '../../../../hooks/mutation/branch/useCreateBranch'
import { branchType } from '../../../../constans/branch'

export default function CreateBranchPage() {
  const navigate = useNavigate()

  const [branchName, setBranchName] = useState('')
  const [type, setType] = useState('')

  const createBranch = useCreateBranch()

  const handleCreate = (e?: React.FormEvent) => {
    e?.preventDefault()

    const name = branchName.trim()
    if (!name) return toast.error('Nama cabang wajib diisi')
    if (!type) return toast.error('Tipe cabang wajib dipilih')

    createBranch.mutate(
      {
        branch_name: name,
        branch_type: type,
        status: 'active',
      },
      {
        onSuccess: () => navigate('/dashboard/branch'),
      }
    )
  }

  return (
    <form onSubmit={handleCreate}>
      <Head label="Create Branch" />

      <section className="flex justify-between gap-5 items-start mt-8">
        <Inputs
          label="Branch Name"
          value={branchName}
          onChange={setBranchName}
          placeholder="mis. Bandung Barat"
          containerClassName="w-1/2"
          required
        />
        <Selects
          label="Branch Type"
          value={type}
          onChange={setType}
          options={branchType}
          placeholder="Pilih tipe cabang..."
          helperText="HO dipakai backend untuk menandai kantor pusat — nilainya tidak boleh diketik bebas."
          containerClassName="w-1/2"
          required
        />
      </section>

      <div className="mt-4 flex gap-2">
        <Buttons
          label="Cancel"
          onClick={() => navigate('/dashboard/branch')}
          disable={createBranch.isPending}
        />
        <Buttons
          label={createBranch.isPending ? 'Menyimpan...' : 'Create'}
          onClick={handleCreate}
          disable={createBranch.isPending}
        />
      </div>
    </form>
  )
}
