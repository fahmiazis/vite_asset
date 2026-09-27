import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import {
  assignBranchMembers,
  removeBranchMember,
} from "../../../services/branch/members"
import type { UserBranchMembership } from "../../../models/users/branches"

/**
 * Atur homebase & akses cabang dari sisi USER.
 *
 * Sengaja memakai endpoint sisi cabang (`/branchs/:id/homebase-users`,
 * `/branchs/:id/assigned-users`) dengan satu user_id, bukan
 * `POST /users/:id/branchs` — endpoint itu replace-all dan menulis ulang
 * semua baris tanpa branch_type, jadi homebase user ikut rusak.
 */

function errorMessage(error: unknown, fallback: string) {
  const e = error as { response?: { data?: { message?: string } } }
  return e?.response?.data?.message || fallback
}

function useInvalidateUserBranches(userId: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["user-branches", userId] })
    queryClient.invalidateQueries({ queryKey: ["branch-members"] })
    queryClient.invalidateQueries({ queryKey: ["user-detail"] })
    // kalau yang diubah user yang sedang login, homebase & cakupan asetnya ikut
    queryClient.invalidateQueries({ queryKey: ["homebase-list"] })
    queryClient.invalidateQueries({ queryKey: ["asset-viewable-branches"] })
  }
}

/** Jadikan satu cabang homebase aktif user; homebase lama dinonaktifkan */
export function useSetUserHomebase(userId: string, onSuccess?: () => void) {
  const { t } = useTranslation()
  const invalidate = useInvalidateUserBranches(userId)

  return useMutation({
    mutationFn: (branchId: string) =>
      assignBranchMembers(branchId, "homebase", { user_ids: [userId] }),
    onSuccess: () => {
      invalidate()
      toast.success(t("userBranch.toast.homebaseSet"))
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(errorMessage(error, t("userBranch.toast.failed")))
    },
  })
}

/** Beri akses ke beberapa cabang sekaligus (satu request per cabang) */
export function useAddUserBranchAccess(userId: string, onSuccess?: () => void) {
  const { t } = useTranslation()
  const invalidate = useInvalidateUserBranches(userId)

  return useMutation({
    mutationFn: async (branchIds: string[]) => {
      for (const branchId of branchIds) {
        await assignBranchMembers(branchId, "assignment", { user_ids: [userId] })
      }
    },
    onSuccess: (_, branchIds) => {
      invalidate()
      toast.success(t("userBranch.toast.accessAdded", { count: branchIds.length }))
      onSuccess?.()
    },
    onError: (error) => {
      // sebagian cabang mungkin sudah tersimpan sebelum gagal
      invalidate()
      toast.error(errorMessage(error, t("userBranch.toast.failed")))
    },
  })
}

/** Lepas satu baris user_branchs, endpoint-nya mengikuti jenis keanggotaan */
export function useRemoveUserBranch(userId: string, onSuccess?: () => void) {
  const { t } = useTranslation()
  const invalidate = useInvalidateUserBranches(userId)

  return useMutation({
    mutationFn: ({
      branchId,
      membership,
    }: {
      branchId: string
      membership: UserBranchMembership
    }) =>
      removeBranchMember(
        branchId,
        membership === "homebase" ? "homebase" : "assignment",
        userId
      ),
    onSuccess: () => {
      invalidate()
      toast.success(t("userBranch.toast.removed"))
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(errorMessage(error, t("userBranch.toast.failed")))
    },
  })
}
