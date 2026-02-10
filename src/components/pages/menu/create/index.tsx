import { Inputs } from '../../../molecules/input/inputs'
import Buttons from '../../../atoms/buttons'
import { useState } from 'react'
import { useCreateMenu } from '../../../../hooks/mutation/menu/useCreateMenus'

export default function CreateMenu() {
  const [name, setName] = useState('')
  const [path, setPath] = useState('')
  const [routepath, setRoutePath] = useState('')

  const createMenu = useCreateMenu();

  const handleCreate = () => {
    createMenu.mutate({
      name: name,
      path: path,
      route_path: routepath,
      status: 'active',
    });
  };
  return (
    <div>
      <h6> u can create menu here</h6>
      <section className='flex justify-between items-center gap-4'>
        <Inputs label={'Name'} value={name} onChange={setName} containerClassName='w-1/2'/>
        <Inputs label={'Path'} value={path} onChange={setPath} containerClassName='w-1/2'/>
        <Inputs label={'Route Path'} value={routepath} onChange={setRoutePath} containerClassName='w-1/2'/>
      </section>

      <Buttons label='Create' className='mt-4' onClick={handleCreate}/>
    </div>
  )
}
