import type { InitialState } from "@/runtime/initialState";
import {
  PermissionName,
  PERMISSIONS,
  getPermissionValues,
} from "../config/permissions";

/**
TODO: de verificat daca modalitatea data este ok
 */

export type Can = (permission: PermissionName) => boolean;
export type CanAny = (permissions: PermissionName[]) => boolean;
export type CanAll = (permissions: PermissionName[]) => boolean;

const ALL_PERMISSIONS = getPermissionValues(PERMISSIONS);

export default function access(initialState?: InitialState) {
  const currentUser = initialState?.currentUser;
  const isAdmin = currentUser?.is_admin === true;
  const userPermissions = new Set<string>(currentUser?.permissions ?? []);

  const can: Can = (permission) => isAdmin || userPermissions.has(permission);

  const canAny: CanAny = (permissions) =>
    isAdmin || permissions.some((p) => userPermissions.has(p));

  const canAll: CanAll = (permissions) =>
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
