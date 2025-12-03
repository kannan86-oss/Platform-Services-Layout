import React, { useState, useRef, useEffect } from 'react';
import { TopTab, ServiceCategoryId } from '../types';
import { TOP_TABS, SERVICE_CATEGORIES } from '../constants';
import { Moon, Sun, Monitor, Search, X } from 'lucide-react';

interface TopNavProps {
  activeTab: TopTab;
  onTabChange: (tab: TopTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onSearchSelect?: (subId: string, categoryId: ServiceCategoryId) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  activeTab, 
  onTabChange, 
  isDark, 
  toggleTheme,
  onSearchSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  const handleResultClick = (subId: string, categoryId: ServiceCategoryId) => {
    if (onSearchSelect) {
      onSearchSelect(subId, categoryId);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Filter items based on search query
  const filteredItems = searchQuery.trim() === '' 
    ? [] 
    : SERVICE_CATEGORIES.flatMap(category => 
        category.subServices
          .filter(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(sub => ({
            ...sub,
            categoryTitle: category.title,
            categoryId: category.id
          }))
      );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      {/* Top Bar: Brand, Search, Theme */}
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 w-1/4 min-w-fit">
          <div className="p-2 bg-primary-600 rounded-lg text-white shadow-md">
            <Monitor className="w-6 h-6" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Platform Service</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Welcome to the Home of Platform Services</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl px-4 relative" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl leading-5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
              placeholder="Search for services, teams, or modules..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredItems.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto custom-scrollbar py-2">
                  <li className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Services Found
                  </li>
                  {filteredItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleResultClick(item.id, item.categoryId)}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.categoryTitle}
                          </p>
                        </div>
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No services found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-end w-1/4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <nav className="flex overflow-x-auto px-4 pb-0 hide-scrollbar border-t border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex space-x-1 min-w-max">
          {TOP_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`
                  relative px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'}
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