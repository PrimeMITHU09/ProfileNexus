import React, { useState } from 'react';
import { UserProfile } from '../types';
import { formatFullProfileText, getCountryFlagAndName } from '../utils/generator';
import {
  Mail,
  Lock,
  Calendar,
  User,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Briefcase,
  Copy,
  Eye,
  EyeOff,
  Check,
  ClipboardList,
  Sparkles,
  KeyRound,
  Globe2,
  Edit3
} from 'lucide-react';

interface ProfileDetailsCardProps {
  profile: UserProfile | null;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
  onOpenEditProfile?: () => void;
}

export const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
  profile,
  onCopy,
  copiedLabel,
  onOpenEditProfile,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!profile) return null;

  const countryInfo = getCountryFlagAndName(profile.origin);

  const handleCopyAll = () => {
    const formatted = formatFullProfileText(profile);
    onCopy(formatted, 'Full Profile');
  };

  return (
    <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg dark:shadow-none hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 space-y-5">
      
      {/* Card Header & Copy All button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Social Acc Signup Account Profile</span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              {countryInfo.flag} {countryInfo.name}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Non-repeating profile data ready for account registration
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenEditProfile && (
            <button
              onClick={onOpenEditProfile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
              title="Edit / Customize Profile Details"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={handleCopyAll}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition"
          >
            {copiedLabel === 'Full Profile' ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>All Details Copied!</span>
              </>
            ) : (
              <>
                <ClipboardList className="w-4 h-4" />
                <span>Copy All Profile Details</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Grid of detail fields with animated hover cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* PROMINENTLY HIGHLIGHTED PASSWORD FIELD (AS REQUESTED) */}
        <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-yellow-500/10 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-yellow-950/30 border-2 border-amber-400 dark:border-amber-500/60 shadow-md shadow-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:scale-[1.01] hover:border-amber-500 transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  🔑 HIGHLIGHTED SECURE PASSWORD
                </span>
                <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded uppercase">
                  READY
                </span>
              </div>
              <span className="text-base font-mono font-extrabold text-slate-900 dark:text-amber-100 truncate block mt-0.5 tracking-wider">
                {showPassword ? profile.password : profile.password.replace(/./g, '•')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-amber-300 dark:border-slate-700 transition font-bold text-xs flex items-center gap-1"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-amber-600" />}
              <span className="hidden sm:inline">{showPassword ? 'Hide' : 'Show'}</span>
            </button>

            <button
              onClick={() => onCopy(profile.password, 'Password')}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              title="Copy Password"
            >
              {copiedLabel === 'Password' ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Password</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Field */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Email Address
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.email, 'Email')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Email"
          >
            {copiedLabel === 'Email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Date of Birth Field */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Date of Birth (DOB)
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.dob.formatted} <span className="text-xs text-slate-500 font-normal">({profile.dob.age} yrs)</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.dob.formatted, 'DOB')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy DOB"
          >
            {copiedLabel === 'DOB' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Gender Field */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Gender
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 block">
                {profile.gender}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.gender, 'Gender')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Gender"
          >
            {copiedLabel === 'Gender' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Instagram Handle */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Instagram Handle
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.username.instagram}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.username.instagram, 'Instagram Handle')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Instagram Handle"
          >
            {copiedLabel === 'Instagram Handle' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Facebook Handle */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Facebook className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Facebook Profile
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.username.facebook}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.username.facebook, 'Facebook Profile')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Facebook Link"
          >
            {copiedLabel === 'Facebook Profile' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Phone Field */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Phone Number ({countryInfo.name})
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.phone}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(profile.phone, 'Phone Number')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Phone Number"
          >
            {copiedLabel === 'Phone Number' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

        {/* Address Field with Country Flag and Name */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider flex items-center gap-1">
                <span>Location</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{countryInfo.flag} {profile.address.country}</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                {profile.address.city}, {profile.address.state}
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                {profile.address.street}, Zip: {profile.address.zip}
              </span>
            </div>
          </div>

          <button
            onClick={() => onCopy(`${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}, ${profile.address.country}`, 'Address')}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0 transition"
            title="Copy Address"
          >
            {copiedLabel === 'Address' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>

      </div>

      {/* Bio & Occupation Section with hover animation */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-indigo-300 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Occupation: <span className="text-slate-800 dark:text-slate-200 font-bold">{profile.occupation}</span>
            </span>
          </div>
          <button
            onClick={() => onCopy(profile.bio, 'Bio')}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Bio</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
          "{profile.bio}"
        </p>
      </div>

    </div>
  );
};

