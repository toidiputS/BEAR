import React from 'react';
import { Mode } from '../types';
import Icon from './Icon';

interface Props {
  mode: Mode;
  onToggle: (mode: Mode) => void;
}

const ModeToggle: React.FC<Props> = ({ mode, onToggle }) => {
  return (
    <div className="flex bg-black/10 dark:bg-black/30 p-1 rounded-lg relative font-mono text-xs font-bold">
      <button
        onClick={() => onToggle('PAWS')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
          mode === 'PAWS' 
            ? 'bg-paws-accent text-white shadow-sm' 
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        }`}
      >
        <Icon name="Coffee" size={14} />
        PAWS
      </button>
      <button
        onClick={() => onToggle('CLAWS')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
          mode === 'CLAWS' 
            ? 'bg-claws-text text-black shadow-sm' 
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        }`}
      >
        <Icon name="ShieldAlert" size={14} />
        CLAWS
      </button>
    </div>
  );
};

export default ModeToggle;