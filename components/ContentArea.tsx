
import React, { useState } from 'react';
import { TopTab, ServiceCategoryId, ServiceDocument } from '../types';
import { SERVICE_CATEGORIES, MOCK_TEAM_DATA, MOCK_HOME_DATA } from '../constants';
import { Card, SectionHeader, Badge } from './LayoutComponents';
import { Users, UserCheck, Calendar, Award, AlertCircle, FileText, ClipboardList, Plus, Clock, CheckCircle2, Link as LinkIcon, File, Globe, MapPin, Building } from 'lucide-react';
import { useAuth, useTasks, useNotification, useData } from '../context';

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
  
  const { user } = useAuth();
  const { tasks, addTask, updateTaskStatus } = useTasks();
  const { addNotification } = useNotification();
  const { events, addEvent, documents, addDocument, links, addLink } = useData();
  
  const activeCategory = SERVICE_CATEGORIES.find(c => c.id === categoryId);
  const activeSubService = activeCategory?.subServices.find(s => s.id === activeSubServiceId);

  // New Task Form State
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low'|'Medium'|'High'>('Medium');

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', schedule: '', venue: '', activityType: 'In Campus' as const, services: [] as string[] });

  // New Document/URL Form State
  const [showDocForm, setShowDocForm] = useState(false);
  const [docForm, setDocForm] = useState({ type: 'Document' as 'Document'|'URL', name: '', url: '' });

  // New Link Form State
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkForm, setLinkForm] = useState({ name: '', url: '', services: [] as string[] });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newTaskTitle) return;
    addTask(newTaskTitle, newTaskDesc, newTaskPriority);
    setShowTaskForm(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      name: eventForm.name,
      schedule: eventForm.schedule,
      venue: eventForm.venue,
      activityType: eventForm.activityType,
      services: eventForm.services
    });
    setShowEventForm(false);
    setEventForm({ name: '', schedule: '', venue: '', activityType: 'In Campus', services: [] });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubServiceId) return;
    
    // Determine category based on current tab
    let cat: 'Audit' | 'Documentation' = 'Audit';
    let subCat = undefined;

    if (topTab === 'Audit Trails') {
      cat = 'Audit';
    } else if (topTab === 'Documentation' || ['SOPs', 'Onboarding', 'KT documents', 'Induction (NGAs)'].includes(topTab)) {
      cat = 'Documentation';
      if (topTab !== 'Documentation') subCat = topTab;
    }

    addDocument({
      type: docForm.type,
      name: docForm.name,
      url: docForm.url,
      category: cat,
      subCategory: subCat,
      serviceId: activeSubServiceId
    });
    setShowDocForm(false);
    setDocForm({ type: 'Document', name: '', url: '' });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    addLink(linkForm);
    setShowLinkForm(false);
    setLinkForm({ name: '', url: '', services: [] });
  };

  // Helper for multi-select services
  const toggleServiceSelection = (serviceId: string, currentList: string[], setter: any) => {
    if (currentList.includes(serviceId)) {
      setter({ ...setter === setEventForm ? eventForm : linkForm, services: currentList.filter(id => id !== serviceId) });
    } else {
      setter({ ...setter === setEventForm ? eventForm : linkForm, services: [...currentList, serviceId] });
    }
  };

  const getAllSubServices = () => SERVICE_CATEGORIES.flatMap(c => c.subServices);

  // --- Independent Views (No Sidebar Required) ---

  if (topTab === 'Team Events') {
    return (
      <div className="flex-1 p-8 h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
             <SectionHeader title="Team Events" subtitle="Internal events, workshops, and gatherings" />
             <button onClick={() => setShowEventForm(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg">
               <Plus className="w-5 h-5 mr-2" /> New Event
             </button>
          </div>

          {showEventForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-primary-100 dark:border-slate-600 mb-6 animate-slide-in">
              <h4 className="font-bold text-lg mb-4">Add New Event</h4>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name</label>
                    <input required type="text" value={eventForm.name} onChange={e => setEventForm({...eventForm, name: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Schedule</label>
                    <input required type="datetime-local" value={eventForm.schedule} onChange={e => setEventForm({...eventForm, schedule: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Venue</label>
                    <input required type="text" value={eventForm.venue} onChange={e => setEventForm({...eventForm, venue: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Activity Type</label>
                    <select value={eventForm.activityType} onChange={e => setEventForm({...eventForm, activityType: e.target.value as any})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600">
                      <option>In Campus</option>
                      <option>Out of Campus</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-2">Services Involved (Select multiple)</label>
                   <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded dark:border-slate-600">
                      {getAllSubServices().map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleServiceSelection(sub.id, eventForm.services, setEventForm)}
                          className={`px-3 py-1 rounded-full text-xs border ${eventForm.services.includes(sub.id) ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowEventForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Add Event</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {events.map(ev => (
               <div key={ev.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-slate-700">
                 <div className="p-1 bg-primary-500"></div>
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl">{ev.name}</h3>
                      <Badge status={ev.activityType === 'In Campus' ? 'success' : 'warning'} />
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                       <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(ev.schedule).toLocaleString()}</div>
                       <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {ev.venue}</div>
                       <div className="flex items-center"><Building className="w-4 h-4 mr-2" /> {ev.activityType}</div>
                       <div className="flex items-center flex-wrap gap-1 mt-2">
                         <Users className="w-4 h-4 mr-2" /> 
                         {ev.services.length > 0 ? ev.services.map(sid => {
                           const s = getAllSubServices().find(x => x.id === sid);
                           return <span key={sid} className="text-xs bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{s?.name}</span>
                         }) : 'All Services'}
                       </div>
                    </div>
                 </div>
                 <div className="px-6 py-3 bg-gray-50 dark:bg-slate-700/30 text-xs text-gray-500 flex justify-between">
                    <span>Organizer: {ev.createdBy}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  if (topTab === 'Links') {
    return (
      <div className="flex-1 p-8 h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
             <SectionHeader title="Centralized Links" subtitle="Quick access to external portals and tools" />
             <button onClick={() => setShowLinkForm(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg">
               <Plus className="w-5 h-5 mr-2" /> Add Link
             </button>
          </div>

          {showLinkForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-primary-100 dark:border-slate-600 mb-6 animate-slide-in">
              <h4 className="font-bold text-lg mb-4">Add New Link</h4>
              <form onSubmit={handleAddLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input required type="text" value={linkForm.name} onChange={e => setLinkForm({...linkForm, name: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input required type="url" value={linkForm.url} onChange={e => setLinkForm({...linkForm, url: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-2">Applicable Services (Select multiple)</label>
                   <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded dark:border-slate-600">
                      {getAllSubServices().map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleServiceSelection(sub.id, linkForm.services, setLinkForm)}
                          className={`px-3 py-1 rounded-full text-xs border ${linkForm.services.includes(sub.id) ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowLinkForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save Link</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {links.map(link => (
               <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.id} className="group bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md hover:border-primary-500 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Globe className="w-6 h-6 text-primary-500" />
                    <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{link.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {link.services.length > 0 ? link.services.slice(0, 3).map(sid => (
                       <span key={sid} className="text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                         {getAllSubServices().find(x => x.id === sid)?.name}
                       </span>
                    )) : <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">All Services</span>}
                    {link.services.length > 3 && <span className="text-[10px] text-gray-400">+{link.services.length - 3}</span>}
                  </div>
               </a>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Views requiring Sidebar ---

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
          {topTab} - {activeSubService.name}
        </p>
      </div>

      <div className="flex space-x-4 mt-6 overflow-x-auto pb-2">
        {activeCategory.subServices.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSubServiceChange(sub.id)}
            className={`
              px-6 py-2.5 rounded-full text-sm font-medium transition-all transform duration-200 whitespace-nowrap
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
    const teamData = MOCK_TEAM_DATA[activeSubService.id] || MOCK_TEAM_DATA['unix_l3'];
    
    // Filter docs for current service and tab type
    const isAudit = topTab === 'Audit Trails';
    const isDocs = topTab === 'Documentation' || ['SOPs', 'Onboarding', 'KT documents', 'Induction (NGAs)'].includes(topTab);
    const docCategory = isAudit ? 'Audit' : 'Documentation';
    const subCatFilter = (isDocs && topTab !== 'Documentation') ? topTab : undefined;

    const filteredDocs = documents.filter(d => 
      d.serviceId === activeSubService.id && 
      d.category === docCategory && 
      (!subCatFilter || d.subCategory === subCatFilter) &&
      d.type === 'Document'
    );

    const filteredUrls = documents.filter(d => 
      d.serviceId === activeSubService.id && 
      d.category === docCategory && 
      (!subCatFilter || d.subCategory === subCatFilter) &&
      d.type === 'URL'
    );

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
                          <td className="px-6 py-4"><span className="inline-block bg-gray-100 dark:bg-slate-600 rounded px-2 py-1 text-xs font-mono">{emp.region}</span></td>
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
                      <div className="flex justify-between items-center"><span>Morning Shift</span><span className="font-bold text-green-600">8/8</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-green-600 h-2.5 rounded-full" style={{width: '100%'}}></div></div>
                      <div className="flex justify-between items-center mt-4"><span>Afternoon Shift</span><span className="font-bold text-yellow-600">7/8</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-yellow-600 h-2.5 rounded-full" style={{width: '85%'}}></div></div>
                       <div className="flex justify-between items-center mt-4"><span>Night Shift</span><span className="font-bold text-blue-600">8/8</span></div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"><div className="bg-blue-600 h-2.5 rounded-full" style={{width: '100%'}}></div></div>
                    </div>
                  </Card>
               </div>
             </div>
           </div>
        );

      case 'Escalation':
        return (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader title="Escalation & Tasks" subtitle="Manage incidents and operational tasks" />
              <button onClick={() => setShowTaskForm(true)} className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm">
                <Plus className="w-5 h-5 mr-2" /> New Task
              </button>
            </div>
            {showTaskForm && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-primary-100 dark:border-slate-600 mb-6 animate-slide-in">
                <h4 className="font-bold text-lg mb-4">Create New Task</h4>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div><label className="block text-sm font-medium mb-1">Title</label><input autoFocus type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" required /></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><input type="text" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" /></div>
                  <div><label className="block text-sm font-medium mb-1">Priority</label><select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600"><option>Low</option><option>Medium</option><option>High</option></select></div>
                  <div className="flex justify-end space-x-3"><button type="button" onClick={() => setShowTaskForm(false)} className="px-4 py-2 text-gray-500">Cancel</button><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Create</button></div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Pending', 'In Progress', 'Completed'] as const).map(status => (
                <div key={status} className="bg-gray-100 dark:bg-slate-800/50 rounded-xl p-4 min-h-[400px]">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-between">{status}<span className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-full text-xs">{tasks.filter(t => t.status === status).length}</span></h3>
                  <div className="space-y-3">
                    {tasks.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2"><Badge status={task.priority} /><span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span></div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                          <div className="flex items-center text-xs text-gray-500"><Users className="w-3 h-3 mr-1" /> {task.assignee}</div>
                          <div className="flex space-x-1">
                            {status !== 'Pending' && <button onClick={() => updateTaskStatus(task.id, status === 'Completed' ? 'In Progress' : 'Pending')} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><Clock className="w-4 h-4 text-gray-400" /></button>}
                            {status !== 'Completed' && <button onClick={() => updateTaskStatus(task.id, status === 'Pending' ? 'In Progress' : 'Completed')} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /></button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Audit & Documentation Cases
      case 'Audit Trails':
      case 'Documentation':
      case 'SOPs':
      case 'Onboarding':
      case 'KT documents':
      case 'Induction (NGAs)':
        return (
           <div className="animate-fade-in space-y-8">
             <div className="flex justify-between items-center">
                <SectionHeader 
                  title={isAudit ? 'Audit Evidence & Trails' : `Documentation: ${topTab === 'Documentation' ? 'General' : topTab}`} 
                  subtitle={`Repository for ${activeSubService.name}`} 
                />
                <div className="flex space-x-3">
                  <button onClick={() => { setShowDocForm(true); setDocForm(prev => ({...prev, type: 'URL'})); }} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-slate-800">
                    <LinkIcon className="w-4 h-4 mr-2" /> Add URL
                  </button>
                  <button onClick={() => { setShowDocForm(true); setDocForm(prev => ({...prev, type: 'Document'})); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Document
                  </button>
                </div>
             </div>

             {showDocForm && (
               <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-primary-100 dark:border-slate-600 animate-slide-in">
                 <h4 className="font-bold mb-4">Add {docForm.type}</h4>
                 <form onSubmit={handleAddDoc} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">Name / Description</label>
                      <input required type="text" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">{docForm.type === 'URL' ? 'Link Address' : 'File Name (Mock)'}</label>
                      <input required type={docForm.type === 'URL' ? 'url' : 'text'} value={docForm.url} onChange={e => setDocForm({...docForm, url: e.target.value})} className="w-full p-2 rounded border dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
                    <button type="button" onClick={() => setShowDocForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                 </form>
               </div>
             )}

             <div className="grid grid-cols-1 gap-8">
               {/* Documents Section */}
               <Card title="Uploaded Documents" icon={File}>
                 {filteredDocs.length === 0 ? <p className="text-gray-500 italic">No documents available.</p> : (
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                       <thead><tr className="border-b dark:border-slate-700 text-gray-500"><th className="pb-2">Name</th><th className="pb-2">Uploaded By</th><th className="pb-2">Date</th><th className="pb-2 text-right">Action</th></tr></thead>
                       <tbody>
                         {filteredDocs.map(d => (
                           <tr key={d.id} className="border-b dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800">
                             <td className="py-3 flex items-center font-medium"><FileText className="w-4 h-4 mr-2 text-blue-500" /> {d.name}</td>
                             <td className="py-3 text-gray-500">{d.uploadedBy}</td>
                             <td className="py-3 text-gray-500">{new Date(d.date).toLocaleDateString()}</td>
                             <td className="py-3 text-right"><a href="#" className="text-primary-600 hover:underline">Download</a></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
               </Card>

               {/* URLs Section */}
               <Card title="External Links & References" icon={LinkIcon}>
                 {filteredUrls.length === 0 ? <p className="text-gray-500 italic">No links available.</p> : (
                   <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                       <thead><tr className="border-b dark:border-slate-700 text-gray-500"><th className="pb-2">Title</th><th className="pb-2">Added By</th><th className="pb-2">Date</th><th className="pb-2 text-right">Action</th></tr></thead>
                       <tbody>
                         {filteredUrls.map(d => (
                           <tr key={d.id} className="border-b dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800">
                             <td className="py-3 flex items-center font-medium"><Globe className="w-4 h-4 mr-2 text-green-500" /> {d.name}</td>
                             <td className="py-3 text-gray-500">{d.uploadedBy}</td>
                             <td className="py-3 text-gray-500">{new Date(d.date).toLocaleDateString()}</td>
                             <td className="py-3 text-right"><a href={d.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Open Link</a></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
               </Card>
             </div>
           </div>
        );

      case 'MOR Report':
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 animate-fade-in">
             <AlertCircle className="w-12 h-12 text-purple-400 mb-4" />
             <h3 className="text-xl font-medium text-gray-900 dark:text-white">Monthly Operational Review</h3>
             <p className="text-gray-500 mt-2">Generate MOR reports for {activeSubService.name}</p>
             <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">Generate Report</button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 animate-fade-in">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{topTab} Module</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center">
              This module for <strong>{activeSubService.name}</strong> is currently under development.
            </p>
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
