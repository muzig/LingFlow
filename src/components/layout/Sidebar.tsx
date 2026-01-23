import { NavLink } from "react-router-dom";
import { BookOpen, Library, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/",
    icon: BookOpen,
    label: "阅读",
  },
  {
    to: "/vocabulary",
    icon: Library,
    label: "生词本",
  },
  {
    to: "/review",
    icon: GraduationCap,
    label: "复习",
  },
];

export function Sidebar() {
  return (
    <>
      {/* 桌面端侧边栏 */}
      <aside className="hidden md:flex w-16 border-r bg-card flex-col items-center py-4 gap-2">
        <div className="mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 移动端底部导航栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex-1 h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors",
                "hover:bg-accent hover:text-accent-foreground active:scale-95",
                isActive && "bg-accent text-accent-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
