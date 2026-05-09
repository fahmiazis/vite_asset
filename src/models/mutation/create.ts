export interface CreateMutationRequest {
  transaction_date: string;
  category_id: number;
  to_branch_code: string;
  notes: string;
}

export interface CreateMutationResponse {
  message: string;
  data?: {
    id: number;
    transaction_date: string;
    category_id: number;
    to_branch_code: string;
    notes: string;
    [key: string]: any;
  };
}