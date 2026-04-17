import { axiosPrivate } from "../../libs/instance"

export const deleteAttachmentSetting = async (id: number) => {
    const res = await axiosPrivate.delete(
        `/attachment-configs/${id}`
    )

    if (!res) {
        throw new Error("fail to delete attachment setting")
    }

    return res.data
}