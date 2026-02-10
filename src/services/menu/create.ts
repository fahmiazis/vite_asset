import { axiosPrivate } from "../../libs/instance";
import type { CreateMenuRequest, CreateMenuResponse } from "../../models/menu/create";
import type { allMenuProps } from "../../models/menu/list";

export const createMenu = async (payload: CreateMenuRequest): Promise<CreateMenuResponse> => {
    const response = await axiosPrivate.post<CreateMenuResponse>('/menus', payload);
    return response.data;
}