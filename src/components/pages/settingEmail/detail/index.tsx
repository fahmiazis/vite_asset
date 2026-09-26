import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { EmailTemplateForm } from "../../../organisms/emailSetting/templateForm"
import { useEmailTemplateDetail } from "../../../../hooks/query/emailSetting/detail"
import { useUpdateEmailTemplate } from "../../../../hooks/mutation/emailSetting/template"

function apiMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message
}

export default function DetailEmailSettingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading } = useEmailTemplateDetail(id)
  const { mutate, isPending } = useUpdateEmailTemplate(Number(id))

  const template = data?.data

  return (
    <div className="w-full mx-auto space-y-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg"
      >
        ← {t("emailSetting.back")}
      </button>

      {isLoading && <p className="text-sm text-gray-400">{t("emailSetting.loading")}</p>}
      {!isLoading && !template && <p className="text-sm text-gray-400">{t("emailSetting.notFound")}</p>}

      {template && (
        <EmailTemplateForm
          // form diinisialisasi sekali dari data server
          key={template.id}
          mode="edit"
          isPending={isPending}
          initial={{
            transaction_type: template.transaction_type,
            stage: template.stage,
            action: template.action,
            subject: template.subject,
            body: template.body,
            cc_role_ids: template.cc_roles.map((r) => r.id),
            is_active: template.is_active,
          }}
          onCancel={() => navigate(-1)}
          onSubmit={(value) =>
            // kunci template (jenis, stage, aksi) tidak ikut dikirim
            mutate(
              {
                subject: value.subject,
                body: value.body,
                cc_role_ids: value.cc_role_ids,
                is_active: value.is_active,
              },
              {
                onSuccess: () => {
                  toast.success(t("emailSetting.toast.updated"))
                  navigate("/dashboard/setting-email")
                },
                onError: (error) => toast.error(apiMessage(error) ?? t("emailSetting.toast.updateFailed")),
              }
            )
          }
        />
      )}
    </div>
  )
}
