import React from 'react';
import { TopTab } from '../types';
import { TOP_TABS } from '../constants';
import { Moon, Sun, Monitor } from 'lucide-react';

interface TopNavProps {
  activeTab: TopTab;
  onTabChange: (tab: TopTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, onTabChange, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      {/* Brand & Title */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-600 rounded-lg text-white">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Platform Service</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Welcome to the Home of Platform Services</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Horizontal Tabs */}
      <nav className="flex overflow-x-auto px-4 pb-0 hide-scrollbar border-t border-gray-100 dark:border-slate-800">
        <div className="flex space-x-1 min-w-max">
          {TOP_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`
                  relative px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-t-lg
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800 border-b-2 border-primary-600 dark:border-primary-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
