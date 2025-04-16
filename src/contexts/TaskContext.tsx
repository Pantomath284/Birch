
import { createContext, useContext, useState, useEffect } from 'react';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'due';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  category?: string;
  progress?: number;
  assignees?: string[];
};

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByCategory: (category: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  totalTasksToday: number;
  getTaskStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    due: number;
  };
  getCompletedTasksByDate: (days: number) => Record<string, number>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Mock initial tasks
const generateInitialTasks = (): Task[] => {
  return [
    {
      id: '1',
      title: 'Make a landing page and mobile app',
      description: 'Create a responsive landing page with mobile app design',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2023-04-15',
      category: 'Design',
      progress: 35,
      assignees: ['user1', 'user2', 'user3', 'user4']
    },
    {
      id: '2',
      title: 'Finacial App',
      description: 'Branding and mobile app development',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2023-04-20',
      category: 'Development',
      progress: 60,
      assignees: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7']
    },
    {
      id: '3',
      title: 'Meeting',
      description: 'Discuss team tasks for the day',
      status: 'todo',
      priority: 'high',
      dueDate: '2023-04-10',
      category: 'Meetings',
      assignees: ['user1', 'user2', 'user3', 'user4']
    },
    {
      id: '4',
      title: 'Icon set',
      description: 'Edit icons for Navi Project',
      status: 'todo',
      priority: 'medium',
      dueDate: '2023-04-10',
      category: 'Design',
      assignees: []
    },
    {
      id: '5',
      title: 'Update documentation',
      description: 'Update API documentation for developers',
      status: 'completed',
      priority: 'low',
      dueDate: '2023-04-08',
      category: 'Documentation',
      progress: 100,
    },
    {
      id: '6',
      title: 'Design system updates',
      description: 'Update the design system with new components',
      status: 'due',
      priority: 'high',
      dueDate: '2023-04-05',
      category: 'Design',
      progress: 20,
    },
    {
      id: '7',
      title: 'Weekly report',
      description: 'Prepare weekly status report',
      status: 'todo',
      priority: 'medium',
      dueDate: '2023-04-12',
      category: 'Reporting',
    },
    {
      id: '8',
      title: 'Client presentation',
      description: 'Prepare presentation for client meeting',
      status: 'todo',
      priority: 'high',
      dueDate: '2023-04-10',
      category: 'Meetings',
    },
  ];
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Load tasks from localStorage or use mock data
    const storedTasks = localStorage.getItem('taskify-tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      const initialTasks = generateInitialTasks();
      setTasks(initialTasks);
      localStorage.setItem('taskify-tasks', JSON.stringify(initialTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('taskify-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter((task) => task.category === category);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const totalTasksToday = tasks.filter((task) => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  }).length;

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
    const due = tasks.filter((task) => task.status === 'due').length;
    
    return {
      total,
      completed,
      inProgress,
      due
    };
  };

  // Get completed tasks for the past X days for charts
  const getCompletedTasksByDate = (days: number) => {
    const result: Record<string, number> = {};
    const today = new Date();
    
    // Initialize all days with zero counts
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result[dateStr] = 0;
    }
    
    // Count completed tasks for each day
    tasks.forEach((task) => {
      if (task.status === 'completed' && result[task.dueDate] !== undefined) {
        result[task.dueDate] += 1;
      }
    });
    
    return result;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByCategory,
        getTasksByStatus,
        totalTasksToday,
        getTaskStats,
        getCompletedTasksByDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
