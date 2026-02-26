import { axiosPrivate } from "../../libs/instance";
import type { CreateAssetsCategoryPayload, CreateAssetsCategoryResponse } from "../../models/assetsCategory/create";

export const createAssetsCategory = async (payload: CreateAssetsCategoryPayload): Promise<CreateAssetsCategoryResponse> => {
    const response = await axiosPrivate.post<CreateAssetsCategoryResponse>('/asset-categories', payload);
    return response.data;
}