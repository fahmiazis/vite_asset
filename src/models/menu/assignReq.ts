export interface AssignMenuPermission {
  menu_id: string;
  permissions: string[];
}

export interface AssignMenusRequest {
  menus: AssignMenuPermission[];
}

export interface AssignMenusResponse {
  message: string;
  status: string;
  data?: any;
}