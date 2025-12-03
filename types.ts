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
  | 'Audit' 
  | 'Reports';

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

// Global state interface
export interface AppState {
  darkMode: boolean;
  activeTopTab: TopTab;
  expandedCategoryId: ServiceCategoryId | null;
  activeSubServiceId: string | null;
}
