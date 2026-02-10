import toast from "react-hot-toast"

export const initFunc = () => {
    toast.error('Belum ada function')
}
export const contohSearchFetching = async (search?: string) => {
    if (search) {
        toast.success(`Hasil untuk: ${search}`)
        return { success: true }
    } else {
        toast.success(`fetch tanpa query search`)
    }
}
