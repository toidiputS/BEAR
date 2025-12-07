

import React, { useEffect, useState } from 'react';
import { APP_NAME, APP_SUBTITLE } from '../constants';
import Icon from './Icon';

interface Props {
  onComplete: () => void;
  userName?: string;
}

const SplashScreen: React.FC<Props> = ({ onComplete, userName }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3200);
    const timer4 = setTimeout(onComplete, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-stone-900 text-stone-200 flex flex-col items-center justify-center p-8 font-mono z-50">
      <div className="max-w-md w-full text-center space-y-6">

        <div className={`transition-opacity duration-700 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-24 h-24 bg-stone-800 border-2 border-stone-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <Icon name="Bot" size={48} className="text-stone-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-widest">{APP_NAME}</h1>
        </div>

        <div className={`space-y-2 transition-opacity duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-stone-500 text-sm uppercase tracking-widest">Initialization Sequence</p>
          <p className="text-lg font-medium">{APP_SUBTITLE}</p>
        </div>

        <div className={`bg-stone-800 p-4 rounded border-l-4 border-stone-500 text-left text-xs transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-mono text-green-500">&gt; DETECTING ATTITUDE VECTOR...</p>
          <p className="font-mono text-green-500 delay-75">&gt; CONFIRMING USER ID: {userName ? userName.toUpperCase() : 'UNKNOWN'}...</p>
          <p className="font-mono text-green-500 delay-100">&gt; LOADING P.A.W.S. MODULE...</p>
          <p className="font-mono text-amber-500 delay-200">&gt; LOADING C.L.A.W.S. SAFEGUARDS...</p>
          <p className="font-mono text-stone-400 mt-2">"This device was developed after every normal method failed."</p>
        </div>

        <div className={`text-xs text-stone-600 animate-pulse mt-8 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          SYSTEM READY
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;