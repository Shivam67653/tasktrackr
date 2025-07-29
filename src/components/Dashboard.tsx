import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TaskColumn } from './TaskColumn';
import { TaskModal } from './TaskModal';
import { BoardModal } from './BoardModal';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, Task } from '@/contexts/TaskContext';

export function Dashboard() {
  const { user, profile, logout } = useAuth();
  const { 
    tasks, 
    boards, 
    activeBoard, 
    setActiveBoard, 
    createTask, 
    updateTask, 
    deleteTask, 
    createBoard, 
    getTasksByStatus 
  } = useTask();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const activeBoardData = boards.find(b => b.id === activeBoard);

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');

  const handleTaskCreate = (status: Task['status']) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, taskData);
    } else {
      // Create new task
      createTask(taskData);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleBoardCreate = (boardData: { name: string; color: string }) => {
    createBoard(boardData);
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
                    className="w-4 h-4 rounded-full animate-pulse jojo-glow"
                    style={{ backgroundColor: activeBoardData.color }}
                  />
                  <h2 className="text-2xl font-bold text-foreground jojo-text">
                    {activeBoardData.name}
                  </h2>
                  <Button variant="ghost" size="sm" className="hover-glow-primary">
                    <Star className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* User Avatar - Show image if available, fallback to emoji */}
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.username}
                    className="w-12 h-12 rounded-full border-2 border-purple-500 jojo-glow animate-pulse"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      target.style.display = 'none';
                      if (nextSibling) {
                        nextSibling.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="text-3xl animate-pulse jojo-animate"
                  style={{ display: profile?.avatar_url ? 'none' : 'block' }}
                >
                  {profile?.avatar_emoji}
                </div>
                <div>
                  <div className="text-foreground font-bold jojo-text">{profile?.username || user?.email}</div>
                  <div className="text-xs text-purple-300 font-bold">
                    🌟 Stand: {profile?.stand_name || 'Unknown Stand'} 🌟
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground jojo-glow"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Za Warudo... Logout
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