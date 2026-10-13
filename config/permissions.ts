export const PERMISSIONS = {
  AUTH: {
    USERS: {
      READ: "auth:users:read",
      CREATE: "auth:users:create",
      UPDATE: "auth:users:update",
      DELETE: "auth:users:delete",
    },
    ROLES: {
      READ: "auth:roles:read",
      CREATE: "auth:roles:create",
      UPDATE: "auth:roles:update",
      DELETE: "auth:roles:delete",
    },
    PERMISSIONS: {
      READ: "auth:permissions:read",
      CREATE: "auth:permissions:create",
      UPDATE: "auth:permissions:update",
      DELETE: "auth:permissions:delete",
    },
  },
  PARAMS: {
    COUNTER_EXCEPTION: {
      READ: "counter_update:read",
      CREATE: "counter_update:create",
      UPDATE: "counter_update:update",
      DELETE: "counter_update:delete",
    },
  },
  FINANCE: {
    DIVISION: {
      READ: "finance:division:read",
      CREATE: "finance:division:create",
      UPDATE: "finance:division:update",
      DELETE: "finance:division:delete",
    },
    GROUP: {
      READ: "finance:group:read",
      CREATE: "finance:group:create",
      UPDATE: "finance:group:update",
      DELETE: "finance:group:delete",
    },
    RULE: {
      READ: "finance:rule:read",
      CREATE: "finance:rule:create",
      UPDATE: "finance:rule:update",
      DELETE: "finance:rule:delete",
    },
    RULE_TARGET: {
      READ: "finance:rule_target:read",
      CREATE: "finance:rule_target:create",
      UPDATE: "finance:rule_target:update",
      DELETE: "finance:rule_target:delete",
    },
    DEPARTMENT: {
      READ: "finance:department:read",
      CREATE: "finance:department:create",
      UPDATE: "finance:department:update",
      DELETE: "finance:department:delete",
    },
    DEPARTMENT_REPARTITION: {
      READ: "finance:department_repartition:read",
      CREATE: "finance:department_repartition:create",
      UPDATE: "finance:department_repartition:update",
      DELETE: "finance:department_repartition:delete",
    },
  },
} as const;

// Collects every string value at any depth
type Values<T> = T extends string
  ? T
  : { [K in keyof T]: Values<T[K]> }[keyof T];

export type Permission = Values<typeof PERMISSIONS>;

export function getPermissionValues(obj: object): Permission[] {
  return Object.values(obj).flatMap((value) =>
    typeof value === 'string'
      ? [value as Permission]
      : getPermissionValues(value),
  );
}