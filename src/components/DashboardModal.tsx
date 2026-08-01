import React, { useState } from 'react';
import { UserProfile, UserTagConfig, AuthUser } from '../types';
import {
  X,
  LayoutDashboard,
  Users,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  KeyRound,
  FileSpreadsheet,
  FileJson,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import { generateUniqueProfile, formatUserTag } from '../utils/generator';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: UserProfile[];
  tagConfig: UserTagConfig;
  onUpdateTagConfig: (newConfig: UserTagConfig) => void;
  uniqueCount: number;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLoadProfile: (profile: UserProfile) => void;
  onClearHistory: () => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  history,
  tagConfig,
  onUpdateTagConfig,
  uniqueCount,
  currentUser,
  onOpenAuth,
  onLoadProfile,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'analytics' | 'bulk' | 'vault' | 'tags'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkResults, setBulkResults] = useState<UserProfile[]>([]);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const formattedTag = formatUserTag(tagConfig);

  const filteredHistory = history.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateBulk = () => {
    const existingNames = new Set<string>(history.map((h) => h.fullName));
    const newProfiles: UserProfile[] = [];
    for (let i = 0; i < bulkCount; i++) {
      const p = generateUniqueProfile(
        {
          gender: 'any',
          origin: 'global',
          minAge: 18,
          maxAge: 65,
          customDomain: '',
        },
        existingNames
      );
      existingNames.add(p.fullName);
      newProfiles.push(p);
    }
    setBulkResults(newProfiles);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleExportCSV = (profiles: UserProfile[]) => {
    if (profiles.length === 0) return;
    const headers = ['Full Name', 'First Name', 'Last Name', 'Gender', 'Email', 'Password', 'DOB', 'Phone', 'Address', 'Occupation'];
    const rows = profiles.map((p) => [
      `"${p.fullName}"`,
      `"${p.firstName}"`,
      `"${p.lastName}"`,
      `"${p.gender}"`,
      `"${p.email}"`,
      `"${p.password}"`,
      `"${p.dob.formatted}"`,
      `"${p.phone}"`,
      `"${p.address.street}, ${p.address.city}, ${p.address.country}"`,
      `"${p.occupation}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `generated_profiles_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = (profiles: UserProfile[]) => {
    if (profiles.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(profiles, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `generated_profiles_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Profile Management Dashboard
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                  Tool Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bulk identity generator, export tools, tag presets, and saved profiles vault
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <UserCheck className="w-4 h-4" />
                <span>{currentUser.name}</span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
              >
                Log In / Register
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Overview Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'bulk'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Bulk Generator & Export</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Saved Profiles Vault ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'tags'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tag Presets ({formattedTag})</span>
          </button>
        </div>

        {/* Tab 1: Overview Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 text-xs">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">
                  Total Generated
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {uniqueCount}
                </div>
                <span className="text-[10px] text-slate-500">Unique Identity Records</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                  Memory Guarantee
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  100%
                </div>
                <span className="text-[10px] text-slate-500">Zero Duplicates Memory</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-1">
                <span className="text-purple-600 dark:text-purple-400 font-bold uppercase text-[10px]">
                  Active User Tag
                </span>
                <div className="text-xl font-mono font-black text-slate-900 dark:text-slate-100 truncate">
                  {formattedTag}
                </div>
                <span className="text-[10px] text-slate-500">Automated Daily Prefix</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 space-y-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px]">
                  Password Security
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  High (12+ Chars)
                </div>
                <span className="text-[10px] text-slate-500">Numbers & Symbols Enabled</span>
              </div>
            </div>

            {/* Quick Export All Actions */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    Quick Export History Data
                  </h4>
                  <p className="text-slate-500">
                    Download all generated identities for mass account creation tasks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCSV(history)}
                    disabled={history.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => handleExportJSON(history)}
                    disabled={history.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition"
                  >
                    <FileJson className="w-4 h-4" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bulk Generator & Export */}
        {activeTab === 'bulk' && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Bulk Identity Generator
                </h4>
                <p className="text-slate-500">
                  Generate multiple complete profile identities instantly for bulk registration
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value={5}>5 Profiles</option>
                  <option value={10}>10 Profiles</option>
                  <option value={20}>20 Profiles</option>
                </select>

                <button
                  onClick={handleGenerateBulk}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  Generate {bulkCount} Now
                </button>
              </div>
            </div>

            {bulkResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Generated {bulkResults.length} Bulk Profiles
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCSV(bulkResults)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download CSV
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {bulkResults.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {p.fullName} ({p.gender})
                          </div>
                          <div className="font-mono text-slate-500 text-[10px]">
                            {p.email} | Pass: {p.password}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyText(`${p.fullName}\n${p.email}\n${p.password}`, p.id)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:border-indigo-500 transition shrink-0"
                      >
                        {copiedLabel === p.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search saved profiles by name, email, job..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold border border-red-500/20 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All ({history.length})</span>
                </button>
              )}
            </div>

            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No saved profiles found matching "{searchTerm}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredHistory.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-indigo-400 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.avatarUrl}
                        alt={p.fullName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-indigo-400 bg-white p-0.5 object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {p.fullName}
                        </div>
                        <div className="font-mono text-slate-500 text-[10px] truncate">
                          {p.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onLoadProfile(p);
                        onClose();
                      }}
                      className="p-2 rounded-xl bg-indigo-600 text-white font-bold hover:scale-105 active:scale-95 transition shrink-0"
                      title="Load this profile as active"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tag Presets */}
        {activeTab === 'tags' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Quick Tag Prefix Presets
              </h4>
              <p className="text-slate-500">
                Select from popular user tag formats for instant social registration tagging
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { prefix: 'Prime@', label: 'Prime@ Tag' },
                  { prefix: 'ProUser#', label: 'ProUser# Tag' },
                  { prefix: 'DevAccount_', label: 'DevAccount_ Tag' },
                  { prefix: 'Studio31#', label: 'Studio31# Tag' },
                  { prefix: 'RegUser@', label: 'RegUser@ Tag' },
                  { prefix: 'AlphaMember_', label: 'AlphaMember_ Tag' },
                  { prefix: 'AccVault#', label: 'AccVault# Tag' },
                  { prefix: 'SocialBox@', label: 'SocialBox@ Tag' },
                ].map((item) => (
                  <button
                    key={item.prefix}
                    onClick={() => {
                      onUpdateTagConfig({ ...tagConfig, prefix: item.prefix });
                    }}
                    className={`p-3 rounded-xl text-left border transition font-bold font-mono ${
                      tagConfig.prefix === item.prefix
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <div className="text-[10px] opacity-70 uppercase">{item.label}</div>
                    <div className="text-sm font-black">{item.prefix}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
