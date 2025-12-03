import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { TopTab, ServiceCategoryId } from './types';
import { SERVICE_CATEGORIES } from './constants';

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage or System Preference
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Navigation State
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('Home');
  const [expandedCategoryId, setExpandedCategoryId] = useState<ServiceCategoryId | null>('sa_l3');
  const [activeSubServiceId, setActiveSubServiceId] = useState<string | null>('unix_l3');

  // Theme Toggle Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Handlers
  const handleCategoryToggle = (id: ServiceCategoryId) => {
    setExpandedCategoryId(prev => prev === id ? null : id);
  };

  const handleSubServiceSelect = (subId: string, categoryId: ServiceCategoryId) => {
    setActiveSubServiceId(subId);
    // Ensure category remains open/synced (though the UI implies it is already open if clicking sub)
    if (expandedCategoryId !== categoryId) {
        setExpandedCategoryId(categoryId);
    }
  };

  // Only switching sub-service within the active category view (Layout 2)
  const handleLayout2Switch = (subId: string) => {
    setActiveSubServiceId(subId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-200 font-sans text-gray-900 dark:text-gray-100">
      
      {/* Top Navigation */}
      <TopNav 
        activeTab={activeTopTab} 
        onTabChange={setActiveTopTab} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Layout 1: Sidebar */}
        <Sidebar 
          expandedCategoryId={expandedCategoryId}
          activeSubServiceId={activeSubServiceId}
          onToggleCategory={handleCategoryToggle}
          onSelectSubService={handleSubServiceSelect}
        />

        {/* Layout 2 & 3: Content */}
        <ContentArea 
          topTab={activeTopTab}
          categoryId={expandedCategoryId} // Pass current expanded category as context context
          activeSubServiceId={activeSubServiceId}
          onSubServiceChange={handleLayout2Switch}
        />
        
      </div>
    </div>
  );
};

export default App;
