
import { Task } from '../contexts/TaskContext';
import { MoreVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  variant?: 'default' | 'timeline';
}

const TaskCard = ({ task, variant = 'default' }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTasks();

  const handleStatusChange = (status: Task['status']) => {
    updateTask(task.id, { status });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (variant === 'timeline') {
    return (
      <div className="relative mb-8">
        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
        <div className={cn(
          "ml-8 p-4 rounded-lg",
          task.status === 'completed' ? "bg-primary text-primary-foreground" : "bg-card"
        )}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <span className="text-sm">{task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          </div>
          {task.description && <p className="text-sm mb-3">{task.description}</p>}
          
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden">
              {task.assignees.slice(0, 4).map((user, i) => (
                <Avatar key={i} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs">{user.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 4 && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs">
                  +{task.assignees.length - 4}
                </div>
              )}
            </div>
          )}

          {task.status !== 'completed' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute bottom-2 right-2 p-1 h-8 w-8" 
              onClick={() => handleStatusChange('completed')}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task-card mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{task.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('todo')}>Mark as To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>Mark as In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>Mark as Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('due')}>Mark as Due</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2 overflow-hidden mb-4">
          {task.assignees.slice(0, 4).map((user, i) => (
            <Avatar key={i} className="w-8 h-8 border-2 border-background">
              <AvatarFallback>{user.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 4 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">
              +{task.assignees.length - 4}
            </div>
          )}
        </div>
      )}
      
      {task.progress !== undefined && (
        <div className="mb-1">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${task.progress}%` }}></div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center">
        <span className={cn("w-2 h-2 rounded-full mr-2", getPriorityColor(task.priority))}></span>
        <span className="text-xs text-gray-500">{task.category}</span>
      </div>
    </div>
  );
};

export default TaskCard;
