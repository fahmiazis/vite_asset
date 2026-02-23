import { useMutation } from '@tanstack/react-query'
import type { UpdateMenuPayload } from '../../../models/menu/update'
import { updateMenu } from '../../../services/menu/update'

export const useUpdateMenu = () =>
  useMutation({
    mutationFn: ({
      menuId,
      payload,
    }: {
      menuId: string
      payload: UpdateMenuPayload
    }) => updateMenu(menuId, payload),
  })