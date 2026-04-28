import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Map, Gamepad2, ChevronRight, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

function Home() {
  const { userState, setFirstTimeVoter } = useUser();
  const [showModal, setShowModal] = useState(userState.isFirstTimeVoter === null);

  const handleFirstTimeSelection = (isFirstTime) => {
    setFirstTimeVoter(isFirstTime);
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '500px', width: '90%', textAlign: 'center' }}>
            <h2 className="title-medium text-gradient">Welcome to AdhikarX AI</h2>
            <p className="subtitle" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
              To personalize your learning journey, we need to know: Are you a first-time voter?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => handleFirstTimeSelection(true)}>Yes, I am!</button>
              <button className="btn btn-secondary" onClick={() => handleFirstTimeSelection(false)}>No, just exploring</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '2rem 0' }}>
        <h1 className="title-large text-gradient">Empower Your Vote</h1>
        <p className="subtitle mx-auto" style={{ margin: '0 auto 2rem auto' }}>
          Your one-stop gamified platform to learn your rights, explore your constituency, and prepare for voting day.
        </p>
      </section>

      {/* Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Pillar 1 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <BookOpen size={40} color="var(--accent-blue)" />
          </div>
          <h2 className="title-medium">Learn Your Rights</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem', flex: 1 }}>
            Level up your knowledge through guided journeys, from registration to voting day. Earn XP and badges!
          </p>
          <Link to="/learn" className="btn btn-secondary" style={{ width: 'fit-content' }}>
            Start Learning <ChevronRight size={18} />
          </Link>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Map size={40} color="var(--accent-purple)" />
          </div>
          <h2 className="title-medium">Explore Constituency</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem', flex: 1 }}>
            Find out who is running in your area. Compare candidates and view their unbiased AI-generated summaries.
          </p>
          <Link to="/explore" className="btn btn-secondary" style={{ width: 'fit-content' }}>
            Find Candidates <ChevronRight size={18} />
          </Link>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Gamepad2 size={40} color="var(--accent-cyan)" />
          </div>
          <h2 className="title-medium">Play & Earn</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem', flex: 1 }}>
            Test your knowledge with simulations and quizzes. Unlock the prestigious AdhikarX Champion Trophy.
          </p>
          <Link to="/gamification" className="btn btn-primary" style={{ width: 'fit-content' }}>
            View Dashboard <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
