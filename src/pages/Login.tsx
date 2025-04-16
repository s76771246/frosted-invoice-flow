
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('ceo@e42.ai');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome to the AP Management System',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 -z-10"></div>
      <div className="absolute inset-0 -z-10 bg-pattern-grid"></div>
      
      <div className="w-full max-w-md p-8">
        <Card className="ios-card border-0 backdrop-blur-xl overflow-hidden">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/80 to-primary/50 shadow-lg"></div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white/90">Account Payable Management</CardTitle>
            <CardDescription className="text-center text-white/70">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/90">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ceo@e42.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 backdrop-blur-md border-white/20 text-white/90"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-white/90">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 backdrop-blur-md border-white/20 text-white/90"
                />
              </div>
              <Button type="submit" className="w-full bg-primary/80 hover:bg-primary backdrop-blur-sm" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-white/80">
              <span>Demo Accounts:</span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setEmail('ceo@e42.ai')} className="text-xs bg-white/5 backdrop-blur-md border-white/20 text-white/90">
                  CEO
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEmail('clerk@e42.ai')} className="text-xs bg-white/5 backdrop-blur-md border-white/20 text-white/90">
                  Clerk
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEmail('manager@e42.ai')} className="text-xs bg-white/5 backdrop-blur-md border-white/20 text-white/90">
                  Manager
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
