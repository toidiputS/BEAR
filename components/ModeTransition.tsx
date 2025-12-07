
import React from 'react';
import { Mode } from '../types';
import Icon from './Icon';

interface Props {
  mode: Mode;
}

const ModeTransition: React.FC<Props> = ({ mode }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
      <style>{`
        @keyframes ripple-paws {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ripple-claws {
          0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
          50% { transform: scale(0.9); opacity: 1; border-width: 8px; }
          100% { transform: scale(1.5); opacity: 0; border-width: 0px; }
        }
        .animate-ripple-paws {
          animation: ripple-paws 0.6s ease-out forwards;
        }
        .animate-ripple-claws {
          animation: ripple-claws 0.5s cubic-bezier(0,1,0.5,1) forwards;
        }
      `}</style>
      
      {mode === 'PAWS' ? (
        <div className="relative">
          <div className="absolute inset-0 bg-paws-accent rounded-full animate-ripple-paws opacity-30" />
          <div className="absolute inset-0 bg-paws-accent rounded-full animate-ripple-paws opacity-20 delay-100" />
          <div className="bg-[#E4E4DC] p-6 rounded-full shadow-xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
             <Icon name="Coffee" size={48} className="text-paws-accent" />
             <span className="text-paws-accent font-mono font-bold text-xs mt-2 tracking-widest">RELAX</span>
          </div>
        </div>
      ) : (
        <div className="relative">
           <div className="absolute inset-0 border-4 border-claws-text rounded-lg animate-ripple-claws" />
           <div className="bg-stone-900 border-2 border-claws-text p-6 rounded-lg shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center animate-in fade-in zoom-in duration-200">
             <Icon name="ShieldAlert" size={48} className="text-claws-text" />
             <span className="text-claws-text font-mono font-bold text-xs mt-2 tracking-widest">ENGAGE</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default ModeTransition;
