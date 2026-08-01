import React, { useState } from 'react';
import { AuthUser } from '../types';
import { AlertTriangle, Copy, Check, Share2, Sparkles, X, ShieldAlert, Zap, Send } from 'lucide-react';

interface CreditDepletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onCopyRefLink: (refUrl: string) => void;
}

export const CreditDepletedModal: React.FC<CreditDepletedModalProps> = ({
  isOpen,
  onClose,
  user,
  onCopyRefLink,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const refCode = user?.referralCode || 'REF500';
  const telegramBotRefLink = `https://t.me/ProfileNexus_bot?start=${refCode}`;
  const webRefLink = `${window.location.origin}/?ref=${refCode}`;

  const handleCopy = (link: string) => {
    onCopyRefLink(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        
        {/* Glowing aura */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Credit Balance Depleted</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  0 Credits Left
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock 500 bonus credits instantly or upgrade
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

        {/* Depletion Notice Box */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>You have used all your credits!</span>
          </div>
          <p className="text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
            Invite friends via Telegram to earn <strong className="text-amber-900 dark:text-amber-200 font-extrabold">+500 credits per referral</strong> or contact Admin to upgrade to Premium for Unlimited Access.
          </p>
        </div>

        {/* Telegram Referral Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Your Telegram Referral Link (+500 Bonus)</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">
              Earn 500 Credits / Ref
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={telegramBotRefLink}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={() => handleCopy(telegramBotRefLink)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-95 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Web Referral Link Fallback */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
          <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Web Direct Invitation Link:</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate gap-2">
            <span className="truncate">{webRefLink}</span>
            <button
              onClick={() => handleCopy(webRefLink)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Admin Contact & Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              window.open('https://t.me/admin_master', '_blank');
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade Premium</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
