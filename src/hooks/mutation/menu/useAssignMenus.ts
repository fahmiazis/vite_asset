import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AssignMenusRequest } from '../../../models/menu/assignReq';
import { roleService } from '../../../services/menu/assign';
import { useNavigate } from 'react-router-dom';

interface UseAssignMenusParams {
  roleId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  /** default true supaya halaman assign lama tetap berperilaku sama */
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export function useAssignMenus({
  roleId,
  onSuccess,
  onError,
  redirectOnSuccess = true,
  redirectPath = '/dashboard/menu',
}: UseAssignMenusParams) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: AssignMenusRequest) =>
      roleService.assignMenusToRole(roleId, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['role-menus', roleId] });
      queryClient.invalidateQueries({ queryKey: ['role-list'] });
      // hak akses berubah → sidebar user yang memakai role ini ikut berubah
      queryClient.invalidateQueries({ queryKey: ['sidebar-list'] });

      toast.success(data.message || 'Menus assigned successfully');

      if (redirectOnSuccess) navigate(redirectPath);

      onSuccess?.();
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to assign menus';

      toast.error(errorMessage);

      onError?.(error);
    },
  });
}
