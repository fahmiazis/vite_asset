import { axiosPrivate } from "../../libs/instance";
import type { CreateMenuRequest, CreateMenuResponse } from "../../models/menu/create";

export const createMenu = async (payload: CreateMenuRequest): Promise<CreateMenuResponse> => {
    const response = await axiosPrivate.post<CreateMenuResponse>('/menus', payload);
    return response.data;
}