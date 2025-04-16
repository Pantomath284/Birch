
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  email_confirmed_at?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isVerified: boolean;
  sendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Check if user's email is verified
  const checkEmailVerification = (currentUser: any) => {
    if (currentUser) {
      const hasVerifiedEmail = !!currentUser.email_confirmed_at;
      setIsVerified(hasVerifiedEmail);
      return hasVerifiedEmail;
    }
    return false;
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const currentUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || 'User',
            email: session.user.email || '',
            role: 'user',
            email_confirmed_at: session.user.email_confirmed_at,
          };
          
          setUser(currentUser);
          localStorage.setItem('taskify-user', JSON.stringify(currentUser));
          checkEmailVerification(session.user);
        } else {
          setUser(null);
          localStorage.removeItem('taskify-user');
          setIsVerified(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const currentUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email || '',
          role: 'user',
          email_confirmed_at: session.user.email_confirmed_at,
        };
        
        setUser(currentUser);
        localStorage.setItem('taskify-user', JSON.stringify(currentUser));
        checkEmailVerification(session.user);
      }
      
      setLoading(false);
    };
    
    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        checkEmailVerification(data.user);
      }
      
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (!user?.email) throw new Error('No user email found');
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Failed to send verification email', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + '/auth/confirm',
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        checkEmailVerification(data.user);
      }
      
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('taskify-user');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isVerified,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
