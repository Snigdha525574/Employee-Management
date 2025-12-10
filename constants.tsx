import { Role, User, Project, Task, TaskType, TaskStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Admin', role: Role.ADMIN, designation: 'System Administrator', photo: 'https://picsum.photos/100/100?random=1', birthdate: '1985-05-15', joinDate: '2020-01-01', score: 95, leaves: [], tours: [], teamId: 'admin' },
  { id: 'u2', name: 'Sara Boss', role: Role.BOSS, designation: 'CEO', photo: 'https://picsum.photos/100/100?random=2', birthdate: '1978-10-22', joinDate: '2015-06-15', score: 100, leaves: [], tours: [], teamId: 'exec' },
  { id: 'u3', name: 'Alex Leader', role: Role.TEAM_LEADER, designation: 'Project Manager', photo: 'https://picsum.photos/100/100?random=3', birthdate: '1990-03-12', joinDate: '2018-09-01', score: 88, leaves: [], tours: [], teamId: 'dev_team_1' },
  { id: 'u4', name: 'Emma Employee', role: Role.EMPLOYEE, designation: 'Senior Developer', photo: 'https://picsum.photos/100/100?random=4', birthdate: '1995-12-05', joinDate: '2021-03-20', score: 92, leaves: [{ id: 'l1', type: 'Medical', status: 'Approved', dateRange: 'Jan 10-12' }], tours: ['Paris Expo 2023'], teamId: 'dev_team_1' },
  { id: 'u5', name: 'Leo Intern', role: Role.INTERN, designation: 'UI Intern', photo: 'https://picsum.photos/100/100?random=5', birthdate: '2001-07-30', joinDate: '2023-11-01', score: 75, leaves: [], tours: [], teamId: 'dev_team_1' },
  { id: 'u6', name: 'Mike Design', role: Role.EMPLOYEE, designation: 'UX Designer', photo: 'https://picsum.photos/100/100?random=6', birthdate: '1996-08-10', joinDate: '2022-05-01', score: 85, leaves: [], tours: [], teamId: 'design_team' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'PlanetEye UI Redesign', branch: 'Design', description: 'Complete overhaul of the mobile dashboard interface.', assignedUsers: ['u3', 'u4', 'u5'], status: 'Active' },
  { id: 'p2', title: 'Cloud Integration', branch: 'Backend', description: 'Migrate legacy data to AWS infrastructure.', assignedUsers: ['u3', 'u4'], status: 'Active' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Finalize Landing Hero',
    type: TaskType.SOS,
    status: TaskStatus.PENDING,
    assignedTo: ['u4'],
    assignedBy: 'u3',
    deadline: '2024-05-20T17:00:00Z',
    description: 'Fix the animation on the hero section for mobile devices.',
    messages: []
  },
  {
    id: 't2',
    title: 'Intern Onboarding Guide',
    type: TaskType.INDIVIDUAL,
    status: TaskStatus.PENDING,
    assignedTo: ['u5'],
    assignedBy: 'u3',
    deadline: '2024-06-01T17:00:00Z',
    description: 'Read the documentation and setup the dev environment.',
    messages: []
  }
];