import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchStepApproval, type ChangeStepOrderPayload } from "../../../services/approval/switchStepApproval";
interface MutationVariables {
  stepId: string;
  payload: ChangeStepOrderPayload;
}

export const useSwitchStepApproval = (id: string) => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      payload,
    }: {
      stepId: string;
      payload: { list_ids: string[] };
    }) => switchStepApproval(stepId, payload),

    onSuccess: async () => {
      // refetch detail
      await queryClient.invalidateQueries({
        queryKey: ["approval-flow-detail", id],
      });
    },
  });

};