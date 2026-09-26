import { Link } from "react-router-dom"
import { formatStage } from "../../../utils/stage"

/** Nomor transaksi + tautan ke detailnya */
export function TransactionLink({ href, number }: { href: string; number: string }) {
  return (
    <Link to={href} className="text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap">
      {number}
    </Link>
  )
}

export function StagePill({ stage }: { stage: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
      {formatStage(stage)}
    </span>
  )
}

export function BranchCell({ code, name }: { code: string; name?: string }) {
  if (!code) return <>-</>
  return (
    <div className="whitespace-nowrap">
      <div>{code}</div>
      {name && <div className="text-xs text-gray-500 dark:text-gray-400">{name}</div>}
    </div>
  )
}
