import type { SelectOption } from "../../components/molecules/input/selects";
import type { roleListState } from "../../models/roles/list";


export function roleListToSelectOptions(roles: roleListState[]): SelectOption[] {
  return roles.map((role) => ({
    id: role.id,
    value: role.id,
    label: role.name,
  }));
}

export function roleListToSelectOptionsWithDescription(
  roles: roleListState[]
): SelectOption[] {
  return roles.map((role) => ({
    id: role.id,
    value: role.id,
    label: `${role.name} - ${role.description}`,
  }));
}

export function findRoleById(
  roles: roleListState[],
  roleId: string
): roleListState | undefined {
  return roles.find((role) => role.id === roleId);
}


export function getRoleNameById(
  roles: roleListState[],
  roleId: string
): string {
  const role = findRoleById(roles, roleId);
  return role?.name || '';
}