import React from 'react';
import { UserTagConfig, AuthUser } from '../types';
import { formatUserTag } from '../utils/generator';
import { UserAvatar } from './UserAvatar';
import {
  Sparkles,
  Edit2,
  History,
  Moon,
  Sun,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  UserCircle,
  Zap,
  Crown,
  Video,
  Send,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  tagConfig: UserTagConfig;
  onOpenTagEditor: () => void;
  uniqueCount: number;
  onOpenHistory: () => void;
  onOpenUserProfile?: () => void;
  userAvatar?: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode?: 'login' | 'signup' | 'telegram') => void;
  onLogout?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onCopy?: (text: string, label: string) => void;
  copiedLabel?: string;
  onOpenCreditModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tagConfig,
  onOpenTagEditor,
  uniqueCount,
  onOpenHistory,
  onOpenUserProfile,
  userAvatar,
  currentUser,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  onCopy,
  copiedLabel,
  onOpenCreditModal,
}) => {
  const formattedTag = formatUserTag(tagConfig);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                ProfileNexus
              </h1>
              {currentUser?.role === 'ADMIN' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Crown className="w-3 h-3 text-amber-500" />
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
              Social Account Profile Generator & Analytics
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Credits Badge & Earn 500 Credits Button */}
          {currentUser && (
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Credits: {currentUser.isUnlimited ? '∞ Unlimited' : currentUser.credits}</span>
              </div>

              <button
                onClick={onOpenCreditModal}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 active:scale-95 transition flex items-center gap-1"
                title="Click to copy referral link & earn 500 credits per referral"
              >
                <Send className="w-3 h-3" />
                <span>Earn 500 Credits</span>
              </button>
            </div>
          )}

          {/* User Tag Badge with Copy Button */}
          <div
            className="group flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-mono text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 border border-white/20 shrink-0 transition-all duration-150"
          >
            <button
              onClick={onOpenTagEditor}
              className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              title="Click to edit user tag prefix & date"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>{formattedTag}</span>
              <Edit2 className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {onCopy && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(formattedTag, 'User Tag');
                }}
                className="ml-1 p-1 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 transition-all duration-150 flex items-center justify-center text-white"
                title={`Copy tag "${formattedTag}"`}
              >
                {copiedLabel === 'User Tag' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                ) : (
                  <Copy className="w-3.5 h-3.5 hover:scale-110 active:scale-90 transition-transform text-amber-200" />
                )}
              </button>
            )}
          </div>

          {/* User Profile / Auth Avatar Button (supports image & video avatars) */}
          <button
            onClick={() => {
              if (currentUser && onOpenUserProfile) {
                onOpenUserProfile();
              } else if (onOpenAuth) {
                onOpenAuth('login');
              }
            }}
            className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 active:scale-95 transition flex items-center justify-center shrink-0 shadow-sm"
            title={currentUser ? `Logged in as ${currentUser.name}` : "Sign In / Register"}
          >
            {currentUser ? (
              <UserAvatar
                name={currentUser.name}
                avatarUrl={currentUser.avatarUrl || userAvatar}
                avatarType={currentUser.avatarType}
                sizeClassName="w-7 h-7"
              />
            ) : (
              <UserCircle className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>

          {/* Logout Button */}
          {currentUser && onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-500/10 transition flex items-center gap-1 active:scale-95"
              title="Logout System"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="View Generated History"
          >
            <History className="w-5 h-5" />
            {uniqueCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white border-2 border-white dark:border-slate-900">
                {uniqueCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
