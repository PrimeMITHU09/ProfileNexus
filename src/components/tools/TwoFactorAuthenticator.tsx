import React, { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';
import { Shield, Copy, Check, RefreshCw, Key, Clock, AlertCircle } from 'lucide-react';

interface TwoFactorAuthenticatorProps {
  onCopy?: (text: string, label: string) => void;
  copiedLabel?: string;
  onToolUsed?: (toolName: string) => void;
}

export const TwoFactorAuthenticator: React.FC<TwoFactorAuthenticatorProps> = ({
  onCopy,
  copiedLabel,
  onToolUsed
}) => {
  const [secretInput, setSecretInput] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Generate TOTP code
  const updateTotp = (key: string) => {
    if (!key.trim()) {
      setTotpCode('');
      setErrorMsg('');
      return;
    }

    try {
      let cleanKey = key.trim();
      // If user pasted UID|PASS|2FA_SECRET or similar pipe string
      if (cleanKey.includes('|')) {
        const parts = cleanKey.split('|');
        const base32Candidate = parts.find((p) => {
          const stripped = p.trim().replace(/[\s-=]/g, '');
          return stripped.length >= 8 && /^[a-zA-Z2-7]+$/.test(stripped);
        }) || parts[parts.length - 1];
        cleanKey = base32Candidate;
      }

      cleanKey = cleanKey.replace(/[\s-=]/g, '').toUpperCase();

      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(cleanKey),
        digits: 6,
        period: 30,
        algorithm: 'SHA1'
      });

      const token = totp.generate();
      setTotpCode(token);
      setErrorMsg('');
      if (onToolUsed) {
        onToolUsed('2FA.Live Authenticator');
      }
    } catch (e) {
      console.error(e);
      setTotpCode('');
      setErrorMsg('Invalid 2FA Secret Key format. Make sure it is Base32 (A-Z, 2-7).');
    }
  };

  // Timer loop
  useEffect(() => {
    const calculateSeconds = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setRemainingTime(remaining === 0 ? 30 : remaining);
      
      if (secretInput) {
        updateTotp(secretInput);
      }
    };

    calculateSeconds();
    const interval = setInterval(calculateSeconds, 1000);
    return () => clearInterval(interval);
  }, [secretInput]);

  const handleCopyCode = () => {
    if (totpCode && onCopy) {
      onCopy(totpCode, '2FA Code');
    } else if (totpCode) {
      navigator.clipboard.writeText(totpCode);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                2FA.Live Authenticator
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                Live TOTP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate 6-digit 2FA authentication codes instantly from secret keys (2FA.Live standard).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Secret Key Input */}
        <div className="lg:col-span-6 space-y-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            2FA Secret Key (2FA.Live Input)
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={secretInput}
              onChange={(e) => {
                setSecretInput(e.target.value);
                updateTotp(e.target.value);
              }}
              placeholder="e.g. JBSWY3DPEHPK3PXP"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none uppercase transition"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}


        </div>

        {/* Right Column: Dynamic Live TOTP Display */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 flex flex-col items-center justify-center space-y-5 text-center shadow-inner">
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <Clock className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>2FA Code Refreshing in {remainingTime}s</span>
          </div>

          {/* Countdown Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remainingTime <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
              }`}
              style={{ width: `${(remainingTime / 30) * 100}%` }}
            />
          </div>

          {/* Code Big Banner */}
          <div className="w-full py-6 px-4 bg-white dark:bg-slate-900 border-2 border-indigo-500/30 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              CURRENT 2FA CODE
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-widest">
              {totpCode ? (
                <span>
                  {totpCode.slice(0, 3)} {totpCode.slice(3)}
                </span>
              ) : (
                <span className="text-slate-300 dark:text-slate-700">------</span>
              )}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            disabled={!totpCode}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {copiedLabel === '2FA Code' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Code Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy 2FA Code</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
