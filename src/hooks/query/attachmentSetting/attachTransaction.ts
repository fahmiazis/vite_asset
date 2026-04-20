import { useQuery } from "@tanstack/react-query";
import { attachTransaction } from "../../../services/attachmentSetting/attachmentTransaction";
import type { transactionAttachmentProps } from "../../../models/attachmentSetting/transactionAttachment";

export const useAttachTransaction = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<transactionAttachmentProps>({
    queryKey: ["attach-transaction", id],
    queryFn: () => attachTransaction(id),
  });

  return { data, isLoading, error, refetch };
};
