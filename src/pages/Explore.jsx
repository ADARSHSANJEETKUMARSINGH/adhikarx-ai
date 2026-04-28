import React, { useState } from 'react';
import { Search, Info, Scale } from 'lucide-react';

const STATES = ['Maharashtra', 'Karnataka', 'Delhi'];
const DISTRICTS = {
  'Maharashtra': ['Mumbai City', 'Pune'],
  'Karnataka': ['Bangalore Urban', 'Mysore'],
  'Delhi': ['New Delhi', 'South Delhi']
};
const CONSTITUENCIES = {
  'Mumbai City': ['Colaba', 'Malabar Hill'],
  'Pune': ['Kasba Peth', 'Shivajinagar'],
  'Bangalore Urban': ['BTM Layout', 'Jayanagar'],
  'Mysore': ['Krishnaraja', 'Chamaraja'],
  'New Delhi': ['New Delhi', 'RK Puram'],
  'South Delhi': ['Mehrauli', 'Chattarpur']
};

const MOCK_CANDIDATES = [
  { id: 1, name: "Dr. Ananya Sharma", party: "Vikas Party", edu: "Ph.D. in Public Policy", cases: 0, casesDetail: "", assets: "₹3.2 Cr", liabilities: "₹45 Lakhs", aiInsight: "Strong academic background. Focuses on urban development and education. Zero declared criminal cases." },
  { id: 2, name: "Rajesh Desai", party: "Janata Alliance", edu: "B.A. LL.B.", cases: 2, casesDetail: "Pending civil disputes regarding land", assets: "₹8.5 Cr", liabilities: "₹1.2 Cr", aiInsight: "Legal professional with strong grassroots connection. Has 2 pending civil cases which are currently sub-judice." },
  { id: 3, name: "Vikram Singh", party: "Independent", edu: "M.Tech in IT", cases: 0, casesDetail: "", assets: "₹1.1 Cr", liabilities: "₹10 Lakhs", aiInsight: "Tech entrepreneur running as an independent. Clean record, focuses on digital infrastructure and youth employment." },
  { id: 4, name: "Meera Reddy", party: "Progressive Front", edu: "M.A. Sociology", cases: 1, casesDetail: "Violation of protest guidelines (2020)", assets: "₹2.8 Cr", liabilities: "₹20 Lakhs", aiInsight: "Activist background. One case related to participating in a public protest. Advocates for social welfare schemes." }
];

function Explore() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 candidates.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const getCompareCandidates = () => {
    return MOCK_CANDIDATES.filter(c => compareList.includes(c.id));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="title-large text-gradient">Explore Your Constituency</h1>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Discover candidates, compare their backgrounds neutrally, and make an informed decision.
      </p>

      {/* Search / Filter Box */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select 
          className="btn btn-secondary" 
          style={{ flex: 1, appearance: 'menulist' }}
          value={selectedState}
          onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); setSelectedConstituency(''); }}
        >
          <option value="">Select State...</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select 
          className="btn btn-secondary" 
          style={{ flex: 1, appearance: 'menulist' }}
          value={selectedDistrict}
          onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedConstituency(''); }}
          disabled={!selectedState}
        >
          <option value="">Select District...</option>
          {selectedState && DISTRICTS[selectedState].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        
        <select 
          className="btn btn-secondary" 
          style={{ flex: 1, appearance: 'menulist' }} 
          value={selectedConstituency}
          onChange={(e) => { setSelectedConstituency(e.target.value); setCompareList([]); setShowComparison(false); }}
          disabled={!selectedDistrict}
        >
          <option value="">Select Constituency...</option>
          {selectedDistrict && CONSTITUENCIES[selectedDistrict].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {selectedConstituency && !showComparison && (
        <div className="animate-fade-in">
          <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="title-medium" style={{ fontSize: '1.8rem', margin: 0 }}>Candidates in {selectedConstituency}</h2>
            {compareList.length > 1 && (
              <button className="btn btn-primary" onClick={() => setShowComparison(true)}>
                <Scale size={18} /> Compare Selected ({compareList.length})
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {MOCK_CANDIDATES.map(cand => (
              <div key={cand.id} className="glass-panel" style={{ 
                padding: '1.5rem', display: 'flex', flexDirection: 'column',
                border: compareList.includes(cand.id) ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                boxShadow: compareList.includes(cand.id) ? '0 0 15px rgba(79, 172, 254, 0.2)' : 'none'
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cand.name}</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--accent-purple)', fontWeight: 600 }}>{cand.party}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: 'var(--text-secondary)'}}>Education</strong><br/>{cand.edu}</div>
                  <div><strong style={{color: 'var(--text-secondary)'}}>Net Assets</strong><br/>{cand.assets}</div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{color: 'var(--text-secondary)'}}>Criminal Cases Declared</strong><br/>
                    <span style={{ color: cand.cases > 0 ? '#ff4d4f' : 'var(--accent-green)', fontWeight: 600 }}>{cand.cases}</span>
                    {cand.casesDetail && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> - {cand.casesDetail}</span>}
                  </div>
                </div>

                <div style={{ background: 'rgba(11, 12, 16, 0.6)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Info size={16} color="var(--accent-cyan)"/> <strong style={{color: 'var(--accent-cyan)'}}>AI Insight</strong>
                  </div>
                  <span style={{ lineHeight: '1.5' }}>{cand.aiInsight}</span>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <button 
                    className={`btn ${compareList.includes(cand.id) ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ width: '100%' }}
                    onClick={() => toggleCompare(cand.id)}
                  >
                    {compareList.includes(cand.id) ? 'Added to Comparison' : 'Select for Comparison'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {showComparison && (
        <div className="animate-fade-in">
          <button className="btn" onClick={() => setShowComparison(false)} style={{color: 'var(--text-secondary)', marginBottom: '1rem', padding: 0}}>
             &larr; Back to Candidate List
          </button>
          
          <h2 className="title-medium" style={{ marginBottom: '1.5rem' }}>Candidate Comparison</h2>
          
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '12px' }}>
             <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                   <th style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)', width: '20%' }}>Attribute</th>
                   {getCompareCandidates().map(c => (
                     <th key={c.id} style={{ padding: '1.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                       <div style={{ fontSize: '1.2rem', color: 'white' }}>{c.name}</div>
                       <div style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: 500 }}>{c.party}</div>
                     </th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)' }}>Education</td>
                   {getCompareCandidates().map(c => <td key={c.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>{c.edu}</td>)}
                 </tr>
                 <tr>
                   <td style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)' }}>Criminal Cases</td>
                   {getCompareCandidates().map(c => (
                     <td key={c.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                       <span style={{ color: c.cases > 0 ? '#ff4d4f' : 'var(--accent-green)', fontWeight: 600 }}>{c.cases}</span>
                       {c.casesDetail && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{c.casesDetail}</div>}
                     </td>
                   ))}
                 </tr>
                 <tr>
                   <td style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Assets</td>
                   {getCompareCandidates().map(c => <td key={c.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>{c.assets}</td>)}
                 </tr>
                 <tr>
                   <td style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, color: 'var(--text-secondary)' }}>Liabilities</td>
                   {getCompareCandidates().map(c => <td key={c.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>{c.liabilities}</td>)}
                 </tr>
                 <tr>
                   <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>AI Summary</td>
                   {getCompareCandidates().map(c => (
                     <td key={c.id} style={{ padding: '1.5rem', color: 'var(--text-primary)', lineHeight: '1.5', background: 'rgba(0, 242, 254, 0.05)' }}>
                       {c.aiInsight}
                     </td>
                   ))}
                 </tr>
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
