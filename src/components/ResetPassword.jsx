import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Check,
  KeyRound,
  Layers
} from 'lucide-react';
import { confirmPasswordReset } from '../services/api';

/**
 * Enterprise Reset Password Page (Dark / Black Theme)
 */
export default function ResetPassword({ 
  token: initialToken = '', 
  onBackToLogin, 
  onBackToHome 
}) {
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
    }
  }, [initialToken]);

  useEffect(() => {
    if (!isSuccess) return;
    if (countdown <= 0) {
      if (onBackToLogin) onBackToLogin();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, onBackToLogin]);

  const passwordsMatch = confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const passwordsMismatch = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;
  const isPasswordLongEnough = newPassword.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanToken = (token || '').trim();
    if (!cleanToken) {
      setErrorMessage('Reset token is missing. Please use the link provided in your email.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset({
        token: cleanToken,
        newPassword,
        confirmNewPassword,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error('Password reset confirm error:', err);
      setErrorMessage(
        err.message || 'Failed to reset password. The link may have expired or is invalid.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] flex flex-col justify-between font-sans">
      
      {/* Top Bar with Navigation */}
      <header className="border-b border-white/[0.08] bg-black px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToLogin || onBackToHome}
            className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
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

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          
          <div className="bg-[#0C0C0E] border border-white/[0.08] rounded-lg p-6 sm:p-7 shadow-elevated">
            
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/[0.06] border border-white/[0.1] text-white mb-2.5">
                <KeyRound className="w-4 h-4" />
              </div>
              
              <h2 className="text-lg font-bold tracking-tight text-white">
                Set New Password
              </h2>
              
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Choose a strong password to secure your account
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-md bg-emerald-950/20 border border-emerald-800/40 text-xs font-mono text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <p className="font-semibold">Password updated successfully</p>
                    <p className="mt-1 text-emerald-400">
                      Redirecting to sign in within {countdown} seconds...
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full inline-flex items-center justify-center py-2 px-4 rounded-md bg-[#F97316] hover:bg-[#EA580C] text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                >
                  <span>Sign In Now</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            ) : (
              /* Reset Form */
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-md bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs font-mono flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                    <div className="flex-1">
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Token Field */}
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Reset Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste reset token..."
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40 font-mono"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white">
                      New Password
                    </label>
                    <span className={`text-[10px] font-mono ${isPasswordLongEnough ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {newPassword.length > 0 && (isPasswordLongEnough ? '✓ min 6 chars' : 'min 6 chars')}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#141416] border border-white/[0.1] rounded-md pl-8 pr-8 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
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
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center py-2 px-4 rounded-md bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-black text-xs font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                >
                  {isLoading ? 'Updating password...' : 'Confirm New Password'}
                </button>

              </form>
            )}

            {/* Back link */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] text-center text-xs text-zinc-400">
              <button
                type="button"
                onClick={onBackToLogin || onBackToHome}
                className="text-white font-semibold hover:underline"
              >
                Back to Sign In
              </button>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] font-mono text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Encrypted Token Verification</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-3.5 text-center text-xs font-mono text-zinc-500 bg-black">
        <p>© {new Date().getFullYear()} Knowra. All rights reserved.</p>
      </footer>

    </div>
  );
}
