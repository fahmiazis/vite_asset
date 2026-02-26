import { useAssetsCategoryList } from "../../../hooks/query/assetsCategory/list"

export default function AssetsCategoryPage() {
    const { data } = useAssetsCategoryList()

    console.log('ini isi datanya ==>', data)
    return (
        <div>
assets category here
        </div>
    )
}
