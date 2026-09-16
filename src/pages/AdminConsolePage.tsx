import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Database,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  buildAdminRoute,
  parseAdminRoute,
  adminPages,
} from "../constants/admin";
import { authService } from "../services/authService";
import { assignmentService } from "../services/assignmentService";
import { counterService } from "../services/counterService";
import { permissionService } from "../services/permissionService";
import { roleService } from "../services/roleService";
import { userService } from "../services/userService";
import type { Permission, PermissionName } from "../types/auth/permission";
import type { Role } from "../types/auth/role";
import type { User } from "../types/auth/user";
import type { Counter } from "../types/counter";
import type { RoleForm, UserForm } from "../types/forms";
import { UserFormModal } from "../components/users/UserFormModal";
import { RoleFormModal } from "../components/roles/RoleFormModal";
import { UsersPage } from "./UsersPage";
import { RolesPage } from "./RolesPage";
import { UserDetailPage } from "./UserDetailPage";
import { RoleDetailPage } from "./RoleDetailPage";
import { PermissionCatalogPage } from "./PermissionCatalogPage";
import { CountersPage } from "./CountersPage";
import { CounterDetailPage } from "./CounterDetailPage";
import { CounterUpdateForm } from "../components/CountersUpdate/CounterUpdateForm";
import type { CounterUpdateFormValues } from "../components/CountersUpdate/CounterUpdateForm.schema";
import { MePage } from "./MePage";
import { ScriptsPage } from "./ScriptsPage";
import { GroupsPage } from "./GroupsPage";
import { GroupDetailPage } from "./GroupDetailPage";
import { RuleDetailPage } from "./RuleDetailPage";
import { financeService } from "../services/financeService";
import type {
  Division,
  Group,
  GroupCreate,
  GroupType,
  Rule,
  RuleCreate,
  Target,
  TargetCreate,
} from "../types/finance";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeNav, setActiveNav] = useState("Users");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoleMap, setUserRoleMap] = useState<Record<number, Role[]>>({});
  const [rolePermissionMap, setRolePermissionMap] = useState<
    Record<number, Permission[]>
  >({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [selectedCounterId, setSelectedCounterId] = useState<number | null>(
    null,
  );
  const [userForm, setUserForm] = useState<UserForm>({
    username: "",
    password: "",
    is_admin: false,
  });
  const [roleForm, setRoleForm] = useState<RoleForm>({
    name: "",
    description: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userError, setUserError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [counterError, setCounterError] = useState("");
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterFormError, setCounterFormError] = useState("");
  const [counterRefreshKey, setCounterRefreshKey] = useState(0);

  const [groups, setGroups] = useState<Group[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [groupRulesMap, setGroupRulesMap] = useState<Record<number, Rule[]>>(
    {},
  );
  const [ruleTargetsMap, setRuleTargetsMap] = useState<
    Record<number, Target[]>
  >({});
  const [financeError, setFinanceError] = useState("");

  const userPageLoadedRef = useRef(false);
  const rolePageLoadedRef = useRef(false);
  const permissionPageLoadedRef = useRef(false);
  const groupsPageLoadedRef = useRef(false);
  const loadedGroupRulesIdsRef = useRef<Set<number>>(new Set());
  const loadedRuleTargetsIdsRef = useRef<Set<number>>(new Set());
  const loadedUserRoleIdsRef = useRef<Set<number>>(new Set());
  const loadedRolePermissionIdsRef = useRef<Set<number>>(new Set());
  const loadedCounterIdsRef = useRef<Set<number>>(new Set());
  const counterMapRef = useRef<Record<number, Counter>>({});

  const can = useCallback(
    (permission: PermissionName) =>
      user?.is_admin === true ||
      user?.permissions.includes(permission) === true,
    [user],
  );

  const syncViewFromLocation = () => {
    const route = parseAdminRoute(
      window.location.pathname,
      window.location.search,
    );
    setSelectedUser(null);
    setSelectedUserId(null);
    setSelectedRole(null);
    setSelectedRoleId(null);
    setSelectedCounter(null);
    setSelectedCounterId(null);
    setSelectedGroup(null);
    setSelectedGroupId(null);
    setSelectedRule(null);
    setSelectedRuleId(null);
    if (route.view === "me") {
      setActiveNav("Me");
      return;
    }
    if (route.view === "users") {
      setActiveNav("Users");
      return;
    }
    if (route.view === "user") {
      setActiveNav("User details");
      setSelectedUserId(route.userId);
      return;
    }
    if (route.view === "roles") {
      setActiveNav("Roles");
      return;
    }
    if (route.view === "role") {
      setActiveNav("Role details");
      setSelectedRoleId(route.roleId);
      return;
    }
    if (route.view === "permissions") {
      setActiveNav("Permissions");
      return;
    }
    if (route.view === "counters") {
      setActiveNav("Counters");
      return;
    }
    if (route.view === "groups") {
      setActiveNav("Groups");
      return;
    }
    if (route.view === "group") {
      setActiveNav("Group details");
      setSelectedGroupId(route.groupId);
      return;
    }
    if (route.view === "rule") {
      setActiveNav("Rule details");
      setSelectedRuleId(route.ruleId);
      return;
    }
    if (route.view === "scripts") {
      setActiveNav("Scripts");
      return;
    }
    if (route.view === "counter") {
      setActiveNav("Counter details");
      setSelectedCounterId(route.counterId);
      return;
    }
    setActiveNav("Users");
  };

  const setRoute = (
    view:
      | "me"
      | "users"
      | "user"
      | "roles"
      | "role"
      | "permissions"
      | "counters"
      | "scripts"
      | "counter"
      | "groups"
      | "group"
      | "rule",
    values: {
      userId?: number | null;
      roleId?: number | null;
      counterId?: number | null;
      groupId?: number | null;
      ruleId?: number | null;
    } = {},
  ) => {
    window.history.pushState({}, "", buildAdminRoute(view, values));
    syncViewFromLocation();
  };

  const ensureUsers = async () => {
    if (!user || !can("user:read") || userPageLoadedRef.current) return;
    const nextUsers = await userService.listUsers();
    setUsers(nextUsers);
    userPageLoadedRef.current = true;
  };

  const ensureRoles = async () => {
    if (!user || !can("role:read") || rolePageLoadedRef.current) return;
    const nextRoles = await roleService.listRoles();
    setRoles(nextRoles);
    rolePageLoadedRef.current = true;
  };

  const ensurePermissions = async () => {
    if (!user || !can("permission:read") || permissionPageLoadedRef.current)
      return;
    const nextPermissions = await permissionService.listPermissions();
    setPermissions(nextPermissions);
    permissionPageLoadedRef.current = true;
  };

  const ensureUserRoles = async (userId: number) => {
    if (
      userRoleMap[userId] !== undefined ||
      loadedUserRoleIdsRef.current.has(userId)
    )
      return;
    const nextRoles = await userService.getUserRoles(userId);
    loadedUserRoleIdsRef.current.add(userId);
    setUserRoleMap((current) => ({ ...current, [userId]: nextRoles }));
  };

  const ensureRolePermissions = async (roleId: number) => {
    if (
      rolePermissionMap[roleId] !== undefined ||
      loadedRolePermissionIdsRef.current.has(roleId)
    )
      return;
    const nextPermissions = await roleService.getRolePermissions(roleId);
    loadedRolePermissionIdsRef.current.add(roleId);
    setRolePermissionMap((current) => ({
      ...current,
      [roleId]: nextPermissions,
    }));
  };

  const ensureCounter = async (counterId: number) => {
    if (loadedCounterIdsRef.current.has(counterId)) {
      setSelectedCounter(counterMapRef.current[counterId] ?? null);
      return;
    }
    try {
      const counter = await counterService.getCounter(counterId);
      loadedCounterIdsRef.current.add(counterId);
      counterMapRef.current[counterId] = counter;
      setCounterError("");
      setSelectedCounter(counter);
    } catch (error) {
      setCounterError(
        error instanceof Error ? error.message : "Unable to load counter",
      );
    }
  };

  const ensureGroups = async () => {
    if (
      !user ||
      (!can("finance:group:read") && !user.is_admin) ||
      groupsPageLoadedRef.current
    )
      return;
    try {
      const [nextGroups, nextDivisions, nextGroupTypes] = await Promise.all([
        financeService.getGroups(),
        financeService.getDivisions(),
        financeService.getGroupTypes(),
      ]);
      setGroups(nextGroups);
      setDivisions(nextDivisions);
      setGroupTypes(nextGroupTypes);
      groupsPageLoadedRef.current = true;
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load finance data",
      );
    }
  };

  const ensureGroup = async (groupId: number) => {
    try {
      await ensureGroups();
      const existing = groups.find((g) => g.id === groupId);
      if (existing) {
        setSelectedGroup(existing);
      } else {
        const fetched = await financeService.getGroup(groupId);
        setSelectedGroup(fetched);
        setGroups((cur) =>
          cur.some((g) => g.id === fetched.id) ? cur : [...cur, fetched],
        );
      }
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load group",
      );
    }
  };

  const ensureGroupRules = async (groupId: number) => {
    if (loadedGroupRulesIdsRef.current.has(groupId)) return;
    try {
      const nextRules = await financeService.getRules(groupId);
      loadedGroupRulesIdsRef.current.add(groupId);
      setGroupRulesMap((cur) => ({ ...cur, [groupId]: nextRules }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load group rules",
      );
    }
  };

  const ensureRule = async (ruleId: number) => {
    try {
      await ensureGroups();
      let rule = selectedRule;
      if (!rule || rule.id !== ruleId) {
        rule = await financeService.getRule(ruleId);
        setSelectedRule(rule);
      }
      if (!loadedRuleTargetsIdsRef.current.has(ruleId)) {
        const targets = await financeService.getTargets(ruleId);
        loadedRuleTargetsIdsRef.current.add(ruleId);
        setRuleTargetsMap((cur) => ({ ...cur, [ruleId]: targets }));
      }
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load rule details",
      );
    }
  };

  useEffect(() => {
    authService.setSessionExpiredHandler(() => setUser(null));
    authService
      .refreshSession()
      .then((hasSession) =>
        hasSession
          ? authService
              .getCurrentUser()
              .then(setUser)
              .catch(() => undefined)
          : undefined,
      )
      .finally(() => setCheckingSession(false));
    return () => authService.setSessionExpiredHandler(null);
  }, []);

  useEffect(() => {
    const handlePopState = () => syncViewFromLocation();
    window.addEventListener("popstate", handlePopState);
    syncViewFromLocation();
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (activeNav === "Users" || activeNav === "User details")
      void ensureUsers().catch(() => undefined);
    if (activeNav === "Roles" || activeNav === "Role details")
      void ensureRoles().catch(() => undefined);
    if (activeNav === "Permissions" || activeNav === "Role details")
      void ensurePermissions().catch(() => undefined);
    if (activeNav === "User details" && selectedUserId !== null)
      void ensureUserRoles(selectedUserId).catch(() => undefined);
    if (activeNav === "Role details" && selectedRoleId !== null)
      void ensureRolePermissions(selectedRoleId).catch(() => undefined);
    if (activeNav === "Counter details" && selectedCounterId !== null)
      void ensureCounter(selectedCounterId);
    if (
      activeNav === "Groups" ||
      activeNav === "Group details" ||
      activeNav === "Rule details"
    )
      void ensureGroups().catch(() => undefined);
    if (activeNav === "Group details" && selectedGroupId !== null) {
      void ensureGroup(selectedGroupId).catch(() => undefined);
      void ensureGroupRules(selectedGroupId).catch(() => undefined);
    }
    if (activeNav === "Rule details" && selectedRuleId !== null)
      void ensureRule(selectedRuleId).catch(() => undefined);
  }, [
    activeNav,
    selectedUserId,
    selectedRoleId,
    selectedCounterId,
    selectedGroupId,
    selectedRuleId,
    user,
    can,
  ]);

  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null);
      return;
    }
    setSelectedUser(users.find((item) => item.id === selectedUserId) ?? null);
  }, [selectedUserId, users]);

  useEffect(() => {
    if (selectedRoleId === null) {
      setSelectedRole(null);
      return;
    }
    setSelectedRole(roles.find((item) => item.id === selectedRoleId) ?? null);
  }, [selectedRoleId, roles]);

  useEffect(() => {
    if (selectedGroupId === null) {
      setSelectedGroup(null);
      return;
    }
    const found = groups.find((item) => item.id === selectedGroupId);
    if (found) setSelectedGroup(found);
  }, [selectedGroupId, groups]);

  const handleCreateGroup = async (payload: GroupCreate) => {
    try {
      const created = await financeService.createGroup(payload);
      setGroups((cur) => [...cur, created]);
      setFinanceError("");
      setRoute("group", { groupId: created.id });
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to create group",
      );
      throw err;
    }
  };

  const handleUpdateGroup = async (groupId: number, payload: GroupCreate) => {
    try {
      const updated = await financeService.updateGroup(groupId, payload);
      setGroups((cur) => cur.map((g) => (g.id === groupId ? updated : g)));
      if (selectedGroupId === groupId) setSelectedGroup(updated);
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update group",
      );
      throw err;
    }
  };

  const handleDeleteGroup = async (groupToDelete: Group) => {
    try {
      await financeService.removeGroup(groupToDelete.id);
      setGroups((cur) => cur.filter((g) => g.id !== groupToDelete.id));
      setFinanceError("");
      if (selectedGroupId === groupToDelete.id) setRoute("groups");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete group",
      );
    }
  };

  const handleCreateRule = async (payload: RuleCreate) => {
    try {
      const created = await financeService.createRule(payload);
      setGroupRulesMap((cur) => ({
        ...cur,
        [payload.group_id]: [...(cur[payload.group_id] ?? []), created],
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to create rule",
      );
      throw err;
    }
  };

  const handleUpdateRule = async (ruleId: number, payload: RuleCreate) => {
    try {
      const updated = await financeService.updateRule(ruleId, payload);
      setGroupRulesMap((cur) => ({
        ...cur,
        [payload.group_id]: (cur[payload.group_id] ?? []).map((r) =>
          r.id === ruleId ? updated : r,
        ),
      }));
      if (selectedRuleId === ruleId) setSelectedRule(updated);
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update rule",
      );
      throw err;
    }
  };

  const handleDeleteRule = async (ruleToDelete: Rule) => {
    try {
      await financeService.removeRule(ruleToDelete.id);
      setGroupRulesMap((cur) => ({
        ...cur,
        [ruleToDelete.group_id]: (cur[ruleToDelete.group_id] ?? []).filter(
          (r) => r.id !== ruleToDelete.id,
        ),
      }));
      setFinanceError("");
      if (selectedRuleId === ruleToDelete.id)
        setRoute("group", { groupId: ruleToDelete.group_id });
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete rule",
      );
    }
  };

  const handleCreateTarget = async (payload: TargetCreate) => {
    try {
      const created = await financeService.assignTarget(
        payload.rule_id,
        payload,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [payload.rule_id]: [...(cur[payload.rule_id] ?? []), created],
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to create target",
      );
      throw err;
    }
  };

  const handleUpdateTarget = async (
    ruleId: number,
    targetId: number,
    payload: TargetCreate,
  ) => {
    try {
      const updated = await financeService.updateTarget(
        ruleId,
        targetId,
        payload,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [ruleId]: (cur[ruleId] ?? []).map((t) =>
          t.id === targetId ? updated : t,
        ),
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update target",
      );
      throw err;
    }
  };

  const handleDeleteTarget = async (targetToDelete: Target) => {
    try {
      await financeService.revokeTarget(
        targetToDelete.rule_id,
        targetToDelete.id,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [targetToDelete.rule_id]: (cur[targetToDelete.rule_id] ?? []).filter(
          (t) => t.id !== targetToDelete.id,
        ),
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete target",
      );
    }
  };

  const toggleUserRole = async (userId: number, roleId: number) => {
    const assigned = (userRoleMap[userId] ?? []).some(
      (item) => item.id === roleId,
    );
    try {
      if (assigned) await userService.removeRoleFromUser(userId, roleId);
      else await userService.assignRoleToUser(userId, roleId);
      setAssignmentError("");
      setUserRoleMap((current) =>
        assignmentService.toggleRoleMembership(
          current,
          userId,
          roleId,
          assigned,
          roles.find((item) => item.id === roleId)!,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error ? error.message : "Unable to update user roles",
      );
    }
  };

  const toggleUserAdmin = async (targetUser: User) => {
    try {
      const updated = targetUser.is_admin
        ? await userService.revokeAdmin(targetUser.id)
        : await userService.grantAdmin(targetUser.id);
      setAssignmentError("");
      setUsers((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Unable to update admin access",
      );
    }
  };

  const toggleRolePermission = async (roleId: number, permissionId: number) => {
    const assigned = (rolePermissionMap[roleId] ?? []).some(
      (item) => item.id === permissionId,
    );
    try {
      if (assigned)
        await roleService.removePermissionFromRole(roleId, permissionId);
      else await roleService.assignPermissionToRole(roleId, permissionId);
      setAssignmentError("");
      setRolePermissionMap((current) =>
        assignmentService.togglePermissionMembership(
          current,
          roleId,
          permissionId,
          assigned,
          permissions.find((item) => item.id === permissionId)!,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Unable to update role permissions",
      );
    }
  };

  const openUser = (item: User) => {
    setSelectedUser(item);
    setSelectedUserId(item.id);
    setSelectedRole(null);
    setSelectedRoleId(null);
    setRoute("user", { userId: item.id });
  };
  const openRole = (item: Role) => {
    setSelectedRole(item);
    setSelectedRoleId(item.id);
    setSelectedUser(null);
    setSelectedUserId(null);
    setRoute("role", { roleId: item.id });
  };
  const openCounter = (item: Counter) => {
    setSelectedCounter(item);
    setSelectedCounterId(item.id);
    setRoute("counter", { counterId: item.id });
  };
  const openUserEditor = (item: User | null) => {
    setEditingUser(item);
    setUserForm({
      username: item?.username ?? "",
      password: "",
      is_admin: item?.is_admin ?? false,
    });
    setUserError("");
    setUserModalOpen(true);
  };
  const openRoleEditor = (item: Role | null) => {
    setEditingRole(item);
    setRoleForm({
      name: item?.name ?? "",
      description: item?.description ?? "",
    });
    setRoleError("");
    setRoleModalOpen(true);
  };
  const openCounterEditor = (item: Counter | null) => {
    setEditingCounter(item);
    setCounterFormError("");
    setCounterModalOpen(true);
  };

  const saveCounter = async (values: CounterUpdateFormValues) => {
    const payload = { ...values, comment: values.comment ?? "" };
    try {
      const saved = editingCounter
        ? await counterService.updateCounter(editingCounter.id, payload)
        : await counterService.createCounter(payload);
      loadedCounterIdsRef.current.add(saved.id);
      counterMapRef.current[saved.id] = saved;
      if (selectedCounter?.id === saved.id) setSelectedCounter(saved);
      setCounterModalOpen(false);
      setCounterRefreshKey((current) => current + 1);
    } catch (error) {
      setCounterFormError(
        error instanceof Error ? error.message : "Unable to save counter",
      );
    }
  };

  const removeCounter = async (item: Counter) => {
    if (!window.confirm(`Delete counter ${item.id_counter}?`)) return;
    try {
      await counterService.deleteCounter(item.id);
      loadedCounterIdsRef.current.delete(item.id);
      delete counterMapRef.current[item.id];
      setCounterError("");
      setCounterRefreshKey((current) => current + 1);
      if (selectedCounter?.id === item.id) setRoute("counters");
    } catch (error) {
      setCounterError(
        error instanceof Error ? error.message : "Unable to delete counter",
      );
    }
  };

  const saveUser = async () => {
    if (!userForm.username.trim() || (!editingUser && !userForm.password))
      return;
    try {
      const saved = editingUser
        ? await userService.updateUser(editingUser.id, {
            username: userForm.username.trim(),
            ...(userForm.password ? { password: userForm.password } : {}),
            is_admin: userForm.is_admin,
          })
        : await userService.createUser({
            username: userForm.username.trim(),
            password: userForm.password,
            is_admin: userForm.is_admin,
          });
      setUsers((current) =>
        editingUser
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved],
      );
      if (selectedUser?.id === saved.id) setSelectedUser(saved);
      setUserModalOpen(false);
    } catch (error) {
      setUserError(
        error instanceof Error ? error.message : "Unable to save user",
      );
    }
  };

  const saveRole = async () => {
    if (!roleForm.name.trim()) return;
    try {
      const saved = editingRole
        ? await roleService.updateRole(editingRole.id, {
            name: roleForm.name.trim(),
            description: roleForm.description.trim() || null,
          })
        : await roleService.createRole(
            roleForm.name.trim(),
            roleForm.description.trim() || null,
          );
      setRoles((current) =>
        editingRole
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved],
      );
      if (selectedRole?.id === saved.id) setSelectedRole(saved);
      setRoleModalOpen(false);
    } catch (error) {
      setRoleError(
        error instanceof Error ? error.message : "Unable to save role",
      );
    }
  };

  const removeUser = async (item: User) => {
    if (!window.confirm(`Delete ${item.username}?`)) return;
    try {
      await userService.deleteUser(item.id);
      setUsers((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedUser?.id === item.id) setActiveNav("Users");
    } catch (error) {
      setUserError(
        error instanceof Error ? error.message : "Unable to delete user",
      );
    }
  };
  const removeRole = async (item: Role) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      await roleService.deleteRole(item.id);
      setRoles((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedRole?.id === item.id) setActiveNav("Roles");
    } catch (error) {
      setRoleError(
        error instanceof Error ? error.message : "Unable to delete role",
      );
    }
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      setUser(await authService.login(username, password));
      setPassword("");
      setRoute("me");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  if (checkingSession)
    return (
      <div className="auth-screen">
        <div className="auth-panel">
          <span className="brand-mark">
            <Database size={18} />
          </span>
          <p>Connecting to Ledgerline...</p>
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="auth-screen">
        <form className="auth-panel" onSubmit={submitLogin}>
          <div className="brand auth-brand">
            <span className="brand-mark">
              <Database size={18} />
            </span>
            <span>ledgerline</span>
          </div>
          <p className="eyebrow">SECURE CONSOLE</p>
          <h1>Sign in to your workspace</h1>
          <p className="subtitle">Use your FastAPI account to continue.</p>
          <label>
            Username
            <input
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {loginError && <p className="auth-error">{loginError}</p>}
          <button className="primary-button auth-submit" disabled={loggingIn}>
            {loggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );

  const visibleNav = adminPages.filter(
    (item) => item.permission && can(item.permission),
  );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-mark">
              <Database size={18} />
            </span>
            <span>ledgerline</span>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-dot" />
          <span>Acme workspace</span>
          <ChevronDown size={15} />
        </div>
        <nav className="nav-list">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {item.group &&
                  visibleNav.find((nav) => nav.group === item.group)?.id ===
                    item.id && <span className="nav-group">{item.group}</span>}
                <button
                  className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                  onClick={() => {
                    if (item.id === "users") setRoute("users");
                    if (item.id === "roles") setRoute("roles");
                    if (item.id === "permissions") setRoute("permissions");
                    if (item.id === "counters") setRoute("counters");
                    if (item.id === "groups") setRoute("groups");
                    if (item.id === "scripts") setRoute("scripts");
                  }}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item">
            <BookOpen size={17} />
            <span>Documentation</span>
          </button>
          <button className="nav-item">
            <CircleHelp size={17} />
            <span>Help center</span>
          </button>
          <div className="profile">
            <button className="profile-link" onClick={() => setRoute("me")}>
              <div className="avatar">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong>{user.username}</strong>
                <small>{user.is_admin ? "Admin" : "Member"}</small>
              </div>
            </button>
            <button
              className="icon-button"
              aria-label="Log out"
              onClick={() => authService.logout().then(() => setUser(null))}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activeNav}</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-button"
              type="button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="help-button">
              <CircleHelp size={16} /> Support
            </button>
          </div>
        </header>
        {activeNav === "Me" && <MePage user={user} />}
        {activeNav === "Users" && (
          <UsersPage
            canCreate={can("user:create")}
            canEdit={can("user:update")}
            canDelete={can("user:delete")}
            onCreate={() => openUserEditor(null)}
            onOpen={openUser}
            onEdit={openUserEditor}
            onDelete={removeUser}
            error={userError}
          />
        )}
        {activeNav === "User details" && selectedUser && (
          <UserDetailPage
            user={selectedUser}
            roles={roles}
            assignedRoles={userRoleMap[selectedUser.id] ?? []}
            canEdit={can("user:update")}
            canAssign={can("user_role:assign") || can("user_role:revoke")}
            canManageAdmin={can("user:manage_admin")}
            onBack={() => setRoute("users")}
            onEdit={() => openUserEditor(selectedUser)}
            onOpenRole={openRole}
            onToggleRole={(roleId) => toggleUserRole(selectedUser.id, roleId)}
            onToggleAdmin={() => toggleUserAdmin(selectedUser)}
            error={assignmentError}
          />
        )}
        {activeNav === "Roles" && (
          <RolesPage
            canCreate={can("role:create")}
            canEdit={can("role:update")}
            canDelete={can("role:delete")}
            onCreate={() => openRoleEditor(null)}
            onOpen={openRole}
            onEdit={openRoleEditor}
            onDelete={removeRole}
            error={roleError}
          />
        )}
        {activeNav === "Role details" && selectedRole && (
          <RoleDetailPage
            role={selectedRole}
            permissions={permissions}
            assignedPermissions={rolePermissionMap[selectedRole.id] ?? []}
            canEdit={can("role:update")}
            canAssign={
              can("role_permission:assign") || can("role_permission:revoke")
            }
            onBack={() => setRoute("roles")}
            onEdit={() => openRoleEditor(selectedRole)}
            onTogglePermission={(permissionId) =>
              toggleRolePermission(selectedRole.id, permissionId)
            }
            error={assignmentError}
          />
        )}
        {activeNav === "Permissions" && (
          <PermissionCatalogPage permissions={permissions} />
        )}
        {activeNav === "Counters" && (
          <CountersPage
            key={counterRefreshKey}
            canCreate={can("counter_update:create")}
            canEdit={can("counter_update:update")}
            canDelete={can("counter_update:delete")}
            onCreate={() => openCounterEditor(null)}
            onOpen={openCounter}
            onEdit={openCounterEditor}
            onDelete={removeCounter}
            error={counterError}
          />
        )}
        {activeNav === "Counter details" && selectedCounter && (
          <CounterDetailPage
            counter={selectedCounter}
            canEdit={can("counter_update:update")}
            canDelete={can("counter_update:delete")}
            onBack={() => setRoute("counters")}
            onEdit={() => openCounterEditor(selectedCounter)}
            onDelete={() => removeCounter(selectedCounter)}
            error={counterError}
          />
        )}
        {activeNav === "Groups" && (
          <GroupsPage
            groups={groups}
            divisions={divisions}
            groupTypes={groupTypes}
            canCreate={can("finance:group:create")}
            canEdit={can("finance:group:update")}
            canDelete={can("finance:group:delete")}
            onOpenGroup={(g) => setRoute("group", { groupId: g.id })}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            error={financeError}
          />
        )}
        {activeNav === "Group details" && selectedGroup && (
          <GroupDetailPage
            group={selectedGroup}
            allGroups={groups}
            divisions={divisions}
            groupTypes={groupTypes}
            rules={groupRulesMap[selectedGroup.id] ?? []}
            canEditGroup={can("finance:group:update")}
            canDeleteGroup={can("finance:group:delete")}
            canCreateRule={can("finance:rule:create")}
            canEditRule={can("finance:rule:update")}
            canDeleteRule={can("finance:rule:delete")}
            onBack={() => setRoute("groups")}
            onSelectGroup={(groupId) => setRoute("group", { groupId })}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onOpenRule={(r) => setRoute("rule", { ruleId: r.id })}
            onCreateRule={handleCreateRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
            error={financeError}
          />
        )}
        {activeNav === "Rule details" && selectedRule && (
          <RuleDetailPage
            rule={selectedRule}
            group={
              groups.find((g) => g.id === selectedRule.group_id) ??
              selectedGroup
            }
            allGroups={groups}
            targets={ruleTargetsMap[selectedRule.id] ?? []}
            canEditRule={can("finance:rule:update")}
            canDeleteRule={can("finance:rule:delete")}
            canCreateTarget={can("finance:rule_target:create")}
            canEditTarget={can("finance:rule_target:update")}
            canDeleteTarget={can("finance:rule_target:delete")}
            onBack={() => setRoute("group", { groupId: selectedRule.group_id })}
            onOpenGroup={(groupId) => setRoute("group", { groupId })}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
            onCreateTarget={handleCreateTarget}
            onUpdateTarget={handleUpdateTarget}
            onDeleteTarget={handleDeleteTarget}
            error={financeError}
          />
        )}
        {activeNav === "Scripts" && <ScriptsPage username={user.username} />}
      </main>
      {userModalOpen && (
        <UserFormModal
          user={editingUser}
          isAdmin={user.is_admin}
          form={userForm}
          error={userError}
          onChange={setUserForm}
          onClose={() => setUserModalOpen(false)}
          onSubmit={saveUser}
        />
      )}
      {roleModalOpen && (
        <RoleFormModal
          role={editingRole}
          form={roleForm}
          error={roleError}
          onChange={setRoleForm}
          onClose={() => setRoleModalOpen(false)}
          onSubmit={saveRole}
        />
      )}
      {counterModalOpen && (
        <CounterUpdateForm
          counter={editingCounter}
          error={counterFormError}
          onClose={() => setCounterModalOpen(false)}
          onSubmit={saveCounter}
        />
      )}
    </div>
  );
}

export default App;
