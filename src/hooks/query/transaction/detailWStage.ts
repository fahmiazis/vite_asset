import { useQuery } from "@tanstack/react-query";
import { TransactionDetailWStage } from "../../../services/transaction/detailWStage";
import type { detailTransactionWStageProps } from "../../../models/transaction/detailWStages";

export const useTransactionDetailWStage = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailTransactionWStageProps>({
    queryKey: ["transaction-detail-with-stage", id],
    queryFn: () => TransactionDetailWStage(id),
  });

  return { data, isLoading, error, refetch };
};
