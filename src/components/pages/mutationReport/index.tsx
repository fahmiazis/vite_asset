import { useTranslation } from "react-i18next"
import { CheckListIcon, Clock01Icon, Menu01Icon, PackageIcon } from "hugeicons-react"
import { useMutationReport } from "../../../hooks/query/report/mutation"
import { useReportExport } from "../../../hooks/mutation/report/exportReport"
import { useReportFilters } from "../../../hooks/useReportFilters"
import type { MutationReportRow } from "../../../models/report/mutation"
import { formatNumber } from "../../../utils/format"
import { reportErrorMessage } from "../../../utils/reportError"
import ListHeader from "../../organisms/common/listHeader"
import { StatCards } from "../../organisms/common/statCards"
import { ReportFilterBar } from "../../organisms/report/reportFilterBar"
import { ReportDownloadButton } from "../../organisms/report/reportDownloadButton"
import { ReportStageTabs } from "../../organisms/report/reportStageTabs"
import { ReportTable, type ReportColumn } from "../../organisms/report/reportTable"
import { BranchCell, StagePill, TransactionLink } from "../../organisms/report/cells"

export default function MutationReportPage() {
  const { t } = useTranslation()
  const { filters, params, update, reset } = useReportFilters()
  const { data, isLoading, error } = useMutationReport(params)
  const { exportReport, isExporting } = useReportExport("mutation")

  const report = data?.data
  const summary = report?.summary
  const rows = report?.rows ?? []
  const executed = rows.filter((r) => r.asset_status === "EXECUTED").length
  const pending = rows.filter((r) => r.asset_status === "PENDING").length

  const columns: ReportColumn<MutationReportRow>[] = [
    {
      key: "number",
      header: t("transactionReport.column.transactionNumber"),
      render: (r) => <TransactionLink href={`/dashboard/mutation/${r.transaction_number}`} number={r.transaction_number} />,
    },
    { key: "date", header: t("transactionReport.column.date"), render: (r) => r.transaction_date, nowrap: true },
    { key: "stage", header: t("transactionReport.column.stage"), render: (r) => <StagePill stage={r.current_stage} /> },
    { key: "assetNumber", header: t("transactionReport.column.assetNumber"), render: (r) => r.asset_number || "-", nowrap: true },
    { key: "assetName", header: t("transactionReport.column.assetName"), render: (r) => r.asset_name || "-" },
    { key: "from", header: t("transactionReport.column.fromBranch"), render: (r) => <BranchCell code={r.from_branch_code} name={r.from_branch_name} /> },
    { key: "to", header: t("transactionReport.column.toBranch"), render: (r) => <BranchCell code={r.to_branch_code} name={r.to_branch_name} /> },
    { key: "toLocation", header: t("transactionReport.column.toLocation"), render: (r) => r.to_location || "-" },
    { key: "document", header: t("transactionReport.column.documentNumber"), render: (r) => r.document_number || "-", nowrap: true },
    { key: "assetStatus", header: t("transactionReport.column.assetStatus"), render: (r) => r.asset_status || "-", nowrap: true },
    { key: "creator", header: t("transactionReport.column.createdBy"), render: (r) => r.created_by_name || "-", nowrap: true },
  ]

  const stats = [
    { color: "gray" as const, icon: <Menu01Icon size={15} />, value: formatNumber(summary?.total_transactions ?? 0), label: t("transactionReport.stat.transactions") },
    { color: "gray" as const, icon: <PackageIcon size={15} />, value: formatNumber(summary?.total_rows ?? 0), label: t("transactionReport.stat.assets") },
    { color: "yellow" as const, icon: <Clock01Icon size={15} />, value: formatNumber(pending), label: t("transactionReport.stat.assetsPending") },
    { color: "green" as const, icon: <CheckListIcon size={15} />, value: formatNumber(executed), label: t("transactionReport.stat.assetsExecuted") },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t("transactionReport.mutation.title")}
        subtitle={t("transactionReport.mutation.subtitle")}
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
