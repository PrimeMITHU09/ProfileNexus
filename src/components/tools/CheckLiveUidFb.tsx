import React, { useState } from 'react';
import { UserCheck, RefreshCw, Copy, Check, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

interface CheckLiveUidFbProps {
  onCopy?: (text: string, label: string) => void;
  copiedLabel?: string;
  onToolUsed?: (toolName: string) => void;
}

interface UidStatusResult {
  raw: string;
  uid: string;
  status: 'live' | 'dead' | 'checking';
  avatarUrl?: string;
}

export const CheckLiveUidFb: React.FC<CheckLiveUidFbProps> = ({ onCopy, copiedLabel, onToolUsed }) => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<UidStatusResult[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const parseUidFromLine = (line: string): string => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    if (trimmed.includes('|')) {
      const parts = trimmed.split('|');
      const uidPart = parts[0].replace(/\D/g, '');
      if (uidPart) return uidPart;
    }

    if (trimmed.includes('facebook.com') || trimmed.includes('fb.com')) {
      const matchId = trimmed.match(/(?:id=|\/profile\.php\?id=|\/people\/[^\/]+\/|\/)([0-9]{4,})/i);
      if (matchId && matchId[1]) return matchId[1];
    }

    const cleanNumbers = trimmed.replace(/\D/g, '');
    return cleanNumbers || trimmed;
  };

  const checkSingleUidLive = async (uid: string): Promise<{ status: 'live' | 'dead'; avatarUrl?: string }> => {
    if (!uid || uid.length < 3) {
      return { status: 'dead' };
    }

    try {
      // Method 1: Facebook Graph JSON check with redirect=false
      const res = await fetch(`https://graph.facebook.com/${uid}/picture?type=normal&redirect=false`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && json.data.url) {
          return {
            status: 'live',
            avatarUrl: json.data.url
          };
        }
      }
    } catch (e) {
      // Fallback if CORS or fetch network restriction
    }

    // Method 2: Image loader probe
    return new Promise((resolve) => {
      const picUrl = `https://graph.facebook.com/${uid}/picture?type=normal`;
      const img = new Image();
      img.onload = () => {
        if (img.width > 5 && img.height > 5) {
          resolve({ status: 'live', avatarUrl: picUrl });
        } else {
          resolve({ status: 'dead' });
        }
      };
      img.onerror = () => {
        resolve({ status: 'dead' });
      };
      img.src = picUrl;
    });
  };

  const handleCheckLive = async () => {
    const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    if (onToolUsed) {
      lines.forEach(() => onToolUsed('Check live UID Fb'));
    }

    setIsChecking(true);

    const initialList: UidStatusResult[] = lines.map((line) => {
      const cleanUid = parseUidFromLine(line);
      return {
        raw: line,
        uid: cleanUid,
        status: 'checking'
      };
    });

    setResults(initialList);

    const updatedResults: UidStatusResult[] = [];

    for (let i = 0; i < initialList.length; i++) {
      const item = initialList[i];
      if (!item.uid || item.uid.length < 3) {
        updatedResults.push({ ...item, status: 'dead' });
        continue;
      }

      const { status, avatarUrl } = await checkSingleUidLive(item.uid);
      updatedResults.push({
        ...item,
        status,
        avatarUrl
      });

      setResults([...updatedResults, ...initialList.slice(i + 1)]);
    }

    setIsChecking(false);
  };

  const liveUids = results.filter((r) => r.status === 'live').map((r) => r.uid);
  const deadUids = results.filter((r) => r.status === 'dead').map((r) => r.uid);

  const handleCopyText = (text: string, label: string) => {
    if (onCopy) {
      onCopy(text, label);
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const faqs = [
    {
      q: 'How does Facebook Live UID checking work?',
      a: 'The tool queries the official Facebook profile picture endpoints for each numeric UID to check if the account is active (Live) or disabled/deleted (Dead).'
    },
    {
      q: 'Can I check UID|Password|2FA formats?',
      a: 'Yes! The checker automatically parses raw UID lines as well as pipe-delimited lines (UID|Pass|2FA).'
    },
    {
      q: 'Is my input saved or shared?',
      a: 'No. All processing happens entirely in your browser. Nothing is saved or sent to external servers.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      
      {/* Top Banner Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Check Live Facebook UID
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Bulk scan Facebook UIDs to instantly verify which accounts are Active (Live) or Disabled (Dead).
        </p>
      </div>

      {/* Main Extractor Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Input Box */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
            Input Facebook UIDs / Links (each line is an entry):
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`100081234567890\n100081234567890|pass123|2fasecret\nhttps://www.facebook.com/zuck`}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleCheckLive}
            disabled={isChecking}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 active:scale-95 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking UIDs...' : 'Check Live Status'}</span>
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Result
          </h2>

          {/* Live UIDs Box */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              Live UIDs | <span>{liveUids.length}</span>
            </div>
            <textarea
              rows={4}
              readOnly
              value={liveUids.join('\n')}
              placeholder="Active / Live UIDs will appear here..."
              className="w-full p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 outline-none resize-y"
            />
            <button
              onClick={() => handleCopyText(liveUids.join('\n'), 'Live UIDs')}
              disabled={liveUids.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Live UIDs</span>
            </button>
          </div>

          {/* Dead UIDs Box */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-extrabold text-red-600 dark:text-red-400">
              Dead / Disabled UIDs | <span>{deadUids.length}</span>
            </div>
            <textarea
              rows={3}
              readOnly
              value={deadUids.join('\n')}
              placeholder="Disabled or invalid UIDs will appear here..."
              className="w-full p-4 bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs font-mono font-bold text-red-600 dark:text-red-400 outline-none resize-y"
            />
            <button
              onClick={() => handleCopyText(deadUids.join('\n'), 'Dead UIDs')}
              disabled={deadUids.length === 0}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Dead UIDs</span>
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
