import React from 'react';
import { User, Role } from '../types';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  MessageSquare,
  BarChart3,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export type NavTab = 'Dashboard' | 'Projects' | 'Employees' | 'Tasks' | 'Messages' | 'Performance';

interface Props {
  user: User;
  allUsers: User[];
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ user, allUsers, activeTab, onNavigate, onLogout, onSwitchUser, children }) => {
  return (
    <div className="min-h-screen flex text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">P</div>
            PlanetEye
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => onNavigate('Dashboard')}
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="Projects" 
              active={activeTab === 'Projects'} 
              onClick={() => onNavigate('Projects')}
            />
            <NavItem 
              icon={<CheckCircle2 size={20} />} 
              label="Tasks" 
              active={activeTab === 'Tasks'} 
              onClick={() => onNavigate('Tasks')}
            />
            {(user.role === Role.ADMIN || user.role === Role.BOSS) && (
               <NavItem 
                 icon={<Users size={20} />} 
                 label="Employees" 
                 active={activeTab === 'Employees'} 
                 onClick={() => onNavigate('Employees')}
               />
            )}
            <NavItem 
              icon={<MessageSquare size={20} />} 
              label="Messages" 
              active={activeTab === 'Messages'} 
              onClick={() => onNavigate('Messages')}
            />
            <NavItem 
              icon={<BarChart3 size={20} />} 
              label="Performance" 
              active={activeTab === 'Performance'} 
              onClick={() => onNavigate('Performance')}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <NavItem icon={<Settings size={20} />} label="Settings" active={false} onClick={() => {}} />
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
             <h1 className="font-semibold text-lg">{activeTab}</h1>
             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
               {user.role.replace('_', ' ')} VIEW
             </span>
             
             {/* SIMULATOR SWITCHER */}
             <div className="relative group ml-4 hidden lg:block">
               <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors">
                 Simulate User <ChevronDown size={12} />
               </button>
               <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 py-2">
                 <div className="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase border-b border-gray-50 mb-1">Select Role Perspective</div>
                 {allUsers.map(u => (
                   <button 
                    key={u.id} 
                    onClick={() => onSwitchUser(u)}
                    className="w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                   >
                     <img src={u.photo} className="w-6 h-6 rounded-full" />
                     <div>
                       <div className="text-xs font-bold text-gray-900">{u.name}</div>
                       <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">{u.role}</div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
              <div className="text-right">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.designation}</div>
              </div>
              <img src={user.photo} className="w-9 h-9 rounded-full bg-gray-200 border-2 border-indigo-100" alt="profile" />
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);