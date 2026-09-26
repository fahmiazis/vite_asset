import { useTranslation } from "react-i18next"
import type { ReportStageCount } from "../../../models/report/common"
import { formatStage } from "../../../utils/stage"
import { ListTabs } from "../common/listTabs"

/** Tab per stage, angkanya dari summary.by_stage (dihitung sebelum filter stage). */
export function ReportStageTabs({
  byStage,
  active,
  onChange,
}: {
  byStage: ReportStageCount[]
  active: string
  onChange: (stage: string) => void
}) {
  const { t } = useTranslation()
  const total = byStage.reduce((sum, s) => sum + s.count, 0)

  // stage yang sedang dipilih tetap tampil walau hasilnya kosong
  const stages = byStage.some((s) => s.stage === active) || !active ? byStage : [...byStage, { stage: active, count: 0 }]

  return (
    <div className="px-4 md:px-6">
      <ListTabs
        activeTab={active}
        onChange={onChange}
        tabs={[
          { label: t("transactionReport.allStages"), value: "", count: total },
          ...stages.map((s) => ({ label: formatStage(s.stage), value: s.stage, count: s.count })),
        ]}
      />
    </div>
  )
}
