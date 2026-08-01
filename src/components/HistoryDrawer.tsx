import React, { useState } from 'react';
import { UserProfile } from '../types';
import { downloadCSV, formatFullProfileText } from '../utils/generator';
import {
  X,
  Search,
  Download,
  Trash2,
  Copy,
  Check,
  History,
  UserCheck,
  Calendar,
  Mail,
  Instagram
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: UserProfile[];
  onClearHistory: () => void;
  onSelectProfile: (profile: UserProfile) => void;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectProfile,
  onCopy,
  copiedLabel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.username.instagram.toLowerCase().includes(q) ||
      p.address.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Generated Names History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} Unique Profile{history.length === 1 ? '' : 's'} Created
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Bulk Action Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, city..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => downloadCSV(history)}
              disabled={history.length === 0}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-600">
              <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No generated history found</p>
              <p className="text-xs mt-1">Generate profiles to track them here</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => {
                      onSelectProfile(item);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {item.fullName}
                    </span>
                    <span className="text-[10px] font-semibold ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.gender}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const fullText = formatFullProfileText(item);
                      onCopy(fullText, `Profile ${item.firstName}`);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition shrink-0"
                    title="Copy Profile Details"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Instagram className="w-3 h-3 text-pink-500 shrink-0" />
                    <span className="truncate">{item.username.instagram}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{item.dob.formatted}</span>
                  </div>
                  <div className="truncate text-slate-400">
                    {item.address.city}, {item.address.country}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
