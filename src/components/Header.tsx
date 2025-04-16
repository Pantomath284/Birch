
import { useState } from 'react';
import { Bell, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b">
      <div>
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
        {!title && !subtitle && (
          <>
            <p className="text-gray-500">Hello, {user?.name?.split(' ')[0]}!</p>
            <h2 className="text-3xl font-bold">You've got 8 tasks today</h2>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {notifications}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <Mail className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500">UI/UX Designer</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
