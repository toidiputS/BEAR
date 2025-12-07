
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Mode } from '../types';
import Icon from './Icon';

interface Props {
  message: Message;
  currentMode: Mode;
  onSave?: (text: string) => void;
  onReaction?: (id: string, emoji: string) => void;
  onChaos?: () => void;
}

const REACTION_OPTIONS = ['🐻', '🫡', '❤️', '😂', '💤', '🔥'];

const ChatMessage: React.FC<Props> = ({ message, currentMode, onSave, onReaction, onChaos }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';
  
  const isPaws = message.mode === 'PAWS';
  const isClaws = message.mode === 'CLAWS';

  let bubbleClass = '';
  
  if (isUser) {
    bubbleClass = 'bg-[#F2F2EC] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 self-end ml-8';
  } else if (isPaws) {
    bubbleClass = 'bg-[#D8D8D0] text-[#3E3E38] border border-[#C8C8C0] self-start mr-8';
  } else if (isClaws) {
    bubbleClass = 'bg-stone-900 text-amber-500 border border-amber-900/50 self-start mr-8 font-mono tracking-tight';
  } else {
    bubbleClass = 'bg-stone-300 text-stone-700 self-start mr-8';
  }

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(false);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPicker]);

  // Deterministic chaos check
  const showChaosButton = !isUser && onChaos && (() => {
    let hash = 0;
    const str = message.id;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; 
    }
    return Math.abs(hash) % 8 === 0;
  })();

  const activeReactions = message.reactions || [];

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'} max-w-full animate-fade-in group/container overflow-x-hidden`}>
      <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed break-words relative group max-w-full ${bubbleClass} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
        <ReactMarkdown>{message.text}</ReactMarkdown>
        
        {/* Actions Row (Inside Bubble at Bottom) */}
        <div className={`flex flex-wrap items-center gap-2 mt-2 pt-2 border-t ${isUser ? 'border-stone-300/50 dark:border-stone-700' : 'border-black/5'} opacity-70`}>
           {!isUser && onSave && (
            <button 
              onClick={() => onSave(message.text)}
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-current opacity-60 hover:opacity-100"
              title="Log to Journal"
            >
              <Icon name="Bookmark" size={14} />
            </button>
          )}
          {onReaction && (
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className={`p-1 rounded-full transition-colors flex items-center gap-1 text-current ${showReactionPicker ? 'bg-black/10 dark:bg-white/10 opacity-100' : 'opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'}`}
                title="Add Reaction"
              >
                <Icon name="Smile" size={14} />
                {activeReactions.length === 0 && <span className="text-[10px] opacity-70">React</span>}
              </button>

              {/* Reaction Picker Popover */}
              {showReactionPicker && (
                <div className={`absolute bottom-full mb-2 ${isUser ? 'right-0' : 'left-0'} z-20 flex gap-1 p-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full shadow-xl animate-in fade-in zoom-in duration-200 min-w-max`}>
                  {REACTION_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReaction(message.id, emoji);
                        setShowReactionPicker(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-lg transition-transform hover:scale-125 active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Spacer */}
          <div className="flex-1 min-w-[4px]"></div>

           {/* Active Reactions Display */}
          {activeReactions.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {activeReactions.map((emoji, idx) => (
                <span 
                  key={idx} 
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] shadow-sm cursor-default select-none animate-pop ${
                    isUser 
                      ? 'bg-white/50 dark:bg-black/20' 
                      : isPaws 
                        ? 'bg-white/50' 
                        : 'bg-amber-900/20 text-amber-500 border border-amber-900/30'
                  }`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>


        {/* Random Distraction Button */}
        {showChaosButton && (
          <div className="mt-4 pt-2 border-t border-current/20">
            <button
              onClick={onChaos}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider opacity-70 hover:opacity-100 transition-all hover:scale-105 bg-red-500/10 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full"
            >
              <Icon name="TriangleAlert" size={12} />
              <span>Do Not Press</span>
            </button>
          </div>
        )}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-stone-500 mt-1 px-1">
        {isUser ? 'USER INPUT' : message.mode ? `SYS.${message.mode}` : 'SYSTEM'}
      </span>
    </div>
  );
};

export default ChatMessage;
