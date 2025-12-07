
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Message, Mode, JournalEntry, Settings as SettingsType, UserProfile } from './types';
import { generateBearResponse } from './services/geminiService';
import { playModeTransitionSound } from './services/audioService';
import { initSupabase } from './services/supabaseService';
import { MASTER_QUICK_ACTIONS } from './constants';
import SplashScreen from './components/SplashScreen';
import ModeToggle from './components/ModeToggle';
import ChatMessage from './components/ChatMessage';
import Journal from './components/Journal';
import Settings from './components/Settings';
import Icon from './components/Icon';
import Onboarding from './components/Onboarding';
import BearHug from './components/BearHug';
import ChaosOverlay from './components/ChaosOverlay';
import ModeTransition from './components/ModeTransition';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_SETTINGS: SettingsType = {
  dailyReminders: true,
  crisisAlerts: true,
  supabaseUrl: '',
  supabaseKey: ''
};

const App: React.FC = () => {
  // State
  const [showSplash, setShowSplash] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<Mode>('PAWS');
  const [messages, setMessages] = useState<Message[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Overlays
  const [showJournal, setShowJournal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBearHug, setShowBearHug] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showChaos, setShowChaos] = useState(false);
  const [showModeTransition, setShowModeTransition] = useState(false);

  // Dynamic Content State
  const [activeQuickActions, setActiveQuickActions] = useState(MASTER_QUICK_ACTIONS.slice(0, 6));

  // Gamification State
  const [pokeCount, setPokeCount] = useState(0);
  const [pokeMessage, setPokeMessage] = useState<string | null>(null);
  const [dnpPosition, setDnpPosition] = useState({ top: '15%', left: '85%' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // STT Hook
  const { isListening, transcript, startListening, stopListening, hasSupport, resetTranscript } = useSpeechRecognition();

  // Sync transcript to input
  useEffect(() => {
    if (transcript) {
      setInputText(prev => prev + ' ' + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bear_app_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.messages || []);
      setJournal(parsed.journal || []);
      setMode(parsed.mode || 'PAWS');
      if (parsed.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        // Initialize Supabase if credentials exist
        if (parsed.settings.supabaseUrl && parsed.settings.supabaseKey) {
          initSupabase(parsed.settings.supabaseUrl, parsed.settings.supabaseKey);
        }
      }
      if (parsed.user) setUser(parsed.user);
      if (parsed.hasOnboarded) {
        setHasOnboarded(true);
      }
    }
    // Randomize actions on mount
    refreshQuickActions();
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!showSplash) {
      localStorage.setItem('bear_app_state', JSON.stringify({
        messages,
        journal,
        mode,
        settings,
        user,
        hasOnboarded
      }));
    }
  }, [messages, journal, mode, settings, user, hasOnboarded, showSplash]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clear poke message after delay
  useEffect(() => {
    if (pokeMessage) {
      const t = setTimeout(() => setPokeMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [pokeMessage]);

  // Move the Do Not Press button randomly
  useEffect(() => {
    const moveButton = () => {
      // Keep it within 15% - 85% vertical and 10% - 80% horizontal to avoid header/footer/edges
      const randomTop = 15 + Math.random() * 70;
      const randomLeft = 10 + Math.random() * 70;
      setDnpPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
    };

    // Initial move
    moveButton();

    // Move every 5 seconds
    const interval = setInterval(moveButton, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshQuickActions = () => {
    // Shuffle and pick 6
    const shuffled = [...MASTER_QUICK_ACTIONS].sort(() => 0.5 - Math.random());
    setActiveQuickActions(shuffled.slice(0, 6));
  };

  const handleModeChange = (newMode: Mode) => {
    if (mode === newMode) return;

    playModeTransitionSound(newMode);
    setShowModeTransition(true);
    setMode(newMode);

    setTimeout(() => {
      setShowModeTransition(false);
    }, 1000);
  };

  const handleSendMessage = async (text: string, promptOverride?: string) => {
    if (!text.trim() || isLoading) return;

    const newMessage: Message = {
      id: generateId(),
      role: 'user',
      text: text, // Always display the clean text
      timestamp: Date.now(),
      reactions: []
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Pass the entire history PLUS the new message context.
      // We send 'promptOverride' if it exists (for quick actions), otherwise 'text'.
      const actualPrompt = promptOverride || text;

      const responseText = await generateBearResponse(
        [...messages, newMessage],
        mode,
        actualPrompt,
        user // Pass user profile for personalization
      );

      const botMessage: Message = {
        id: generateId(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        mode: mode, // Tag the message with the mode that generated it
        reactions: []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error handled in service mostly, but fallback here
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to force varied responses from Quick Actions
  const handleQuickAction = (action: typeof MASTER_QUICK_ACTIONS[0]) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const term = mode === 'PAWS' ? 'Strategy' : 'Maneuver';

    // We append a hidden system instruction to the prompt to force variety.
    // The user sees the clean prompt, but the LLM sees the directive.
    const hiddenInstruction = `\n\n[SYSTEM: IGNORE PREVIOUS CACHED PATTERNS. Execute ${term} ${randomLetter} from your instructions immediately.]`;

    handleSendMessage(action.prompt, action.prompt + hiddenInstruction);
  };

  const saveToJournal = (text: string) => {
    const entry: JournalEntry = {
      id: generateId(),
      content: text,
      timestamp: Date.now(),
      mode: mode
    };
    setJournal(prev => [entry, ...prev]);

    // Trigger celebratory animation
    setShowBearHug(true);
    setTimeout(() => setShowBearHug(false), 2000);
  };

  const deleteJournalEntry = (id: string) => {
    setJournal(prev => prev.filter(entry => entry.id !== id));
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions || [];
        // Toggle: remove if exists, add if not
        const newReactions = currentReactions.includes(emoji)
          ? currentReactions.filter(r => r !== emoji)
          : [...currentReactions, emoji];
        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));
  };

  const updateSettings = (key: keyof SettingsType, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      // If updating Supabase credentials, re-init service
      if (key === 'supabaseUrl' || key === 'supabaseKey') {
        if (newSettings.supabaseUrl && newSettings.supabaseKey) {
          initSupabase(newSettings.supabaseUrl, newSettings.supabaseKey);
        }
      }
      return newSettings;
    });
  };

  const handleClearHistory = () => {
    setMessages([]);
    setShowResetConfirm(false);
    refreshQuickActions(); // Randomize buttons again when returning to menu
  };

  const handleReturnToMenu = () => {
    if (messages.length > 0) {
      setShowResetConfirm(true);
    } else {
      // If already at menu (no messages), trigger splash as a system reboot
      setShowSplash(true);
      refreshQuickActions();
    }
  };

  const handleBotPoke = () => {
    const newCount = pokeCount + 1;
    setPokeCount(newCount);

    // Gamification: "Poke the Bear" logic
    if (newCount === 3) {
      setPokeMessage(mode === 'PAWS' ? "Please do not poke the bear. I am napping." : "UNAUTHORIZED CONTACT. CEASE.");
    } else if (newCount === 8) {
      setPokeMessage(mode === 'PAWS' ? "Seriously. Personal space." : "TACTICAL COUNTERMEASURES ENGAGED. (Just kidding, stop it.)");
    } else if (newCount > 15) {
      setPokeMessage("You are very persistent.");
      setPokeCount(0); // Reset
    }
  };

  const completeOnboarding = (name: string, email: string) => {
    setUser({ name, email });
    setHasOnboarded(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} userName={user?.name} />;
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  // Theme classes based on mode
  const themeContainer = mode === 'PAWS'
    ? 'bg-paws-bg text-paws-text selection:bg-paws-accent/30'
    : 'bg-claws-bg text-stone-300 selection:bg-claws-text/30 claws-mode';

  const headerClass = mode === 'PAWS'
    ? 'bg-paws-surface border-b border-paws-border'
    : 'bg-claws-surface border-b border-claws-border';

  // Apply mode class to wrapper to activate CSS variables
  const wrapperModeClass = mode === 'PAWS' ? 'paws-mode' : 'claws-mode';

  return (
    <div className={`flex flex-col h-screen w-full transition-colors duration-500 relative overflow-hidden ${themeContainer} ${wrapperModeClass}`}>

      {/* FLOATING DISTRACTION / CHAOS BUTTON */}
      <button
        onClick={() => setShowChaos(true)}
        style={{ top: dnpPosition.top, left: dnpPosition.left }}
        className="fixed z-30 p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-[2000ms] ease-in-out shadow-lg hover:shadow-red-500/40 border border-red-500/20 group backdrop-blur-sm"
        title="DO NOT PRESS"
      >
        <Icon name="TriangleAlert" size={24} className="animate-pulse" />
        <span className="sr-only">DO NOT PRESS</span>
      </button>

      {/* HEADER */}
      <header className={`px-4 py-3 flex items-center justify-between shrink-0 shadow-sm transition-colors duration-500 z-40 relative ${headerClass}`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={messages.length > 0 ? handleReturnToMenu : handleBotPoke}
              className={`p-2 rounded-lg transition-colors duration-200 ${mode === 'PAWS'
                ? 'text-stone-600 hover:bg-black/5'
                : 'text-stone-400 hover:bg-white/10'
                }`}
              title={messages.length > 0 ? "Return to Menu" : "Poke the Bear"}
            >
              <Icon name="Bot" size={24} />
            </button>
            {/* Poke Message Toast */}
            {pokeMessage && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-black text-white text-xs font-mono p-2 rounded z-50 pointer-events-none animate-bounce">
                {pokeMessage}
              </div>
            )}
          </div>

          <div className="w-44 sm:w-48">
            <ModeToggle mode={mode} onToggle={handleModeChange} />
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowJournal(true)}
            className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition ${mode === 'PAWS' ? 'text-stone-600' : 'text-stone-400'}`}
            title="System Logs"
          >
            <Icon name="Book" size={20} />
          </button>

          {/* SETTINGS BUTTON */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition ${mode === 'PAWS' ? 'text-stone-600' : 'text-stone-400'}`}
            title="Settings"
          >
            <Icon name="Settings" size={20} />
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-80 space-y-8">
            <div className="text-center space-y-2 max-w-xs animate-in fade-in zoom-in duration-500">
              <Icon name="Activity" size={48} className={`mx-auto mb-4 ${mode === 'PAWS' ? 'text-paws-accent' : 'text-claws-text'}`} />
              <h2 className="font-mono font-bold text-lg">AWAITING INPUT</h2>
              <p className="text-sm opacity-70">
                {mode === 'PAWS'
                  ? "Passive Wellness Subsystem is monitoring. Vital signs stable."
                  : "Critical Level protocols active. Tactical support standing by."}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl px-2">
              {activeQuickActions.map((action, idx) => (
                <div
                  key={action.id}
                  className="animate-slide-up-fade fill-mode-forwards opacity-0"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <button
                    onClick={() => handleQuickAction(action)}
                    className={`w-full h-full flex flex-col items-center p-4 rounded-xl border transition-all duration-300 group
                      hover:-translate-y-1 hover:shadow-lg
                    ${mode === 'PAWS'
                        ? 'bg-[#F2F2EC] border-paws-border hover:border-paws-accent shadow-sm'
                        : 'bg-stone-800 border-stone-700 hover:border-claws-text hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      }`}
                  >
                    <div className="animate-float">
                      <Icon name={action.icon} size={24} className={`mb-3 transition-colors ${mode === 'PAWS' ? 'text-paws-accent group-hover:text-paws-text' : 'text-claws-text group-hover:text-white'}`} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-center leading-tight">{action.label}</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={refreshQuickActions}
              className="text-xs font-mono opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 animate-in fade-in delay-700 duration-500"
            >
              <Icon name="RefreshCcw" size={12} />
              REFRESH PROTOCOLS
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            currentMode={mode}
            onSave={saveToJournal}
            onReaction={handleToggleReaction}
            onChaos={() => setShowChaos(true)}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono opacity-50 ml-4 animate-pulse">
            <Icon name="Cpu" size={14} />
            <span>PROCESSING EMOTIONAL VECTOR...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* INPUT AREA */}
      <footer className={`p-4 shrink-0 transition-colors duration-500 z-40 relative ${mode === 'PAWS' ? 'bg-[#D8D8D0] border-t border-paws-border' : 'bg-stone-900 border-t border-stone-800'}`}>
        <div className="max-w-4xl mx-auto flex gap-2">
          {/* MIC BUTTON */}
          {hasSupport && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : mode === 'PAWS' ? 'bg-[#F2F2EC] text-stone-600 hover:bg-white' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              title={isListening ? "Stop Listening" : "Speak"}
            >
              <Icon name={isListening ? "MicOff" : "Mic"} size={20} />
            </button>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={mode === 'PAWS' ? "Enter thoughts for processing..." : "REPORT STATUS IMMEDIATELY..."}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl outline-none border transition-all ${mode === 'PAWS'
              ? 'bg-[#F2F2EC] border-[#C8C8C0] focus:border-paws-accent focus:ring-1 focus:ring-paws-accent/50 text-stone-800 placeholder:text-stone-400'
              : 'bg-stone-950 border-stone-700 focus:border-claws-text focus:ring-1 focus:ring-claws-text/50 text-amber-500 placeholder:text-stone-700 font-mono text-sm'
              }`}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'PAWS'
              ? 'bg-paws-accent text-white hover:bg-[#5E6B52] shadow-sm'
              : 'bg-claws-text text-black hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              }`}
          >
            <Icon name="Send" size={20} />
          </button>
        </div>
      </footer>

      {/* OVERLAYS */}
      <Journal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        entries={journal}
        onDelete={deleteJournalEntry}
      />

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        mode={mode}
        settings={settings}
        userName={user?.name}
        onUpdateSettings={updateSettings}
        onResetOnboarding={() => {
          setHasOnboarded(false);
          setShowSettings(false);
          setUser(null); // Clear user state to trigger fresh onboarding
        }}
      />

      {showBearHug && <BearHug />}

      {showChaos && <ChaosOverlay onComplete={() => setShowChaos(false)} />}

      {showModeTransition && <ModeTransition mode={mode} />}

      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl border-2 ${mode === 'PAWS' ? 'bg-[#E4E4DC] border-stone-300' : 'bg-stone-900 border-red-500/30'}`}>
            <h3 className={`text-lg font-bold font-mono mb-2 ${mode === 'PAWS' ? 'text-stone-800' : 'text-red-500'}`}>
              RETURN TO MENU?
            </h3>
            <p className={`text-sm mb-6 ${mode === 'PAWS' ? 'text-stone-600' : 'text-stone-400'}`}>
              This will clear the current conversation and return you to the main selection screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm ${mode === 'PAWS' ? 'bg-stone-200 text-stone-600' : 'bg-stone-800 text-stone-400'}`}
              >
                CANCEL
              </button>
              <button
                onClick={handleClearHistory}
                className={`flex-1 py-3 rounded-xl font-bold text-sm ${mode === 'PAWS' ? 'bg-stone-800 text-white' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
