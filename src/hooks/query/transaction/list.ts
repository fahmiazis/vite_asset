import { useQuery } from "@tanstack/react-query";
import type { transactionListProps } from "../../../models/transaction/list";
import { transactionList } from "../../../services/transaction/list";

export const useTransactionList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<transactionListProps>({
    queryKey: ["transaction-list"],
    queryFn: transactionList,
  });

  return { data, isLoading, error, refetch };
};
