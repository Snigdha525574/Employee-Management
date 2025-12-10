import React, { useState } from 'react';
import { User, Role } from '../types';
import { ShieldCheck, User as UserIcon, Lock, ChevronRight } from 'lucide-react';

interface Props {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ users, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | 'ALL'>('ALL');

  const filteredUsers = selectedRole === 'ALL' ? users : users.filter(u => u.role === selectedRole);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Left Side - Brand */}
        <div className="md:w-5/12 bg-indigo-600 p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
               <span className="text-indigo-600 text-2xl font-black">P</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">PLANET<br/>EYE</h1>
            <p className="text-indigo-100 font-medium text-sm">Enterprise Resource & Employee Management Suite</p>
          </div>
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><ShieldCheck size={20} /></div>
               <div className="text-xs font-bold uppercase tracking-widest opacity-80">Secure Access</div>
            </div>
            <p className="text-indigo-100 text-xs leading-relaxed opacity-70">
              Select your personnel profile to access the secure dashboard. Role-based permissions are active.
            </p>
          </div>
        </div>

        {/* Right Side - Login */}
        <div className="md:w-7/12 p-10 bg-slate-50">
          <h2 className="text-2xl font-black text-slate-900 mb-6">System Entry</h2>
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
            {['ALL', ...Object.values(Role)].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r as Role | 'ALL')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition
                  ${selectedRole === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'}`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/50 transition-all text-left"
              >
                <div className="relative">
                  <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white
                    ${user.role === Role.ADMIN ? 'bg-red-500' : user.role === Role.BOSS ? 'bg-purple-600' : 'bg-indigo-500'}`}>
                    {user.role[0]}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.designation}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-medium">
             <span className="flex items-center gap-2"><Lock size={12} /> Encrypted Connection</span>
             <span>v2.5.0 Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};