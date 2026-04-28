import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

function Assistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am AdhikarX AI. I can help answer your questions about voting, registration, the EVM, and more. What would you like to know?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || streamingMessageId) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Engine (Determine the response)
    const lowerInput = userMessage.text.toLowerCase();
    let fullResponse = "I'm still learning! But I can help you with questions about voter registration, documents needed to vote, the voting day process, and how to use an EVM.";
    
    if (lowerInput.includes('document') || lowerInput.includes('id') || lowerInput.includes('proof')) {
      fullResponse = "To vote, you can use your Voter ID (EPIC), Aadhar Card, PAN Card, Driving License, Indian Passport, or Passbook with a photograph issued by a Bank/Post Office.";
    } else if (lowerInput.includes('register') || lowerInput.includes('apply')) {
      fullResponse = "You can register to vote online through the Voter Service Portal (voters.eci.gov.in) or the Voter Helpline App by filling out Form 6.";
    } else if (lowerInput.includes('evm') || lowerInput.includes('machine')) {
      fullResponse = "An EVM (Electronic Voting Machine) is used to record votes. You simply press the blue button next to your chosen candidate's name and symbol. A red light will glow and you'll hear a long beep indicating your vote is cast.";
    } else if (lowerInput.includes('when') || lowerInput.includes('date') || lowerInput.includes('day')) {
      fullResponse = "Election dates vary by state and constituency. Please check the official Election Commission of India website or the 'Explore' section of our app for your specific constituency details.";
    } else if (lowerInput.includes('age') || lowerInput.includes('old') || lowerInput.includes('eligible')) {
      fullResponse = "To be eligible to vote in India, you must be a citizen of India and be at least 18 years of age on the qualifying date (usually January 1st of the year of revision of the electoral roll).";
    }

    // Simulate network delay then start streaming
    setTimeout(() => {
      setIsTyping(false);
      const newMsgId = Date.now() + 1;
      setStreamingMessageId(newMsgId);
      
      setMessages(prev => [...prev, { id: newMsgId, text: "", sender: 'ai' }]);
      
      // Simulate word-by-word streaming
      const words = fullResponse.split(' ');
      let currentWordIndex = 0;
      
      const streamInterval = setInterval(() => {
        if (currentWordIndex < words.length) {
          const nextWord = words[currentWordIndex];
          setMessages(prev => prev.map(msg => {
            if (msg.id === newMsgId) {
              return { ...msg, text: msg.text + (currentWordIndex === 0 ? '' : ' ') + nextWord };
            }
            return msg;
          }));
          currentWordIndex++;
        } else {
          clearInterval(streamInterval);
          setStreamingMessageId(null);
        }
      }, 50); // 50ms per word = fast, smooth reading speed

    }, 1000); // 1s "thinking" delay
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '50%' }}>
          <Sparkles size={24} color="white" />
        </div>
        <div>
          <h1 className="title-medium" style={{ marginBottom: '0.25rem' }}>Ask AdhikarX AI</h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Your personal guide to the democratic process.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              {msg.sender === 'ai' && (
                <div style={{ background: 'var(--gradient-secondary)', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--accent-blue)', flexShrink: 0 }}>
                  <Bot size={20} color="white" />
                </div>
              )}
              
              <div style={{
                background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: '16px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
                maxWidth: '75%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                color: 'white'
              }}>
                <p style={{ margin: 0, lineHeight: '1.6', fontSize: '1.05rem' }}>
                  {msg.text}
                  {streamingMessageId === msg.id && (
                    <span style={{ display: 'inline-block', width: '8px', height: '15px', background: 'var(--accent-cyan)', marginLeft: '4px', animation: 'blink 1s step-end infinite' }}></span>
                  )}
                </p>
              </div>

              {msg.sender === 'user' && (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--accent-purple)', flexShrink: 0 }}>
                  <User size={20} color="var(--accent-purple)" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ background: 'var(--gradient-secondary)', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--accent-blue)', flexShrink: 0 }}>
                <Bot size={20} color="white" />
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <Loader2 size={16} className="animate-spin" color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AdhikarX AI is typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about voting..."
            disabled={isTyping || streamingMessageId}
            style={{ 
              flex: 1, 
              padding: '1rem 1.5rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'rgba(255,255,255,0.05)', 
              color: 'white',
              outline: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ borderRadius: '50%', width: '52px', height: '52px', padding: 0, flexShrink: 0, opacity: (!input.trim() || isTyping || streamingMessageId) ? 0.5 : 1 }} 
            disabled={!input.trim() || isTyping || streamingMessageId}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Assistant;

