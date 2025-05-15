import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button is here

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  if (!username) {
    return null; // Don't render Navbar if not logged in (e.g., on LandingPage)
  }

  return (
    <nav className="bg-background border-b fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/home" className="text-lg font-semibold text-primary">
          CineLog
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Search
          </Link>
          <Link to="/lists" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Lists
          </Link>
          <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Profile
          </Link>
          <span className="text-sm text-muted-foreground">Hi, {username}!</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 