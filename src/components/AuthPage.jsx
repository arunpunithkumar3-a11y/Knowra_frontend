import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Send, 
  Check,
  Layers
} from 'lucide-react';
import { loginUser, signupUser, requestPasswordReset, confirmPasswordReset } from '../services/api';

/**
 * Enterprise Authentication Page (Dark / Black Theme)
 * Restrained Linear / Stripe style authentication flow:
 * Deep black background, crisp dark card, fine borders, and instant feedback.
 */
export default function AuthPage({ 
  initialMode = 'login', 
  initialToken = '', 
  onNavigateResetPassword,
  onBackToHome, 
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot' | 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    token: initialToken || '',
    rememberMe: false,
  });

  useEffect(() => {
    if (initialToken) {
      setFormData((prev) => ({ ...prev, token: initialToken }));
      setMode('reset');
    }
  }, [initialToken]);

  useEffect(() => {
    if (initialMode && !initialToken) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        await signupUser({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMessage('Account created successfully! Signing in...');
        
        setTimeout(async () => {
          try {
            await loginUser({
              email: formData.email.trim(),
              password: formData.password,
            });
            if (onAuthSuccess) onAuthSuccess({ email: formData.email.trim() });
          } catch {
            switchMode('login');
            setSuccessMessage('Account created. Please sign in with your credentials.');
          }
        }, 1000);

      } else if (mode === 'login') {
        await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMessage('Successfully signed in.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess({ email: formData.email.trim() });
        }, 400);

      } else if (mode === 'forgot') {
        if (!formData.email || !formData.email.trim()) {
          setErrorMessage('Please enter your email address.');
          setIsLoading(false);
          return;
        }

        const res = await requestPasswordReset(formData.email.trim());
        setSuccessMessage(
          res.message || 'Password reset link sent. Please check your inbox for instructions.'
        );

      } else if (mode === 'reset') {
        if (!formData.token || !formData.token.trim()) {
          setErrorMessage('Please provide the reset token from your email.');
          setIsLoading(false);
          return;
        }

        if (!formData.newPassword || formData.newPassword.length < 6) {
          setErrorMessage('New password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
          setErrorMessage('Passwords do not match. Please verify both fields.');
          setIsLoading(false);
          return;
        }

        const res = await confirmPasswordReset({
          token: formData.token.trim(),
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        });

        setSuccessMessage(res.message || 'Password reset successfully. Redirecting to sign in...');
        
        setTimeout(() => {
          switchMode('login');
          setSuccessMessage('Password reset successfully. You can now sign in with your new password.');
          setFormData((prev) => ({
            ...prev,
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            token: '',
          }));
        }, 1500);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'Authentication request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.confirmNewPassword.length > 0 && formData.newPassword === formData.confirmNewPassword;
  const passwordsMismatch = formData.confirmNewPassword.length > 0 && formData.newPassword !== formData.confirmNewPassword;

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] flex flex-col justify-between font-sans">
      
      {/* Top Bar with Back Navigation */}
      <header className="border-b border-white/[0.08] bg-black px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#F97316] text-black flex items-center justify-center shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
              <Layers className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Knowra
            </span>
          </div>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          
          <div className="bg-[#0C0C0E] border border-white/[0.08] rounded-lg p-6 sm:p-7 shadow-elevated">
            
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/[0.06] border border-white/[0.1] text-white mb-2.5">
                {mode === 'forgot' ? (
                  <Mail className="w-4 h-4" />
                ) : mode === 'reset' ? (
                  <KeyRound className="w-4 h-4" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
              </div>
              
              <h2 className="text-lg font-bold tracking-tight text-white">
                {mode === 'login' && 'Sign in to Knowra'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset your password'}
                {mode === 'reset' && 'Set new password'}
              </h2>
              
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                {mode === 'login' && 'Enter your credentials to access workspaces'}
                {mode === 'signup' && 'Index business documents and generate reports'}
                {mode === 'forgot' && 'Enter your email to receive a password reset token'}
                {mode === 'reset' && 'Enter your reset token and choose a new password'}
              </p>
            </div>

            {/* Segmented Mode Switcher (Login/Signup) */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="grid grid-cols-2 p-0.5 bg-[#141416] rounded-md border border-white/[0.08] mb-4 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`py-1.5 rounded transition-colors font-bold ${
                    mode === 'login'
                      ? 'bg-[#F97316] text-black shadow-subtle'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`py-1.5 rounded transition-colors font-bold ${
                    mode === 'signup'
                      ? 'bg-[#F97316] text-black shadow-subtle'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Back breadcrumb for forgot & reset modes */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="mb-4 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center text-white hover:underline"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  <span>Back to Sign In</span>
                </button>
                
                {mode === 'forgot' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateResetPassword) onNavigateResetPassword(formData.token);
                      else switchMode('reset');
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    Have a token?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-zinc-400 hover:text-white"
                  >
                    Need a token?
                  </button>
                )}
              </div>
            )}

            {/* Success Feedback */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div className="flex-1">
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Feedback */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-md bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Username (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="username"
                      required
                      minLength={2}
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username"
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              {mode !== 'reset' && (
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                  </div>
                </div>
              )}

              {/* Reset Token Input (Reset Mode only) */}
              {mode === 'reset' && (
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Reset Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="token"
                      required
                      value={formData.token}
                      onChange={handleChange}
                      placeholder="Paste reset token..."
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {(mode === 'login' || mode === 'signup') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* New Password & Confirm New Password (Reset Mode only) */}
              {mode === 'reset' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">
                      New Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        required
                        minLength={6}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-white">
                        Confirm Password
                      </label>
                      {passwordsMatch && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                          <Check className="w-3 h-3 mr-0.5" /> Match
                        </span>
                      )}
                      {passwordsMismatch && (
                        <span className="text-[10px] font-mono text-rose-400">
                          Passwords do not match
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmNewPassword"
                        required
                        minLength={6}
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center py-2 px-4 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-black text-xs font-bold transition-all shadow-[0_2px_14px_rgba(249,115,22,0.35)] cursor-pointer"
              >
                {isLoading ? (
                  <span>Please wait...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Instructions'}
                      {mode === 'reset' && 'Confirm New Password'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Security Note */}
          <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] font-mono text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Strict Document Knowledge Isolation</span>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.08] py-3.5 text-center text-xs font-mono text-zinc-500 bg-black">
        <p>© {new Date().getFullYear()} Knowra. All rights reserved.</p>
      </footer>

    </div>
  );
}
