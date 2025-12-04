
import React, { useState } from 'react';
import { useAppState, useAuth, useAudit } from '../context';
import { X, Users, ShieldAlert, Activity, Plug, Bell, Lock } from 'lucide-react';
import { MOCK_INTEGRATIONS } from '../constants';

export const AdminConsole: React.FC = () => {
  const { closeAdminConsole, systemLogs } = useAppState();
  const { usersList, updateUserRole } = useAuth();
  const { logs } = useAudit();
  
  const [activeTab, setActiveTab] = useState<'RBAC' | 'Audit' | 'Logs' | 'Integration' | 'Notification'>('RBAC');

  // RBAC Tab
  const renderRBAC = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Role-Based Access Control</h3>
        <button className="text-sm bg-primary-600 text-white px-3 py-1 rounded">Add User to Domain</button>
      </div>
      <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
           <thead className="bg-gray-50 dark:bg-slate-800">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
             </tr>
           </thead>
           <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
             {usersList.map(u => (
               <tr key={u.id}>
                 <td className="px-6 py-4 flex items-center">
                   <img src={u.avatar} className="w-8 h-8 rounded-full mr-3" alt="" />
                   <span className="font-medium">{u.name}</span>
                 </td>
                 <td className="px-6 py-4 text-gray-500">{u.email}</td>
                 <td className="px-6 py-4">
                   <select 
                     value={u.role} 
                     onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                     className="bg-gray-100 dark:bg-slate-800 border-none rounded text-sm px-2 py-1"
                   >
                     <option value="Admin">Admin</option>
                     <option value="Editor">Editor</option>
                     <option value="Viewer">Viewer</option>
                   </select>
                 </td>
                 <td className="px-6 py-4 text-right">
                   <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded text-sm text-yellow-800 dark:text-yellow-200">
        <Lock className="w-4 h-4 inline mr-2" />
        Synchronization with Active Directory server is scheduled every 24 hours.
      </div>
    </div>
  );

  // Audit Tab
  const renderAudit = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Admin Audit Trail</h3>
      <div className="overflow-hidden border border-gray-200 dark:border-slate-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td className="px-6 py-4 text-sm font-medium">{log.userName}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs ${log.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Logs Tab
  const renderLogs = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">System Logs & Feedback</h3>
      <div className="space-y-2">
        {systemLogs.map(log => (
          <div key={log.id} className="flex items-start p-3 bg-gray-50 dark:bg-slate-800 rounded border-l-4 border-gray-300 dark:border-slate-600">
            <div className={`mr-3 mt-1 
              ${log.type === 'error' ? 'text-red-500' : ''}
              ${log.type === 'warning' ? 'text-yellow-500' : ''}
              ${log.type === 'info' ? 'text-blue-500' : ''}
              ${log.type === 'feedback' ? 'text-green-500' : ''}
            `}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-semibold text-sm uppercase">{log.type}</span>
                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm font-medium">{log.message}</p>
              <p className="text-xs text-gray-500 mt-1">Source: {log.source}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Integration Tab
  const renderIntegration = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">External Integrations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_INTEGRATIONS.map(int => (
          <div key={int.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg flex justify-between items-center bg-white dark:bg-slate-800">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full mr-3">
                <Plug className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="font-semibold">{int.name}</h4>
                <p className="text-xs text-gray-500">{int.type} • {int.lastSync}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-bold 
              ${int.status === 'Connected' ? 'bg-green-100 text-green-800' : ''}
              ${int.status === 'Error' ? 'bg-red-100 text-red-800' : ''}
              ${int.status === 'Disconnected' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
              {int.status}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
         <h4 className="font-semibold mb-2">Add New Integration</h4>
         <div className="flex space-x-2">
           <input type="text" placeholder="API Endpoint / Connection String" className="flex-1 border p-2 rounded text-sm dark:bg-slate-700 dark:border-slate-600" />
           <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm">Connect</button>
         </div>
      </div>
    </div>
  );

  // Notification Tab
  const renderNotification = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Global Notification Settings</h3>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <label className="flex items-center justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">System Downtime Alerts</span>
          <input type="checkbox" checked className="toggle" />
        </label>
        <label className="flex items-center justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">New Feature Announcements</span>
          <input type="checkbox" checked className="toggle" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">RBAC Change Warnings</span>
          <input type="checkbox" className="toggle" />
        </label>
      </div>
      
      <h4 className="font-bold mt-6">Broadcast Message</h4>
      <textarea className="w-full border p-2 rounded h-24 dark:bg-slate-700 dark:border-slate-600" placeholder="Type a message to send to all online users..."></textarea>
      <div className="flex justify-end mt-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Send Broadcast</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight">Admin Console</h2>
          </div>
          <button onClick={closeAdminConsole} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
            <nav className="flex-1 p-4 space-y-1">
              {[
                { id: 'RBAC', icon: Users, label: 'RBAC & Users' },
                { id: 'Audit', icon: ShieldAlert, label: 'Audit Trail' },
                { id: 'Logs', icon: Activity, label: 'System Logs' },
                { id: 'Integration', icon: Plug, label: 'Integrations' },
                { id: 'Notification', icon: Bell, label: 'Notifications' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${activeTab === item.id 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
               <div className="text-xs text-gray-500 text-center">Platform Services v2.1.0</div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900">
            {activeTab === 'RBAC' && renderRBAC()}
            {activeTab === 'Audit' && renderAudit()}
            {activeTab === 'Logs' && renderLogs()}
            {activeTab === 'Integration' && renderIntegration()}
            {activeTab === 'Notification' && renderNotification()}
          </main>
        </div>
      </div>
    </div>
  );
};
