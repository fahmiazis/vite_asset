import { useState } from 'react'
import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useCreateBranch } from '../../../../hooks/mutation/branch/useCreateBranch'
import { useNavigate } from 'react-router-dom'
import { InputToggle } from '../../../molecules/input/inputTogle'
import Head from '../../../molecules/head'

export default function CreateBranchPage() {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false);

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
      <Head label='Create Branch'/>
      <section className='flex justify-between gap-5 items-center mt-8'>
        <Inputs label={'Branch Name'} value={branchName} onChange={setBranchName} containerClassName='w-1/2' />
        <Inputs label={'Branch Type'} value={branchType} onChange={setBranchType} containerClassName='w-1/2' />
      </section>
      {/* <section className='flex justify-between gap-5 items-center'>
        <InputToggle
          checked={isActive}
          onChange={setIsActive}
          className='w-1/2'
        />
      </section> */}
      <Buttons label='Create' className='mt-4' onClick={handleCreate} />
    </div>
  )
}
