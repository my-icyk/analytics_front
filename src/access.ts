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

  const can = (permission: PermissionName): boolean =>
    isAdmin || userPermissions.has(permission);

  const canAny = (permissions: PermissionName[]): boolean =>
    isAdmin || permissions.some((p) => userPermissions.has(p));

  const canAll = (permissions: PermissionName[]): boolean =>
    isAdmin || permissions.every((p) => userPermissions.has(p));

  return {
    // flat map for route-level `access: 'auth.user.read'`
    ...Object.fromEntries(ALL_PERMISSIONS.map((p) => [p, can(p)])),
    isAdmin,
    can,
    canAny,
    canAll,
  };
}
