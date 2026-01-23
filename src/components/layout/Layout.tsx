import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Layout() {
  return (
    <TooltipProvider>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />
        {/* 主内容区域，移动端底部留出导航栏空间 */}
        <main className="flex-1 overflow-auto pb-0 md:pb-0">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
