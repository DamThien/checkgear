import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PlusCircle,
  Search,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/market", icon: ShoppingBag, label: "Market" },
  { to: "/my-gear", icon: Package, label: "My Gear", authOnly: true },
  { to: "/add-gear", icon: PlusCircle, label: "Add Gear", authOnly: true },
  { to: "/price-search", icon: Search, label: "Price Search", authOnly: true },
];

export default function Sidebar() {
  const { user, isGuest, logout, canEdit } = useAuthStore();
  const editable = canEdit();

  const avatar = isGuest ? "G" : (user?.email?.[0] || "?").toUpperCase();
  const displayName = isGuest ? "Guest" : user?.email;

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[var(--color-panel)] border-r border-[var(--color-border)] flex flex-col h-full">
      {/* Logo */}
      <a href="/" className="px-5 py-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <img
            className="text-white text-xs font-bold font-[var(--font-mono)] h-10 w-10"
            src="src/assets/CG_logo.png"
            alt="Logo"
          />
          <span className="font-[var(--font-display)] font-bold text-[15px] text-[var(--color-text)] tracking-tight">
            CheckGear
          </span>
        </div>
      </a>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.filter((n) => !n.authOnly || editable).map(
          ({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]/20"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface2)]"
                }`
              }
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </NavLink>
          )
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent2)] to-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold font-[var(--font-mono)] flex-shrink-0">
            {avatar}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--color-text)] truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-[var(--color-faint)]">
              {isGuest ? "View only" : "Member"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-[12px] text-[var(--color-faint)] hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150"
        >
          <LogOut size={13} />
          {isGuest ? "Exit guest" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
