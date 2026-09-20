import { axiosPrivate } from "../../libs/instance";

export interface ChangeStepOrderPayload {
  list_ids: string[];
}

/** `flowId` — bukan step id. Backend mem-filter `flow_id = ?` pada param :id. */
export const switchStepApproval = async (
  flowId: string,
  payload: ChangeStepOrderPayload
) => {
  const { data } = await axiosPrivate.put(
    `/approval-flow-steps/step-order-change/${flowId}`,
    payload
  );

  return data;
};
