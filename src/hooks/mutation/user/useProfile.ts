import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  changeMyPassword,
  deleteAvatar,
  uploadAvatar,
  type ChangePasswordRequest,
} from "../../../services/users/profile"
import { updateUser } from "../../../services/users/update"

function errorMessage(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message || fallback
}

function useInvalidateUser(userId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["user-avatar", userId] })
    queryClient.invalidateQueries({ queryKey: ["user-detail", userId] })
    queryClient.invalidateQueries({ queryKey: ["my-profile"] })
  }
}

/** Upload / hapus foto profil. `self` = user mengubah fotonya sendiri */
export function useAvatarActions(userId: string, self: boolean) {
  const { t } = useTranslation()
  const invalidate = useInvalidateUser(userId)

  const upload = useMutation({
    mutationFn: (file: File) => uploadAvatar(userId, file, self),
    onSuccess: () => {
      invalidate()
      toast.success(t("userProfile.avatar.uploaded"))
    },
    onError: (error) => toast.error(errorMessage(error, t("userProfile.failed"))),
  })

  const remove = useMutation({
    mutationFn: () => deleteAvatar(userId, self),
    onSuccess: () => {
      invalidate()
      toast.success(t("userProfile.avatar.removed"))
    },
    onError: (error) => toast.error(errorMessage(error, t("userProfile.failed"))),
  })

  return { upload, remove }
}

/** Ganti password sendiri — wajib password lama */
export function useChangeMyPassword(onSuccess?: () => void) {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changeMyPassword(payload),
    onSuccess: () => {
      toast.success(t("userProfile.password.changed"))
      onSuccess?.()
    },
    onError: (error) => toast.error(errorMessage(error, t("userProfile.failed"))),
  })
}

/** Admin mengatur password user lain — PUT /users/:id, tanpa password lama */
export function useSetUserPassword(userId: string, onSuccess?: () => void) {
  const { t } = useTranslation()
  return useMutation({
    mutationFn: (password: string) => updateUser(userId, { password }),
    onSuccess: () => {
      toast.success(t("userProfile.password.changed"))
      onSuccess?.()
    },
    onError: (error) => toast.error(errorMessage(error, t("userProfile.failed"))),
  })
}
