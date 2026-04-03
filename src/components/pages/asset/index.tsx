import React from 'react'
import { AssetsTable } from '../../organisms/assest/table'
import { useAssetList } from '../../../hooks/query/asset/list'

export default function AssetPage() {
    const { data } = useAssetList()
  return (
    <div>
      <h6 className='text-3xl font-bold mb-4'>Assets</h6>
      {data && (
          <AssetsTable data={data?.data.data}/>
      )}
    </div>
  )
}
