
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BarChart2, Settings, FileText, Users } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="sidebar-icon" />
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: <BarChart2 className="sidebar-icon" />
    },
    { 
      name: 'Teams', 
      path: '/teams', 
      icon: <Users className="sidebar-icon" />
    },
    { 
      name: 'Documents', 
      path: '/documents', 
      icon: <FileText className="sidebar-icon" />
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="sidebar-icon" />
    }
  ];

  return (
    <div className="bg-sidebar text-sidebar-foreground w-[260px] fixed inset-y-0 left-0 z-30 flex flex-col">
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
          <span className="text-xl font-bold">t.</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-gray-800"
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="rounded-md w-8 h-8 bg-gray-700 flex items-center justify-center text-xs font-medium">
            T
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-xs text-gray-400">Workspace</span>
            <span className="text-sm font-medium">Tino Digital Agency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
