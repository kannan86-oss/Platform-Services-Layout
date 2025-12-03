import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, icon: Icon, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-6 ${className}`}>
    <div className="flex items-center space-x-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-600 dark:text-primary-500" />}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
    <div className="text-gray-600 dark:text-gray-300">
      {children}
    </div>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
    {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles = status === 'Active' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};
