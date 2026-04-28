import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';

const SIMULATION_STEPS = [
  {
    id: 1,
    title: 'ID Verification',
    instruction: 'You have entered the polling booth. The polling officer asks for your ID. Which document is NOT valid for voting?',
    options: ['Voter ID (EPIC)', 'Aadhar Card', 'Library Card', 'Passport'],
    correctIndex: 2,
    successMsg: 'Correct! The officer verifies your name on the electoral roll and you proceed to the next desk.'
  },
  {
    id: 2,
    title: 'Inking & Slip',
    instruction: 'The second officer will mark your finger with indelible ink. Which finger is traditionally marked?',
    options: ['Right Index Finger', 'Left Index Finger', 'Right Thumb', 'Left Pinky'],
    correctIndex: 1,
    successMsg: 'Correct! The officer marks your Left Index Finger, gives you a voter slip, and you proceed to the polling screen.'
  },
  {
    id: 3,
    title: 'The EVM (Electronic Voting Machine)',
    instruction: 'You are now alone at the EVM. You see names of candidates and their symbols, plus a blue button next to each. What should you do to cast your vote?',
    options: ['Press multiple buttons at once', 'Press the blue button next to your chosen candidate', 'Pull the lever on the side', 'Write your name on the machine'],
    correctIndex: 1,
    successMsg: 'Correct! You press the blue button. You see a red light glow next to your chosen candidate.'
  },
  {
    id: 4,
    title: 'VVPAT Confirmation',
    instruction: 'After pressing the button on the EVM, the VVPAT machine prints a slip that is visible through a glass window for 7 seconds. Why is this important?',
    options: ['To give you a souvenir receipt to take home', 'To let you verify that your vote went to the correct candidate', 'To scan a QR code', 'It is just a random test print'],
    correctIndex: 1,
    successMsg: 'Excellent! You verified the printed slip matches your choice. You hear a long beep, and your vote is successfully cast!'
  }
];

function Simulation() {
  const { addXP } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, correct, wrong, finished
  const [errorMessage, setErrorMessage] = useState('');
  const [animating, setAnimating] = useState(false);

  const stepData = SIMULATION_STEPS[currentStep];

  const handleSelection = (index) => {
    if (status === 'correct' || animating) return;

    if (index === stepData.correctIndex) {
      setStatus('correct');
      setErrorMessage('');
    } else {
      setStatus('wrong');
      setErrorMessage('Incorrect choice. In a real scenario, this could delay your voting process. Try again!');
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500); // Stop shaking after 500ms
    }
  };

  const nextStep = () => {
    if (currentStep < SIMULATION_STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
      setStatus('idle');
    } else {
      setStatus('finished');
      addXP(100, 'simulation_completed');
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setStatus('idle');
  };

  if (status === 'finished') {
    return (
      <div className="animate-fade-in flex-center flex-column" style={{ minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ background: 'rgba(67, 233, 123, 0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
          <CheckCircle2 size={80} color="var(--accent-green)" />
        </div>
        <h1 className="title-large text-gradient-secondary">Simulation Complete!</h1>
        <p className="subtitle" style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
          You have successfully navigated the Voting Day process from start to finish. You earned 100 XP!
        </p>
        <button className="btn btn-primary" onClick={restart} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          <RefreshCw size={20} /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 className="title-medium" style={{ margin: 0 }}>Voting Day Simulator</h1>
        <span className="badge" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>Step {currentStep + 1} of {SIMULATION_STEPS.length}</span>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '2rem', height: '8px', background: 'rgba(255,255,255,0.05)' }}>
         <div className="progress-bar-fill" style={{ width: `${((currentStep) / SIMULATION_STEPS.length) * 100}%`, background: 'var(--gradient-secondary)' }}></div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--gradient-secondary)', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)' }}>
            <Target size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{stepData.title}</h2>
        </div>

        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
          {stepData.instruction}
        </p>

        {status === 'idle' || status === 'wrong' ? (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {stepData.options.map((opt, idx) => (
              <button 
                key={idx} 
                className={`btn btn-secondary ${status === 'wrong' && animating ? 'shake' : ''}`} 
                style={{ 
                  justifyContent: 'space-between', 
                  padding: '1.25rem 1.5rem', 
                  fontSize: '1.15rem',
                  border: status === 'wrong' && !animating ? '1px solid var(--border-color)' : '',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleSelection(idx)}
              >
                <span>{opt}</span>
                <ChevronRight size={20} color="var(--text-secondary)" />
              </button>
            ))}
            
            {status === 'wrong' && (
              <div className="animate-fade-in" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                background: 'rgba(255, 77, 79, 0.1)', border: '1px solid rgba(255, 77, 79, 0.3)',
                padding: '1rem', borderRadius: '8px', color: '#ff4d4f', marginTop: '1rem' 
              }}>
                <AlertCircle size={24} flexShrink={0} />
                <span style={{ fontSize: '1.1rem' }}>{errorMessage}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in" style={{ 
            background: 'rgba(67, 233, 123, 0.1)', 
            border: '1px solid rgba(67, 233, 123, 0.4)', 
            padding: '2rem', 
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(67, 233, 123, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--accent-green)' }}>
              <div style={{ background: 'rgba(67, 233, 123, 0.2)', borderRadius: '50%', padding: '0.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>Excellent!</h3>
            </div>
            <p style={{ marginBottom: '2rem', fontSize: '1.2rem', lineHeight: '1.6' }}>{stepData.successMsg}</p>
            <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              {currentStep < SIMULATION_STEPS.length - 1 ? 'Proceed to Next Station' : 'Finish Simulation'} <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          border-color: #ff4d4f !important;
          background: rgba(255, 77, 79, 0.05) !important;
        }
      `}</style>
    </div>
  );
}

export default Simulation;
