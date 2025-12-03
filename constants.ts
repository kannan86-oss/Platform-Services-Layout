import { ServiceCategory, TopTab, TeamData, ServiceDetailData, Employee } from './types';

export const TOP_TABS: TopTab[] = [
  'Home', 'Team details', 'SOW', 'Shift Tracker', 'Leave Tracker', 
  'MOR Report', 'Escalation', 'NEMS', 'Training', 'Certification', 'Audit', 'Reports'
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
