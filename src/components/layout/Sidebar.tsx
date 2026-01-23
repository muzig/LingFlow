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
    <aside className="w-16 border-r bg-card flex flex-col items-center py-4 gap-2">
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
  );
}
