'use client';

import { useState } from 'react';
import styles from './agents.module.scss';

const AGENTS = [
  { id: '1', name: 'Content Writer', description: 'Generates engaging social media posts from your ideas', status: 'active', runs: 142 },
  { id: '2', name: 'Hashtag Optimizer', description: 'Finds the best hashtags for maximum reach', status: 'active', runs: 89 },
  { id: '3', name: 'Engagement Analyzer', description: 'Analyzes your best performing content patterns', status: 'idle', runs: 34 },
  { id: '4', name: 'Trend Spotter', description: 'Monitors trending topics relevant to your niche', status: 'idle', runs: 12 },
];

export function AgentsComponent() {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your AI assistant. How can I help you create amazing content today?' },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
      { role: 'assistant', text: 'I\'m processing your request... (This is a demo response)' },
    ]);
    setMessage('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.agentsList}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Available Agents</h3>
            <button type="button" className={styles.newAgentBtn}>+ New Agent</button>
          </div>
          <div className={styles.agents}>
            {AGENTS.map((agent) => (
              <div key={agent.id} className={styles.agentCard}>
                <div className={styles.agentIcon}>🤖</div>
                <div className={styles.agentInfo}>
                  <div className={styles.agentName}>{agent.name}</div>
                  <div className={styles.agentDesc}>{agent.description}</div>
                  <div className={styles.agentStats}>
                    <span className={`${styles.statusBadge} ${styles[agent.status]}`}>{agent.status}</span>
                    <span className={styles.runs}>{agent.runs} runs</span>
                  </div>
                </div>
                <button type="button" className={styles.runBtn} onClick={() => setChatOpen(true)}>
                  Run
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`${styles.chatPanel} ${chatOpen ? styles.open : ''}`}>
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>AI Agent Chat</h3>
            <button type="button" className={styles.closeChat} onClick={() => setChatOpen(false)} aria-label="Close chat">✕</button>
          </div>
          <div className={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Ask the agent anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className={styles.input}
            />
            <button type="button" className={styles.sendBtn} onClick={sendMessage} aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {!chatOpen && (
        <button type="button" className={styles.openChatBtn} onClick={() => setChatOpen(true)}>
          ✨ Open AI Chat
        </button>
      )}
    </div>
  );
}
