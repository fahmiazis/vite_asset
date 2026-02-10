import { useState } from 'react'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useCreateBranch } from '../../../../hooks/mutation/branch/useCreateBranch'
import { useNavigate } from 'react-router-dom'

export default function CreateBranchPage() {
  const navigate = useNavigate()
  const [branchName, setBranchName] = useState('')
  const [branchType, setBranchType] = useState('')
  const createBranch = useCreateBranch();

  const handleCreate = () => {
    createBranch.mutate(
      {
        branch_name: branchName,
        branch_type: branchType,
        status: 'active',
      },
      {
        onSuccess: () => {
          navigate('/dashboard/branch');
        },
        onError: (error) => {
          console.error('Failed to create branch:', error);
        },
      }
    );
  };
  return (
    <div>
      <section className='flex justify-between gap-5 items-center'>
        <Inputs label={'Branch Name'} value={branchName} onChange={setBranchName} containerClassName='w-1/2' />
        <Inputs label={'Branch Type'} value={branchType} onChange={setBranchType} containerClassName='w-1/2' />
      </section>
      <Buttons label='Create' className='mt-4' onClick={handleCreate} />
    </div>
  )
}
