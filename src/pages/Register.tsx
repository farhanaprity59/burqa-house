import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(form);
      toast({ title: 'Account created!', description: 'Welcome to Burqa House.' });
      navigate('/');
    } catch (err: any) {
      if (err.errors) {
        const serverErrors: Record<string, string> = {};
        Object.entries(err.errors).forEach(([key, val]: [string, any]) => {
          serverErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(serverErrors);
      } else {
        toast({ title: 'Error', description: err.message || 'Registration failed', variant: 'destructive' });
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
              <UserPlus className="text-primary-foreground" size={28} />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="font-body text-muted-foreground text-sm">
              Join Burqa House for an exclusive shopping experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-sm space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="font-body text-sm text-card-foreground">
                Full Name
              </Label>
              <Input
                id="reg-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'border-destructive' : ''}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-destructive text-xs font-body">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="font-body text-sm text-card-foreground">
                Email Address
              </Label>
              <Input
                id="reg-email"
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

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="font-body text-sm text-card-foreground">
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="reg-phone"
                name="phone"
                type="tel"
                placeholder="+880 1XXX XXXXXX"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? 'border-destructive' : ''}
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-destructive text-xs font-body">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="font-body text-sm text-card-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="reg-confirm" className="font-body text-sm text-card-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="reg-confirm"
                  name="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className={errors.password_confirmation ? 'border-destructive pr-10' : 'pr-10'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-destructive text-xs font-body">{errors.password_confirmation}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider py-6 text-sm"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </Button>

            {/* Link to Login */}
            <p className="text-center font-body text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold-dark font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
