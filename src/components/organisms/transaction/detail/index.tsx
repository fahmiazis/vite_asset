import type { detailtransactionProps } from "../../../../models/transaction/detail"

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(num)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    approved: "bg-green-50 text-green-700 border border-green-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${map[status.toLowerCase()] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

export default function DetailTransactionLayout({ data }: { data: detailtransactionProps }) {
  const { transaction, items } = data.data

  const totalUnit = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalNilai = items.reduce((sum, item) => sum + item.total_price, 0)

  return (
    <section className="space-y-4 mt-4">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nomor transaksi</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{transaction.transaction_number}</p>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Tipe transaksi", value: transaction.transaction_type },
            { label: "Tanggal", value: formatDate(transaction.transaction_date) },
            { label: "Dibuat oleh", value: transaction.created_by },
            { label: "Disetujui oleh", value: transaction.approved_by ?? "Belum disetujui" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Catatan transaksi</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daftar item</h3>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{items.length} item</span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Item header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.item_name}</span>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                    {item.category_name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(item.total_price)}</span>
              </div>

              {/* Item body */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div><p className="text-xs text-gray-400 mb-1">Kuantitas</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.quantity} unit</p></div>
                  <div><p className="text-xs text-gray-400 mb-1">Harga satuan</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatRupiah(item.unit_price)}</p></div>
                  <div><p className="text-xs text-gray-400 mb-1">Kode cabang</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.branch_code}</p></div>
                </div>

                {item.notes && (
                  <div><p className="text-xs text-gray-400 mb-1">Catatan</p><p className="text-sm text-gray-700 dark:text-gray-300">{item.notes}</p></div>
                )}

                {/* Detail penerima */}
                {item.details && item.details.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Detail penerima</p>
                    <div className="space-y-2">
                      {item.details.map((detail) => (
                        <div key={detail.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center justify-center flex-shrink-0">
                            {detail.requester_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{detail.requester_name}</p>
                            <p className="text-xs text-gray-400">{detail.branch_code} · {detail.quantity} unit</p>
                          </div>
                          {detail.notes && <p className="text-xs text-gray-400 italic">{detail.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Total item</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{items.length} jenis &middot; {totalUnit} unit</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Total nilai</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(totalNilai)}</p>
          </div>
        </div>
      </div>

    </section>
  )
}