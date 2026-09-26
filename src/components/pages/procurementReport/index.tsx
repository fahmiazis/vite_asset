import { useTranslation } from "react-i18next"
import { CheckListIcon, DeliveryBox01Icon, Menu01Icon, Money03Icon } from "hugeicons-react"
import { useProcurementReport } from "../../../hooks/query/report/procurement"
import { useReportExport } from "../../../hooks/mutation/report/exportReport"
import { useReportFilters } from "../../../hooks/useReportFilters"
import type { ProcurementReportRow } from "../../../models/report/procurement"
import { formatNumber, formatRupiah } from "../../../utils/format"
import { reportErrorMessage } from "../../../utils/reportError"
import ListHeader from "../../organisms/common/listHeader"
import { StatCards } from "../../organisms/common/statCards"
import { ReportFilterBar } from "../../organisms/report/reportFilterBar"
import { ReportDownloadButton } from "../../organisms/report/reportDownloadButton"
import { ReportStageTabs } from "../../organisms/report/reportStageTabs"
import { ReportTable, type ReportColumn } from "../../organisms/report/reportTable"
import { BranchCell, StagePill, TransactionLink } from "../../organisms/report/cells"

export default function ProcurementReportPage() {
  const { t } = useTranslation()
  const { filters, params, update, reset } = useReportFilters()
  const { data, isLoading, error } = useProcurementReport(params)
  const { exportReport, isExporting } = useReportExport("procurement")

  const report = data?.data
  const summary = report?.summary
  const rows = report?.rows ?? []

  const columns: ReportColumn<ProcurementReportRow>[] = [
    {
      key: "number",
      header: t("transactionReport.column.transactionNumber"),
      render: (r) => <TransactionLink href={`/dashboard/procurement/${r.transaction_number}`} number={r.transaction_number} />,
    },
    { key: "date", header: t("transactionReport.column.date"), render: (r) => r.transaction_date, nowrap: true },
    { key: "branch", header: t("transactionReport.column.branch"), render: (r) => <BranchCell code={r.branch_code} name={r.branch_name} /> },
    { key: "stage", header: t("transactionReport.column.stage"), render: (r) => <StagePill stage={r.current_stage} /> },
    { key: "item", header: t("transactionReport.column.itemName"), render: (r) => r.item_name || "-" },
    { key: "category", header: t("transactionReport.column.category"), render: (r) => r.category_name || "-", nowrap: true },
    { key: "qty", header: t("transactionReport.column.quantity"), render: (r) => formatNumber(r.quantity), align: "right" },
    { key: "unit", header: t("transactionReport.column.unitPrice"), render: (r) => formatRupiah(r.unit_price), align: "right", nowrap: true },
    { key: "total", header: t("transactionReport.column.totalPrice"), render: (r) => formatRupiah(r.total_price), align: "right", nowrap: true },
    { key: "dist", header: t("transactionReport.column.distribution"), render: (r) => r.distribution || "-" },
    { key: "creator", header: t("transactionReport.column.createdBy"), render: (r) => r.created_by_name || "-", nowrap: true },
  ]

  const stats = [
    { color: "gray" as const, icon: <Menu01Icon size={15} />, value: formatNumber(summary?.total_transactions ?? 0), label: t("transactionReport.stat.transactions") },
    { color: "yellow" as const, icon: <CheckListIcon size={15} />, value: formatNumber(summary?.total_rows ?? 0), label: t("transactionReport.stat.items") },
    { color: "green" as const, icon: <DeliveryBox01Icon size={15} />, value: formatNumber(summary?.total_quantity ?? 0), label: t("transactionReport.stat.quantity") },
    { color: "gray" as const, icon: <Money03Icon size={15} />, value: formatRupiah(summary?.total_value ?? 0), label: t("transactionReport.stat.totalValue") },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t("transactionReport.procurement.title")}
        subtitle={t("transactionReport.procurement.subtitle")}
        actions={<ReportDownloadButton onClick={() => exportReport(params)} isLoading={isExporting} disabled={!!error} />}
      />
      <StatCards items={stats} isLoading={isLoading && !data} />
      <ReportFilterBar
        filters={filters}
        branches={report?.branches ?? []}
        allBranches={report?.all_branches ?? false}
        onChange={update}
        onReset={reset}
      />
      <ReportStageTabs byStage={summary?.by_stage ?? []} active={filters.stage} onChange={(stage) => update({ stage })} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} error={reportErrorMessage(error, t)} />
    </div>
  )
}
