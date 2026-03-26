import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../App';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/atoms';
import { useLogin } from '../hooks/data/useAuth';
import { AxiosError } from 'axios';
import { ApiError } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { mutate: login, isPending } = useLogin();
  
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('Test@1234');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    login({ email, password }, {
      onSuccess: (response) => {
        // Update global auth state
        setUser(response.data);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      },
      onError: (err) => {
        const axiosError = err as AxiosError<ApiError>;
        setError(axiosError.response?.data?.message || 'Invalid credentials or server error');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-full">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            WebHub Admin
          </CardTitle>
          <p className="text-sm text-slate-500">
            Secure Access Portal
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
                required 
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
              {!isPending && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
               Protected by Enterprise Grade Security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;