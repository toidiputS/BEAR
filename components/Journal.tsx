import React, { useState } from 'react';
import { JournalEntry, Mode } from '../types';
import Icon from './Icon';

interface Props {
  entries: JournalEntry[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAddEntry: (content: string, mood?: string) => void;
  currentMode: Mode;
}

const MOOD_OPTIONS = [
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Reflective' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🎉', label: 'Happy' },
];

const DAILY_PROMPTS = [
  "What's draining your energy today?",
  "Name one thing you're grateful for right now.",
  "What would make today 1% better?",
  "Describe your mood in 3 words.",
  "What's one thing you accomplished recently?",
  "What do you need permission to let go of?",
  "If your feelings were weather, what would it be?",
  "What's one kind thing you can do for yourself today?",
  "What's taking up space in your head?",
  "Write a message to yourself for tomorrow.",
];

const Journal: React.FC<Props> = ({ entries, isOpen, onClose, onDelete, onAddEntry, currentMode }) => {
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  // Get today's prompt based on date
  const todayPrompt = DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length];

  const handleSubmit = () => {
    if (newEntry.trim()) {
      onAddEntry(newEntry.trim(), selectedMood || undefined);
      setNewEntry('');
      setSelectedMood(null);
      setShowComposer(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg max-h-[85vh] rounded-xl shadow-2xl flex flex-col border border-stone-200 dark:border-stone-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950">
          <h2 className="font-mono font-bold text-lg dark:text-stone-200 flex items-center gap-2">
            <Icon name="BookOpen" size={20} />
            SYSTEM LOGS
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComposer(!showComposer)}
              className={`p-2 rounded-lg transition ${showComposer ? 'bg-paws-accent text-white' : 'hover:bg-stone-200 dark:hover:bg-stone-800'}`}
              title="New Entry"
            >
              <Icon name="PenLine" size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition">
              <Icon name="X" size={20} className="text-stone-500" />
            </button>
          </div>
        </div>

        {/* Composer */}
        {showComposer && (
          <div className="p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 space-y-3">
            {/* Daily Prompt */}
            <div className="text-xs font-mono text-stone-500 dark:text-stone-400 italic">
              💡 {todayPrompt}
            </div>

            {/* Text Input */}
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-24 p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-paws-accent/50"
            />

            {/* Mood Tags */}
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => setSelectedMood(selectedMood === mood.emoji ? null : mood.emoji)}
                  className={`px-2 py-1 rounded-full text-xs transition ${selectedMood === mood.emoji
                      ? 'bg-paws-accent text-white'
                      : 'bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600'
                    }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!newEntry.trim()}
              className="w-full py-2 rounded-lg font-mono text-sm font-bold bg-paws-accent text-white hover:bg-paws-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              SAVE ENTRY
            </button>
          </div>
        )}

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-600 font-mono text-sm space-y-2">
              <Icon name="FileText" size={32} className="mx-auto opacity-50" />
              <p>NO DATA RECORDED</p>
              <p className="text-xs">Tap the pen icon to write your first entry.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-100 dark:border-stone-800 relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${entry.mode === 'PAWS' ? 'bg-paws-accent/20 text-paws-accent' : 'bg-claws-text/20 text-claws-text'}`}>
                      {entry.mode}
                    </span>
                    {entry.mood && (
                      <span className="text-sm" title="Mood">{entry.mood}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-sm whitespace-pre-wrap">{entry.content}</p>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="absolute bottom-2 right-2 p-1.5 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-xs text-center text-stone-400 font-mono">
          {entries.length} ENTRIES // ENCRYPTED LOCALLY
        </div>

      </div>
    </div>
  );
};

export default Journal;