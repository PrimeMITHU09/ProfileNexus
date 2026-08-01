import React from 'react';
import { GeneratorSettings, AvatarStyle, Gender, CountryOrigin } from '../types';
import { X, Settings, ShieldCheck, Check, Sparkles, SlidersHorizontal, KeyRound, UserCheck, Globe2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GeneratorSettings;
  onUpdateSettings: (newSettings: GeneratorSettings) => void;
}

const AVATAR_OPTIONS: { id: AvatarStyle; label: string }[] = [
  { id: 'avataaars', label: 'Avataaars (Human Personas)' },
  { id: 'bottts', label: 'Bottts (Tech Robots)' },
  { id: 'personas', label: 'Minimal Personas' },
  { id: 'lorelei', label: 'Lorelei Artistic' },
  { id: 'micah', label: 'Micah Stylized' },
  { id: 'shapes', label: 'Abstract Geometry' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Generator Default Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize rules for new password generation, avatars, and defaults
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

        <div className="space-y-5 text-xs">
          
          {/* Password Settings */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <KeyRound className="w-4 h-4 text-indigo-500" />
              <span>Password Generation Rules</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span>Password Length</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{settings.passwordLength} chars</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={settings.passwordLength}
                onChange={(e) => onUpdateSettings({ ...settings, passwordLength: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-400 transition">
                <input
                  type="checkbox"
                  checked={settings.includeNumbers}
                  onChange={(e) => onUpdateSettings({ ...settings, includeNumbers: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-200">Include Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-400 transition">
                <input
                  type="checkbox"
                  checked={settings.includeSymbols}
                  onChange={(e) => onUpdateSettings({ ...settings, includeSymbols: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-200">Include Symbols (!@#$)</span>
              </label>
            </div>
          </div>

          {/* Default Avatar Style */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              <span>Default Avatar Vector Style</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, avatarStyle: opt.id })}
                  className={`p-2.5 rounded-xl text-left border transition font-bold ${
                    settings.avatarStyle === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="truncate">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Default Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Default Gender Preference</span>
              </label>
              <select
                value={settings.defaultGender}
                onChange={(e) => onUpdateSettings({ ...settings, defaultGender: e.target.value as Gender })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="any">🎲 Any Gender (Random)</option>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Default Country Origin</span>
              </label>
              <select
                value={settings.defaultOrigin}
                onChange={(e) => onUpdateSettings({ ...settings, defaultOrigin: e.target.value as CountryOrigin })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="global">🌍 Global Mix</option>
                <option value="us">🇺🇸 United States</option>
                <option value="uk">🇬🇧 United Kingdom</option>
                <option value="ca">🇨🇦 Canada</option>
                <option value="in">🇮🇳 India</option>
                <option value="de">🇩🇪 Germany</option>
                <option value="fr">🇫🇷 France</option>
              </select>
            </div>
          </div>

          {/* Auto Copy Toggle */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Auto Copy Full Name on Generation
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automatically copies full name to clipboard whenever new profile is generated
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.autoCopyOnGenerate}
                onChange={(e) => onUpdateSettings({ ...settings, autoCopyOnGenerate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Done & Apply Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
