
import React, { useState, useRef, useEffect } from 'react';
import { TopTab, ServiceCategoryId } from '../types';
import { NAV_MENU_ITEMS, SERVICE_CATEGORIES } from '../constants';
import { Moon, Sun, Monitor, Search, X, ChevronDown, LogOut, ChevronRight, Bell, Settings } from 'lucide-react';
import { HighlightedText } from './LayoutComponents';
import { useAuth, useAudit, useAppState, useNotification } from '../context';

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // State for tracking which dropdown is open (by label)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const { openAdminConsole } = useAppState();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const { logAction } = useAudit();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenDropdown(null);
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

  const handleResultClick = (subId: string, categoryId: ServiceCategoryId, name: string) => {
    if (onSearchSelect) {
      logAction('Search Selection', `User searched for "${searchQuery}" and selected "${name}"`);
      onSearchSelect(subId, categoryId);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const toggleNotif = () => {
    if (!isNotifOpen) markAllAsRead();
    setIsNotifOpen(!isNotifOpen);
  };

  // Fuzzy Search Logic
  const getFilteredItems = () => {
    if (!searchQuery.trim()) return [];
    const queryTerms = searchQuery.toLowerCase().split(' ').filter(t => t);
    return SERVICE_CATEGORIES.flatMap(category => 
      category.subServices.map(sub => ({
        ...sub,
        categoryTitle: category.title,
        categoryId: category.id
      }))
    ).filter(item => {
      const itemText = `${item.name} ${item.categoryTitle}`.toLowerCase();
      return queryTerms.every(term => itemText.includes(term));
    });
  };

  const filteredItems = getFilteredItems();

  const handleNavClick = (view?: TopTab) => {
    if (view) {
      onTabChange(view);
      logAction('Navigation', `User navigated to ${view} tab`);
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => prev === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      {/* Top Bar */}
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
              placeholder="Search services (e.g., 'unix l2', 'build')"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Search Dropdown omitted for brevity, logic remains same as before */}
           {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredItems.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto custom-scrollbar py-2">
                  <li className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between">
                    <span>Services Found</span>
                    <span className="text-primary-500">{filteredItems.length} results</span>
                  </li>
                  {filteredItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleResultClick(item.id, item.categoryId, item.name)}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
                            <HighlightedText text={item.name} highlight={searchQuery} />
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.categoryTitle}</p>
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

        {/* Right Section */}
        <div className="flex justify-end w-1/4 items-center space-x-3">
          
          {/* Settings (Admin Only) */}
          {user?.role === 'Admin' && (
            <button 
              onClick={openAdminConsole}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors relative group"
              title="Admin Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={toggleNotif}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              )}
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-sm font-bold">Notifications</h3>
                  <button onClick={markAllAsRead} className="text-xs text-primary-600 hover:text-primary-800">Clear all</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                         <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                         <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>

          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
            >
              <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav 
        className="flex overflow-visible px-4 pb-0 border-t border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
        ref={navRef}
      >
        <div className="flex space-x-1 min-w-max">
          {NAV_MENU_ITEMS.map((item) => {
            const isChildActive = item.children?.includes(activeTab as any); // Cast for flexibility
            const isActive = item.view === activeTab || isChildActive;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;

            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => hasChildren ? toggleDropdown(item.label) : handleNavClick(item.view)}
                  className={`
                    relative px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap outline-none flex items-center
                    ${isActive 
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {hasChildren && isOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    {item.children!.map((childTab) => (
                      <button
                        key={childTab}
                        onClick={() => handleNavClick(childTab as TopTab)}
                        className={`
                          w-full text-left px-4 py-2 text-sm flex items-center justify-between
                          ${activeTab === childTab 
                            ? 'bg-primary-50 dark:bg-slate-700 text-primary-700 dark:text-primary-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}
                        `}
                      >
                        {childTab}
                        {activeTab === childTab && <ChevronRight className="w-3 h-3 ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
