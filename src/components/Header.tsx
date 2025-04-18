
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThemeSelector from '@/components/ThemeSelector';
import { LogOut, Home, CreditCard } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewPayments = () => {
    navigate('/payments');
  };

  return (
    <header className="true-glass rounded-xl border border-white/30 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-primary/80 flex items-center justify-center">
          <span className="font-bold text-primary-foreground">{user?.name?.charAt(0) || 'A'}</span>
        </div>
        <div>
          <h2 className="font-semibold text-black">{user?.name || 'User'}</h2>
          <p className="text-sm text-black/70">{user?.role || 'Guest'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="true-glass text-black">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        
        {(user?.role === 'CEO' || user?.role === 'Manager') && (
          <Button onClick={handleViewPayments} variant="outline" size="sm" className="true-glass text-black">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </Button>
        )}
        
        <ThemeSelector />
        
        <Button onClick={handleLogout} variant="outline" size="sm" className="true-glass text-black">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
