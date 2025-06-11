import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'salon@example.com',
    password: 'password',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen login-black-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-coral-500 rounded-full flex items-center justify-center glow-coral">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Salon Pro</h1>
          <p className="text-gray-300">Client Portal & Skin Analysis</p>
        </div>

        {/* Login Card */}
        <Card className="login-black-box">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-playfair text-center text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-white">
              Sign in to your salon dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-black border-gray-700 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleChange('rememberMe', !!checked)}
                  className="border-gray-700 data-[state=checked]:bg-coral-500"
                />
                <Label htmlFor="remember" className="text-sm text-white">
                  Remember me
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-coral-500 hover:bg-coral-600 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-white hover:text-coral-500"
              >
                Forgot your password?
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-black rounded-lg border border-gray-700">
          <p className="text-sm text-white text-center mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-300 text-center">
            Email: salon@example.com | Password: password
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
