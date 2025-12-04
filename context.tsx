
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Notification, AuditLog, Task, TaskStatus, SystemLog } from './types';
import { MOCK_USERS, INITIAL_TASKS, MOCK_SYSTEM_LOGS } from './constants';

// --- Context Definitions ---

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string, domain: string) => Promise<boolean>;
  logout: () => void;
  usersList: User[]; // For RBAC management
  updateUserRole: (id: string, role: User['role']) => void;
}

interface AppStateContextType {
  isAdminConsoleOpen: boolean;
  openAdminConsole: () => void;
  closeAdminConsole: () => void;
  systemLogs: SystemLog[];
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

interface AuditContextType {
  logs: AuditLog[];
  logAction: (action: string, details: string, severity?: AuditLog['severity']) => void;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string, priority: Task['priority']) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
const AuditContext = createContext<AuditContextType | undefined>(undefined);
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// --- Provider Component ---

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);

  // App State
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [systemLogs] = useState<SystemLog[]>(MOCK_SYSTEM_LOGS);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Audit State
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Task State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Helper: Add Notification
  const addNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [{ id, message, type, timestamp: Date.now(), read: false }, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Helper: Log Action
  const logAction = (action: string, details: string, severity: AuditLog['severity'] = 'info') => {
    if (!user) return;
    const newLog: AuditLog = {
      id: Date.now().toString() + Math.random(),
      userId: user.id,
      userName: user.name,
      action,
      details,
      timestamp: new Date().toISOString(),
      severity
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Auth Actions
  const login = async (username: string, pass: string, domain: string): Promise<boolean> => {
    // Simulating API call to server.js
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation: "admin", "editor", "viewer" as usernames, pass "123"
        // In reality, this would fetch('/api/login')
        
        let foundUser: User | undefined;
        if (username.toLowerCase().includes('admin')) foundUser = usersList.find(u => u.role === 'Admin');
        else if (username.toLowerCase().includes('editor')) foundUser = usersList.find(u => u.role === 'Editor');
        else foundUser = usersList.find(u => u.role === 'Viewer');

        if (foundUser) {
          setUser(foundUser);
          addNotification(`Welcome back, ${foundUser.name}`, 'success');
          logAction('Login', `User logged in via ${domain}`);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    if (user) logAction('Logout', 'User logged out');
    setUser(null);
    setIsAdminConsoleOpen(false);
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    logAction('RBAC Update', `Updated user ${id} role to ${role}`, 'warning');
  };

  // Task Actions
  const addTask = (title: string, description: string, priority: Task['priority']) => {
    if (!user) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'Pending',
      assignee: user.name,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    logAction('Task Created', `Task "${title}" created by ${user.name}`);
    addNotification('Task created successfully', 'success');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    const task = tasks.find(t => t.id === taskId);
    logAction('Task Updated', `Task "${task?.title}" moved to ${status}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, usersList, updateUserRole }}>
      <AppStateContext.Provider value={{ isAdminConsoleOpen, openAdminConsole: () => setIsAdminConsoleOpen(true), closeAdminConsole: () => setIsAdminConsoleOpen(false), systemLogs }}>
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, removeNotification, markAsRead, markAllAsRead }}>
          <AuditContext.Provider value={{ logs, logAction }}>
            <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
              {children}
            </TaskContext.Provider>
          </AuditContext.Provider>
        </NotificationContext.Provider>
      </AppStateContext.Provider>
    </AuthContext.Provider>
  );
};

// --- Hooks ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AppProvider');
  return context;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within AppProvider');
  return context;
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAudit must be used within AppProvider');
  return context;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within AppProvider');
  return context;
};
