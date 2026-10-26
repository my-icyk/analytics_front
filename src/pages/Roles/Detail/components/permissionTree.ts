import type { Permission } from "@/types/auth";

export type PermissionLeaf = { permission: Permission; action: string };
export type PermissionTree = Map<string, Map<string, PermissionLeaf[]>>;

const DEFAULT_DOMAIN = "other";
const DEFAULT_RESOURCE = "general";

export function parsePermission(name: string) {
  const parts = name.split(":");
  if (parts.length === 1) {
    return { domain: DEFAULT_DOMAIN, resource: DEFAULT_RESOURCE, action: name };
  }
  return {
    domain: parts[0],
    resource: parts.slice(1, -1).join(":") || DEFAULT_RESOURCE,
    action: parts[parts.length - 1],
  };
}

const byKey = <T>([a]: [string, T], [b]: [string, T]) => a.localeCompare(b);

export function buildPermissionTree(
  permissions: Permission[],
  search: string,
): PermissionTree {
  const query = search.trim().toLowerCase();
  const raw: PermissionTree = new Map();

  for (const permission of permissions) {
    if (query && !permission.name.toLowerCase().includes(query)) continue;

    const { domain, resource, action } = parsePermission(permission.name);
    const resources = raw.get(domain) ?? new Map<string, PermissionLeaf[]>();
    const leaves = resources.get(resource) ?? [];

    leaves.push({ permission, action });
    resources.set(resource, leaves);
    raw.set(domain, resources);
  }

  // sort every level without mutating the inputs
  return new Map(
    [...raw.entries()]
      .sort(byKey)
      .map(([domain, resources]) => [
        domain,
        new Map(
          [...resources.entries()]
            .sort(byKey)
            .map(([resource, leaves]) => [
              resource,
              [...leaves].sort((a, b) => a.action.localeCompare(b.action)),
            ]),
        ),
      ]),
  );
}

export const areSetsEqual = (a: Set<number>, b: Set<number>) =>
  a.size === b.size && [...a].every((id) => b.has(id));

export const toArray = (keys: string | string[]) =>
  Array.isArray(keys) ? keys : [keys];
