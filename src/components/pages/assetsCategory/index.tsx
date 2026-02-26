import { useAssetsCategoryList } from "../../../hooks/query/assetsCategory/list"
import { AssetsCategoryTable } from "../../organisms/assetsCategory/table"

export default function AssetsCategoryPage() {
    const { data } = useAssetsCategoryList()
    return (
        <div>
            {data && (
                <AssetsCategoryTable data={data.data}/>
            )}
        </div>
    )
}
