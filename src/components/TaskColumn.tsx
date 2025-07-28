import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { Task } from '@/contexts/TaskContext';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  tasks: Task[];
  onTaskCreate: (status: Task['status']) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const statusColors = {
  'todo': 'border-warning/30 bg-warning/5',
  'in-progress': 'border-primary/30 bg-primary/5', 
  'done': 'border-accent/30 bg-accent/5'
};

const statusGradients = {
  'todo': 'from-warning/20 to-warning/5',
  'in-progress': 'from-primary/20 to-primary/5',
  'done': 'from-accent/20 to-accent/5'
};

export function TaskColumn({ 
  title, 
  status, 
  tasks, 
  onTaskCreate, 
  onTaskEdit, 
  onTaskDelete 
}: TaskColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`
        p-4 border rounded-t-xl bg-gradient-to-r ${statusGradients[status]} ${statusColors[status]}
        backdrop-blur-sm
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="hover-glow-primary">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div className={`
        flex-1 p-4 space-y-3 border-l border-r border-b rounded-b-xl 
        ${statusColors[status]} backdrop-blur-sm
        min-h-[400px]
      `}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onTaskEdit(task)}
            onDelete={() => onTaskDelete(task.id)}
          />
        ))}

        {/* Add Task Button */}
        <Button
          onClick={() => onTaskCreate(status)}
          variant="outline"
          className="w-full border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 hover-glow-primary transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}