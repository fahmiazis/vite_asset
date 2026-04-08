import type { SelectOption } from "../../components/molecules/input/selects";
import type { assetsCategoryListState } from "../../models/assetsCategory/list";

export function activeCategoryListToSelectOptions(
    categories: assetsCategoryListState[]
): SelectOption[] {
    return categories
        .filter((category) => category.is_active)
        .map((category) => ({
            id: category.id,
            value: category.id,
            label: `${category.category_code} - ${category.category_name}`,
        }));
}