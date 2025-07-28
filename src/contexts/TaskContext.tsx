import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  deadline?: string;
  createdAt: string;
  userId: string; // Add userId to tasks
}

export interface Board {
  id: string;
  name: string;
  color: string;
  userId: string; // Add userId to boards
}

interface TaskContextType {
  tasks: Task[];
  boards: Board[];
  activeBoard: string;
  setActiveBoard: (boardId: string) => void;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  createBoard: (boardData: Omit<Board, 'id' | 'userId'>) => void;
  getTasksByStatus: (status: Task['status']) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// JoJo-themed default boards for new users
const createDefaultBoards = (userId: string): Board[] => [
  { id: `${userId}_1`, name: 'Stand User Missions', color: '#9932cc', userId },
  { id: `${userId}_2`, name: 'Bizarre Adventure Tasks', color: '#ff1493', userId },
  { id: `${userId}_3`, name: 'Golden Experience Goals', color: '#ffd700', userId }
];

// JoJo-themed default tasks for new users
const createDefaultTasks = (userId: string, boardId: string): Task[] => [
  {
    id: `${userId}_task_1`,
    title: 'Master Star Platinum abilities',
    description: 'Train to unlock the full potential of Star Platinum\'s time-stopping power and precision strikes.',
    status: 'todo',
    deadline: '2024-02-15',
    createdAt: new Date().toISOString(),
    userId
  },
  {
    id: `${userId}_task_2`, 
    title: 'Investigate Stand Arrow mystery',
    description: 'Research the origins and powers of the mysterious Stand Arrows that grant supernatural abilities.',
    status: 'in-progress',
    deadline: '2024-02-10',
    createdAt: new Date().toISOString(),
    userId
  },
  {
    id: `${userId}_task_3`,
    title: 'Defeat DIO once and for all', 
    description: 'Complete the ultimate showdown with the immortal vampire DIO to save the world.',
    status: 'done',
    createdAt: new Date().toISOString(),
    userId
  }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<string>('');

  // Initialize user data when user logs in
  useEffect(() => {
    if (user) {
      const storageKey = `tasktrackr_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const { tasks: storedTasks, boards: storedBoards, activeBoard: storedActiveBoard } = JSON.parse(stored);
        setTasks(storedTasks);
        setBoards(storedBoards);
        setActiveBoard(storedActiveBoard || storedBoards[0]?.id || '');
      } else {
        // Create default data for new user
        const defaultBoards = createDefaultBoards(user.id);
        const defaultTasks = createDefaultTasks(user.id, defaultBoards[0].id);
        
        setBoards(defaultBoards);
        setTasks(defaultTasks);
        setActiveBoard(defaultBoards[0].id);
        
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify({
          tasks: defaultTasks,
          boards: defaultBoards,
          activeBoard: defaultBoards[0].id
        }));
      }
    } else {
      // Clear data when user logs out
      setTasks([]);
      setBoards([]);
      setActiveBoard('');
    }
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user && boards.length > 0) {
      const storageKey = `tasktrackr_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        tasks,
        boards,
        activeBoard
      }));
    }
  }, [user, tasks, boards, activeBoard]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...taskData,
      id: `${user.id}_task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: user.id
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const createBoard = (boardData: Omit<Board, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBoard: Board = {
      ...boardData,
      id: `${user.id}_board_${Date.now()}`,
      userId: user.id
    };
    
    setBoards(prev => [...prev, newBoard]);
    setActiveBoard(newBoard.id);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status && task.userId === user?.id);
  };

  const value: TaskContextType = {
    tasks: tasks.filter(task => task.userId === user?.id),
    boards: boards.filter(board => board.userId === user?.id),
    activeBoard,
    setActiveBoard,
    createTask,
    updateTask,
    deleteTask,
    createBoard,
    getTasksByStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};