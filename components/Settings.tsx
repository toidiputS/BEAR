
import React, { useState } from 'react';
import { Mode, Settings as SettingsType } from '../types';
import Icon from './Icon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  settings: SettingsType;
  userName?: string;
  onUpdateSettings: (key: keyof SettingsType, value: any) => void;
  onResetOnboarding: () => void;
}

const Settings: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  settings,
  userName,
  onUpdateSettings,
  onResetOnboarding
}) => {
  if (!isOpen) return null;

  const isPaws = mode === 'PAWS';
  const baseBg = isPaws ? 'bg-[#F2F2EC]' : 'bg-stone-900';
  const textPrimary = isPaws ? 'text-stone-800' : 'text-stone-200';
  const textSecondary = isPaws ? 'text-stone-500' : 'text-stone-400';
  const border = isPaws ? 'border-[#C8C8C0]' : 'border-stone-700';
  const headerBg = isPaws ? 'bg-[#E4E4DC]' : 'bg-stone-950';
  const accentText = isPaws ? 'text-paws-accent' : 'text-claws-text';
  const accentBg = isPaws ? 'bg-paws-accent' : 'bg-claws-text';

  const [localUrl, setLocalUrl] = useState(settings.supabaseUrl || '');
  const [localKey, setLocalKey] = useState(settings.supabaseKey || '');

  const handleSaveConnection = () => {
    onUpdateSettings('supabaseUrl', localUrl);
    onUpdateSettings('supabaseKey', localKey);
  };

  const isSupabaseConnected = !!settings.supabaseUrl && !!settings.supabaseKey;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`${baseBg} w-full max-w-lg max-h-[85vh] rounded-xl shadow-2xl flex flex-col border ${border} overflow-hidden`}>

        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${border} ${headerBg}`}>
          <h2 className={`font-mono font-bold text-lg ${textPrimary} flex items-center gap-2`}>
            <Icon name="Settings" size={20} className={accentText} />
            SYSTEM CONFIG
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition ${isPaws ? 'hover:bg-stone-200' : 'hover:bg-stone-800'}`}>
            <Icon name="X" size={20} className={textSecondary} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Notifications Section */}
          <section className="space-y-4">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-widest ${textSecondary}`}>
              Notification Protocols
            </h3>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${border} ${isPaws ? 'bg-stone-50' : 'bg-stone-800/50'}`}>
              <div className="space-y-1">
                <div className={`font-medium ${textPrimary}`}>Daily Nudge</div>
                <div className="text-xs text-stone-500">P.A.W.S. will gently remind you to exist.</div>
              </div>
              <button
                onClick={() => onUpdateSettings('dailyReminders', !settings.dailyReminders)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.dailyReminders ? accentBg : 'bg-stone-300 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.dailyReminders ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${border} ${isPaws ? 'bg-stone-50' : 'bg-stone-800/50'}`}>
              <div className="space-y-1">
                <div className={`font-medium ${textPrimary}`}>Crisis Interruptions</div>
                <div className="text-xs text-stone-500">Allow C.L.A.W.S. to interrupt doom-scrolling.</div>
              </div>
              <button
                onClick={() => onUpdateSettings('crisisAlerts', !settings.crisisAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.crisisAlerts ? accentBg : 'bg-stone-300 dark:bg-stone-700'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.crisisAlerts ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </section>

          {/* Database Connection */}
          <section className="space-y-4">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-widest ${textSecondary}`}>
              Database Connection (Supabase)
            </h3>
            <div className={`p-4 rounded-lg border ${border} ${isPaws ? 'bg-stone-50' : 'bg-stone-800/50'} space-y-3`}>
              <div>
                <label className={`text-xs font-mono ${textSecondary}`}>Project URL</label>
                <input
                  type="text"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className={`w-full mt-1 px-3 py-2 rounded border ${isPaws ? 'bg-white border-stone-300' : 'bg-stone-900 border-stone-600 text-stone-300'} text-xs font-mono`}
                />
              </div>
              <div>
                <label className={`text-xs font-mono ${textSecondary}`}>API Key (Anon)</label>
                <input
                  type="password"
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value)}
                  placeholder="eyJ..."
                  className={`w-full mt-1 px-3 py-2 rounded border ${isPaws ? 'bg-white border-stone-300' : 'bg-stone-900 border-stone-600 text-stone-300'} text-xs font-mono`}
                />
              </div>
              <button
                onClick={handleSaveConnection}
                className={`text-xs font-mono px-4 py-2 rounded ${isPaws ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-stone-700 text-stone-300 hover:bg-stone-600'}`}
              >
                Save Credentials
              </button>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="space-y-4">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-widest ${textSecondary}`}>
              Data & Privacy
            </h3>
            <div className={`p-4 rounded-lg border border-dashed ${isPaws ? 'border-paws-accent/30 bg-paws-accent/5' : 'border-claws-text/30 bg-claws-text/5'}`}>
              <div className="flex items-start gap-3">
                <Icon name={isSupabaseConnected ? "Cloud" : "Lock"} size={20} className={accentText} />
                <div className="space-y-2">
                  <h4 className={`font-bold text-sm ${textPrimary}`}>
                    {isSupabaseConnected ? 'Cloud Sync Active' : 'Local Storage Only'}
                  </h4>
                  <p className={`text-xs ${textSecondary} leading-relaxed`}>
                    {isSupabaseConnected
                      ? "B.E.A.R. is connected to your external database. Data is stored locally and synchronized with your secure database."
                      : "B.E.A.R. does not gossip. All journals, chat history, and emotional breakdowns are stored locally on this device unless external database is configured."
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* System Actions */}
          <section className="space-y-4">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-widest ${textSecondary}`}>
              System Actions
            </h3>
            <button
              onClick={() => {
                if (window.confirm("This will restart the introduction sequence. Your data will remain. Continue?")) {
                  onResetOnboarding();
                  onClose();
                }
              }}
              className={`w-full text-left p-4 rounded-lg border transition-colors flex items-center gap-3 ${border} hover:bg-stone-100 dark:hover:bg-stone-800`}
            >
              <Icon name="RotateCcw" size={18} className={textSecondary} />
              <span className={`text-sm font-medium ${textPrimary}`}>Re-run Calibration (Onboarding)</span>
            </button>
          </section>

        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${border} ${headerBg} text-center space-y-1`}>
          <p className="text-[10px] text-stone-400 font-mono">B.E.A.R. OS v1.0.4 // {userName ? userName.toUpperCase() : 'UNKNOWN'} BUILD</p>
          <a
            href="https://bear.itsai.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-stone-500 hover:text-stone-300 font-mono transition-colors"
          >
            🐻 BEARLY made by TRAD34
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
