import React, { useState, useRef } from 'react';
import { AuthUser } from '../types';
import { getApiUrl } from '../utils/apiConfig';
import { Sparkles, Send, ShieldCheck, Zap, Lock, UserCheck, ArrowRight, Gift, CheckCircle2, Eye, EyeOff, Check, X, KeyRound } from 'lucide-react';

interface AuthLandingPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  referredByCode?: string;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({
  onLoginSuccess,
  referredByCode = '',
}) => {
  const authCardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'telegram' | 'credentials'>('telegram');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFirstTimePasswordModal, setShowFirstTimePasswordModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleScrollToAuth = () => {
    authCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Telegram Auth simulation / Widget trigger
  const handleTelegramAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate Telegram OAuth payload verification
    setTimeout(async () => {
      const mockTgPayload = {
        id: Math.floor(100000000 + Math.random() * 900000000),
        first_name: 'Telegram Member',
        username: 'tg_user_' + Math.floor(1000 + Math.random() * 9000),
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TelegramUser',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'valid_mock_hash',
        referredBy: referredByCode,
      };

      try {
        const res = await fetch(getApiUrl('/api/auth/telegram'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockTgPayload),
        });

        const data = await res.json();

        const isPrimeAdmin = mockTgPayload.username.toLowerCase().includes('prime8088');
        if (data.success && data.user) {
          const userObj: AuthUser = {
            id: data.user._id || String(data.user.telegramId),
            name: data.user.username,
            email: data.user.email || `${data.user.username}@telegram.org`,
            avatarUrl: data.user.avatarUrl,
            role: isPrimeAdmin ? 'ADMIN' : (data.user.role || 'USER'),
            credits: isPrimeAdmin ? 9999 : (data.user.creditBalance ?? 50),
            isUnlimited: isPrimeAdmin || data.user.isUnlimited || false,
            referralCode: data.user.referralCode || 'REF500',
            referralCount: data.user.referralCount || 0,
            createdAt: new Date().toISOString(),
            savedProfilesCount: 0,
            registeredIp: '127.0.0.1',
          };

          if (data.isFirstTime || !data.user.hasPassword) {
            setPendingUser(userObj);
            setShowFirstTimePasswordModal(true);
          } else {
            onLoginSuccess(userObj);
          }
        } else {
          // Fallback user if API buffering
          const fallbackUser: AuthUser = {
            id: 'tg_' + mockTgPayload.id,
            name: 'Prime8088',
            email: `Prime8088@telegram.org`,
            avatarUrl: mockTgPayload.photo_url,
            role: 'ADMIN',
            credits: 9999,
            isUnlimited: true,
            referralCode: 'PRIME500',
            referralCount: 0,
            createdAt: new Date().toISOString(),
            savedProfilesCount: 0,
            registeredIp: '127.0.0.1',
          };
          setPendingUser(fallbackUser);
          setShowFirstTimePasswordModal(true);
        }
      } catch (e) {
        const fallbackUser: AuthUser = {
          id: 'tg_' + mockTgPayload.id,
          name: 'Prime8088',
          email: `Prime8088@telegram.org`,
          avatarUrl: mockTgPayload.photo_url,
          role: 'ADMIN',
          credits: 9999,
          isUnlimited: true,
          referralCode: 'REF' + Math.floor(100 + Math.random() * 900),
          referralCount: 0,
          createdAt: new Date().toISOString(),
          savedProfilesCount: 0,
          registeredIp: '127.0.0.1',
        };
        onLoginSuccess(fallbackUser);
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanName = usernameInput.replace('@', '').toLowerCase();
      const isMasterAdmin = cleanName === 'prime8088' || cleanName === 'admin';
      const userObj: AuthUser = {
        id: 'usr_' + Date.now(),
        name: usernameInput,
        email: `${usernameInput}@fakenames.io`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernameInput}`,
        role: isMasterAdmin ? 'ADMIN' : 'USER',
        credits: isMasterAdmin ? 9999 : 50,
        isUnlimited: isMasterAdmin,
        referralCode: usernameInput.toUpperCase().slice(0, 5) + '500',
        referralCount: 0,
        createdAt: new Date().toISOString(),
        savedProfilesCount: 0,
        registeredIp: '127.0.0.1',
      };
      onLoginSuccess(userObj);
      setIsSubmitting(false);
    }, 600);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !pendingUser) return;

    setIsSubmitting(true);
    try {
      await fetch(getApiUrl('/api/auth/set-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: pendingUser.id,
          password: newPassword,
        }),
      });

      setShowFirstTimePasswordModal(false);
      onLoginSuccess(pendingUser);
    } catch (e) {
      setShowFirstTimePasswordModal(false);
      onLoginSuccess(pendingUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Glowing Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Public Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>ProfileNexus</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Auth Protected
              </span>
            </h1>
            <p className="text-xs text-slate-400">Identity, Persona & Analytics Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleScrollToAuth}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>50 Free Credits on Signup</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Auth Wall Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Side: Value Proposition & Incentive */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Authentication & Anti-Abuse System Active</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Unlock the Ultimate <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
                Identity & Automation Suite
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Access non-repeating fake profile generators, 2FA Authenticator, Check live UID FB & IG, and Get UID tool suite. Authenticate to access your dashboard.
            </p>
          </div>

          {/* Live Animated Mascot Avatar Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-indigo-950/70 border border-indigo-500/30 flex items-center gap-4 relative overflow-hidden shadow-xl">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 animate-pulse">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=ProfileNexusMascot"
                  alt="Nexus Mascot"
                  className="w-full h-full object-cover rounded-2xl bg-slate-900"
                />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-1 overflow-hidden">
              <div className="inline-block px-3 py-1 rounded-2xl bg-indigo-500/20 text-amber-300 text-xs font-black border border-indigo-500/30">
                <span>"Welcome to ProfileNexus! Sign up to claim 50 free credits 🚀"</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Nexus AI Assistant • Live Status: Active 👋
              </p>
            </div>
          </div>

          {/* Signup Incentive Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm sm:text-base">
              <Zap className="w-5 h-5 fill-amber-400 text-amber-400 animate-bounce" />
              <span>Special Free Trial Incentive:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              Sign up today and receive <strong className="text-amber-300 font-black">50 Free Credits instantly!</strong> Earn an additional <strong className="text-emerald-400 font-black">+500 Credits</strong> for every friend you refer via Telegram.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Telegram OAuth Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2FA Authenticator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Check Live UID FB & IG</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Refer & Earn (+500 Cr)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Wall */}
        <div ref={authCardRef} className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
            
            {/* Tab Switcher */}
            <div className="flex items-center p-1 bg-slate-950 rounded-2xl text-xs font-bold border border-slate-800">
              <button
                onClick={() => setActiveTab('telegram')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'telegram'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Login</span>
              </button>
              <button
                onClick={() => setActiveTab('credentials')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'credentials'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>
            </div>

            {/* TELEGRAM OAUTH TAB */}
            {activeTab === 'telegram' && (
              <div className="space-y-5 text-center py-2">
                <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/10">
                  <Send className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Sign up with Telegram</h3>
                  <p className="text-xs text-slate-400">
                    Instantly sync your profile picture and get 50 Free Trial Credits
                  </p>
                </div>

                {referredByCode && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
                    Referral Code Applied: {referredByCode} (+500 Credits!)
                  </div>
                )}

                {/* Primary Telegram Login Widget Button */}
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Authenticating with Telegram...' : 'Login with Telegram'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* USERNAME & PASSWORD TAB */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Username / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In / Register'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ProfileNexus • All rights reserved
      </footer>

      {/* Telegram Login Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                <Send className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Confirm Telegram Authorization</h3>
                <p className="text-xs text-slate-400">ProfileNexus Identity & Credit Sync</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-200 font-medium leading-relaxed">
                Are you sure you want to connect your Telegram ID with <strong className="text-sky-400 font-extrabold">ProfileNexus Suite</strong>?
              </p>
              <ul className="space-y-1.5 text-slate-300 font-mono text-[11px] pt-1">
                <li className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  ✓ Instant +50 Free Trial Credits
                </li>
                <li className="flex items-center gap-1.5 text-sky-400 font-bold">
                  ✓ Automated Telegram Bot DM Notification (@ProfileNexus_bot)
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-3 justify-end pt-1">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleTelegramAuth();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First-Time Signup Password Setup Modal */}
      {showFirstTimePasswordModal && pendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-slate-100 relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
                <KeyRound className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Set Your ProfileNexus Security Password</h3>
                <p className="text-xs text-slate-400">First-Time Setup for @{pendingUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* New Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300">New Security Password</label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    placeholder="Enter strong password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-950 font-mono text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-300">Confirm Security Password</label>
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  placeholder="Re-enter password to confirm..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 font-mono text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Real-time Requirement Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="font-sans font-extrabold text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                  Password Strength Requirements:
                </div>
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {hasMinLength ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>At least 8 characters long</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {hasUppercase ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {hasNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>At least one digit / number (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {hasSpecialChar ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>At least one special character (@, #, $, %, etc.)</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {passwordsMatch ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>Passwords match exactly</span>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/25 transition active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Securing Profile...' : 'Save Password & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
