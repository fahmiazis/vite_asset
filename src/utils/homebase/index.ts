import type { SelectOption } from "../../components/molecules/input/selects";
import type { homeBaseListState } from "../../models/homebase/list";

export function activeHomeBaseToSelectOptions(
  homebases: homeBaseListState[]
): SelectOption[] {
  return homebases
    .filter((hb) => hb.is_active)
    .map((hb) => ({
      id: hb.branch_id,
      value: hb.branch.branch_code,
      label: `${hb.branch.branch_code} - ${hb.branch.branch_name}`,
    }));
}