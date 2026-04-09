import { useQuery } from "@tanstack/react-query";
import type { detailtransactionProps } from "../../../models/transaction/detail";
import { TransactionDetail } from "../../../services/transaction/detail";

export const useTransactionDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailtransactionProps>({
    queryKey: ["transaction-detail", id],
    queryFn: () => TransactionDetail(id),
  });

  return { data, isLoading, error, refetch };
};
