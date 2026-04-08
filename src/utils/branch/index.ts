import type { SelectOption } from "../../components/molecules/input/selects";
import type { branchListState } from "../../models/branch/list";

export function activeBranchListToSelectOptions(
  branches: branchListState[]
): SelectOption[] {
  return branches
    .filter((branch) => branch.status === 'active')
    .map((branch) => ({
      id: branch.id,
      value: branch.branch_code,
      label: `${branch.branch_code} - ${branch.branch_name}`,
    }));
}