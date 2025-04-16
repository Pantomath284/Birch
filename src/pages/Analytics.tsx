
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TaskProvider, useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';
import { CheckCheck, Clock, AlertTriangle, Rocket } from 'lucide-react';

const AnalyticsContent = () => {
  const { tasks, getTaskStats, getCompletedTasksByDate } = useTasks();
  
  const stats = getTaskStats();
  
  // Get completed tasks data for the past 7 days
  const completedTasksData = getCompletedTasksByDate(7);
  const chartData = Object.entries(completedTasksData).map(([date, count]) => {
    const dateObj = new Date(date);
    return {
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks: count
    };
  });
  
  // Calculate task distribution by status
  const taskDistribution = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'in_progress').length },
    { name: 'Due', value: tasks.filter(task => task.status === 'due').length },
    { name: 'Completed', value: tasks.filter(task => task.status === 'completed').length },
  ];
  
  // Calculate task distribution by priority
  const priorityDistribution = [
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
  ];

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${Math.round((value / tasks.length) * 100)}%`;
  };

  return (
    <div className="pl-[260px] min-h-screen">
      <div className="p-6 space-y-6">
        <Header title="Analytics" subtitle="Track your productivity and task progress" />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{stats.completed}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCheck className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">{stats.inProgress}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due</p>
                <h3 className="text-2xl font-bold mt-1">{stats.due}</h3>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="tasks" 
                      name="Completed Tasks"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Tasks" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => [`${value} tasks (${formatPercentage(value)})`, 'Count']} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Tasks" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Productivity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[300px]">
                <div className="text-6xl font-bold text-primary mb-4">
                  {Math.round((stats.completed / (stats.total || 1)) * 100)}%
                </div>
                <p className="text-muted-foreground text-center">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  return (
    <TaskProvider>
      <div className="bg-background">
        <Sidebar />
        <AnalyticsContent />
      </div>
    </TaskProvider>
  );
};

export default Analytics;
