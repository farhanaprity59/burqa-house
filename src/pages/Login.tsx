import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(form.email, form.password);
      toast({ title: 'Welcome back!', description: 'You have logged in successfully.' });
      navigate('/');
    } catch (err: any) {
      if (err.status === 401) {
        setErrors({ email: 'Invalid email or password' });
      } else if (err.errors) {
        const serverErrors: Record<string, string> = {};
        Object.entries(err.errors).forEach(([key, val]: [string, any]) => {
          serverErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(serverErrors);
      } else {
        toast({ title: 'Error', description: err.message || 'Login failed', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-6">
              <LogIn className="text-primary-foreground" size={28} />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="font-body text-muted-foreground text-sm">
              Sign in to your account to continue shopping
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-sm space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="font-body text-sm text-card-foreground">
                Email Address
              </Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'border-destructive' : ''}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-xs font-body">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="font-body text-sm text-card-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs font-body">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider py-6 text-sm"
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>

            {/* Link to Register */}
            <p className="text-center font-body text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-dark font-medium transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
