import type { SelectOption } from "../../components/molecules/input/selects";
import type { userListState } from "../../models/users/list";

export function userListToSelectOptions(roles: userListState[]): SelectOption[] {
  return roles.map((role) => ({
    id: role.id,
    value: role.id,
    label: role.fullname,
  }));
}