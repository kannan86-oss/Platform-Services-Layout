import React from 'react';
import { TopTab, ServiceCategoryId, SubService } from '../types';
import { SERVICE_CATEGORIES, MOCK_TEAM_DATA, MOCK_HOME_DATA } from '../constants';
import { Card, SectionHeader, Badge } from './LayoutComponents';
import { Users, UserCheck, Calendar, Award, AlertCircle, FileText, ClipboardList } from 'lucide-react';

interface ContentAreaProps {
  topTab: TopTab;
  categoryId: ServiceCategoryId | null;
  activeSubServiceId: string | null;
  onSubServiceChange: (id: string) => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ 
  topTab, 
  categoryId, 
  activeSubServiceId,
  onSubServiceChange
}) => {
  
  const activeCategory = SERVICE_CATEGORIES.find(c => c.id === categoryId);
  const activeSubService = activeCategory?.subServices.find(s => s.id === activeSubServiceId);

  // If no category selected, show a welcome state
  if (!activeCategory || !activeSubService) {
    return (
      <div className="flex-1 p-10 flex flex-col items-center justify-center text-center h-full">
        <div className="p-6 bg-blue-50 dark:bg-slate-800 rounded-full mb-6 animate-bounce">
          <ClipboardList className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a Service</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Please select a service category from the sidebar to view details, team members, and reports.
        </p>
      </div>
    );
  }

  // --- Layout 2: Horizontal Sub-service tabs ---
  const renderLayout2 = () => (
    <div className="mb-8 border-b border-gray-200 dark:border-slate-700 pb-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
           {activeCategory.title}
        </h3>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome to {activeSubService.name}
        </p>
      </div>

      <div className="flex space-x-4 mt-6">
        {activeCategory.subServices.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSubServiceChange(sub.id)}
            className={`
              px-6 py-2.5 rounded-full text-sm font-medium transition-all transform duration-200
              ${activeSubServiceId === sub.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'}
            `}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );

  // --- Layout 3: Content based on Top Tab ---
  const renderLayout3 = () => {
    const detailData = MOCK_HOME_DATA[activeSubService.id] || MOCK_HOME_DATA['default'];
    const teamData = MOCK_TEAM_DATA[activeSubService.id] || MOCK_TEAM_DATA['unix_l3']; // Fallback

    switch (topTab) {
      case 'Home':
        return (
          <div className="animate-fade-in space-y-6">
            <SectionHeader title="Service Overview" subtitle="Key metrics and service description" />
            
            <Card title="About the Service" icon={FileText}>
              <p className="leading-relaxed text-lg">{detailData.description}</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Recent Achievements" icon={Award}>
                <ul className="space-y-3">
                  {detailData.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Upcoming Events" icon={Calendar}>
                <ul className="space-y-3">
                  {detailData.upcomingEvents.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        );

      case 'Team details':
        return (
          <div className="animate-fade-in space-y-8">
             <SectionHeader title="Team Structure" subtitle="Managerial hierarchy and staff allocation" />
             
             {/* Managers Section */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <h4 className="text-blue-100 text-sm font-semibold uppercase mb-2">L1 Manager</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">L1</div>
                    <span className="text-xl font-bold">{teamData.managers.l1}</span>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                  <h4 className="text-indigo-100 text-sm font-semibold uppercase mb-2">L2 Manager</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">L2</div>
                    <span className="text-xl font-bold">{teamData.managers.l2}</span>
                  </div>
               </div>
               <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <h4 className="text-purple-100 text-sm font-semibold uppercase mb-2">L3 Manager</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">L3</div>
                    <span className="text-xl font-bold">{teamData.managers.l3}</span>
                  </div>
               </div>
             </div>

             {/* Employees Table */}
             <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" /> Employee Roster
                  </h3>
                  <span className="text-sm text-gray-500">{teamData.employees.length} Members</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-slate-700 text-xs uppercase text-gray-500 dark:text-gray-300">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Name</th>
                        <th className="px-6 py-3 font-semibold">Role</th>
                        <th className="px-6 py-3 font-semibold">Region</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {teamData.employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{emp.name}</td>
                          <td className="px-6 py-4">{emp.role}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block bg-gray-100 dark:bg-slate-600 rounded px-2 py-1 text-xs font-mono">
                              {emp.region}
                            </span>
                          </td>
                          <td className="px-6 py-4"><Badge status={emp.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );

      case 'Shift Tracker':
        return (
           <div className="space-y-6 animate-fade-in">
             <SectionHeader title="Shift Management" subtitle="Current roster and upcoming rotations" />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2">
                 <Card title="Weekly Roster" icon={Calendar}>
                   <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded border border-dashed border-gray-300 dark:border-slate-600">
                     <p className="text-gray-500 italic">Shift Roster Calendar View Placeholder</p>
                   </div>
                 </Card>
               </div>
               <div>
                  <Card title="Shift Stats" icon={UserCheck}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Morning Shift</span>
                        <span className="font-bold text-green-600">8/8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span>Afternoon Shift</span>
                        <span className="font-bold text-yellow-600">7/8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
                      </div>

                       <div className="flex justify-between items-center mt-4">
                        <span>Night Shift</span>
                        <span className="font-bold text-blue-600">8/8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </Card>
               </div>
             </div>
           </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 animate-fade-in">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{topTab} Module</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center">
              This module for <strong>{activeSubService.name}</strong> is currently under development or maintenance.
            </p>
            <button className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              View Documentation
            </button>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 p-8 h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto pb-20">
        {renderLayout2()}
        {renderLayout3()}
      </div>
    </main>
  );
};
