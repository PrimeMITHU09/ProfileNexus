import React from 'react';
import { UserProfile } from '../types';
import { Copy, RefreshCw, Check, Globe2, Sparkles, UserCheck, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { getCountryFlagAndName } from '../utils/generator';

interface NameCardProps {
  profile: UserProfile | null;
  onGenerate: () => void;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
  isGenerating?: boolean;
  onOpenEditProfile?: () => void;
}

export const NameCard: React.FC<NameCardProps> = ({
  profile,
  onGenerate,
  onCopy,
  copiedLabel,
  isGenerating = false,
  onOpenEditProfile,
}) => {
  if (!profile) return null;

  const countryInfo = getCountryFlagAndName(profile.origin);

  return (
    <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg dark:shadow-none hover:shadow-2xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 text-center">
      
      {/* Top Bar with Country Name & Generate Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>Identity Profile</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 text-[11px]">
              <span>{countryInfo.flag}</span>
              <span>{countryInfo.name}</span>
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenEditProfile && (
            <button
              onClick={onOpenEditProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
              title="Edit / Customize Active Profile"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Name</span>
          </button>
        </div>
      </div>


      {/* Main Full Name Highlight Display with Generated Avatar */}
      <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50/60 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.01] transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          {/* Avatar Profile Picture */}
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl}
              alt={`${profile.fullName} Avatar`}
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-indigo-500/50 bg-indigo-100 dark:bg-indigo-950 p-0.5 object-cover shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 text-xs bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-800 shadow-xs">
              {countryInfo.flag}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Full Name ({countryInfo.name})
            </span>
            <motion.h2
              key={profile.fullName}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight"
            >
              {profile.fullName}
            </motion.h2>
          </div>
        </div>

        <button
          onClick={() => onCopy(profile.fullName, 'Full Name')}
          className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          {copiedLabel === 'Full Name' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Name</span>
            </>
          )}
        </button>
      </div>

      {/* Compact First Name & Last Name Grid (Table-like compact view with hover animations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        
        {/* First Name Block */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              First Name
            </span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 truncate block">
              {profile.firstName}
            </span>
          </div>

          <button
            onClick={() => onCopy(profile.firstName, 'First Name')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0 transition"
          >
            {copiedLabel === 'First Name' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-indigo-500" />
            )}
            <span>Copy</span>
          </button>
        </div>

        {/* Last Name Block */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Last Name
            </span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 truncate block">
              {profile.lastName}
            </span>
          </div>

          <button
            onClick={() => onCopy(profile.lastName, 'Last Name')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0 transition"
          >
            {copiedLabel === 'Last Name' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-indigo-500" />
            )}
            <span>Copy</span>
          </button>
        </div>

      </div>
    </div>
  );
};

