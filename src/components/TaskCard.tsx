import { Calendar, Edit2, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000; // 24 hours

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDeadlineColor = () => {
    if (isOverdue) return 'text-destructive';
    if (isDueSoon) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="group bg-card border border-border rounded-lg p-3 hover:border-primary/30 hover-lift hover-glow-primary transition-all duration-200 animate-fade-in">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-card-foreground text-sm leading-5 flex-1">
          {task.title}
        </h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        {/* Status Badge */}
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            task.status === 'todo' 
              ? 'bg-warning/10 text-warning border-warning/20' 
              : task.status === 'in-progress'
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-accent/10 text-accent border-accent/20'
          }`}
        >
          {task.status === 'todo' ? 'To Do' : 
           task.status === 'in-progress' ? 'In Progress' : 'Done'}
        </Badge>

        {/* Deadline */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${getDeadlineColor()}`}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
            {(isOverdue || isDueSoon) && (
              <Clock className="h-3 w-3" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}