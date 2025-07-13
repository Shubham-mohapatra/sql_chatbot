import React from 'react';
import { User, Bot, Loader2, Database, Sparkles } from 'lucide-react';
import Message from './Message';

const MessageList = ({ messages, loading, formatMessage, messagesEndRef }) => {
  return (
    <div className="messages">
      <div>
        {messages.length === 0 && <WelcomeMessage />}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            <div className={`avatar ${message.sender}`}>
              {message.sender === 'user' ? 
                <User className="icon" /> : 
                <Bot className="icon" />
              }
            </div>
            
            <div className="message-bubble">
              <div>
                {formatMessage(message.text)}
              </div>
              {message.timestamp && (
                <div className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message-row bot">
            <div className="avatar bot">
              <Bot className="icon" />
            </div>
            <div className="message-bubble">
              <div className="loading">
                <Loader2 className="icon spin" />
                <span>Generating response...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

const WelcomeMessage = () => (
  <div className="welcome">
    <div className="welcome-icon">
      <Database className="icon-lg" />
    </div>
    <h3 className="welcome-title">Welcome to SQL Assistant</h3>
    <p className="welcome-desc">
      Connect to your database and ask me anything about SQL queries, database design, optimization, or any database-related questions!
    </p>
    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
      <Sparkles size={16} />
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Powered by AI</span>
    </div>
  </div>
);

export default MessageList;