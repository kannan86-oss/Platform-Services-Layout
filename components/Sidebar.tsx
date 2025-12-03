import React from 'react';
import { ServiceCategory, ServiceCategoryId } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import { ChevronDown, ChevronRight, Server, Layers, Box, Cpu } from 'lucide-react';

interface SidebarProps {
  expandedCategoryId: ServiceCategoryId | null;
  activeSubServiceId: string | null;
  onToggleCategory: (id: ServiceCategoryId) => void;
  onSelectSubService: (id: string, categoryId: ServiceCategoryId) => void;
}

const CategoryIcon = ({ id }: { id: string }) => {
  switch (id) {
    case 'sa_l3': return <Server className="w-5 h-5" />;
    case 'platform_l2': return <Layers className="w-5 h-5" />;
    case 'build_delivery': return <Box className="w-5 h-5" />;
    case 'virtualization': return <Cpu className="w-5 h-5" />;
    default: return <Server className="w-5 h-5" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  expandedCategoryId, 
  activeSubServiceId, 
  onToggleCategory, 
  onSelectSubService 
}) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar sticky top-[130px]">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Service Catalog
        </h2>
        <div className="space-y-2">
          {SERVICE_CATEGORIES.map((category) => {
            const isExpanded = expandedCategoryId === category.id;
            
            return (
              <div key={category.id} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => onToggleCategory(category.id)}
                  className={`
                    w-full flex items-center justify-between p-3 text-sm font-medium transition-colors duration-200
                    ${isExpanded 
                      ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <CategoryIcon id={category.id} />
                    <span>{category.title}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Sub Services (Accordion Body) */}
                <div 
                  className={`
                    bg-gray-50 dark:bg-slate-900/50 transition-all duration-300 ease-in-out overflow-hidden
                    ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-3 py-2 space-y-1">
                    {category.subServices.map((sub) => {
                      const isActive = activeSubServiceId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelectSubService(sub.id, category.id)}
                          className={`
                            w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors
                            ${isActive 
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'}
                          `}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'}`}></span>
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
