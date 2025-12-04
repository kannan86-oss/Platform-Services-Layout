
import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { TopTab, ServiceCategoryId } from './types';
import { ToastContainer } from './components/LayoutComponents';
import { AppProvider, useAuth, useAppState } from './context';
import { LoginScreen } from './components/LoginScreen';
import { AdminConsole } from './components/AdminConsole';

// Inner App Component to access context
const PlatformServicesApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isAdminConsoleOpen } = useAppState();

  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
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
    if (expandedCategoryId !== categoryId) {
        setExpandedCategoryId(categoryId);
    }
  };

  const handleLayout2Switch = (subId: string) => {
    setActiveSubServiceId(subId);
  };
  
  const handleSearchNavigation = (subId: string, categoryId: ServiceCategoryId) => {
    setActiveSubServiceId(subId);
    setExpandedCategoryId(categoryId);
  };

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className="text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
        <LoginScreen />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-200 font-sans text-gray-900 dark:text-gray-100">
      
      <TopNav 
        activeTab={activeTopTab} 
        onTabChange={setActiveTopTab} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onSearchSelect={handleSearchNavigation}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          expandedCategoryId={expandedCategoryId}
          activeSubServiceId={activeSubServiceId}
          onToggleCategory={handleCategoryToggle}
          onSelectSubService={handleSubServiceSelect}
        />

        <ContentArea 
          topTab={activeTopTab}
          categoryId={expandedCategoryId}
          activeSubServiceId={activeSubServiceId}
          onSubServiceChange={handleLayout2Switch}
        />
      </div>

      {isAdminConsoleOpen && <AdminConsole />}
      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <PlatformServicesApp />
    </AppProvider>
  );
};

export default App;
