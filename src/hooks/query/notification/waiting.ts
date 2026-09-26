import { useQuery } from "@tanstack/react-query"
import type { waitingNotificationProps } from "../../../models/notification"
import { waitingNotifications } from "../../../services/notification/waiting"

/**
 * Isi lonceng navbar. Diperbarui berkala + saat tab kembali difokus, supaya
 * pengajuan yang baru masuk giliran user terlihat tanpa reload; setelah aksi
 * di aplikasi ini sendiri, di-invalidate langsung oleh withStageEmail.
 */
export const useWaitingNotifications = () =>
  useQuery<waitingNotificationProps>({
    queryKey: ["waiting-notifications"],
    queryFn: waitingNotifications,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  })
