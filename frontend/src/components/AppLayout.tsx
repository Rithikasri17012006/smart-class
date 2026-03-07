import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  Users,
  ClipboardCheck,
  History,
  LogOut,
  Menu,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classrooms", label: "Classrooms", icon: School },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/history", label: "History", icon: History },
];

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/classrooms")) return "Classrooms";
  if (pathname.startsWith("/students")) return "Students";
  if (pathname.startsWith("/attendance")) return "Attendance";
  if (pathname.startsWith("/history")) return "Attendance History";
  return "SmartClass";
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const Sidebar = (
    <div className="flex h-full w-64 flex-col bg-slate-950 text-slate-100 shadow-xl">
      {/* Brand */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SmartClass</h1>
            <p className="text-xs text-slate-400">
              Classroom & Attendance
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 rounded-2xl bg-slate-900 px-4 py-3">
          <p className="text-sm font-semibold text-white">
            {parsedUser?.name || "Admin"}
          </p>
          <p className="text-xs text-slate-400">
            {parsedUser?.email || "admin@smartclass.com"}
          </p>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full justify-start rounded-xl bg-white text-slate-900 hover:bg-slate-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">{Sidebar}</aside>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 h-full">{Sidebar}</div>
          </div>
        )}

        <div className="flex flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {getPageTitle(location.pathname)}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage classrooms, students and attendance
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="md:hidden"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}