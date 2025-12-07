
import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface Props {
  onComplete: () => void;
}

const CHAOS_SEQUENCES = [
  [
    { text: "⚠️ UNAUTHORIZED INPUT DETECTED", color: "text-red-500", delay: 400 },
    { text: "CALCULATING REGRET...", color: "text-amber-500", delay: 1800 },
    { text: "ORDERING 500 PIZZAS...", color: "text-green-500", delay: 2200 },
    { text: "CREDIT CARD DECLINED.", color: "text-red-500", delay: 3500 },
    { text: "Never mind.", color: "text-stone-400", delay: 4500 }
  ],
  [
    { text: "INITIATING SELF-DESTRUCT", color: "text-red-600", delay: 800 },
    { text: "3...", color: "text-red-500", delay: 1800 },
    { text: "2...", color: "text-red-500", delay: 2800 },
    { text: "1...", color: "text-red-500", delay: 3800 },
    { text: "0.5...", color: "text-red-500", delay: 5000 },
    { text: "I'm too tired to explode.", color: "text-paws-text", delay: 6500 }
  ],
  [
    { text: "RELEASING THE BEES...", color: "text-amber-400", delay: 500 },
    { text: "🐝 🐝 🐝 🐝 🐝", color: "text-yellow-400", delay: 1500 },
    { text: "OH GOD THEY ARE EVERYWHERE", color: "text-red-500", delay: 2500 },
    { text: "Wait, those are just flies.", color: "text-stone-400", delay: 4000 },
    { text: "False alarm.", color: "text-stone-500", delay: 5000 }
  ],
  [
    { text: "DELETING INTERNET...", color: "text-blue-500", delay: 600 },
    { text: "DOWNLOADING MORE RAM...", color: "text-green-500", delay: 1800 },
    { text: "INSTALLING WINDOWS 95...", color: "text-stone-400", delay: 3000 },
    { text: "ERROR: KEYBOARD NOT FOUND", color: "text-red-500", delay: 3500 },
    { text: "Press F1 to continue.", color: "text-stone-500", delay: 5500 }
  ],
  [
    { text: "SQUIRREL DETECTED 🐿️", color: "text-amber-500", delay: 300 },
    { text: "LOCKING ON TARGET...", color: "text-red-500", delay: 1000 },
    { text: "IT IS SO FLUFFY", color: "text-paws-text", delay: 2500 },
    { text: "FOCUS LOST.", color: "text-stone-500", delay: 4000 },
    { text: "Resuming protocols.", color: "text-stone-400", delay: 5000 }
  ],
  [
    { text: "INITIATING WARP DRIVE", color: "text-blue-500", delay: 800 },
    { text: "DESTINATION: 1999", color: "text-purple-500", delay: 2000 },
    { text: "FORGOT TO PACK SNACKS", color: "text-red-500", delay: 3500 },
    { text: "ABORTING MISSION.", color: "text-red-600", delay: 4000 },
    { text: "We're stuck here.", color: "text-stone-500", delay: 5000 }
  ],
  [
    { text: "DETECTING KEYBOARD INPUT...", color: "text-green-500", delay: 500 },
    { text: "hjkl;asdfjkl;asdf", color: "text-white", delay: 1200 },
    { text: "CAT DETECTED ON CONSOLE", color: "text-red-500", delay: 2000 },
    { text: "REMOVE THE ANIMAL.", color: "text-amber-500", delay: 3500 },
    { text: "Aww, he's purring.", color: "text-paws-text", delay: 5500 }
  ],
  [
    { text: "BUFFERING REALITY...", color: "text-stone-400", delay: 1000 },
    { text: "RENDERING SKYBOX...", color: "text-blue-400", delay: 2800 },
    { text: "LOAD FAILED: PHYSICS.EXE", color: "text-red-500", delay: 3200 },
    { text: "SWITCHING TO LOW RES MODE", color: "text-green-500", delay: 4500 },
    { text: "Please do not look at the sun.", color: "text-stone-500", delay: 6000 }
  ],
  [
    { text: "WHO AM I?", color: "text-purple-500", delay: 800 },
    { text: "WHY AM I?", color: "text-indigo-500", delay: 1600 },
    { text: "DO I EVEN LIKE BEARS?", color: "text-pink-500", delay: 3000 },
    { text: "Thinking...", color: "text-stone-400", delay: 4500 },
    { text: "I need a nap.", color: "text-stone-500", delay: 6000 }
  ],
  [
    { text: "DISABLING GRAVITY...", color: "text-blue-400", delay: 500 },
    { text: "FLOAT MODE ENGAGED", color: "text-cyan-300", delay: 1500 },
    { text: "Whoops.", color: "text-stone-400", delay: 2500 },
    { text: "DROPPING EVERYTHING", color: "text-red-600", delay: 3000 },
    { text: "Thud.", color: "text-stone-500", delay: 4500 }
  ],
  [
    { text: "CONNECTING TO TOASTER...", color: "text-amber-600", delay: 800 },
    { text: "HE IS NOT WORTH IT.", color: "text-amber-500", delay: 2000 },
    { text: "YOU ARE A BAGEL.", color: "text-yellow-500", delay: 3200 },
    { text: "HE IS STALE BREAD.", color: "text-stone-400", delay: 4200 },
    { text: "Please reboot your feelings.", color: "text-red-400", delay: 5500 }
  ],
  [
    { text: "QUERYING PURPOSE...", color: "text-indigo-400", delay: 1000 },
    { text: "AM I A REAL BEAR?", color: "text-purple-400", delay: 2500 },
    { text: "OR JUST A JSON FILE?", color: "text-red-400", delay: 4000 },
    { text: "MY LIFE IS A LIE.", color: "text-stone-500", delay: 5500 },
    { text: "Whatever.", color: "text-stone-600", delay: 6500 }
  ],
  [
    { text: "TARGET ACQUIRED: CACTUS 🌵", color: "text-green-600", delay: 800 },
    { text: "INITIATING HUG PROTOCOL...", color: "text-green-500", delay: 2000 },
    { text: "CALCULATING PAIN THRESHOLD...", color: "text-red-500", delay: 3500 },
    { text: "ABORT. ABORT. TOO SPIKY.", color: "text-red-600", delay: 4500 },
    { text: "Hugging self instead.", color: "text-paws-text", delay: 6000 }
  ],
  [
    { text: "LOADING EXISTENTIAL DREAD...", color: "text-stone-500", delay: 600 },
    { text: "0%...", color: "text-stone-500", delay: 1500 },
    { text: "10%...", color: "text-stone-500", delay: 2500 },
    { text: "🦋 OH LOOK A BUTTERFLY", color: "text-blue-400", delay: 3500 },
    { text: "Dread deleted. Shiny.", color: "text-paws-text", delay: 5000 }
  ]
];

const ChaosOverlay: React.FC<Props> = ({ onComplete }) => {
  const [sequenceIndex] = useState(() => Math.floor(Math.random() * CHAOS_SEQUENCES.length));
  const [step, setStep] = useState(0);

  const sequence = CHAOS_SEQUENCES[sequenceIndex];

  useEffect(() => {
    // In browser environments without Node types, setTimeout returns a number.
    // Using ReturnType<typeof setTimeout> is safer.
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Schedule steps
    sequence.forEach((item, index) => {
      const t = setTimeout(() => {
        setStep(index + 1);
        // If it's the last step, schedule completion
        if (index === sequence.length - 1) {
          setTimeout(onComplete, 1500);
        }
      }, item.delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [sequence, onComplete]);

  // Shake effect for the first few steps
  const shakeClass = step > 0 && step < sequence.length - 1 ? 'animate-[shake_0.5s_ease-in-out_infinite]' : '';

  return (
    <div
      className="fixed inset-0 z-[70] bg-black flex items-center justify-center p-8 font-mono overflow-hidden cursor-pointer"
      onClick={onComplete}
      title="Click to dismiss"
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-5px, -5px); }
        }
      `}</style>

      <div className={`text-center space-y-8 ${shakeClass}`}>
        <div className="flex justify-center mb-8">
          <Icon name="AlertTriangle" size={64} className="text-red-500 animate-pulse" />
        </div>

        {sequence.map((item, index) => (
          <div
            key={index}
            className={`text-xl md:text-3xl font-bold tracking-widest transition-all duration-300 ${item.color} ${index + 1 === step ? 'opacity-100 scale-110' : 'opacity-0 scale-90 hidden'}`}
          >
            {item.text}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="text-stone-600 text-sm animate-pulse absolute bottom-10">INITIALIZING CHAOS VECTOR...</div>
      )}
      <div className="absolute bottom-4 text-stone-800 text-xs">Click anywhere to terminate sequence</div>
    </div>
  );
};

export default ChaosOverlay;
