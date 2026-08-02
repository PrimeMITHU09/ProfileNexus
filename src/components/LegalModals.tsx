import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, Info, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// -----------------------------------------------------------------------------
// 1. PRIVACY POLICY MODAL
// -----------------------------------------------------------------------------
export const PrivacyPolicyModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Privacy Policy</h2>
              <p className="text-xs text-slate-400 font-mono">Last Updated: August 2026 | Google AdSense Compliant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">1. Information We Collect</h3>
            <p>
              ProfileNexus (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a privacy-centric identity generation, 2FA code authenticator, and social analytics web suite. We do not collect or store personal real-world identities, financial credentials, or private user passwords. Transient logs generated during account status verification or IP checks are stored securely in memory for operational security and are never sold to third parties.
            </p>
          </section>

          <section className="space-y-2 bg-indigo-950/30 p-4 rounded-2xl border border-indigo-500/20">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              2. Google AdSense & Third-Party Advertising Cookies
            </h3>
            <p>
              We use <strong>Google AdSense</strong> (Publisher ID: <code className="text-amber-300">ca-pub-4741085747836613</code>) to serve advertisements when you visit our website. Google may use cookies (such as the DoubleClick DART cookie) to serve ads based on user visits to this and other websites on the Internet.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
              <li>Third-party vendors, including Google, use cookies to serve ads based on prior user visits.</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-sky-400 underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-sky-400 underline">aboutads.info</a>.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">3. Cookies and Web Beacons</h3>
            <p>
              Like any web application, ProfileNexus uses local storage and cookies to store session tokens, theme preferences (dark mode), and user credit counts. Third-party advertisers may use technology such as cookies and web beacons when they advertise on our site.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">4. Data Security & User Rights</h3>
            <p>
              Under GDPR, CCPA, and global privacy standards, you have the right to request deletion of your account data or object to tracking. Since all synthetic profiles generated on ProfileNexus are randomized mock data, no personal data profiles are harvested or retained.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-white">Contacting Our Data Protection Officer</h3>
            <p>
              For any privacy queries, email us directly at <span className="text-sky-400 font-mono font-bold">privacy@profilenexus.com</span>.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 2. TERMS OF SERVICE MODAL
// -----------------------------------------------------------------------------
export const TermsOfServiceModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Terms of Service</h2>
              <p className="text-xs text-slate-400 font-mono">Effective Date: August 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">1. Acceptance of Terms</h3>
            <p>
              By accessing or using ProfileNexus, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">2. Acceptable Use Policy</h3>
            <p>
              ProfileNexus provides synthetic identity generation, 2FA secret key verification, and public account status tools for software testing, quality assurance, and security research. Users agree NOT to use this service for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
              <li>Identity theft, fraudulent activity, or illegal impersonation.</li>
              <li>Automated spamming, malicious scraping, or Denial of Service attacks.</li>
              <li>Bypassing security measures or abusing credit allocation mechanisms.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400">3. Disclaimer of Warranties</h3>
            <p>
              The services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. ProfileNexus does not guarantee that social account status verification tools will remain uninterrupted or error-free.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-white">4. Limitation of Liability</h3>
            <p>
              In no event shall ProfileNexus, its owners, or developers be liable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use this platform.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 3. CONTACT US MODAL
// -----------------------------------------------------------------------------
export const ContactUsModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Contact Us</h2>
              <p className="text-xs text-slate-400 font-mono">We usually respond within 24 hours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-extrabold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400">Thank you for reaching out. Our support team will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message / Support Query</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Direct Email: support@profilenexus.com</span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. ABOUT US MODAL
// -----------------------------------------------------------------------------
export const AboutUsModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">About ProfileNexus</h2>
              <p className="text-xs text-slate-400 font-mono">Next-Generation Identity & Social Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>ProfileNexus</strong> is an all-in-one web suite crafted for digital marketers, quality assurance engineers, and security researchers. Our platform streamlines synthetic identity generation, social media account verification, live 2FA TOTP calculations, and IP intelligence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-extrabold text-white text-xs text-indigo-400">🛡️ 2FA.Live Authenticator</h4>
              <p className="text-[11px] text-slate-400">Generates instant 6-digit TOTP authentication codes from secret keys adhering to RFC 6238 standards.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-extrabold text-white text-xs text-purple-400">👤 Identity Synthesis</h4>
              <p className="text-[11px] text-slate-400">Generates randomized identity personas with custom age ranges, email providers, and DiceBear avatars.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-extrabold text-white text-xs text-sky-400">📘 Social Account Verification</h4>
              <p className="text-[11px] text-slate-400">Bulk checks Facebook and Instagram UIDs to sort active versus disabled account handles.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-extrabold text-white text-xs text-emerald-400">🌐 IP & Network Intelligence</h4>
              <p className="text-[11px] text-slate-400">Real-time IP geolocation, proxy/VPN flag detection, and network security diagnostic tools.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Version: 2.5.0 Pro Suite</span>
            <span>Built with React 19 & TypeScript</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
