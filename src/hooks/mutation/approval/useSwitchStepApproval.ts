import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchStepApproval, type ChangeStepOrderPayload } from "../../../services/approval/switchStepApproval";

/**
 * Reorder step. Catatan penting: endpoint
 * PUT /approval-flow-steps/step-order-change/:id memakai :id sebagai **flow_id**
 * (lihat services.UpdateBulkStepOrderFlowStep — query-nya `flow_id = ?`),
 * bukan id step. Urutan baru diambil dari posisi di `list_ids`.
 */
export const useSwitchStepApproval = (flowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeStepOrderPayload) => switchStepApproval(flowId, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["approval-flow-detail", flowId],
      });
    },
  });
};
