import React, { useState } from 'react';
import { UserTagConfig } from '../types';
import { X, Calendar, Edit3, Sparkles, Check, RefreshCw } from 'lucide-react';
import { formatUserTag } from '../utils/generator';

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagConfig: UserTagConfig;
  onSave: (newConfig: UserTagConfig) => void;
}

export const TagEditorModal: React.FC<TagEditorModalProps> = ({
  isOpen,
  onClose,
  tagConfig,
  onSave,
}) => {
  const [prefix, setPrefix] = useState(tagConfig.prefix);
  const [useZeroPadding, setUseZeroPadding] = useState(tagConfig.useZeroPadding);
  const [isManual, setIsManual] = useState(tagConfig.manualDateOverride !== null);
  const [manualDate, setManualDate] = useState<number>(
    tagConfig.manualDateOverride || new Date().getDate()
  );

  if (!isOpen) return null;

  const currentDay = new Date().getDate();

  const handleSave = () => {
    onSave({
      prefix: prefix.trim() ? prefix : 'Prime@',
      useZeroPadding,
      manualDateOverride: isManual ? manualDate : null,
      autoRefreshDaily: !isManual,
    });
    onClose();
  };

  const previewConfig: UserTagConfig = {
    prefix: prefix.trim() ? prefix : 'Prime@',
    useZeroPadding,
    manualDateOverride: isManual ? manualDate : null,
    autoRefreshDaily: !isManual,
  };

  const formattedPreview = formatUserTag(previewConfig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Edit User Tag Badge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize prefix and auto-refreshing calendar date tag
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs uppercase font-medium tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Live Badge Preview
          </span>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-base font-bold shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            <span>{formattedPreview}</span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Prefix Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              User Tag Prefix (e.g. Prime@)
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Prime@"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Example prefixes: Prime@, Agent@, User@, VIP@, Account@
            </p>
          </div>

          {/* Date Mode Toggle */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Calendar Date Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsManual(false)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition ${
                  !isManual
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-indigo-500" />
                <span>Auto Daily Date ({currentDay})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsManual(true)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-medium transition ${
                  isManual
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Manual Date Set</span>
              </button>
            </div>
          </div>

          {/* Manual Date Slider / Input */}
          {isManual && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>Select Day of Month:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Day {manualDate}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={31}
                value={manualDate}
                onChange={(e) => setManualDate(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          )}

          {/* Zero Padding Format Choice */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Zero Padding (01 vs 1)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Format day 1 as {useZeroPadding ? 'Prime@01' : 'Prime@1'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUseZeroPadding(!useZeroPadding)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                useZeroPadding ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  useZeroPadding ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Save Badge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
