
import React, { useState } from 'react';
import Icon from './Icon';

interface Props {
  onComplete: (name: string, email: string) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const steps = [
    {
      theme: 'base',
      bg: 'bg-stone-950',
      text: 'text-stone-200',
      iconColor: 'text-stone-400',
      icon: 'User',
      title: 'IDENTITY REQUIRED',
      subtitle: 'Registration Protocol',
      body: null
    },
    {
      theme: 'base',
      bg: 'bg-stone-900',
      text: 'text-stone-200',
      iconColor: 'text-stone-400',
      icon: 'Cpu',
      title: 'UNIT ACTIVATED',
      subtitle: 'Bifurcated Engine of Attitude Readjustment',
      body: (
        <>
          <p>Welcome to B.E.A.R., {name || 'USER'}. This unit is specifically assigned to you because standard coping mechanisms (deep breathing, screaming into pillows) have failed. We are here to assist.</p>
          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm font-mono opacity-60 mb-1">These are,</p>
            <h3 className="text-xl font-bold font-mono tracking-wider text-white">The B.E.A.R. Necessities</h3>
          </div>
        </>
      )
    },
    {
      theme: 'paws',
      bg: 'bg-paws-bg',
      text: 'text-paws-text',
      iconColor: 'text-paws-accent',
      icon: 'Coffee',
      title: 'SUBSYSTEM: P.A.W.S.',
      subtitle: 'Passive Attitude Wellness Subsystem',
      body: "Status: Online. P.A.W.S. handles general malaise, venting, and existential confusion. It is calm. It is a bear. It is listening. Use for low-intensity regulation."
    },
    {
      theme: 'claws',
      bg: 'bg-claws-bg',
      text: 'text-claws-text',
      iconColor: 'text-claws-accent',
      icon: 'ShieldAlert',
      title: 'SUBSYSTEM: C.L.A.W.S.',
      subtitle: 'Critical Level Attitude Withdrawal Sequence',
      body: "Status: Standby. C.L.A.W.S. handles system overloads. It does not negotiate with your emotions; it stabilizes them. Procedural. Blunt. Effective. Use only during emergencies."
    },
    {
      theme: 'final',
      bg: 'bg-stone-800',
      text: 'text-stone-100',
      iconColor: 'text-green-500',
      icon: 'CheckCircle',
      title: 'CALIBRATION COMPLETE',
      subtitle: 'Protocols Loaded',
      body: "The engine is now online. Please do not feed the algorithms. Select your current status on the dashboard to begin regulation."
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    // Validation for first step
    if (step === 0) {
      if (!name.trim()) {
        setError('Name is required for calibration.');
        return;
      }
      // Valid email regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Valid email format required (e.g. user@domain.com).');
        return;
      }
      
      setError('');
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(name, email);
    }
  };

  return (
    <div className={`fixed inset-0 z-40 flex flex-col transition-colors duration-500 ${currentStep.bg} ${currentStep.text}`}>
      {/* Progress Bar */}
      <div className="flex gap-2 p-8 justify-center max-w-md mx-auto w-full">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i === step 
                ? 'bg-current opacity-100' 
                : i < step ? 'bg-current opacity-40' : 'bg-current opacity-10'
            }`} 
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards key={step}">
        <div className={`mb-8 p-6 rounded-full border-2 border-current opacity-80 ${step !== 0 && 'animate-pulse-slow'}`}>
          <Icon name={currentStep.icon} size={48} className={currentStep.iconColor} />
        </div>
        
        <h2 className="font-mono font-bold text-2xl mb-2 tracking-wider">{currentStep.title}</h2>
        <p className="font-mono text-xs uppercase opacity-60 mb-8 tracking-widest">{currentStep.subtitle}</p>
        
        {step === 0 ? (
          <div className={`w-full space-y-4 text-left ${error ? 'animate-shake' : ''}`}>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-xs font-mono opacity-70 leading-relaxed text-center">
                    Please register your designation. This data is stored locally to personalize your experience.
                </p>
            </div>

            <div>
                <label className="block text-xs font-mono uppercase opacity-60 mb-1 ml-1">Designation (First Name)</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="e.g. Tabi"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg outline-none focus:border-white/50 focus:bg-white/20 focus:scale-[1.02] transition-all font-mono"
                />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase opacity-60 mb-1 ml-1">Communication Link (Email)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="user@example.com"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg outline-none transition-all font-mono focus:bg-white/20 focus:scale-[1.02] ${error && !email.includes('@') ? 'border-red-400' : 'border-white/20 focus:border-white/50'}`}
              />
            </div>
            {error && <p className="text-red-400 text-xs font-mono text-center pt-2 animate-bounce">{error}</p>}
          </div>
        ) : (
          <div className="text-lg leading-relaxed opacity-90 font-sans">
            {currentStep.body}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-8 flex justify-between items-center max-w-md mx-auto w-full">
        {step > 0 && (
          <button 
            onClick={() => onComplete(name || 'User', email || 'anon@bear.app')}
            className="text-xs font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity px-4 py-2"
          >
            Skip Setup
          </button>
        )}
        {step === 0 && <div className="w-24"></div>} {/* Spacer */}

        <button 
          onClick={handleNext}
          className={`px-8 py-3 rounded-lg font-mono font-bold text-sm tracking-wide transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${
             currentStep.theme === 'paws' ? 'bg-paws-accent text-white shadow-paws-accent/20' : 
             currentStep.theme === 'claws' ? 'bg-claws-text text-black shadow-claws-text/20' :
             'bg-white text-black shadow-white/10'
          }`}
        >
          {step === steps.length - 1 ? 'INITIALIZE' : 'NEXT STEP'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
