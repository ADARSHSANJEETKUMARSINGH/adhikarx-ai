import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Map, Trophy, BookOpen, Gamepad2, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import { useUser } from './context/UserContext';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Explore from './pages/Explore';
import Gamification from './pages/Gamification';
import Simulation from './pages/Simulation';
import Assistant from './pages/Assistant';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { userState } = useUser();
  const { currentUser, logout } = useAuth();

  return (
    <Router>
      <div className="app-layout">
        <header className="navbar">
          <div className="container flex-between">
            <Link to="/" className="nav-brand text-gradient">
              <ShieldCheck size={28} color="var(--accent-blue)" />
              AdhikarX AI
            </Link>
            
            <nav className="nav-links" style={{ alignItems: 'center' }}>
              <Link to="/learn" className="nav-link flex-center" style={{gap:'0.5rem'}}><BookOpen size={18}/> Learn</Link>
              <Link to="/explore" className="nav-link flex-center" style={{gap:'0.5rem'}}><Map size={18}/> Explore</Link>
              <Link to="/simulation" className="nav-link flex-center" style={{gap:'0.5rem'}}><Gamepad2 size={18}/> Play</Link>
              <Link to="/gamification" className="nav-link flex-center" style={{gap:'0.5rem'}}>
                <Trophy size={18}/> 
                <span className="badge">{userState.xp} XP</span>
              </Link>
              <Link to="/assistant" className="nav-link flex-center" style={{gap:'0.5rem', color: 'var(--accent-cyan)'}}>
                <MessageSquare size={18}/> AI
              </Link>
              
              {/* Auth Section */}
              <div style={{ marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {currentUser ? (
                  <>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCircle size={18} /> {currentUser.name.split(' ')[0]}
                    </span>
                    <button onClick={logout} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0, background: 'none' }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Sign Up</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>
        
        <main className="main-content container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/explore" element={<Explore />} />
            
            {/* Protected Routes */}
            <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
            <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
