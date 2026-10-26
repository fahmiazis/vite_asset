import { useQuery } from "@tanstack/react-query"
import type { appReleaseListProps } from "../../../models/appRelease/release"
import { appReleaseList } from "../../../services/appRelease/release"

export const useAppReleaseList = () =>
  useQuery<appReleaseListProps>({
    queryKey: ["app-release-list"],
    queryFn: appReleaseList,
  })
