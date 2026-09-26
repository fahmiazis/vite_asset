import { useQuery } from "@tanstack/react-query";
import type { transactionListProps } from "../../../models/transaction/list";
import {
  transactionList,
  type TransactionListParams,
} from "../../../services/transaction/list";

export const useTransactionList = (params: TransactionListParams = {}) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<transactionListProps>({
    queryKey: ["transaction-list", params],
    queryFn: () => transactionList(params),
  });

  return { data, isLoading, error, refetch };
};
