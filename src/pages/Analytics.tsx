
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import Header from '@/components/Header';
import { useTasks } from '@/contexts/TaskContext';

const Analytics: React.FC = () => {
  const { tasks } = useTasks();

  // Prepare data for task completion over time
  const taskCompletionData = React.useMemo(() => {
    const completedTasksByDate: Record<string, number> = {};

    tasks.forEach(task => {
      if (task.status === 'completed' && task.dueDate) {
        const formattedDate = new Date(task.dueDate).toLocaleDateString();
        completedTasksByDate[formattedDate] = 
          (completedTasksByDate[formattedDate] || 0) + 1;
      }
    });

    return Object.entries(completedTasksByDate).map(([date, count]) => ({
      date,
      completed: count
    }));
  }, [tasks]);

  // Prepare data for task status distribution
  const taskStatusData = React.useMemo(() => {
    const statusCounts = {
      todo: 0,
      'in_progress': 0,
      completed: 0,
      due: 0
    };

    tasks.forEach(task => {
      statusCounts[task.status]++;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }, [tasks]);

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Analytics" 
        subtitle="Track your productivity and task progress" 
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#7E69AB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
