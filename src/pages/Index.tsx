import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, BarChart, Calendar, Clock, TreePine } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Task Management',
      description: 'Create, update, and organize tasks with ease. Set priorities and deadlines.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Analytics Dashboard',
      description: 'Track your progress with insightful charts and productivity metrics.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: 'Calendar View',
      description: 'View your tasks in a calendar format to manage your schedule efficiently.'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: 'Time Tracking',
      description: 'Track time spent on tasks and analyze your productivity patterns.'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-2 font-bold text-xl">Birch</h1>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/register')}>Sign up</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">Manage your tasks like never before</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A beautiful and intuitive task manager that helps you stay organized and boost your productivity.
            </p>
            <Button size="lg" onClick={() => navigate('/register')} className="px-8">
              Get Started
            </Button>
          </div>
        </section>
        
        <section className="py-20 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Features designed for productivity</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10">Ready to boost your productivity?</h2>
            <Button size="lg" onClick={() => navigate('/register')} className="px-8">
              Sign up for free
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2023 Birch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
