import React from 'react';
import Icon from './Icon';

const BearHug: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px]">
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      <div className="bg-stone-900 border-2 border-paws-accent p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-pop">
        <div className="relative">
          <Icon name="Bot" size={80} className="text-stone-200" />
          <div className="absolute -bottom-2 -right-2 text-paws-accent animate-bounce">
             <Icon name="Heart" size={32} fill="currentColor" className="drop-shadow-lg" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold font-mono text-white tracking-widest">BEAR HUG</h2>
          <p className="text-xs font-mono text-paws-accent uppercase tracking-wider mt-1">Thought Secured</p>
        </div>
      </div>
    </div>
  );
};

export default BearHug;