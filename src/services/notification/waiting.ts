import { axiosPrivate } from "../../libs/instance"
import type { waitingNotificationProps } from "../../models/notification"

export const waitingNotifications = async (): Promise<waitingNotificationProps> => {
  const res = await axiosPrivate.get(`/notifications/waiting`)
  return res.data
}
