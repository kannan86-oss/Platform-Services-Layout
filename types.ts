
export type TopTab = 
  | 'Home' 
  | 'Team details' 
  | 'SOW' 
  | 'Shift Tracker' 
  | 'Leave Tracker' 
  | 'MOR Report' 
  | 'Escalation' 
  | 'NEMS' 
  | 'Training' 
  | 'Certification' 
  | 'Reports';
// Audit removed from TopTab as it's now in Admin Console

export type ServiceCategoryId = 
  | 'sa_l3' 
  | 'platform_l2' 
  | 'build_delivery' 
  | 'virtualization';

export interface SubService {
  id: string;
  name: string;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  subServices: SubService[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  region: 'APAC' | 'EMEA' | 'NAM' | 'WAM';
  status: 'Active' | 'Leave' | 'Shift';
}

export interface ManagerChain {
  l1: string;
  l2: string;
  l3: string;
}

export interface TeamData {
  managers: ManagerChain;
  employees: Employee[];
}

export interface ServiceDetailData {
  description: string;
  achievements: string[];
  upcomingEvents: string[];
}

// Navigation Structure Interface
export interface NavMenuItem {
  label: string;
  view?: TopTab;     // The functional view ID if it's a direct link
  children?: string[]; // Sub-items labels
}

// Global state interface
export interface AppState {
  darkMode: boolean;
  activeTopTab: TopTab;
  expandedCategoryId: ServiceCategoryId | null;
  activeSubServiceId: string | null;
}

// --- New Types for Features ---

export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SystemLog {
  id: string;
  type: 'error' | 'warning' | 'info' | 'feedback';
  message: string;
  source: string;
  timestamp: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'OAUTH' | 'ODBC' | 'API';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
  read: boolean;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}
