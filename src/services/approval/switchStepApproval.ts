import { axiosPrivate } from "../../libs/instance";

export interface ChangeStepOrderPayload {
  list_ids: string[];
}

export const switchStepApproval = async (
  stepId: string,
  payload: ChangeStepOrderPayload
) => {
  const { data } = await axiosPrivate.put(
    `/approval-flow-steps/step-order-change/${stepId}`,
    payload
  );

  return data;
};