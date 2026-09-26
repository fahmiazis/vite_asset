import { useQuery } from "@tanstack/react-query";
import type { mutationListProps } from "../../../models/mutation/list";
import { mutationList, type MutationListParams } from "../../../services/mutation/list";

export const useMutationList = (params: MutationListParams = {}) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<mutationListProps>({
        queryKey: ["mutation-list", params],
        queryFn: () => mutationList(params),
        placeholderData: (prev) => prev,
    });

    return { data, isLoading, error, refetch };
};
