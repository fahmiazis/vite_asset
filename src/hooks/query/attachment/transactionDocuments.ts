import { useQuery } from "@tanstack/react-query"
import {
  transactionDocumentConfigs,
  transactionDocumentStatus,
  type TransactionDocumentsParams,
} from "../../../services/attachment/transactionDocuments"

/**
 * Config + berkas dokumen satu stage. Query key diawali "attachments" supaya
 * ikut ter-refresh oleh useUploadAttachment dan review.
 */
export const useTransactionDocuments = (params: TransactionDocumentsParams, enabled = true) => {
  const { transactionNumber, transactionType, stage, branchCode } = params

  const configs = useQuery({
    queryKey: ["attachments", "configs", transactionType, stage, branchCode],
    queryFn: () => transactionDocumentConfigs(params),
    enabled: enabled && !!stage,
    staleTime: 5 * 60 * 1000,
  })

  const status = useQuery({
    queryKey: ["attachments", "status", transactionType, transactionNumber, stage, branchCode],
    queryFn: () => transactionDocumentStatus(params),
    enabled: enabled && !!transactionNumber && !!stage,
  })

  return {
    configs: configs.data ?? [],
    status: status.data,
    isLoading: configs.isLoading || status.isLoading,
  }
}
