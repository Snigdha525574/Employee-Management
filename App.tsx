
import React, { useState, useEffect, useRef } from 'react';
import { Role, User, Task, Project, TaskType, TaskStatus, ChatMessage } from './types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS } from './constants';
import { Layout, NavTab } from './components/Layout';
import { ProjectGrid } from './components/ProjectGrid';
import { BirthdayCelebration } from './components/BirthdayCelebration';
import { MotivationalPopup } from './components/MotivationalPopup';
import { Login } from './components/Login';
import { BossDashboard, AdminDashboard, TeamLeaderDashboard } from './components/RoleDashboards';
import { 
  Plus, 
  Filter, 
  Trophy, 
  Calendar, 
  CheckSquare, 
  AlertCircle,
  TrendingUp,
  Clock,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Search,
  CheckCircle2,
  Trash2,
  UserPlus,
  Briefcase,
  Users,
  ChevronRight,
  Plane,
  CalendarDays,
  Activity,
  User as UserIcon,
  X,
  Lock,
  Edit,
  UserCog
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[3]); // Default for type safety
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [messageText, setMessageText] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | 'All'>('All');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosTargetId, setSosTargetId] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showTaskAssignModal, setShowTaskAssignModal] = useState(false);

  // Check for birthdays
  const today = new Date().toISOString().slice(5, 10);
  const birthdayUsers = users.filter(u => u.birthdate.slice(5, 10) === today);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab('Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('Dashboard');
  };

  const handleTaskCreate = (type: TaskType, targetId?: string) => {
    // If Intern creates task, default assigned to self.
    // If Boss/Admin/TL creates, they might use the modal, but this function handles SOS/Quick tasks
    const assignees = targetId ? [targetId] : [currentUser.id];
    
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: type === TaskType.SOS ? 'URGENT: SOS Request' : `New ${type} Task`,
      type: type,
      status: TaskStatus.PENDING,
      assignedTo: assignees,
      assignedBy: currentUser.id,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      description: type === TaskType.SOS ? 'Critical intervention required immediately.' : 'Task created via quick action.',
      messages: []
    };
    setTasks([newTask, ...tasks]);
    if (type === TaskType.SOS) setShowSOSModal(false);
  };

  const dashboardStats = [
    { 
      label: 'My Assignments', 
      value: tasks.filter(t => t.assignedTo.includes(currentUser.id) && t.status !== TaskStatus.COMPLETED).length.toString(), 
      icon: <CheckSquare className="text-blue-600" />, 
      change: 'Active' 
    },
    { label: 'Performance', value: currentUser.score + '%', icon: <Trophy className="text-yellow-600" />, change: 'Score' },
    { label: 'Leaves', value: currentUser.leaves.length.toString(), icon: <Plane className="text-purple-600" />, change: 'YTD' },
    { label: 'Role', value: currentUser.role.replace('_', ' '), icon: <Activity className="text-green-600" />, change: 'Level' },
  ];

  // Logic to determine which tasks a user can see
  const getVisibleTasks = () => {
    if (currentUser.role === Role.BOSS || currentUser.role === Role.ADMIN) {
      return tasks;
    }
    if (currentUser.role === Role.TEAM_LEADER) {
      // See tasks assigned to self OR tasks assigned to team members
      const teamMemberIds = users.filter(u => u.teamId === currentUser.teamId).map(u => u.id);
      return tasks.filter(t => t.assignedTo.some(id => teamMemberIds.includes(id)));
    }
    // Employee & Intern: See tasks assigned to them
    return tasks.filter(t => t.assignedTo.includes(currentUser.id));
  };

  // Logic to determine which users can create groups
  const canCreateGroup = currentUser.role === Role.BOSS || currentUser.role === Role.ADMIN || currentUser.role === Role.TEAM_LEADER;

  // Logic to determine if user can add employees
  const canManageEmployees = currentUser.role === Role.BOSS || currentUser.role === Role.ADMIN;

  const visibleTasks = getVisibleTasks();

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        if (currentUser.role === Role.BOSS) {
           return <BossDashboard currentUser={currentUser} users={users} projects={projects} tasks={tasks} />;
        }
        if (currentUser.role === Role.ADMIN) {
           return <AdminDashboard currentUser={currentUser} users={users} projects={projects} tasks={tasks} />;
        }
        if (currentUser.role === Role.TEAM_LEADER) {
           return <TeamLeaderDashboard currentUser={currentUser} users={users} projects={projects} tasks={tasks} />;
        }
        
        // DEFAULT EMPLOYEE / INTERN DASHBOARD (UNCHANGED)
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 h-full pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-bold tracking-tight uppercase tracking-tighter">{stat.label}</span>
                    <div className="p-2 bg-slate-50 rounded-xl">{stat.icon}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-widest">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-gray-900">Your Task Stream</h3>
                    <div className="flex gap-2">
                       <button onClick={() => setShowSOSModal(true)} className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full hover:bg-red-100 transition shadow-sm border border-red-100 uppercase tracking-widest">SIGNAL SOS</button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {visibleTasks.map(t => (
                      <TaskItem key={t.id} task={t} onToggleComplete={(id) => {
                         setTasks(prev => prev.map(task => task.id === id ? { ...task, status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED } : task));
                      }} />
                    ))}
                    {visibleTasks.length === 0 && (
                      <p className="p-6 text-center text-gray-400 text-sm italic">No active tasks.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold">Peer Performance Benchmarks</h3>
                     <TrendingUp className="text-indigo-600 w-5 h-5" />
                   </div>
                   <div className="space-y-4">
                      {users.sort((a,b) => b.score - a.score).slice(0, 4).map(u => (
                        <div key={u.id} className="flex items-center gap-4">
                          <img src={u.photo} className="w-8 h-8 rounded-full ring-2 ring-indigo-50" />
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                              <span className="text-gray-700">{u.name}</span>
                              <span className="text-indigo-600">{u.score}%</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full transition-all duration-700" style={{ width: `${u.score}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-4 uppercase text-[10px] tracking-widest text-gray-400"><Calendar size={14} className="text-indigo-600" /> Attendance Log</h3>
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-2 text-gray-400 font-bold">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition cursor-default
                        ${i + 1 === 15 ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110 z-10' : ''}
                        ${i % 7 === 5 || i % 7 === 6 ? 'bg-gray-50 text-gray-300' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-[9px] font-black uppercase tracking-wider text-gray-500">
                     <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Work</span>
                     <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div> Off</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold mb-4 uppercase text-[10px] tracking-widest text-gray-400">Business Tours</h3>
                  <div className="space-y-3">
                    {currentUser.tours.map((tour, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <Plane size={14} className="text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-900">{tour}</span>
                      </div>
                    ))}
                    {currentUser.tours.length === 0 && <p className="text-xs text-gray-400 text-center italic py-2">No active itineraries.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Tasks':
        const filteredTasks = selectedTaskType === 'All' ? visibleTasks : visibleTasks.filter(t => t.type === selectedTaskType);
        
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tighter">TASK BOARD</h2>
                {currentUser.role === Role.INTERN && <p className="text-xs text-indigo-500 font-bold mt-1">Create individual tasks to track your learning progress.</p>}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                 {/* Interns can create personal tasks, others can create tasks too */}
                 {currentUser.role === Role.INTERN && (
                    <button onClick={() => handleTaskCreate(TaskType.INDIVIDUAL)} className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition flex items-center gap-2">
                       <Plus size={14} /> My Task
                    </button>
                 )}
                 {(currentUser.role === Role.BOSS || currentUser.role === Role.ADMIN || currentUser.role === Role.TEAM_LEADER) && (
                    <button onClick={() => setShowTaskAssignModal(true)} className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition flex items-center gap-2">
                       <Plus size={14} /> Assign Task
                    </button>
                 )}
                
                {(Object.values(TaskType)).map(type => (
                   <button 
                    key={type}
                    onClick={() => setSelectedTaskType(type)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition shadow-sm
                      ${selectedTaskType === type ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border text-gray-500 hover:border-indigo-600'}`}>
                      {type}
                   </button>
                ))}
                <button onClick={() => setSelectedTaskType('All')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition ${selectedTaskType === 'All' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border text-gray-500'}`}>All</button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
              <div className="divide-y divide-slate-50">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(t => (
                    <div key={t.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-indigo-50/20 transition-all border-l-4 border-transparent hover:border-indigo-600 group">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-inner ${t.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                           {t.type === TaskType.SOS ? <AlertCircle size={24} className="animate-pulse" /> : <CheckSquare size={24} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className={`text-lg font-black tracking-tight ${t.status === TaskStatus.COMPLETED ? 'text-gray-300 line-through' : 'text-gray-900'}`}>{t.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest shadow-sm ${t.type === TaskType.SOS ? 'bg-red-500 text-white border-red-400' : 'bg-white text-indigo-600 border-indigo-100'}`}>{t.type}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 font-medium">{t.description}</p>
                          {(currentUser.role === Role.BOSS || currentUser.role === Role.ADMIN || currentUser.role === Role.TEAM_LEADER) && (
                            <p className="text-[10px] text-gray-400 mt-2">Assigned by: {users.find(u=>u.id===t.assignedBy)?.name || 'Unknown'}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-[9px] text-gray-400 font-black uppercase mb-1.5 tracking-widest">Visibility</p>
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${t.status === TaskStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                             {t.status}
                           </span>
                        </div>
                        <div className="flex -space-x-2.5">
                          {t.assignedTo.map(id => {
                            const u = users.find(x => x.id === id);
                            return u ? <img key={id} src={u.photo} className="w-10 h-10 rounded-full border-4 border-white ring-1 ring-slate-100 shadow-sm" title={u.name} /> : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-24 text-center text-slate-300">
                    <CheckSquare size={64} className="mx-auto mb-6 opacity-20" />
                    <p className="text-xl font-black italic tracking-tighter">NO CORRESPONDING TASKS</p>
                    <p className="text-xs font-bold uppercase tracking-widest mt-2">Check another tab or filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'Performance':
        return (
          <div className="space-y-8 animate-in slide-in-from-left-4 pb-12">
            <h2 className="text-2xl font-black tracking-tighter">ORGANIZATIONAL METRICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.sort((a,b) => b.score - a.score).map((u, i) => (
                 <div key={u.id} className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center shadow-xl shadow-slate-200/40 relative hover:scale-105 transition-transform">
                    <div className="relative mb-6">
                      <img src={u.photo} className="w-24 h-24 rounded-3xl border-4 border-indigo-50 shadow-lg object-cover" />
                      <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shadow-2xl border-4 border-white ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{u.name}</h3>
                    <p className="text-[10px] text-indigo-600 font-black mb-6 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">{u.designation}</p>
                    <div className="w-full space-y-3 mt-auto">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <span>Mastery Score</span>
                         <span className="text-indigo-600">{u.score}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                        <div className={`h-full transition-all duration-1000 bg-gradient-to-r ${u.score > 90 ? 'from-green-400 to-green-600' : u.score > 80 ? 'from-indigo-400 to-indigo-600' : 'from-amber-400 to-amber-600'}`} style={{ width: `${u.score}%` }}></div>
                      </div>
                    </div>
                    <button className="mt-8 text-indigo-600 text-[10px] font-black flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest">Profile Analytics <ChevronRight size={14} /></button>
                 </div>
              ))}
            </div>
          </div>
        );

      case 'Projects':
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 pb-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Project Pipeline</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{projects.length} Active Operational Units</p>
              </div>
              {(currentUser.role === Role.ADMIN || currentUser.role === Role.BOSS) && (
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition active:scale-95">
                  <Plus size={18} /> Initiate Workspace
                </button>
              )}
            </div>
            <ProjectGrid projects={projects} users={users} />
          </div>
        );

      case 'Employees':
        // Determine who can be seen
        let visibleUsers = users;
        if (currentUser.role === Role.TEAM_LEADER) {
           visibleUsers = users.filter(u => u.teamId === currentUser.teamId);
        }

        return (
          <div className="space-y-6 animate-in fade-in duration-300 h-full pb-12">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black tracking-tighter uppercase">Directory</h2>
               {canManageEmployees && (
                 <button onClick={() => setShowAddEmployeeModal(true)} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-indigo-600 rounded-2xl hover:bg-slate-50 shadow-xl shadow-slate-100 font-black uppercase text-[10px] tracking-widest transition">
                   <UserPlus size={18} /> Add Talent
                 </button>
               )}
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-[0.15em] border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6">Individual</th>
                    <th className="px-8 py-6">Privileges</th>
                    <th className="px-8 py-6">Contribution Score</th>
                    <th className="px-8 py-6">Seniority</th>
                    {canManageEmployees && <th className="px-8 py-6">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visibleUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-8 py-6 flex items-center gap-5">
                        <img src={u.photo} className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-100" />
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">{u.name}</p>
                          <p className="text-[10px] text-indigo-500 font-black uppercase tracking-tight">{u.designation}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full border border-slate-200 uppercase tracking-widest">{u.role}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900">{u.score}%</span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${u.score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.joinDate}</td>
                      {canManageEmployees && (
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition border border-transparent hover:bg-white hover:shadow-sm rounded-xl"><Edit size={18} /></button>
                            <button className="p-2.5 text-slate-400 hover:text-red-500 transition border border-transparent hover:bg-white hover:shadow-sm rounded-xl"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Messages':
        return (
          <div className="h-[calc(100vh-10rem)] flex gap-8 animate-in slide-in-from-right-4">
            <div className="w-80 bg-white rounded-3xl border border-slate-100 flex flex-col shadow-xl shadow-slate-200/50 shrink-0 overflow-hidden">
              <div className="p-6 border-b border-slate-50 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input placeholder="Sync with colleagues..." className="w-full pl-11 pr-5 py-3 bg-slate-50 rounded-2xl text-xs font-bold tracking-tight focus:ring-4 focus:ring-indigo-100 outline-none border border-transparent transition" />
                </div>
                {canCreateGroup && (
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition">
                    + Create Group
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                {users.map(u => (
                  <button key={u.id} className="w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50/80 transition-all group border-l-4 border-transparent hover:border-indigo-500">
                    <div className="relative shrink-0">
                      <img src={u.photo} className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm" />
                    </div>
                    <div className="text-left overflow-hidden flex-1">
                      <p className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-600 transition tracking-tight">{u.name}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase truncate tracking-widest mt-1">{u.designation}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-slate-100 flex flex-col shadow-xl shadow-slate-200/50 overflow-hidden relative">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-5">
                  <img src={users[2].photo} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md" />
                  <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">{users[2].name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[9px] text-green-600 font-black uppercase tracking-[0.1em]">Encrypted Channel</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition"><Calendar size={20} /></button>
                </div>
              </div>
              <div className="flex-1 p-10 space-y-8 overflow-y-auto bg-indigo-50/10 custom-scrollbar">
                 <div className="flex gap-4">
                   <img src={users[2].photo} className="w-9 h-9 rounded-xl shrink-0 border shadow-sm" />
                   <div className="max-w-md p-5 rounded-3xl rounded-tl-none bg-white border border-slate-100 shadow-xl shadow-slate-200/20">
                     <p className="text-xs font-bold text-slate-700 leading-relaxed">Hey {currentUser.name}, confirming the status of the SOS resolution protocol. Any roadblocks?</p>
                     <span className="text-[8px] text-slate-400 font-black mt-3 block text-right tracking-widest uppercase">09:12 AM</span>
                   </div>
                 </div>
                 <div className="flex flex-row-reverse gap-4">
                   <div className="max-w-md p-5 rounded-3xl rounded-tr-none bg-indigo-600 text-white shadow-xl shadow-indigo-100 border border-indigo-500">
                     <p className="text-xs font-bold leading-relaxed">Protocol initialized. Resolving dependency loops now. ETA: 25 minutes. ⚡</p>
                     <span className="text-[8px] text-indigo-200 font-black mt-3 block tracking-widest uppercase text-right">09:15 AM</span>
                   </div>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-50 bg-white">
                <div className="bg-slate-50 rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:bg-white focus-within:border-indigo-100 transition-all shadow-inner">
                  <button className="p-3 text-slate-400 hover:text-indigo-600 transition"><Paperclip size={20} /></button>
                  <input 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Contribute to discussion..." 
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-xs font-bold tracking-tight placeholder-slate-400" 
                  />
                  <button className="p-3 text-slate-400 hover:text-indigo-600 transition"><Smile size={20} /></button>
                  <button className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition active:scale-95 flex items-center justify-center">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="p-24 text-center text-slate-300 font-black tracking-widest uppercase">SECTION OFFLINE</div>;
    }
  };

  if (!isAuthenticated) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      allUsers={users}
      activeTab={activeTab} 
      onNavigate={setActiveTab} 
      onSwitchUser={(u) => setCurrentUser(u)} // Kept simulator for dev convenience, can be removed
      onLogout={handleLogout}
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {renderContent()}
      </div>

      <BirthdayCelebration birthdayUsers={birthdayUsers} />
      <MotivationalPopup />

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 border border-white">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-200"><AlertCircle size={28} /></div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">SOS Signal</h2>
                </div>
                <button onClick={() => setShowSOSModal(false)} className="text-slate-300 hover:text-slate-900 bg-slate-50 p-2 rounded-full transition-colors"><X /></button>
             </div>
             <p className="text-slate-500 mb-8 text-sm font-bold leading-relaxed uppercase tracking-widest border-b border-slate-50 pb-6 italic opacity-80">Critical mission hazard. select a specialist for emergency collaboration.</p>
             <div className="space-y-3 mb-10 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                {users.filter(u => u.id !== currentUser.id).map(u => (
                  <button 
                    key={u.id} 
                    onClick={() => setSosTargetId(u.id)}
                    className={`w-full p-4 rounded-3xl flex items-center gap-4 border-2 transition-all ${sosTargetId === u.id ? 'border-red-500 bg-red-50 shadow-xl shadow-red-50' : 'border-slate-50 hover:border-red-200 bg-slate-50/50'}`}>
                    <img src={u.photo} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-black text-slate-900 tracking-tight">{u.name}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mt-0.5">{u.role}</p>
                    </div>
                  </button>
                ))}
             </div>
             <button 
               disabled={!sosTargetId}
               onClick={() => handleTaskCreate(TaskType.SOS, sosTargetId)}
               className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-red-200 hover:bg-red-700 disabled:opacity-20 transition active:scale-95">
               DEPLOY EMERGENCY COLLAB
             </button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 h-[90vh] overflow-y-auto border border-white">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100"><UserPlus size={28} /></div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Onboard Colleague</h2>
                </div>
                <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-300 hover:text-slate-900 bg-slate-50 p-2 rounded-full transition-colors"><X /></button>
             </div>
             <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowAddEmployeeModal(false); }}>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Legal Identity</label>
                    <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition font-bold tracking-tight text-sm" placeholder="Input Full Name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Privilege Role</label>
                      <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none transition uppercase text-[10px] font-black tracking-widest cursor-pointer" required>
                        {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Departmental Titling</label>
                      <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none transition font-bold tracking-tight text-sm" placeholder="e.g. Lead Dev" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Chronological Birth</label>
                      <input type="date" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none transition font-black text-[10px] tracking-widest uppercase cursor-pointer" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Tenure Start</label>
                      <input type="date" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 outline-none transition font-black text-[10px] tracking-widest uppercase cursor-pointer" required />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 mt-8">
                  Commit Onboarding
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Simplified Task Assign Modal for Demo */}
      {showTaskAssignModal && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 border border-white">
               <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Assign Responsibility</h2>
               <p className="text-sm text-slate-500 mb-6">Select a team member to delegate this task to.</p>
               <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar mb-6">
                  {users.filter(u => u.id !== currentUser.id).map(u => (
                    <button key={u.id} onClick={() => { handleTaskCreate(TaskType.INDIVIDUAL, u.id); setShowTaskAssignModal(false); }} className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center gap-3">
                       <img src={u.photo} className="w-8 h-8 rounded-full" />
                       <span className="font-bold text-sm">{u.name}</span>
                    </button>
                  ))}
               </div>
               <button onClick={() => setShowTaskAssignModal(false)} className="w-full py-3 text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600">Cancel</button>
            </div>
         </div>
      )}
    </Layout>
  );
};

const TaskItem = ({ task, onToggleComplete }: { task: Task, onToggleComplete: (id: string) => void }) => {
  const isSOS = task.type === TaskType.SOS;
  const isDone = task.status === TaskStatus.COMPLETED;
  
  return (
    <div className="px-8 py-5 flex items-center justify-between group hover:bg-indigo-50/20 transition-all border-l-4 border-transparent hover:border-indigo-500 relative">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onToggleComplete(task.id)}
          className={`p-3 rounded-2xl transition-all border-2 flex items-center justify-center ${isDone ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-slate-300 border-slate-100 group-hover:border-indigo-200 group-hover:text-indigo-400 shadow-sm shadow-indigo-100/10'}`}>
          <CheckCircle2 size={20} className={isDone ? 'scale-110' : ''} />
        </button>
        <div>
          <h4 className={`text-sm font-black tracking-tight ${isDone ? 'text-slate-300 line-through decoration-indigo-400 decoration-4' : 'text-slate-900'}`}>{task.title}</h4>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-widest">
              <Clock size={12} className="text-indigo-400" /> Deadline: Today, 5:00 PM
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-widest shadow-sm ${isSOS ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-white text-indigo-500 border-indigo-100'}`}>
              {task.type}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-3 bg-white text-indigo-400 hover:text-indigo-600 hover:shadow-xl rounded-2xl border border-slate-100 transition shadow-sm">
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
}

export default App;
