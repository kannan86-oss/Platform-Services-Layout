import React from 'react';
import { LucideIcon, X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useNotification } from '../context';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, icon: Icon, className = "", action }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-5 h-5 text-primary-600 dark:text-primary-500" />}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      {action && <div>{action}</div>}
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
  let styles = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  
  switch(status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      styles = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      break;
    case 'leave':
    case 'pending':
    case 'warning':
      styles = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      break;
    case 'shift':
    case 'in progress':
      styles = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      break;
    case 'high':
    case 'critical':
      styles = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};

// --- New Components ---

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2">
      {notifications.map(n => (
        <div 
          key={n.id}
          className={`
            flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-[300px] animate-slide-in
            bg-white dark:bg-slate-800 text-gray-800 dark:text-white
            ${n.type === 'success' ? 'border-green-500' : ''}
            ${n.type === 'error' ? 'border-red-500' : ''}
            ${n.type === 'warning' ? 'border-yellow-500' : ''}
            ${n.type === 'info' ? 'border-blue-500' : ''}
          `}
        >
          <div className="mr-3">
             {n.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
             {n.type === 'error' && <AlertOctagon className="w-5 h-5 text-red-500" />}
             {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
             {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex-1 text-sm font-medium">{n.message}</div>
          <button onClick={() => removeNotification(n.id)} className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-600/50 text-yellow-900 dark:text-yellow-100 font-medium rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};