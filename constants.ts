
import { ServiceCategory, TeamData, ServiceDetailData, Employee, User, Task, NavMenuItem, SystemLog, IntegrationConfig } from './types';

// Updated Navigation Structure with Tracker Dropdown
// Removed 'Audit' as it is now in Admin Console
export const NAV_MENU_ITEMS: NavMenuItem[] = [
  { label: 'Home', view: 'Home' },
  { label: 'Team details', view: 'Team details' },
  { label: 'SOW', view: 'SOW' },
  { 
    label: 'Tracker', 
    children: [
      'Shift Tracker', 
      'Leave Tracker', 
      'Escalation', 
      'NEMS', 
      'Training', 
      'Certification'
    ] 
  },
  { label: 'MOR Report', view: 'MOR Report' },
  { label: 'Reports', view: 'Reports' }
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'sa_l3',
    title: 'SA L3 Services',
    subServices: [
      { id: 'unix_l3', name: 'Unix L3' },
      { id: 'wintel_l3', name: 'Wintel L3' },
    ]
  },
  {
    id: 'platform_l2',
    title: 'Platform L2 Services',
    subServices: [
      { id: 'unix_l2', name: 'Unix L2' },
      { id: 'wintel_l2', name: 'Wintel L2' },
    ]
  },
  {
    id: 'build_delivery',
    title: 'Build & Delivery',
    subServices: [
      { id: 'apac_build', name: 'APAC Build' },
      { id: 'nam_build', name: 'NAM Build' },
    ]
  },
  {
    id: 'virtualization',
    title: 'Virtualization Services',
    subServices: [
      { id: 'vm_guest', name: 'VM Guest Services' },
      { id: 'cas_services', name: 'CAS Services' },
    ]
  }
];

// Helper to generate mock employees
const generateEmployees = (count: number, rolePrefix: string): Employee[] => {
  const regions: ('APAC' | 'EMEA' | 'NAM' | 'WAM')[] = ['APAC', 'EMEA', 'NAM', 'WAM'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `emp-${rolePrefix}-${i}`,
    name: `Engineer ${rolePrefix} ${i + 1}`,
    role: `${rolePrefix} Specialist`,
    region: regions[i % regions.length],
    status: i % 5 === 0 ? 'Leave' : 'Active',
  }));
};

// Mock Data Store - Indexed by SubService ID
export const MOCK_TEAM_DATA: Record<string, TeamData> = {
  'unix_l3': {
    managers: { l1: 'Alice Johnson', l2: 'Bob Smith', l3: 'Charlie Davis' },
    employees: generateEmployees(12, 'Unix L3')
  },
  'wintel_l3': {
    managers: { l1: 'David Wilson', l2: 'Eva Brown', l3: 'Frank Miller' },
    employees: generateEmployees(10, 'Wintel L3')
  },
  'unix_l2': {
    managers: { l1: 'Grace Lee', l2: 'Henry Ford', l3: 'Ivy Chen' },
    employees: generateEmployees(20, 'Unix L2')
  },
  'wintel_l2': {
    managers: { l1: 'Jack White', l2: 'Kelly Green', l3: 'Leo Black' },
    employees: generateEmployees(18, 'Wintel L2')
  },
  'apac_build': {
    managers: { l1: 'Mike Ross', l2: 'Nancy Drew', l3: 'Oscar Wilde' },
    employees: generateEmployees(8, 'Build')
  },
  'nam_build': {
    managers: { l1: 'Paul Atreides', l2: 'Quinn Faber', l3: 'Rachael Tyrell' },
    employees: generateEmployees(9, 'Build')
  },
  'vm_guest': {
    managers: { l1: 'Sarah Connor', l2: 'Tom Ripley', l3: 'Ursula K.' },
    employees: generateEmployees(15, 'Virt')
  },
  'cas_services': {
    managers: { l1: 'Victor Von', l2: 'Wanda M.', l3: 'Xavier P.' },
    employees: generateEmployees(7, 'CAS')
  },
};

export const MOCK_HOME_DATA: Record<string, ServiceDetailData> = {
  'unix_l3': {
    description: "Deep dive diagnostics, kernel tuning, and root cause analysis for mission-critical Unix environments across the enterprise.",
    achievements: ["99.99% Uptime in Q3", "Automated Patching Pipeline deployed", "Zero Severity 1 incidents in October"],
    upcomingEvents: ["RedHat 9 Upgrade Training", "Global Unix Townhall"]
  },
  'wintel_l3': {
    description: "Advanced Windows Server troubleshooting, Active Directory architecture management, and high-availability clustering support.",
    achievements: ["Migrated 500 servers to Azure Hybrid", "Reduced login latency by 40%"],
    upcomingEvents: ["Windows Server 2025 Preview", "Security Compliance Workshop"]
  },
  'unix_l2': {
    description: "24/7 Monitoring, Incident Management, and routine maintenance for Unix platforms.",
    achievements: ["Resolved 4000+ Tickets", "CSAT Score: 4.8/5"],
    upcomingEvents: ["Shift Handover Automation Demo"]
  },
  // Default fallback for others
  'default': {
    description: "Providing world-class infrastructure services ensuring stability, scalability, and security.",
    achievements: ["Operational Excellence Award 2024", "ISO 27001 Audit Passed"],
    upcomingEvents: ["Annual Team Outing", "Quarterly Business Review"]
  }
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Admin', email: 'sarah.admin@platform.com', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Sarah+Admin&background=0D8ABC&color=fff' },
  { id: 'u2', name: 'John Dev', email: 'john.dev@platform.com', role: 'Editor', avatar: 'https://ui-avatars.com/api/?name=John+Dev&background=random' },
  { id: 'u3', name: 'Guest Viewer', email: 'guest@platform.com', role: 'Viewer', avatar: 'https://ui-avatars.com/api/?name=Guest+Viewer&background=random' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Review Q3 Unix Incident Reports', description: 'Analyze high severity incidents for Unix L3', assignee: 'Unix L3 Lead', status: 'Pending', priority: 'High', createdAt: new Date().toISOString() },
  { id: 't2', title: 'Update Wintel Patching Schedule', description: 'Coordinate with business units for next maintenance window', assignee: 'Wintel Admin', status: 'In Progress', priority: 'Medium', createdAt: new Date().toISOString() },
  { id: 't3', title: 'Audit VM Guest Access Logs', description: 'Quarterly compliance check', assignee: 'Security Lead', status: 'Completed', priority: 'High', createdAt: new Date().toISOString() },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', type: 'error', message: 'Connection timeout: LDAP Server #2', source: 'AuthService', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'l2', type: 'warning', message: 'High latency detected in Layout 3 rendering', source: 'Frontend', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'l3', type: 'feedback', message: 'Dark mode contrast needs improvement on reports page', source: 'User Feedback', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'l4', type: 'info', message: 'Shift Roster synced successfully', source: 'IntegrationService', timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
];

export const MOCK_INTEGRATIONS: IntegrationConfig[] = [
  { id: 'i1', name: 'ServiceNow ITSM', type: 'API', status: 'Connected', lastSync: '10 mins ago' },
  { id: 'i2', name: 'Active Directory (EMEA)', type: 'OAUTH', status: 'Connected', lastSync: '1 min ago' },
  { id: 'i3', name: 'Splunk Logging', type: 'API', status: 'Error', lastSync: '2 days ago' },
  { id: 'i4', name: 'Legacy HR ODBC', type: 'ODBC', status: 'Disconnected', lastSync: 'Never' },
];
