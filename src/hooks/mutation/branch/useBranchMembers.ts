import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import {
  assignBranchMembers,
  removeBranchMember,
} from "../../../services/branch/members"
import type {
  AssignBranchMembersRequest,
  BranchMemberVariant,
} from "../../../models/branch/members"

interface UseBranchMembersParams {
  branchId: string
  variant: BranchMemberVariant
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Homebase dan assignment sama-sama menulis ke user_branchs, jadi kedua
 * daftar di-invalidate bersamaan supaya tidak ada yang basi.
 */
function invalidateMemberQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  branchId: string
) {
  queryClient.invalidateQueries({ queryKey: ["branch-members", branchId] })
  queryClient.invalidateQueries({ queryKey: ["user-detail"] })
  queryClient.invalidateQueries({ queryKey: ["user-list"] })
}

export function useAssignBranchMembers({
  branchId,
  variant,
  onSuccess,
  onError,
}: UseBranchMembersParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AssignBranchMembersRequest) =>
      assignBranchMembers(branchId, variant, payload),

    onSuccess: (data) => {
      invalidateMemberQueries(queryClient, branchId)
      toast.success(data?.message || "Berhasil disimpan")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal menyimpan"
      toast.error(message)
      onError?.(error)
    },
  })
}

export function useRemoveBranchMember({
  branchId,
  variant,
  onSuccess,
  onError,
}: UseBranchMembersParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => removeBranchMember(branchId, variant, userId),

    onSuccess: (data) => {
      invalidateMemberQueries(queryClient, branchId)
      toast.success(data?.message || "User dilepas dari cabang ini")
      onSuccess?.()
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Gagal melepas user"
      toast.error(message)
      onError?.(error)
    },
  })
}
