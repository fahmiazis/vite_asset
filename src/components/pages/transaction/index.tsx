import React from 'react'
import TransaksiHeader from '../../organisms/transaction/head'
import StatCards from '../../organisms/transaction/statCard'
import { TransaksiTable } from '../../organisms/transaction/table'
import { dummyTransaksi } from '../../organisms/transaction/dataDummy'

export default function TransactionPage() {
  return (
    <div>
      <TransaksiHeader/>
      <StatCards/>
      <TransaksiTable data={dummyTransaksi}/>
    </div>
  )
}
