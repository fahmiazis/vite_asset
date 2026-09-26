import { useTranslation } from "react-i18next"
import { CheckListIcon, Menu01Icon, Money03Icon, MoneyReceive01Icon } from "hugeicons-react"
import { useDisposalReport } from "../../../hooks/query/report/disposal"
import { useReportExport } from "../../../hooks/mutation/report/exportReport"
import { useReportFilters } from "../../../hooks/useReportFilters"
import type { DisposalReportRow } from "../../../models/report/disposal"
import { disposalStageLabel } from "../../../utils/disposalStage"
import { formatNumber, formatRupiah } from "../../../utils/format"
import { reportErrorMessage } from "../../../utils/reportError"
import ListHeader from "../../organisms/common/listHeader"
import { StatCards } from "../../organisms/common/statCards"
import { ReportFilterBar } from "../../organisms/report/reportFilterBar"
import { ReportDownloadButton } from "../../organisms/report/reportDownloadButton"
import { ReportStageTabs } from "../../organisms/report/reportStageTabs"
import { ReportTable, type ReportColumn } from "../../organisms/report/reportTable"
import { BranchCell, TransactionLink } from "../../organisms/report/cells"

const money = (value: number | null) => (value == null ? "-" : formatRupiah(value))

export default function DisposalReportPage() {
  const { t } = useTranslation()
  const { filters, params, update, reset } = useReportFilters()
  const { data, isLoading, error } = useDisposalReport(params)
  const { exportReport, isExporting } = useReportExport("disposal")

  const report = data?.data
  const summary = report?.summary
  const rows = report?.rows ?? []

  const columns: ReportColumn<DisposalReportRow>[] = [
    {
      key: "number",
      header: t("transactionReport.column.transactionNumber"),
      render: (r) => <TransactionLink href={`/dashboard/disposal/${r.transaction_number}`} number={r.transaction_number} />,
    },
    { key: "date", header: t("transactionReport.column.date"), render: (r) => r.transaction_date, nowrap: true },
    { key: "branch", header: t("transactionReport.column.branch"), render: (r) => <BranchCell code={r.branch_code} name={r.branch_name} /> },
    {
      key: "stage",
      header: t("transactionReport.column.stage"),
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 whitespace-nowrap">
          {disposalStageLabel(r.current_stage)}
        </span>
      ),
    },
    { key: "type", header: t("transactionReport.column.disposalType"), render: (r) => r.disposal_type || "-", nowrap: true },
    { key: "assetNumber", header: t("transactionReport.column.assetNumber"), render: (r) => r.asset_number || "-", nowrap: true },
    { key: "assetName", header: t("transactionReport.column.assetName"), render: (r) => r.asset_name || "-" },
    { key: "reason", header: t("transactionReport.column.reason"), render: (r) => r.disposal_reason || "-" },
    { key: "sale", header: t("transactionReport.column.saleValue"), render: (r) => money(r.sale_value), align: "right", nowrap: true },
    { key: "income", header: t("transactionReport.column.incomeValue"), render: (r) => money(r.income_value), align: "right", nowrap: true },
    { key: "invoice", header: t("transactionReport.column.invoiceNumber"), render: (r) => r.invoice_number || "-", nowrap: true },
    { key: "agreement", header: t("transactionReport.column.agreementNumber"), render: (r) => r.agreement_number || "-", nowrap: true },
    { key: "assetStatus", header: t("transactionReport.column.assetStatus"), render: (r) => r.asset_status || "-", nowrap: true },
  ]

  const stats = [
    { color: "gray" as const, icon: <Menu01Icon size={15} />, value: formatNumber(summary?.total_transactions ?? 0), label: t("transactionReport.stat.transactions") },
    { color: "yellow" as const, icon: <CheckListIcon size={15} />, value: formatNumber(summary?.total_rows ?? 0), label: t("transactionReport.stat.assets") },
    { color: "gray" as const, icon: <Money03Icon size={15} />, value: formatRupiah(summary?.total_value ?? 0), label: t("transactionReport.stat.saleValue") },
    { color: "green" as const, icon: <MoneyReceive01Icon size={15} />, value: formatRupiah(summary?.total_income ?? 0), label: t("transactionReport.stat.incomeValue") },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-2 rounded-xl">
      <ListHeader
        title={t("transactionReport.disposal.title")}
        subtitle={t("transactionReport.disposal.subtitle")}
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
