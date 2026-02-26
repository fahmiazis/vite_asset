import { useState } from "react"
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useCreateAssetsCategory } from "../../../../hooks/mutation/assestCategory/create"

export default function CreateAssetsCategory() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createAssetsCategory = useCreateAssetsCategory({
    redirectOnSuccess: true,
    redirectPath: '/dashboard/asset-category',
  })

  const handleCreate = () => {
    createAssetsCategory.mutate({
      category_code: code,
      category_name: name,
      description: description,
      is_active: true,
    })
  }

  return (
    <section className="bg-white rounded-xl p-2 px-4">
      <h6>You can create asset category here</h6>
      <section className='flex justify-between items-center gap-4'>
        <Inputs label='Category Code' value={code} onChange={setCode} containerClassName='w-1/2' />
        <Inputs label='Category Name' value={name} onChange={setName} containerClassName='w-1/2' />
        <Inputs label='Description' value={description} onChange={setDescription} containerClassName='w-1/2' />
      </section>

      <Buttons label='Create' className='mt-4' onClick={handleCreate} />
    </section>
  )
}