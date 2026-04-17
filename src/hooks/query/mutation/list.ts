import { useQuery } from "@tanstack/react-query";
import type { mutationListProps } from "../../../models/mutation/list";
import { mutationList } from "../../../services/mutation/list";

export const useMutationList = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<mutationListProps>({
        queryKey: ["mutation-list"],
        queryFn: mutationList,
    });

    return { data, isLoading, error, refetch };
};
