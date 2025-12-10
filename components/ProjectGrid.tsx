
import React from 'react';
import { Project, User } from '../types';
import { Briefcase, Users, MoreHorizontal } from 'lucide-react';

interface Props {
  projects: Project[];
  users: User[];
}

export const ProjectGrid: React.FC<Props> = ({ projects, users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <div key={project.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="text-indigo-600 w-5 h-5" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
          <p className="text-xs text-indigo-600 font-medium mb-3 uppercase tracking-wider">{project.branch}</p>
          <p className="text-sm text-gray-600 mb-6 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex -space-x-2">
              {project.assignedUsers.map(uid => {
                const u = users.find(x => x.id === uid);
                return u ? (
                  <img key={u.id} src={u.photo} className="w-8 h-8 rounded-full border-2 border-white" alt={u.name} title={u.name} />
                ) : null;
              })}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <Users size={14} />
              {project.assignedUsers.length} Members
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
