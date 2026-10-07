import React from 'react';
import {
  Home,
  Search,
  CheckSquare,
  UploadCloud,
  Database,
  GraduationCap,
  BarChart2,
  LogOut,
} from 'lucide-react';

export type NavItem =
  | 'home'
  | 'search'
  | 'tasks'
  | 'upload'
  | 'database'
  | 'campus'
  | 'analytics';

interface SidebarProps {
  activeItem: NavItem;
  onSelectItem: (item: NavItem) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'campus',
  onSelectItem,
  onLogout,
}) => {
  const topNavItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home Dashboard', icon: <Home className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
    { id: 'search', label: 'Global Search', icon: <Search className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
    { id: 'tasks', label: 'Action Items & Tasks', icon: <CheckSquare className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
    { id: 'upload', label: 'Batch Upload & Integration', icon: <UploadCloud className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
    { id: 'database', label: 'Data Repository', icon: <Database className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
    { id: 'campus', label: 'Campus Connect', icon: <GraduationCap className="w-[19px] h-[19px]" strokeWidth={1.9} /> },
    { id: 'analytics', label: 'Recruitment Analytics', icon: <BarChart2 className="w-[18px] h-[18px]" strokeWidth={1.75} /> },
  ];

  return (
    <aside
      className="w-14 shrink-0 bg-[#fbf8f0] border-r border-[#ece3d3] flex flex-col justify-between items-center py-4 select-none min-h-[calc(100vh-3.5rem)]"
      aria-label="Primary Navigation"
    >
      {/* Top list of icons */}
      <nav className="flex flex-col items-center gap-3 w-full">
        {topNavItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <div key={item.id} className="relative group flex justify-center w-full">
              <button
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#dce9f0] text-[#245d77] shadow-xs'
                    : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-[#efe8d8]'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
              </button>

              {/* Floating Tooltip */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Logout Icon */}
      <div className="w-full flex justify-center pb-2">
        <div className="relative group">
          <button
            type="button"
            onClick={onLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#ea4335] hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </button>
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-red-900 text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Sign Out
          </div>
        </div>
      </div>
    </aside>
  );
};
