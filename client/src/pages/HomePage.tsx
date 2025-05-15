import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome back, <span className="text-primary">{username || 'User'}</span>!
      </h1>
      <p className="text-muted-foreground text-lg mb-12 text-center">
        What would you like to do today?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <Button asChild size="lg" className="h-auto py-6 text-lg">
          <Link to="/search">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">🔍</span>
              <span>Search Movies & Series</span>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto py-6 text-lg">
          <Link to="/lists">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">📚</span>
              <span>View My Lists</span>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" className="h-auto py-6 text-lg">
          <Link to="/profile">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">👤</span>
              <span>My Profile</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage; 