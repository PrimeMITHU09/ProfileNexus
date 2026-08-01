import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  saveUser,
  generateReferralCode,
  getAllUsers,
  processReferral
} from '../utils/userStore';
import {
  fetchClientIp,
  checkIpRegistrationAllowed,
  recordIpRegistration
} from '../utils/ipGuard';
import {
  X,
  UserCheck,
  Lock,
  Mail,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Send,
  Video,
  AlertTriangle,
  Crown,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  initialMode?: 'login' | 'signup' | 'telegram';
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  referredByCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialMode = 'signup',
  onLoginSuccess,
  onLogout,
  referredByCode = '',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup' | 'telegram'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarType, setAvatarType] = useState<'image' | 'video'>('image');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [videoAvatarUrl, setVideoAvatarUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-loop-motion-graphic-41484-large.mp4');

  const [error, setError] = useState<string | null>(null);
  const [ipErrorModal, setIpErrorModal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in both email and password.');
        return;
      }

      const users = getAllUsers();
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() ||
          (u.telegramUsername && u.telegramUsername.toLowerCase() === email.toLowerCase().replace('@', ''))
      );

      if (match) {
        if (match.isBanned) {
          setError('This account has been banned by Admin.');
          return;
        }
        onLoginSuccess(match);
        onClose();
      } else {
        // Fallback demo user creation for testing
        const newUser: AuthUser = {
          id: 'usr_' + Date.now(),
          name: email.split('@')[0] || 'User',
          email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          createdAt: new Date().toISOString(),
          savedProfilesCount: 0,
          credits: 50,
          role: 'USER',
          registeredIp: await fetchClientIp(),
          referralCode: generateReferralCode(email),
          referralCount: 0,
        };
        saveUser(newUser);
        onLoginSuccess(newUser);
        onClose();
      }
      return;
    }

    // Signup / Telegram Signup Validation
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (mode === 'telegram' && !telegramUsername) {
      setError('Please enter your Telegram Username (e.g. @username).');
      return;
    }

    // IP Anti-Abuse Check
    const clientIp = await fetchClientIp();
    const ipCheck = checkIpRegistrationAllowed(clientIp);

    if (!ipCheck.allowed) {
      setIpErrorModal(ipCheck.reason || 'Multiple free accounts from the same IP are restricted.');
      return;
    }

    const cleanTgUsername = telegramUsername.replace('@', '').trim();
    const finalName = mode === 'telegram' ? (cleanTgUsername ? `@${cleanTgUsername}` : 'Telegram User') : name;
    const finalEmail = email || `${cleanTgUsername || 'user' + Date.now()}@telegram.org`;
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalName)}&backgroundColor=b6e3f4,c0aede`;

    const newUser: AuthUser = {
      id: 'usr_' + Date.now(),
      name: finalName,
      email: finalEmail,
      password: password,
      telegramUsername: cleanTgUsername || undefined,
      avatarUrl: customAvatarUrl || defaultAvatar,
      avatarType: avatarType,
      videoAvatarUrl: avatarType === 'video' ? videoAvatarUrl : undefined,
      createdAt: new Date().toISOString(),
      savedProfilesCount: 0,
      credits: 50, // Automatically assign 50 Free Credits on registration
      role: 'USER',
      registeredIp: clientIp,
      referralCode: generateReferralCode(cleanTgUsername || finalName),
      referredBy: referredByCode || undefined,
      referralCount: 0,
      totalGeneratedCount: 0,
      totalCopiedCount: 0,
      isBanned: false,
    };

    // Save User & IP telemetry
    saveUser(newUser);
    recordIpRegistration(clientIp, newUser.id);

    // Process referral bonus if signed up via ref link
    if (referredByCode) {
      processReferral(referredByCode, newUser.id);
    }

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickAdminLogin = () => {
    const adminUser = getAllUsers().find((u) => u.role === 'ADMIN') || {
      id: 'usr_admin_001',
      name: 'Admin Master',
      email: 'admin@fakenames.io',
      telegramUsername: 'admin_master',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      avatarType: 'video',
      videoAvatarUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-loop-motion-graphic-41484-large.mp4',
      createdAt: new Date().toISOString(),
      savedProfilesCount: 50,
      credits: 9999,
      isUnlimited: true,
      role: 'ADMIN',
      registeredIp: '127.0.0.1',
      referralCode: 'ADMIN500',
      referralCount: 20,
    };
    onLoginSuccess(adminUser as AuthUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Anti-abuse IP Warning Modal Overlay */}
        {ipErrorModal && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/80 border-2 border-red-500 text-red-700 dark:text-red-300 space-y-3">
            <div className="flex items-center gap-2 font-black text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>IP Violation Detected</span>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {ipErrorModal}
            </p>
            <button
              onClick={() => setIpErrorModal(null)}
              className="w-full py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md"
            >
              Understand & Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {currentUser ? 'User Account Session' : mode === 'telegram' ? 'Sign up with Telegram' : mode === 'signup' ? 'Create Account (+50 Credits)' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser ? 'Manage active user settings' : 'Sync profiles & earn 500 bonus credits/ref'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-4">
              
              {currentUser.avatarType === 'video' && currentUser.videoAvatarUrl ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500 shrink-0">
                  <video
                    src={currentUser.videoAvatarUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-800 object-cover shrink-0 shadow-md"
                />
              )}

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  ✓ {currentUser.role === 'ADMIN' ? '👑 SYSTEM ADMIN' : 'Active Account'}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </h4>
                <p className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Credits Balance</div>
                <div className="text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{currentUser.isUnlimited ? '∞ Unlimited' : `${currentUser.credits}`}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Referrals</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                  {currentUser.referralCount || 0} Invited
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold border border-red-500/20 transition"
            >
              Log Out of Account
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-center">
              <button
                type="button"
                onClick={() => { setMode('telegram'); setError(null); }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  mode === 'telegram'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            </div>

            {/* Bonus Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
              <span>Free Trial Setup: Receive <strong>50 Free Credits</strong> on registration!</span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Telegram Handle Field */}
              {mode === 'telegram' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-sky-500" />
                    <span>Telegram Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@mithu_pro"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Standard Signup Name */}
              {mode === 'signup' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Live Video / Animated Profile Option */}
              {mode !== 'login' && (
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-purple-500" />
                      <span>Profile Avatar Style</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAvatarType('image')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${avatarType === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                      >
                        Image Avatar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarType('video')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${avatarType === 'video' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                      >
                        Live MP4 Video
                      </button>
                    </div>
                  </div>

                  {avatarType === 'video' && (
                    <input
                      type="url"
                      placeholder="https://assets.mixkit.co/.../video.mp4"
                      value={videoAvatarUrl}
                      onChange={(e) => setVideoAvatarUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                    />
                  )}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Confirm Password */}
              {mode !== 'login' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-extrabold text-white shadow-lg transition flex items-center justify-center gap-2 ${
                  mode === 'telegram'
                    ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                }`}
              >
                <span>{mode === 'login' ? 'Log In' : mode === 'telegram' ? 'Complete Telegram Sign Up' : 'Create Free Account (+50 Free Credits)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Admin Test Login */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white font-extrabold text-xs border border-purple-500/30 hover:border-purple-400 flex items-center justify-center gap-2 transition"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Test Login as SYSTEM ADMIN</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
