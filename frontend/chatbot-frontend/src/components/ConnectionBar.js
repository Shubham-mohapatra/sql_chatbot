import React from 'react';

const ConnectionBar = ({ 
  connectionString, 
  setConnectionString, 
  handleConnect, 
  connecting, 
  loading, 
  connected, 
  connError 
}) => {
  return (
    <div className="connection-string-bar">
      <input
        type="text"
        className="connection-input"
        placeholder="Enter your DB connection string"
        value={connectionString}
        onChange={e => setConnectionString(e.target.value)}
        disabled={connecting || loading}
      />
      <button
        className="connect-btn"
        onClick={handleConnect}
        disabled={!connectionString.trim() || connecting}
      >
        {connecting ? 'Connecting...' : 'Connect'}
      </button>
      <span className={`conn-status ${connected ? 'connected' : 'not-connected'}`}>
        {connected ? 'Connected' : 'Not Connected'}
      </span>
      {connError && <div className="conn-error">{connError}</div>}
    </div>
  );
};

export default ConnectionBar;