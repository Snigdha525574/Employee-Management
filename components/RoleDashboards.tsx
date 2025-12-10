
import React from 'react';
import { User, Project, Task, Role } from '../types';
import { TrendingUp, Users, DollarSign, Activity, AlertTriangle, CheckCircle2, Briefcase, Shield } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
}

export const BossDashboard: React.FC<DashboardProps> = ({ users, projects }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl shadow-slate-300/50">
           <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                <h3 className="text-3xl font-black tracking-tight">$4.2M <span className="text-green-400 text-sm font-bold">+12%</span></h3>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl"><DollarSign className="text-white" /></div>
           </div>
           <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-green-400 rounded-full" />
           </div>
           <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fiscal Year Target: 70%</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
           <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Projects</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{projects.filter(p => p.status === 'Active').length}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl"><Briefcase className="text-indigo-600" /></div>
           </div>
           <div className="flex -space-x-3">
             {users.slice(0,5).map(u => <img key={u.id} src={u.photo} className="w-10 h-10 rounded-full border-4 border-white" />)}
             <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">+{users.length - 5}</div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
           <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Workforce</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{users.length}</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl"><Users className="text-orange-600" /></div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Employees</p>
                 <p className="text-lg font-black text-slate-900">{users.filter(u => u.role === Role.EMPLOYEE).length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Interns</p>
                 <p className="text-lg font-black text-slate-900">{users.filter(u => u.role === Role.INTERN).length}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity className="text-indigo-600" /> Executive Activity Log</h3>
            <div className="space-y-6 border-l-2 border-slate-100 pl-6 relative">
               <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <p className="text-sm font-bold text-slate-900">Q3 Financial Review Completed</p>
                  <p className="text-xs text-slate-400 mt-1">Today, 09:00 AM</p>
               </div>
               <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                  <p className="text-sm font-bold text-slate-900">New Project "Alpha" Initiated</p>
                  <p className="text-xs text-slate-400 mt-1">Yesterday, 04:30 PM</p>
               </div>
               <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                  <p className="text-sm font-bold text-slate-900">Hiring Freeze Lifted</p>
                  <p className="text-xs text-slate-400 mt-1">Oct 24, 2023</p>
               </div>
            </div>
         </div>
         
         <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-200">
            <h3 className="font-bold text-lg mb-4">Quick Directives</h3>
            <p className="text-indigo-200 text-sm mb-6">Broadcast high-priority messages to all department heads.</p>
            <textarea className="w-full bg-indigo-700/50 border border-indigo-500 rounded-xl p-4 text-sm text-white placeholder-indigo-300 outline-none focus:ring-2 focus:ring-white/20 mb-4" placeholder="Type directive here..." rows={4} />
            <button className="w-full py-3 bg-white text-indigo-600 font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition">Broadcast</button>
         </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<DashboardProps> = ({ users }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</p>
            <p className="text-lg font-black text-slate-900">Operational</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Alerts</p>
            <p className="text-lg font-black text-slate-900">0 Active</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Users</p>
            <p className="text-lg font-black text-slate-900">{users.length}</p>
          </div>
        </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Shield /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Logs</p>
            <p className="text-lg font-black text-slate-900">View All</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
         <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"> <TrendingUp className="text-indigo-600" /> System Utilization</h3>
         <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 30, 80, 55, 90, 45, 70, 35, 60, 50, 75].map((h, i) => (
              <div key={i} className="w-full bg-slate-50 rounded-t-xl relative group">
                 <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t-xl transition-all duration-500 group-hover:bg-indigo-500" style={{ height: `${h}%` }}></div>
              </div>
            ))}
         </div>
         <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
         </div>
      </div>
    </div>
  );
};

export const TeamLeaderDashboard: React.FC<DashboardProps> = ({ currentUser, users, tasks }) => {
  const myTeam = users.filter(u => u.teamId === currentUser.teamId && u.id !== currentUser.id);
  const teamTasks = tasks.filter(t => t.assignedTo.some(assigneeId => myTeam.map(u => u.id).includes(assigneeId)));

  return (
     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">My Team</p>
            <h3 className="text-4xl font-black mb-4">{myTeam.length} <span className="text-lg font-medium opacity-70">Members</span></h3>
            <div className="flex -space-x-2 mb-6">
               {myTeam.map(u => <img key={u.id} src={u.photo} className="w-10 h-10 rounded-full border-2 border-indigo-600" />)}
            </div>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition">Manage Roster</button>
         </div>
         
         <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Team Task Velocity</h3>
            <div className="space-y-4">
               {myTeam.map(member => {
                 const memberTasks = tasks.filter(t => t.assignedTo.includes(member.id));
                 const completed = memberTasks.filter(t => t.status === 'Completed').length;
                 const total = memberTasks.length || 1; 
                 const percentage = Math.round((completed / total) * 100);

                 return (
                   <div key={member.id} className="flex items-center gap-4">
                      <img src={member.photo} className="w-8 h-8 rounded-lg" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                           <span>{member.name}</span>
                           <span className="text-slate-400">{completed}/{memberTasks.length} Tasks</span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                   </div>
                 )
               })}
            </div>
         </div>
       </div>

       <div>
          <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tighter">Recent Team Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamTasks.slice(0, 6).map(t => (
               <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                     <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${t.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{t.status}</span>
                     <span className="text-[9px] text-slate-400 font-bold">{t.deadline.slice(0,10)}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{t.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex -space-x-1.5">
                       {t.assignedTo.map(uid => {
                         const u = users.find(user => user.id === uid);
                         return u ? <img key={uid} src={u.photo} className="w-6 h-6 rounded-full border border-white" /> : null
                       })}
                     </div>
                     <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">View Details</span>
                  </div>
               </div>
            ))}
            {teamTasks.length === 0 && <div className="col-span-3 p-8 text-center text-slate-400 italic">No active tasks for your team.</div>}
          </div>
       </div>
     </div>
  );
};
