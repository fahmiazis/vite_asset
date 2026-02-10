export interface CreateBranchRequest {
  branch_name: string;
  branch_type: string;
  status: string;
  branch_code?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
}

export interface CreateBranchResponse {
  message: string;
  status: string;
  data?: {
    id: string;
    branch_code: string;
    branch_name: string;
    branch_type: string;
    status: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    email?: string;
    created_at: string;
    updated_at: string;
  };
}