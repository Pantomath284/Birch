
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TreePine, Loader2 } from 'lucide-react';

const ConfirmEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // The hash fragment contains the tokens after Supabase auth redirects back
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (!hashParams.get('access_token')) {
          setError('Invalid confirmation link');
          setLoading(false);
          return;
        }

        // Wait a moment to ensure the hash params are processed
        setTimeout(() => {
          setLoading(false);
          navigate('/verify-email');
        }, 2000);

      } catch (error) {
        console.error('Error confirming email:', error);
        setError('There was a problem confirming your email. Please try again later.');
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded">
            <TreePine className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-sm text-center">
          {loading ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Confirming your email...</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address.</p>
            </>
          ) : error ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline"
              >
                Return to login
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
