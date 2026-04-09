import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AssignMenusRequest } from '../../../models/menu/assignReq';
import { roleService } from '../../../services/menu/assign';
import { useNavigate } from 'react-router-dom';

interface UseAssignMenusParams {
  roleId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAssignMenus({
  roleId,
  onSuccess,
  onError
}: UseAssignMenusParams) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({

    mutationFn: (payload: AssignMenusRequest) =>
      roleService.assignMenusToRole(roleId, payload),

    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['role-menus', roleId]
      });
      queryClient.invalidateQueries({
        queryKey: ['roles']
      });

      // Show success notification
      toast.success(data.message || 'Menus assigned successfully');
      navigate('/dashboard/menu');
      // Custom success callback
      onSuccess?.();
    },

    onError: (error: any) => {
      // Show error notification
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to assign menus';

      toast.error(errorMessage);

      // Custom error callback
      onError?.(error);
    },
  });
}