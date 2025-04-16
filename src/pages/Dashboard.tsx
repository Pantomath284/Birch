
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { TaskProvider, useTasks } from '@/contexts/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import TaskCard from '@/components/TaskCard';
import AddTaskDialog from '@/components/AddTaskDialog';
import { Input } from '@/components/ui/input';
import { Search, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardContent = () => {
  const { tasks } = useTasks();
  const [activeTab, setActiveTab] = useState('recently');
  
  const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  // Generate calendar days
  const renderCalendarDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDate();
    
    return (
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium mb-2">{day}</div>
            <div 
              className={`calendar-day mx-auto ${index === 4 ? 'active' : ''} ${index === 5 ? 'today' : ''}`}
            >
              {today - 5 + index > 0 ? today - 5 + index : 30 + (today - 5 + index)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pl-[260px] min-h-screen">
      <div className="p-6 space-y-6">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search something..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My tasks</h2>
              
              <Tabs defaultValue="recently" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="recently">Recently</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="later">Later</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recently" className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </TabsContent>
                
                <TabsContent value="today" className="space-y-4">
                  {tasks
                    .filter((task) => {
                      const today = new Date().toISOString().split('T')[0];
                      return task.dueDate === today;
                    })
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {tasks
                    .filter((task) => {
                      const today = new Date();
                      const taskDate = new Date(task.dueDate);
                      const tomorrow = new Date();
                      tomorrow.setDate(today.getDate() + 1);
                      const nextWeek = new Date();
                      nextWeek.setDate(today.getDate() + 7);
                      
                      return taskDate >= tomorrow && taskDate <= nextWeek;
                    })
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </TabsContent>
                
                <TabsContent value="later" className="space-y-4">
                  {tasks
                    .filter((task) => {
                      const today = new Date();
                      const taskDate = new Date(task.dueDate);
                      const nextWeek = new Date();
                      nextWeek.setDate(today.getDate() + 7);
                      
                      return taskDate > nextWeek;
                    })
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Project time tracker</h3>
                  <Button variant="outline" className="px-3 py-1 h-8 rounded-full bg-primary text-primary-foreground">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    <span>Start</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">You can start tracking.</p>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground">{getTodayDate()}</p>
                  <h3 className="text-2xl font-bold">Today</h3>
                </div>
                <AddTaskDialog />
              </div>
              
              {renderCalendarDays()}
              
              <div className="space-y-6 mt-4">
                {tasks.slice(0, 3).map((task) => (
                  <TaskCard key={task.id} task={task} variant="timeline" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <TaskProvider>
      <div className="bg-background">
        <Sidebar />
        <DashboardContent />
      </div>
    </TaskProvider>
  );
};

export default Dashboard;
