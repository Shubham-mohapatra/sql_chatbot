import React from 'react';
import { Database, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo-bg">
          <Database className="icon-lg" />
        </div>
        <div>
          <h1 className="title">SQL Chatbot</h1>
          <p className="subtitle">Your intelligent database assistant</p>
        </div>
        <div className="status">
          <Sparkles className="icon" size={16} />
          <span>AI Powered</span>
        </div>
      </div>
    </div>
  );
};

export default Header;