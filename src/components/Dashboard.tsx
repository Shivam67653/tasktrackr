import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TaskColumn, Task } from './TaskColumn';
import { TaskModal } from './TaskModal';
import { BoardModal } from './BoardModal';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Board {
  id: string;
  name: string;
  color: string;
}

// Mock data
const initialBoards: Board[] = [
  { id: '1', name: 'Marketing Campaign', color: '#00bfff' },
  { id: '2', name: 'Dev Sprint 1', color: '#9932cc' },
  { id: '3', name: 'Product Launch', color: '#00ff7f' }
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups for the new product landing page including mobile responsive design.',
    status: 'todo',
    deadline: '2024-02-15',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2', 
    title: 'Set up analytics tracking',
    description: 'Implement Google Analytics and custom event tracking for user interactions.',
    status: 'in-progress',
    deadline: '2024-02-10',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: '3',
    title: 'Write API documentation', 
    description: 'Complete comprehensive API documentation with examples and use cases.',
    status: 'done',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '4',
    title: 'User testing session prep',
    description: 'Prepare test scenarios and recruit participants for upcoming user testing sessions.',
    status: 'todo',
    deadline: '2024-02-20',
    createdAt: '2024-01-22T11:45:00Z'
  }
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeBoard, setActiveBoard] = useState<string>(initialBoards[0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const activeBoardData = boards.find(b => b.id === activeBoard);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const handleTaskCreate = (status: Task['status']) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData }
          : t
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleBoardCreate = (boardData: { name: string; color: string }) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString()
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoard(newBoard.id);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        boards={boards}
        activeBoard={activeBoard}
        onBoardSelect={setActiveBoard}
        onBoardCreate={() => setBoardModalOpen(true)}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-gradient-dark p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeBoardData && (
                <>
                  <div 
                    className="w-4 h-4 rounded-full animate-glow-pulse"
                    style={{ backgroundColor: activeBoardData.color }}
                  />
                  <h2 className="text-2xl font-bold text-foreground">
                    {activeBoardData.name}
                  </h2>
                  <Button variant="ghost" size="sm" className="hover-glow-primary">
                    <Star className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{user?.avatar}</span>
                <span className="text-foreground font-medium">{user?.username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Board Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onTaskCreate={handleTaskCreate}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={inProgressTasks}
              onTaskCreate={handleTaskCreate}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
            <TaskColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              onTaskCreate={handleTaskCreate}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleTaskSave}
        task={editingTask}
        defaultStatus={newTaskStatus}
      />

      <BoardModal
        isOpen={boardModalOpen}
        onClose={() => setBoardModalOpen(false)}
        onSave={handleBoardCreate}
      />
    </div>
  );
}