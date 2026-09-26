import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { EmailTemplateForm } from "../../../organisms/emailSetting/templateForm"
import { useCreateEmailTemplate } from "../../../../hooks/mutation/emailSetting/template"

function apiMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message
}

export default function CreateEmailSettingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutate, isPending } = useCreateEmailTemplate()

  return (
    <div className="w-full mx-auto space-y-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 border px-3 py-1.5 rounded-lg"
      >
        ← {t("emailSetting.back")}
      </button>

      <EmailTemplateForm
        mode="create"
        isPending={isPending}
        initial={{
          transaction_type: "",
          stage: "",
          action: "proceed",
          subject: "",
          body: "",
          cc_role_ids: [],
          is_active: true,
        }}
        onCancel={() => navigate(-1)}
        onSubmit={(value) =>
          mutate(
            { ...value, transaction_type: value.transaction_type as "procurement" | "mutation" | "disposal" },
            {
              onSuccess: () => {
                toast.success(t("emailSetting.toast.created"))
                navigate("/dashboard/setting-email")
              },
              onError: (error) => toast.error(apiMessage(error) ?? t("emailSetting.toast.createFailed")),
            }
          )
        }
      />
    </div>
  )
}
