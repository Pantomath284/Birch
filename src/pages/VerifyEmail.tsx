
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { TreePine } from 'lucide-react';

const VerifyEmail = () => {
  const { user, isVerified, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60); // 1 minute cooldown
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      });
      setResendDisabled(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded">
              <TreePine className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <MailCheck className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
            <p className="mb-6 text-muted-foreground">
              Your email has been successfully verified. You can now fully use Birch.
            </p>
            <Link to="/dashboard">
              <Button className="w-full">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded">
            <TreePine className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-sm">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
          <p className="mb-6 text-center text-muted-foreground">
            We've sent a verification email to<br />
            <span className="font-medium">{user?.email}</span>
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            Please check your inbox and click the verification link to complete your registration. 
            If you don't see the email, check your spam folder.
          </p>
          
          <Button 
            onClick={handleResendEmail} 
            disabled={resendDisabled} 
            variant="outline" 
            className="w-full mb-4"
          >
            {resendDisabled 
              ? `Resend email (${countdown}s)` 
              : 'Resend verification email'}
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/dashboard" className="text-sm text-primary hover:underline">
              I'll verify later
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
