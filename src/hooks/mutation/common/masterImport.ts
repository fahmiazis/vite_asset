import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import type { ImportEntity, ImportMode } from "../../../models/masterImport"
import { downloadImportTemplate, downloadMasterExport, uploadImportFile } from "../../../services/masterImport/import"

function errorMessage(error: any, fallback: string): string {
  return error?.response?.data?.message || fallback
}

export const useImportTemplate = (entity: ImportEntity) => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: (mode: ImportMode) => downloadImportTemplate(entity, mode),
    onError: () => {
      toast.error(t("masterImport.templateFailed"))
    },
  })
}

export const useMasterExport = (entity: ImportEntity) => {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: (params?: Record<string, string | number | undefined>) => downloadMasterExport(entity, params),
    onError: () => {
      toast.error(t("masterImport.downloadFailed"))
    },
  })
}

interface UseMasterImportParams {
  entity: ImportEntity
  /** prefix query key daftar yang perlu di-refresh setelah tersimpan */
  invalidateKeys: string[]
}

/** satu mutation untuk validasi (dryRun) maupun simpan */
export const useMasterImport = ({ entity, invalidateKeys }: UseMasterImportParams) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mode, file, dryRun }: { mode: ImportMode; file: File; dryRun: boolean }) =>
      uploadImportFile(entity, mode, file, dryRun),

    onSuccess: (data) => {
      if (data.dry_run || data.imported === 0) return
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
      toast.success(t("masterImport.saved", { count: data.imported }))
    },

    onError: (error: any) => {
      toast.error(errorMessage(error, t("masterImport.uploadFailed")))
    },
  })
}
