
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

  // Interactive Text State
  const [clickedKeywords, setClickedKeywords] = useState<string[]>([]);

  const steps = [
    {
      theme: 'base',
      bg: 'bg-stone-950',
      text: 'text-stone-200',
      iconColor: 'text-stone-400',
      icon: 'User',
      title: 'IDENTITY REQUIRED',
      subtitle: 'Registration Protocol',
      body: null,
      keywords: []
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
          <p>Welcome to B.E.A.R., {name || 'USER'}. This unit is specifically assigned to you because <span data-keyword="standard" className="keyword-span">standard coping mechanisms</span> have failed. We are here to assist.</p>
          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm font-mono opacity-60 mb-1">These are,</p>
            <h3 className="text-xl font-bold font-mono tracking-wider text-white">The B.E.A.R. Necessities</h3>
          </div>
        </>
      ),
      keywords: ['standard']
    },
    {
      theme: 'paws',
      bg: 'bg-paws-bg',
      text: 'text-paws-text',
      iconColor: 'text-paws-accent',
      icon: 'Coffee',
      title: 'SUBSYSTEM: P.A.W.S.',
      subtitle: 'Passive Attitude Wellness Subsystem',
      body: (
        <p>Status: Online. <span data-keyword="PAWS" className="keyword-span font-bold">P.A.W.S.</span> handles general malaise, venting, and existential confusion. It is calm. It is a bear. It is listening.</p>
      ),
      keywords: ['PAWS']
    },
    {
      theme: 'claws',
      bg: 'bg-claws-bg',
      text: 'text-claws-text',
      iconColor: 'text-claws-accent',
      icon: 'ShieldAlert',
      title: 'SUBSYSTEM: C.L.A.W.S.',
      subtitle: 'Critical Level Attitude Withdrawal Sequence',
      body: (
        <p>Status: Standby. <span data-keyword="CLAWS" className="keyword-span font-bold">C.L.A.W.S.</span> handles system overloads. It does not negotiate with your emotions; it <span data-keyword="stabilizes" className="keyword-span font-bold">stabilizes</span> them.</p>
      ),
      keywords: ['CLAWS', 'stabilizes']
    },
    {
      theme: 'final',
      bg: 'bg-stone-800',
      text: 'text-stone-100',
      iconColor: 'text-green-500',
      icon: 'CheckCircle',
      title: 'CALIBRATION COMPLETE',
      subtitle: 'Protocols Loaded',
      body: (
        <p>The engine is now online. Please do not feed the algorithms. Select your <span data-keyword="status" className="keyword-span font-bold">status</span> on the dashboard to begin regulation.</p>
      ),
      keywords: ['status']
    }
  ];

  const currentStep = steps[step];

  // Check if all keywords for current step are clicked
  const isStepComplete = () => {
    if (step === 0) return !!(name.trim() && email.includes('@')); // Normal validation for step 0
    if (!currentStep.keywords || currentStep.keywords.length === 0) return true;
    return currentStep.keywords.every(k => clickedKeywords.includes(k));
  };

  const handleKeywordClick = (keyword: string) => {
    if (!clickedKeywords.includes(keyword)) {
      setClickedKeywords(prev => [...prev, keyword]);
    }
  };

  const handleNext = () => {
    if (!isStepComplete()) {
      if (step === 0) {
        if (!processStep0()) return;
      } else {
        return; // Block if keywords not clicked
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
      setClickedKeywords([]); // Reset for next step
    } else {
      onComplete(name, email);
    }
  };

  const processStep0 = () => {
    if (!name.trim()) {
      setError('Name is required for calibration.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Valid email format required.');
      return false;
    }
    return true;
  };

  // Render body with clickable spans
  const renderBody = () => {
    if (!currentStep.body) return null;
    if (React.isValidElement(currentStep.body)) {
      // Clone element to attach handlers to Spans with data-keyword
      // This is a bit tricky with static JSX.
      // Simpler approach: currentStep.body IS the JSX. We need to ensure the spans inside have onClicks.
      // Since we defined the body in `steps` array above with JSX, we can't easily inject handlers there WITHOUT
      // defining the body as a function of `handleKeywordClick`.
      // Let's refactor `steps` to be a function or use a render helper.
      return (
        <div className="text-lg leading-relaxed opacity-90 font-sans interactive-text">
          {/* We map the pre-defined body content. But since we need interactivity, let's just make the body a function in the array? 
                Actually, simpler: Just redefine the steps array inside the render or use a switch. 
                For now, let's just use a render helper function here for the distinct steps.
            */}
          {step === 1 && (
            <>
              <p>Welcome to B.E.A.R., {name || 'USER'}. This unit is specifically assigned to you because <InteractiveWord word="standard coping mechanisms" id="standard" onClick={handleKeywordClick} clicked={clickedKeywords.includes('standard')} /> have failed. We are here to assist.</p>
              <div className="mt-8 flex flex-col items-center">
                <p className="text-sm font-mono opacity-60 mb-1">These are,</p>
                <h3 className="text-xl font-bold font-mono tracking-wider text-white">The B.E.A.R. Necessities</h3>
              </div>
            </>
          )}
          {step === 2 && (
            <p>Status: Online. <InteractiveWord word="P.A.W.S." id="PAWS" onClick={handleKeywordClick} clicked={clickedKeywords.includes('PAWS')} /> handles general malaise, venting, and existential confusion. It is calm. It is a bear. It is listening.</p>
          )}
          {step === 3 && (
            <p>Status: Standby. <InteractiveWord word="C.L.A.W.S." id="CLAWS" onClick={handleKeywordClick} clicked={clickedKeywords.includes('CLAWS')} /> handles system overloads. It does not negotiate with your emotions; it <InteractiveWord word="stabilizes" id="stabilizes" onClick={handleKeywordClick} clicked={clickedKeywords.includes('stabilizes')} /> them.</p>
          )}
          {step === 4 && (
            <p>The engine is now online. Please do not feed the algorithms. Select your <InteractiveWord word="status" id="status" onClick={handleKeywordClick} clicked={clickedKeywords.includes('status')} /> on the dashboard to begin regulation.</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`fixed inset-0 z-40 flex flex-col transition-colors duration-500 ${currentStep.bg} ${currentStep.text}`}>
      {/* Progress Bar */}
      <div className="flex gap-2 p-8 justify-center max-w-md mx-auto w-full">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i === step
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
          renderBody()
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-8 flex flex-col gap-4 items-center max-w-md mx-auto w-full">

        {/* Instruction Hint */}
        {!isStepComplete() && step > 0 && (
          <p className="text-xs font-mono uppercase opacity-50 animate-pulse text-center">
            Tap the highlighted words to confirm understanding
          </p>
        )}

        <div className="flex justify-between items-center w-full">
          <div className="w-24"></div> {/* Spacer to keep center alignment visually balanced */}

          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={`px-8 py-3 rounded-lg font-mono font-bold text-sm tracking-wide transition-all shadow-lg 
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale
                    ${!isStepComplete() ? 'scale-100' : 'hover:scale-105 active:scale-95'}
                    ${currentStep.theme === 'paws' ? 'bg-paws-accent text-white shadow-paws-accent/20' :
                currentStep.theme === 'claws' ? 'bg-claws-text text-black shadow-claws-text/20' :
                  'bg-white text-black shadow-white/10'
              }`}
          >
            {step === steps.length - 1 ? 'INITIALIZE' : 'NEXT STEP'}
          </button>

          <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
};

// Helper component for interactive words
const InteractiveWord = ({ word, id, onClick, clicked }: { word: string, id: string, onClick: (id: string) => void, clicked: boolean }) => (
  <span
    onClick={() => onClick(id)}
    className={`
            cursor-pointer px-1 rounded transition-all duration-300 font-bold border-b-2
            ${clicked
        ? 'bg-green-500/20 border-green-500 text-green-500'
        : 'bg-current/10 border-current hover:bg-current/20 animate-pulse'
      }
        `}
  >
    {word}
  </span>
);

export default Onboarding;
