import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorDetail } from '../services/api';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { admin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      const msg = formatApiErrorDetail(err.response?.data?.detail) || 'Login failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-4">
      <Card className="w-full max-w-md border-gray-200 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-teal-600" size={28} />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Admin Login</CardTitle>
          <p className="text-sm text-slate-500 mt-2">Laboratory for Multiscale Innovative Technologies</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
            <div>
              <Label htmlFor="email" className="text-slate-700 mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="login-email-input"
                placeholder="admin@multiscalelab.edu"
                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-slate-700 mb-2 block">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="login-password-input"
                placeholder="Enter your password"
                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              data-testid="login-submit-button"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-base font-semibold"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-6">
            Authorized personnel only
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
