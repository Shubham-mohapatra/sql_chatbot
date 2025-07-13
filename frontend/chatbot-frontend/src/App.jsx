import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ConnectionBar from './components/ConnectionBar';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';
import './styles/index.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionString, setConnectionString] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connError, setConnError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !connectionString.trim()) return;
    const userMsg = { sender: 'user', text: input, timestamp: new Date() };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, connectionString }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'bot', text: data.reply, timestamp: new Date() }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error: Could not reach server.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    const codeMatch = text.match(/```sql\n([\s\S]*?)\n```/);
    if (codeMatch) {
      navigator.clipboard.writeText(codeMatch[1]);
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const formatMessage = (text) => {
    if (text.includes('```sql')) {
      return text.split('```sql').map((part, index) => {
        if (index === 0) return <span key={index}>{part}</span>;
        const [code, ...rest] = part.split('```');
        return (
          <div key={index} className="sql-code-container">
            <div className="sql-code-header">
              <span>SQL</span>
              <button onClick={() => copyToClipboard(text)} className="copy-btn" aria-label="Copy code">Copy</button>
            </div>
            <pre className="sql-code-block"><code>{code.trim()}</code></pre>
            {rest.length > 0 && <span>{rest.join('```')}</span>}
          </div>
        );
      });
    }
    return <span className="message-text">{text}</span>;
  };

  const handleConnect = async () => {
    setConnecting(true);
    setConnError('');
    setConnected(false);
    try {
      const res = await fetch('http://localhost:3001/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });
      const data = await res.json();
      if (data.success) {
        setConnected(true);
      } else {
        setConnError(data.error || 'Connection failed');
        setConnected(false);
      }
    } catch (err) {
      setConnError('Could not reach server');
      setConnected(false);
    }
    setConnecting(false);
  };

  return (
    <div className="app-fullpage">
      <Header />
      <ConnectionBar
        connectionString={connectionString}
        setConnectionString={setConnectionString}
        handleConnect={handleConnect}
        connecting={connecting}
        loading={loading}
        connected={connected}
        connError={connError}
      />
      <MessageList
        messages={messages}
        loading={loading}
        formatMessage={formatMessage}
        messagesEndRef={messagesEndRef}
      />
      <InputBar
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        sendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
}

export default App;