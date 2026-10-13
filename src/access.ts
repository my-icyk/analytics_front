import type { InitialState } from "@/runtime/initialState";
import {
  PermissionName,
  PERMISSIONS,
  getPermissionValues,
} from "../config/permissions";

/**
TODO: de verificat daca modalitatea data este ok
 */
const ALL_PERMISSIONS = getPermissionValues(PERMISSIONS);

export default function access(initialState?: InitialState) {
  const currentUser = initialState?.currentUser;
  const isAdmin = currentUser?.is_admin === true;

  const userPermissions = new Set<string>(currentUser?.permissions ?? []);

  const allPermissions: PermissionName[] = ALL_PERMISSIONS;

  return Object.fromEntries(
    allPermissions.map((permission) => [
      permission,
      isAdmin || userPermissions.has(permission),
    ]),
  );
}
