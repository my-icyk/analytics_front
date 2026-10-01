import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Database,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth, usePermissions } from "../auth/AuthContext";
import { adminPages } from "../constants/admin";
import { buildAdminPath } from "../routes";

export function AdminSidebar({ activeNav }: { activeNav: string }) {
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const visibleNav = adminPages.filter(
    (item) => item.permission && can(item.permission),
  );

  if (!user) return null;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
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
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? (
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
                type="button"
                onClick={() => navigate(buildAdminPath(item.id))}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" type="button">
          <BookOpen size={17} />
          <span>Documentation</span>
        </button>
        <button className="nav-item" type="button">
          <CircleHelp size={17} />
          <span>Help center</span>
        </button>
        <div className="profile">
          <button
            className="profile-link"
            type="button"
            onClick={() => navigate(buildAdminPath("me"))}
          >
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
            type="button"
            aria-label="Log out"
            onClick={() => void logout()}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
