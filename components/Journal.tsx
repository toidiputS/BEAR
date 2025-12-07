import React from 'react';
import { JournalEntry } from '../types';
import Icon from './Icon';

interface Props {
  entries: JournalEntry[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const Journal: React.FC<Props> = ({ entries, isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg max-h-[80vh] rounded-xl shadow-2xl flex flex-col border border-stone-200 dark:border-stone-700 overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950">
          <h2 className="font-mono font-bold text-lg dark:text-stone-200 flex items-center gap-2">
            <Icon name="BookOpen" size={20} />
            SYSTEM LOGS
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition">
            <Icon name="X" size={20} className="text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-600 font-mono text-sm">
              <p>NO DATA RECORDED</p>
              <p className="text-xs mt-2">Mark beneficial directives to save them here.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-lg border border-stone-100 dark:border-stone-800 relative group">
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${entry.mode === 'PAWS' ? 'bg-paws-accent/20 text-paws-accent' : 'bg-claws-text/20 text-claws-text'}`}>
                     {entry.mode}
                   </span>
                   <span className="text-[10px] text-stone-400 font-mono">
                     {new Date(entry.timestamp).toLocaleDateString()}
                   </span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-sm whitespace-pre-wrap">{entry.content}</p>
                <button 
                  onClick={() => onDelete(entry.id)}
                  className="absolute bottom-2 right-2 p-1.5 text-stone-300 hover:text-red-500 transition-colors"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-xs text-center text-stone-400 font-mono">
          B.E.A.R. SECURE STORAGE // ENCRYPTED LOCALLY
        </div>

      </div>
    </div>
  );
};

export default Journal;