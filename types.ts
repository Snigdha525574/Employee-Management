
export enum Role {
  ADMIN = 'ADMIN',
  BOSS = 'BOSS',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
  INTERN = 'INTERN'
}

export enum TaskType {
  SOS = 'SOS',
  DAILY = '1 Day',
  TEN_DAYS = '10 Days',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  INDIVIDUAL = 'Individual',
  GROUP = 'Group'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  SUBMITTED = 'Submitted',
  OVERDUE = 'Overdue'
}

export interface LeaveRequest {
  id: string;
  type: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  dateRange: string;
}

export interface User {
  id: string;
  name: string;
  photo: string;
  role: Role;
  designation: string;
  birthdate: string;
  joinDate: string;
  score: number;
  leaves: LeaveRequest[];
  tours: string[];
  teamId?: string; // Added for Team Leader logic
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  fileUrl?: string;
  imageUrl?: string;
  emoji?: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  assignedTo: string[];
  assignedBy: string;
  deadline: string;
  description: string;
  projectId?: string;
  messages: ChatMessage[];
}

export interface Project {
  id: string;
  title: string;
  branch: string;
  description: string;
  assignedUsers: string[];
  status: 'Active' | 'Completed' | 'Pending';
}

export interface Attendance {
  userId: string;
  date: string;
  status: 'Present' | 'Absent';
}
