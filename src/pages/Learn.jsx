import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle, ChevronRight, XCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';

const LEVELS = [
  { id: 1, title: 'What is Voting & Why It Matters', moduleName: 'what_is_voting' },
  { id: 2, title: 'Voter Registration Process', moduleName: 'registration' },
  { id: 3, title: 'Eligibility & Required Documents', moduleName: 'eligibility' },
  { id: 4, title: 'Voting Day Process', moduleName: 'voting_day' },
  { id: 5, title: 'Counting & Results', moduleName: 'results' },
];

const LEVEL_CONTENT = {
  1: {
    standard: "Voting is a fundamental democratic right that allows citizens to choose their representatives. By participating in elections, you influence government policies and the future of the nation.",
    eli10: "Imagine you and your friends want to decide what game to play. Voting is like everyone putting a hand up for their favorite game. The game with the most hands wins! In a country, we do this to pick our leaders.",
    questions: [
      { q: "What is the main purpose of voting?", options: ["Choosing representatives", "Getting a holiday", "Paying taxes"], a: 0 },
      { q: "Who does voting give power to?", options: ["The politicians", "The citizens", "The military"], a: 1 }
    ]
  },
  2: {
    standard: "To vote, you must be registered on the electoral roll. You can register online via the Voter Service Portal using Form 6, or offline at your local Electoral Registration Office.",
    eli10: "Before you can play in a big tournament, you have to sign up and get your name on the team list. Voter registration is just signing up so the government knows you are ready to vote!",
    questions: [
      { q: "Which form is used for new voter registration?", options: ["Form 7", "Form 8", "Form 6"], a: 2 },
      { q: "Where can you register to vote online?", options: ["Social Media", "Voter Service Portal", "Banking App"], a: 1 }
    ]
  },
  3: {
    standard: "You must be 18 years old and an Indian citizen to vote. Valid documents include the Voter ID (EPIC), Aadhar Card, PAN Card, Driving License, or Indian Passport.",
    eli10: "You have to be at least 18 years old to vote, just like you have to be a certain height to go on a big rollercoaster. You also need to show an ID card to prove it's really you.",
    questions: [
      { q: "What is the minimum voting age in India?", options: ["16", "18", "21"], a: 1 },
      { q: "Which of these is a valid ID for voting?", options: ["Library Card", "Gym Membership", "Voter ID (EPIC)"], a: 2 }
    ]
  },
  4: {
    standard: "On voting day, officials verify your ID, mark your finger with indelible ink, and allow you to vote using the EVM. Press the blue button next to your candidate, and listen for the beep.",
    eli10: "On the big day, you go to a special room, show your ID, get a cool ink mark on your finger, and push a button on a machine to pick your favorite leader. A beep sound means you did it right!",
    questions: [
      { q: "What indicates your vote has been recorded on the EVM?", options: ["A long beep sound", "A printed receipt you take home", "The machine turns off"], a: 0 },
      { q: "What is applied to your finger before voting?", options: ["Red paint", "Indelible ink", "A sticker"], a: 1 }
    ]
  },
  5: {
    standard: "After voting day, EVMs are secured in strong rooms. On counting day, votes are tallied under the supervision of the Election Commission, and the candidate with the most votes in a constituency wins.",
    eli10: "After everyone votes, all the machines are locked up safely. Later, referees count all the 'hands up' from the machines. The person with the most votes gets to be the leader!",
    questions: [
      { q: "Who supervises the counting of votes?", options: ["The Police", "Election Commission", "The ruling party"], a: 1 },
      { q: "How is the winner decided in a constituency?", options: ["A lottery", "The candidate with the most votes", "The oldest candidate"], a: 1 }
    ]
  }
};

function Learn() {
  const { userState, addXP } = useUser();
  const [activeLevel, setActiveLevel] = useState(null);
  const [eli10, setEli10] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startLevel = (id) => {
    setActiveLevel(id);
    setEli10(userState.isFirstTimeVoter);
    setQuizStarted(false);
    setCurrentQ(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const content = LEVEL_CONTENT[activeLevel];
    if (index === content.questions[currentQ].a) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    const content = LEVEL_CONTENT[activeLevel];
    if (currentQ < content.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const earnedXP = 50 + (score * 10);
      addXP(earnedXP, LEVELS.find(l => l.id === activeLevel).moduleName);
      alert(`Quiz completed! You scored ${score}/${content.questions.length}. You earned ${earnedXP} XP.`);
      setActiveLevel(null);
    }
  };

  if (activeLevel) {
    const content = LEVEL_CONTENT[activeLevel];
    
    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <button className="btn" onClick={() => setActiveLevel(null)} style={{color: 'var(--text-secondary)', marginBottom: '1rem', padding: 0}}>
          &larr; Back to Levels
        </button>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="title-medium" style={{ margin: 0 }}>Level {activeLevel}: {LEVELS[activeLevel-1].title}</h2>
            {!quizStarted && (
              <button className="btn btn-secondary" onClick={() => setEli10(!eli10)}>
                {eli10 ? 'Show Detailed' : 'Explain Like I\'m 10'}
              </button>
            )}
          </div>

          {!quizStarted ? (
            <div className="animate-fade-in">
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem', minHeight: '100px', lineHeight: '1.8' }}>
                {eli10 ? content.eli10 : content.standard}
              </p>
              <button className="btn btn-primary" onClick={() => setQuizStarted(true)}>
                Take Quiz to Earn XP <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Question {currentQ + 1} of {content.questions.length}</h3>
                <span className="badge">Score: {score}</span>
              </div>
              
              <div className="progress-bar-container" style={{ marginBottom: '2rem', height: '4px' }}>
                <div className="progress-bar-fill" style={{ width: `${((currentQ) / content.questions.length) * 100}%` }}></div>
              </div>

              <p style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 500 }}>{content.questions[currentQ].q}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {content.questions[currentQ].options.map((opt, i) => {
                  let btnStyle = { justifyContent: 'space-between', padding: '1rem 1.5rem', fontSize: '1.1rem', width: '100%' };
                  let isCorrect = i === content.questions[currentQ].a;
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle.background = 'rgba(67, 233, 123, 0.2)';
                      btnStyle.borderColor = 'var(--accent-green)';
                    } else if (selectedOption === i) {
                      btnStyle.background = 'rgba(255, 77, 79, 0.2)';
                      btnStyle.borderColor = '#ff4d4f';
                    }
                  }

                  return (
                    <button 
                      key={i} 
                      className={`btn ${selectedOption === i && !isAnswered ? 'btn-primary' : 'btn-secondary'}`} 
                      style={btnStyle}
                      onClick={() => handleOptionClick(i)}
                      disabled={isAnswered}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && <CheckCircle size={20} color="var(--accent-green)" />}
                      {isAnswered && !isCorrect && selectedOption === i && <XCircle size={20} color="#ff4d4f" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="animate-fade-in" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleNext}>
                    {currentQ < content.questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="title-large text-gradient">Your Learning Journey</h1>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Complete levels, pass quizzes, and earn XP to level up your voter status!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        {LEVELS.map((level, index) => {
          const isCompleted = userState.completedModules.includes(level.moduleName);
          const isLocked = index > 0 && !userState.completedModules.includes(LEVELS[index-1].moduleName);
          
          return (
            <div key={level.id} className="glass-panel" 
                 style={{ 
                   padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   opacity: isLocked ? 0.6 : 1, filter: isLocked ? 'grayscale(100%)' : 'none',
                   transition: 'all var(--transition-normal)'
                 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '50%', 
                  background: isCompleted ? 'var(--gradient-success)' : 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isCompleted ? '0 0 15px rgba(67, 233, 123, 0.4)' : 'none'
                }}>
                  {isCompleted ? <CheckCircle size={24} color="black" /> : 
                   isLocked ? <Lock size={20} color="var(--text-secondary)" /> : <Unlock size={20} color="var(--accent-blue)" />}
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.25rem' }}>Level {level.id}: {level.title}</h3>
                  <span className="text-secondary" style={{ fontSize: '0.9rem' }}>
                    {isCompleted ? 'Completed - 50 XP Earned' : 'Earn 50 XP'}
                  </span>
                </div>
              </div>
              <button className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`} disabled={isLocked} onClick={() => startLevel(level.id)}>
                {isCompleted ? 'Review' : 'Start Level'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Learn;
