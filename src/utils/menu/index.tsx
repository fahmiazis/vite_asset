import type { SelectOption } from "../../components/molecules/input/selects";
import type { allMenuState } from "../../models/menu/list";
import type { UpdateMenuPayload } from "../../models/menu/update";

export function menuListToSelectOptions(menus: allMenuState[]): SelectOption[] {
  return menus.map((menu) => ({
    id: menu.id,
    value: menu.id,
    label: menu.name,
  }));
}

export function menuListToSelectOptionsWithPath(
  menus: allMenuState[]
): SelectOption[] {
  return menus.map((menu) => ({
    id: menu.id,
    value: menu.id,
    label: `${menu.name} (${menu.path})`,
  }));
}

export function activeMenuListToSelectOptions(
  menus: allMenuState[]
): SelectOption[] {
  return menus
    .filter((menu) => menu.status === 'active')
    .map((menu) => ({
      id: menu.id,
      value: menu.id,
      label: menu.name,
    }));
}

export function parentMenuListToSelectOptions(
  menus: allMenuState[]
): SelectOption[] {
  return menus
    .filter((menu) => !menu.parent_id)
    .map((menu) => ({
      id: menu.id,
      value: menu.id,
      label: menu.name,
    }));
}

export function menuListToHierarchicalSelectOptions(
  menus: allMenuState[]
): SelectOption[] {
  const options: SelectOption[] = [];

  // Get parent menus first (sorted by order_index)
  const parentMenus = menus
    .filter((menu) => !menu.parent_id)
    .sort((a, b) => a.order_index - b.order_index);

  parentMenus.forEach((parent) => {
    // Add parent menu
    options.push({
      id: parent.id,
      value: parent.id,
      label: parent.name,
    });

    // Add child menus
    const childMenus = menus
      .filter((menu) => menu.parent_id === parent.id)
      .sort((a, b) => a.order_index - b.order_index);

    childMenus.forEach((child) => {
      options.push({
        id: child.id,
        value: child.id,
        label: `  ↳ ${child.name}`,
      });
    });
  });

  return options;
}

export function getChildMenuSelectOptions(
  menus: allMenuState[],
  parentId: string
): SelectOption[] {
  return menus
    .filter((menu) => menu.parent_id === parentId)
    .sort((a, b) => a.order_index - b.order_index)
    .map((menu) => ({
      id: menu.id,
      value: menu.id,
      label: menu.name,
    }));
}

export function findMenuById(
  menus: allMenuState[],
  menuId: string
): allMenuState | undefined {
  return menus.find((menu) => menu.id === menuId);
}

export function getMenuNameById(
  menus: allMenuState[],
  menuId: string
): string {
  const menu = findMenuById(menus, menuId);
  return menu?.name || '';
}

export function hasChildMenus(
  menus: allMenuState[],
  menuId: string
): boolean {
  return menus.some((menu) => menu.parent_id === menuId);
}

export const hasAtLeastOneField = (payload: UpdateMenuPayload) =>
  Object.values(payload).some(
    value => value !== undefined && value !== null && value !== ''
  )