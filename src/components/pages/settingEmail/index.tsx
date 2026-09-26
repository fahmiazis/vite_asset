import { useState } from "react"
import { useTranslation } from "react-i18next"
import Head from "../../molecules/head"
import { useEmailTemplateList } from "../../../hooks/query/emailSetting/list"
import { EmailTemplateTable } from "../../organisms/emailSetting/templateTable"
import { EmailLogTable } from "../../organisms/emailSetting/logTable"

type Tab = "template" | "log"

export default function EmailSettingPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>("template")
  const { data, isLoading } = useEmailTemplateList()

  const tabs: { value: Tab; label: string }[] = [
    { value: "template", label: t("emailSetting.tab.template") },
    { value: "log", label: t("emailSetting.tab.log") },
  ]

  return (
    <div className="space-y-4">
      <Head label={t("emailSetting.title")} className="mb-2" />

      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((item) => (
          <button
            key={item.value}
            onClick={() => setTab(item.value)}
            className={`px-3 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
              tab === item.value
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "template" ? (
        isLoading ? (
          <p className="text-sm text-gray-400">{t("emailSetting.loading")}</p>
        ) : (
          <EmailTemplateTable data={data?.data ?? []} />
        )
      ) : (
        <EmailLogTable />
      )}
    </div>
  )
}
