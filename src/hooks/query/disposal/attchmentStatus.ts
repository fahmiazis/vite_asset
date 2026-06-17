import { useQuery } from "@tanstack/react-query";
import { statusDisposalDetail } from "../../../services/disposal/statusAttachment";
import type { AttachDisposalStatusProps } from "../../../models/disposal/attachmentStatus";

export const useDisposalAttachmentStatus = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<AttachDisposalStatusProps>({
    queryKey: ["disposal-attachment-status", id],
    queryFn: () => statusDisposalDetail(id),
    enabled: !!id,
  });

  return { data, isLoading, error, refetch };
};