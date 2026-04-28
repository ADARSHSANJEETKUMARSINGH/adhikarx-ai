import React from 'react';
import { Trophy, Star, Shield, Award, Medal, Download, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import html2pdf from 'html2pdf.js';

const TIERS = [
  { name: 'Beginner', requiredXp: 0, icon: Star, color: '#a0aab2' },
  { name: 'Aware Citizen', requiredXp: 100, icon: Shield, color: '#4facfe' },
  { name: 'Smart Voter', requiredXp: 300, icon: Medal, color: '#8e2de2' },
  { name: 'Pro Voter', requiredXp: 500, icon: Award, color: '#FFD700' }
];

function Gamification() {
  const { userState } = useUser();
  const { currentUser } = useAuth();
  const { xp, level, unlockedBadges } = userState;

  // Find current and next tier
  const currentTierIndex = TIERS.findIndex(t => t.name === level);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const currentTierData = TIERS[currentTierIndex] || TIERS[0];
  
  const xpForNext = nextTier ? nextTier.requiredXp : xp;
  const xpCurrentTier = currentTierData.requiredXp;
  
  const progressPercent = nextTier 
    ? Math.min(100, ((xp - xpCurrentTier) / (xpForNext - xpCurrentTier)) * 100)
    : 100;

  const handleDownloadCertificate = () => {
    const element = document.getElementById('certificate');
    const opt = {
      margin:       0,
      filename:     'AdhikarX_Champion_Certificate.pdf',
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'px', format: [1123, 794], orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="animate-fade-in print-container">
      <div className="no-print">
        <h1 className="title-large text-gradient">Your Voting Journey</h1>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>
          Track your progress, view your badges, and strive for the AdhikarX Champion title!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Profile Stats */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', marginBottom: '1.5rem', 
              border: `4px solid ${currentTierData.color}`,
              boxShadow: `0 0 30px ${currentTierData.color}40`
            }}>
              {React.createElement(currentTierData.icon, { size: 60, color: currentTierData.color })}
            </div>
            
            <h2 className="title-medium" style={{ margin: 0, color: currentTierData.color }}>{level}</h2>
            <p className="text-secondary" style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>{xp} XP Total</p>
            
            {nextTier ? (
              <div style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <span className="text-secondary">Progress to {nextTier.name}</span>
                  <span style={{ color: nextTier.color }}>{xp} / {nextTier.requiredXp} XP</span>
                </div>
                <div className="progress-bar-container" style={{ height: '12px', background: 'rgba(255,255,255,0.05)' }}>
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${currentTierData.color}, ${nextTier.color})` }}></div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFD700' }}>
                <CheckCircle size={20} />
                <span style={{ fontWeight: 600 }}>Max Level Reached!</span>
              </div>
            )}
          </div>

          {/* Badges Collection */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="title-medium" style={{ marginBottom: '1.5rem' }}>Badges Collection</h2>
            {unlockedBadges.length === 0 ? (
              <div className="flex-center flex-column text-secondary" style={{ height: '200px', border: '2px dashed var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                <Award size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Complete learning modules to earn badges.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {unlockedBadges.map((badge, i) => (
                  <div key={i} className="animate-fade-in" style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)', width: 'calc(50% - 0.5rem)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ background: 'var(--gradient-secondary)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                      <Shield size={32} color="white" />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', color: 'var(--text-primary)' }}>{badge}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grand Reward Section */}
        <div className="glass-panel" style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          background: xp >= 500 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.15) 100%)' : 'var(--bg-surface)',
          border: xp >= 500 ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid var(--border-color)',
          boxShadow: xp >= 500 ? '0 0 40px rgba(255, 215, 0, 0.2)' : 'none'
        }}>
          <Trophy size={80} color={xp >= 500 ? '#FFD700' : 'var(--text-tertiary)'} style={{ margin: '0 auto 1.5rem auto', filter: xp >= 500 ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))' : 'none' }} />
          <h2 className="title-large" style={{ color: xp >= 500 ? '#FFD700' : 'var(--text-primary)', marginBottom: '1rem' }}>
            AdhikarX Champion
          </h2>
          <p className="subtitle mx-auto" style={{ margin: '0 auto 2rem auto', color: xp >= 500 ? '#fff' : 'var(--text-secondary)' }}>
            {xp >= 500 
              ? `Congratulations, ${currentUser?.name || 'Voter'}! You have mastered the knowledge required for a first-time voter.`
              : "Reach 'Pro Voter' status (500 XP) to unlock your digital certificate."}
          </p>
          {xp >= 500 && (
            <button className="btn btn-primary" onClick={handleDownloadCertificate} style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <Download size={20} /> Download Certificate
            </button>
          )}
        </div>
      </div>

      {/* Hidden Certificate Area (Used for PDF generation and printing) */}
      {xp >= 500 && (
        <div className="certificate-wrapper print-only">
          <div id="certificate" style={{ 
            width: '1123px', 
            height: '794px', 
            background: '#ffffff', 
            padding: '60px', 
            boxSizing: 'border-box',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            border: '20px solid #1a1c23',
            color: '#000',
            overflow: 'hidden'
          }}>
             {/* Inner Safe Margin Border */}
             <div style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px', border: '5px solid #FFD700', pointerEvents: 'none' }}></div>
            
             {/* Top Section */}
             <div style={{ marginTop: '20px', zIndex: 1 }}>
               <h1 style={{ fontSize: '3.5rem', color: '#1a1c23', marginBottom: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', wordWrap: 'break-word', maxWidth: '900px' }}>CERTIFICATE OF COMPLETION</h1>
               <h2 style={{ fontSize: '1.8rem', color: '#555', margin: 0, fontWeight: '500', fontStyle: 'italic' }}>This is proudly presented to</h2>
             </div>
             
             {/* Middle Section (Name) */}
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '150px', zIndex: 1, padding: '20px 0', width: '100%' }}>
               <h1 style={{ 
                 fontSize: 'clamp(32px, 5vw, 72px)', 
                 color: '#8e2de2', 
                 margin: 0, 
                 borderBottom: '3px solid #FFD700', 
                 paddingBottom: '10px', 
                 display: 'inline-block', 
                 maxWidth: '90%', 
                 whiteSpace: 'nowrap', 
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 lineHeight: '1.2' 
               }}>
                 {currentUser?.name || 'Dedicated Voter'}
               </h1>
             </div>
             
             {/* Description Section */}
             <div style={{ zIndex: 1 }}>
               <p style={{ fontSize: '1.5rem', color: '#444', maxWidth: '850px', margin: '0 auto', lineHeight: '1.5' }}>
                 Has successfully completed the AdhikarX AI Electoral Literacy Program, demonstrating a comprehensive understanding of voter registration, electoral processes, and democratic rights in India.
               </p>
             </div>
             
             {/* Bottom Section */}
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '30px', marginBottom: '20px', zIndex: 1 }}>
               <Trophy size={80} color="#FFD700" strokeWidth={1.5} />
               <div style={{ textAlign: 'left' }}>
                 <h2 style={{ fontSize: '2.5rem', color: '#FFD700', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>AdhikarX Champion</h2>
                 <p style={{ fontSize: '1.4rem', color: '#777', margin: '5px 0 0 0', fontWeight: '500' }}>Issued on: {new Date().toLocaleDateString()}</p>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gamification;
