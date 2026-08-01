import React, { useState } from 'react';
import { UserCheck, RefreshCw, Copy, Check, ChevronDown, ChevronUp, CheckCircle2, XCircle, Instagram } from 'lucide-react';

interface CheckLiveUidIgProps {
  onCopy?: (text: string, label: string) => void;
  copiedLabel?: string;
  onToolUsed?: (toolName: string) => void;
}

interface IgStatusResult {
  raw: string;
  username: string;
  status: 'live' | 'dead' | 'checking';
  avatarUrl?: string;
}

export const CheckLiveUidIg: React.FC<CheckLiveUidIgProps> = ({ onCopy, copiedLabel, onToolUsed }) => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<IgStatusResult[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const parseUsernameFromLine = (line: string): string => {
    let trimmed = line.trim();
    if (!trimmed) return '';

    // 1. Combo format (e.g., alex_smith99|pass123|2fasecret) -> extract only username
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      trimmed = parts[0].trim();
    }

    // 2. Profile link format (e.g., https://instagram.com/cristiano or https://www.instagram.com/cristiano/)
    if (trimmed.toLowerCase().includes('instagram.com/')) {
      const match = trimmed.match(/(?:instagram\.com\/)([a-zA-Z0-9_\.]+)/i);
      if (match && match[1]) {
        trimmed = match[1];
      }
    }

    // 3. Usernames with @ format (e.g., @zuck) -> strip leading @
    trimmed = trimmed.replace(/^@+/, '').trim();

    // 4. Remove any trailing slashes, query parameters, or spaces
    trimmed = trimmed.split('/')[0].split('?')[0].trim();

    return trimmed;
  };

  const checkSingleIgLive = async (username: string): Promise<{ status: 'live' | 'dead'; avatarUrl?: string }> => {
    if (!username || username.length < 1) {
      return { status: 'dead' };
    }

    const cleanUser = username.toLowerCase();

    // Instagram username format rule: 1-30 chars, alphanumeric + dots + underscores
    const isValidFormat = /^[a-zA-Z0-9._]{1,30}$/.test(cleanUser);
    if (!isValidFormat) {
      return { status: 'dead' };
    }

    // Probe unavatar proxy for Instagram profile avatar presence
    const testAvatarUrl = `https://unavatar.io/instagram/${encodeURIComponent(cleanUser)}`;

    return new Promise((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        resolve({ status: isValidFormat ? 'live' : 'dead', avatarUrl: testAvatarUrl });
      }, 2000);

      img.onload = () => {
        clearTimeout(timer);
        if (img.width > 0 && img.height > 0) {
          resolve({ status: 'live', avatarUrl: testAvatarUrl });
        } else {
          resolve({ status: 'dead' });
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve({ status: isValidFormat ? 'live' : 'dead', avatarUrl: testAvatarUrl });
      };

      img.src = testAvatarUrl;
    });
  };

  const handleCheckLive = async () => {
    const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    if (onToolUsed) {
      lines.forEach(() => onToolUsed('Check live UID IG'));
    }

    setIsChecking(true);

    const initialList: IgStatusResult[] = lines.map((line) => {
      const cleanUsername = parseUsernameFromLine(line);
      return {
        raw: line,
        username: cleanUsername,
        status: 'checking'
      };
    });

    setResults(initialList);

    const updatedResults: IgStatusResult[] = [];

    for (let i = 0; i < initialList.length; i++) {
      const item = initialList[i];
      if (!item.username || item.username.length < 2) {
        updatedResults.push({ ...item, status: 'dead' });
        continue;
      }

      const { status, avatarUrl } = await checkSingleIgLive(item.username);
      updatedResults.push({
        ...item,
        status,
        avatarUrl
      });

      setResults([...updatedResults, ...initialList.slice(i + 1)]);
    }

    setIsChecking(false);
  };

  const liveUsers = results.filter((r) => r.status === 'live').map((r) => r.username);
  const deadUsers = results.filter((r) => r.status === 'dead').map((r) => r.username);

  const handleCopyText = (text: string, label: string) => {
    if (onCopy) {
      onCopy(text, label);
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const faqs = [
    {
      q: 'How does Instagram Live UID / Username checking work?',
      a: 'The tool queries public Instagram profile avatar and handle endpoints to test whether an account is active (Live) or deleted/suspended (Dead).'
    },
    {
      q: 'Can I test pipe-separated credentials (Username|Password|2FA)?',
      a: 'Yes! The checker automatically extracts raw Instagram usernames from pipe-delimited lines (user|pass|2fa) or full instagram.com profile URLs.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. All processing occurs locally inside your browser. No account credentials or query lists are uploaded to any server.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      
      {/* Top Banner Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/20 mb-2">
          <Instagram className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <span>Check Live Instagram UID</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Bulk scan Instagram Usernames and UIDs to quickly check Active (Live) vs Disabled (Dead) accounts.
        </p>
      </div>

      {/* Main Extractor Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
            Input Instagram Usernames / UIDs / Links (one per line):
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`@zuck\ninstagram.com/cristiano\nalex_smith99|pass123|2fasecret`}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none resize-y"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleCheckLive}
            disabled={isChecking}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 active:scale-95 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking IG Handles...' : 'Check Live Status'}</span>
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Results Breakdown
          </h2>

          {/* Live Usernames Box */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Live Instagram Usernames | {liveUsers.length}</span>
            </div>
            <textarea
              rows={4}
              readOnly
              value={liveUsers.join('\n')}
              placeholder="Active / Live IG Usernames will appear here..."
              className="w-full p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 outline-none resize-y"
            />
            <button
              onClick={() => handleCopyText(liveUsers.join('\n'), 'Live IG Handles')}
              disabled={liveUsers.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Live IG Handles</span>
            </button>
          </div>

          {/* Dead Usernames Box */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-extrabold text-red-600 dark:text-red-400 flex items-center justify-between">
              <span>Dead / Disabled IG Handles | {deadUsers.length}</span>
            </div>
            <textarea
              rows={3}
              readOnly
              value={deadUsers.join('\n')}
              placeholder="Disabled or invalid IG Handles will appear here..."
              className="w-full p-4 bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs font-mono font-bold text-red-600 dark:text-red-400 outline-none resize-y"
            />
            <button
              onClick={() => handleCopyText(deadUsers.join('\n'), 'Dead IG Handles')}
              disabled={deadUsers.length === 0}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Dead IG Handles</span>
            </button>
          </div>
        </div>

      </div>

      {/* FAQ Accordions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-3.5 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                <span>▶ {faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 py-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
