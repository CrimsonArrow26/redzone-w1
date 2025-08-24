import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PasswordInput } from './PasswordInput';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  onSwitchToLogin
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      setError('Aadhaar number must be exactly 12 digits');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.firstName + ' ' + formData.lastName,
          phone: formData.phone,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      const { error: insertError } = await supabase.from('app_users').insert([
        {
          id: data.user.id,
          email: formData.email,
          username: formData.firstName + ' ' + formData.lastName,
          phone: formData.phone,
          aadhaar_number: formData.aadhaarNumber
        }
      ]);
      setLoading(false);

      if (insertError) {
        setError('Registration succeeded, but failed to save user details.');
      } else {
        navigate('/login');
      }
    } else {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });
    setLoading(false);
    if (error) {
      setError('Google sign up failed.');
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleRegister}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="firstName" className="block mb-1 font-medium">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
                value={formData.firstName}
                onChange={handleChange}
                onKeyPress={e => { if (!/^[a-zA-Z]*$/.test(e.key)) e.preventDefault(); }}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="lastName" className="block mb-1 font-medium">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
                value={formData.lastName}
                onChange={handleChange}
                onKeyPress={e => { if (!/^[a-zA-Z]*$/.test(e.key)) e.preventDefault(); }}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="email" className="block mb-1 font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="phone" className="block mb-1 font-medium">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
              value={formData.phone}
              onChange={handleChange}
              onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="aadhaarNumber" className="block mb-1 font-medium">Aadhaar Number</Label>
          <div className="relative">
            <Input
              id="aadhaarNumber"
              type="text"
              placeholder="Enter your Aadhaar number"
              className="pl-4 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              onKeyPress={e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
              maxLength={12}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="password" className="block mb-1 font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
              showPassword={showPassword}
              onTogglePassword={onTogglePassword}
              className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              showPassword={showConfirmPassword}
              onTogglePassword={onToggleConfirmPassword}
              className="pl-10 rounded-md border border-gray-200 focus:border-black focus:ring-2 focus:ring-black/10 bg-white text-base"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm mb-6">
          <input type="checkbox" className="mt-1 rounded border-gray-300 focus:ring-black" required />
          <span className="text-gray-600">
            I agree to the{' '}
            <a href="#" className="font-semibold text-black hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-black hover:underline">Privacy Policy</a>
          </span>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="mb-6">
          <div className="bg-red-600 rounded-md shadow-sm">
            <Button className="w-full bg-transparent text-white font-bold text-base py-3 hover:bg-red-700 focus:bg-red-700 border-none shadow-none" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create RedZone Account'}
            </Button>
          </div>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white">or continue with</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={loading}>
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="text-center pt-4">
        <span>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium"
          >
            Sign in here
          </button>
        </span>
      </div>
    </div>
  );
}
