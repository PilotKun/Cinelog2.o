import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage'; // Importing SearchPage
import ListsPage from './pages/ListsPage'; // Import the new ListsPage
// import ProfilePage from './pages/ProfilePage'; // Placeholder for future page
// import ListDetailPage from './pages/ListDetailPage'; // Placeholder for future page
import { UserProvider, useUser } from './contexts/UserContext'; // Import UserProvider and useUser

// Remove default App.css if it's no longer needed or conflicts with Tailwind
// import './App.css'; 

// Main App component structure
const AppContent: React.FC = () => {
  const { username, isLoading } = useUser();

  if (isLoading) {
    // You might want to render a global loading spinner here
    return <div>Loading session...</div>; 
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={username ? <Navigate to="/lists" replace /> : <LandingPage />}
      />
      <Route 
        path="/search" 
        element={username ? <SearchPage /> : <Navigate to="/" replace />}
      />
      <Route 
        path="/lists" 
        element={username ? <ListsPage /> : <Navigate to="/" replace />}
      />
      {/* <Route path="/profile" element={username ? <ProfilePage /> : <Navigate to="/" replace />} /> */}
      {/* <Route path="/list/:listId" element={username ? <ListDetailPage /> : <Navigate to="/" replace />} /> */}
      {/* TODO: Add a 404 Not Found page */}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        {/* TODO: Add a Navbar component here that would be visible on most pages */}
        <div className="pt-16"> {/* Add padding-top if using a fixed navbar of height ~4rem (h-16) */}
          <AppContent />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
