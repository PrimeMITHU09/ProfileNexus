import React from 'react';
import { FilterOptions, Gender, CountryOrigin, FrameworkLayout } from '../types';
import { EMAIL_PROVIDERS } from '../data/namesData';
import {
  SlidersHorizontal,
  Globe2,
  User,
  ShieldCheck,
  Mail,
  Calendar,
  LayoutGrid,
  Zap,
  Columns
} from 'lucide-react';

interface GeneratorControlsProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  uniqueCount: number;
  layout?: FrameworkLayout;
  onSelectLayout?: (layout: FrameworkLayout) => void;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  filters,
  onChangeFilters,
  uniqueCount,
  layout = 'modern-saas',
  onSelectLayout,
}) => {
  return (
    <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>Generator Filters & Customization</span>
        </div>

        {/* Layout Preset Switcher (Mobile & Desktop) */}
        {onSelectLayout && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSelectLayout('modern-saas')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                layout === 'modern-saas'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>SaaS</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectLayout('bold-industrial')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                layout === 'bold-industrial'
                  ? 'bg-[#D4FF00] text-black shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Bold Lime</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectLayout('split-studio')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                layout === 'split-studio'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="w-3 h-3" />
              <span>Studio</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Non-Repeat Memory: {uniqueCount} Generated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Gender Filter */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>Gender</span>
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['any', 'male', 'female'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChangeFilters({ ...filters, gender: g })}
                className={`py-1.5 rounded-lg font-semibold uppercase tracking-wider transition ${
                  filters.gender === g
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Origin / Country Filter */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Name Origin / Country</span>
          </label>
          <select
            value={filters.origin}
            onChange={(e) =>
              onChangeFilters({ ...filters, origin: e.target.value as CountryOrigin })
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

        {/* Email Domain Choice */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Email Provider Domain</span>
          </label>
          <select
            value={filters.customDomain}
            onChange={(e) => onChangeFilters({ ...filters, customDomain: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">🔀 Random Domain Mix</option>
            {EMAIL_PROVIDERS.map((domain) => (
              <option key={domain} value={domain}>
                @{domain}
              </option>
            ))}
          </select>
        </div>

        {/* Age Range Choice */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Age Bracket</span>
          </label>
          <select
            value={`${filters.minAge}-${filters.maxAge}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              onChangeFilters({ ...filters, minAge: min, maxAge: max });
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="18-25">18 – 25 Years Old (Young Adult)</option>
            <option value="25-35">25 – 35 Years Old (Standard)</option>
            <option value="35-50">35 – 50 Years Old (Mature)</option>
            <option value="18-65">18 – 65 Years Old (Wide Spectrum)</option>
          </select>
        </div>

      </div>
    </div>
  );
};
