import React, { useState, useRef } from 'react';
import { X, User, Sparkles, Mail, Tag, Check, Camera, Upload, Plus } from 'lucide-react';
import { UserTagConfig } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userAvatar: string;
  tagConfig: UserTagConfig;
  onSaveProfile: (updated: {
    userName: string;
    userEmail: string;
    userAvatar: string;
    tagPrefix: string;
  }) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  userAvatar,
  tagConfig,
  onSaveProfile,
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [avatar, setAvatar] = useState(userAvatar);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [prefix, setPrefix] = useState(tagConfig.prefix);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG, WEBP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCustomAvatar(dataUrl);
          setAvatar(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    onSaveProfile({
      userName: name.trim() || 'Prime Admin',
      userEmail: email.trim() || 'user@example.com',
      userAvatar: avatar || AVATAR_PRESETS[0],
      tagPrefix: prefix.trim() || 'Prime@',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Edit User Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your account name, avatar, and Prime@ tag prefix
            </p>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Profile Avatar Picture
            </label>
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Picture</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group shrink-0">
              <img
                src={avatar || AVATAR_PRESETS[0]}
                alt="Avatar Preview"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full border-2 border-indigo-600 object-cover shadow-md"
              />
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="absolute inset-0 rounded-full bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                title="Upload custom image"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {/* Circular '+' Upload Slot */}
              <button
                type="button"
                onClick={handleTriggerUpload}
                className="w-9 h-9 rounded-full border-2 border-dashed border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-105 active:scale-95 transition shrink-0"
                title="Upload Custom Image (PNG, JPG, WEBP)"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Uploaded Custom Avatar Slot */}
              {customAvatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(customAvatar)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition shrink-0 ${
                    avatar === customAvatar ? 'border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400/50' : 'border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                  title="Uploaded Custom Avatar"
                >
                  <img src={customAvatar} alt="Custom Upload" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              )}

              {/* Preset Avatars */}
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition shrink-0 ${
                    avatar === preset ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prime User"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Tag Prefix Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            User Tag Prefix (e.g. Prime@)
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. Prime@"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. prime31@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
