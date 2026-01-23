import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Layout() {
  return (
    <TooltipProvider>
      <div 
        className="h-screen flex overflow-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <Sidebar />
        {/* 主内容区域 */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
