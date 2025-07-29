import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  boardId?: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  boards: Board[];
  activeBoard: string | null;
  setActiveBoard: (boardId: string | null) => void;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createBoard: (boardData: { name: string; color: string; description?: string }) => Promise<void>;
  getTasksByStatus: (status: Task['status']) => Task[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session } = useAuth();

  // Load user's boards and tasks
  const loadData = async () => {
    if (!user || !session) {
      setTasks([]);
      setBoards([]);
      setActiveBoard(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Load boards
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (boardsError) {
        console.error('Error loading boards:', boardsError);
      } else {
        const mappedBoards = boardsData.map(board => ({
          id: board.id,
          name: board.name,
          description: board.description,
          color: '#8B5CF6', // Default purple color for now
          createdAt: board.created_at,
          updatedAt: board.updated_at,
          userId: board.user_id
        }));
        setBoards(mappedBoards);
        
        // Set first board as active if none selected
        if (!activeBoard && mappedBoards.length > 0) {
          setActiveBoard(mappedBoards[0].id);
        }
      }

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error loading tasks:', tasksError);
      } else {
        const mappedTasks = tasksData.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: task.status as Task['status'],
          priority: task.priority as Task['priority'],
          dueDate: task.due_date,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
          userId: task.user_id,
          boardId: task.board_id
        }));
        setTasks(mappedTasks);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, session]);

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            due_date: taskData.dueDate,
            user_id: user.id,
            board_id: taskData.boardId || activeBoard
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return;
      }

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        dueDate: data.due_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
        boardId: data.board_id
      };

      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.status !== undefined) updateData.status = taskData.status;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.boardId !== undefined) updateData.board_id = taskData.boardId;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        dueDate: data.due_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id,
        boardId: data.board_id
      };

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const createBoard = async (boardData: { name: string; color: string; description?: string }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('boards')
        .insert([
          {
            name: boardData.name,
            description: boardData.description,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating board:', error);
        return;
      }

      const newBoard: Board = {
        id: data.id,
        name: data.name,
        description: data.description,
        color: boardData.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        userId: data.user_id
      };

      setBoards(prevBoards => [...prevBoards, newBoard]);
      setActiveBoard(newBoard.id);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const getTasksByStatus = (status: Task['status']): Task[] => {
    return tasks.filter(task => 
      task.status === status && 
      (!activeBoard || task.boardId === activeBoard)
    );
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      boards,
      activeBoard,
      setActiveBoard,
      createTask,
      updateTask,
      deleteTask,
      createBoard,
      getTasksByStatus,
      isLoading
    }}>
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