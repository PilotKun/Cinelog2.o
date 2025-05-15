import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const LandingPage: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleStartList = async () => {
    if (usernameInput.trim() === '') {
      setError('Please enter a username.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to connect to server.');
      }

      login(usernameInput.trim(), data.tableName);
      
      console.log(data.message);

    } catch (err) {
      console.error('Landing page API call error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold">Welcome to CineLog</h1>
          <p className="text-muted-foreground mt-2">
            Track and organize your favorite movies and series with ease.
          </p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleStartList(); }} className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Input
              type="text"
              placeholder="Enter your username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className={`flex-grow ${error ? 'border-destructive' : ''}`}
              disabled={isLoading}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Start List'}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

      </div>
    </div>
  );
};

export default LandingPage; 