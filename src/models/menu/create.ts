export interface CreateMenuRequest {
  name: string;
  path: string;
  route_path: string;
  status: string;
  parent_id?: string | null;
  icon_name?: string | null;
  order_index?: number;
}

export interface CreateMenuResponse {
  message: string;
  status: string;
  data?: {
    id: string;
    parent_id: string | null;
    name: string;
    path: string;
    route_path: string;
    icon_name: string | null;
    order_index: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
}