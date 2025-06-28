import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, Code, Copy, Play, User, Bot, Sparkles, Settings, History, Plus, Trash2, Eye, EyeOff, Server, Key, Shield, MessageSquare, X, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom mb-3">
    <div className="container-fluid">
      <button
        onClick={onToggleSidebar}
        className="btn btn-outline-light d-lg-none me-2"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <span className="navbar-brand d-flex align-items-center">
        <span className="bg-primary rounded p-2 me-2 d-flex align-items-center">
          <Database size={20} color="#fff" />
        </span>
        <span>
          <div className="fw-bold">SQL Assistant</div>
          <div className="small text-light">Your intelligent database companion</div>
        </span>
      </span>
      <div className="ms-auto d-flex align-items-center">
        <span className="badge bg-success me-2">●</span>
        <span className="text-light small">Connected</span>
      </div>
    </div>
  </nav>
);

const ChatWindow = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    const codeMatch = text.match(/```sql\n([\s\S]*?)\n```/);
    if (codeMatch) {
      navigator.clipboard.writeText(codeMatch[1]);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        <div className="container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`d-flex mb-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2 ${message.type === 'user' ? 'bg-success' : 'bg-primary'}`} style={{ width: 40, height: 40 }}>
                {message.type === 'user'
                  ? <User size={20} color="#fff" />
                  : <Bot size={20} color="#fff" />
                }
              </div>
              <div className="flex-grow-1">
                <div className={`p-3 rounded ${message.type === 'user' ? 'bg-success bg-opacity-10 border border-success' : 'bg-dark bg-opacity-75 border border-primary text-white'}`}>
                  {message.content.includes('```sql') ? (
                    <div>
                      {message.content.split('```sql').map((part, index) => {
                        if (index === 0) return <p key={index} className="mb-2">{part}</p>;
                        const [code, ...rest] = part.split('```');
                        return (
                          <div key={index}>
                            <div className="bg-secondary bg-opacity-75 rounded p-2 font-monospace text-sm border border-secondary mb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center gap-2">
                                  <Code size={16} color="#0d6efd" />
                                  <span className="text-primary small fw-semibold">SQL</span>
                                </div>
                                <div className="d-flex gap-1">
                                  <button
                                    onClick={() => copyToClipboard(message.content)}
                                    className="btn btn-sm btn-outline-secondary"
                                    title="Copy"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button className="btn btn-sm btn-outline-success" title="Run">
                                    <Play size={14} />
                                  </button>
                                </div>
                              </div>
                              <pre className="text-success mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                <code>{code.trim()}</code>
                              </pre>
                            </div>
                            {rest.length > 0 && <p className="mt-2">{rest.join('```')}</p>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                  )}
                  <div className="text-muted small mt-2 text-end">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="d-flex mb-3">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center flex-shrink-0 me-2" style={{ width: 40, height: 40 }}>
                <Bot size={20} color="#fff" />
              </div>
              <div className="bg-dark bg-opacity-75 border border-primary text-white p-3 rounded">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex gap-1">
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                  </div>
                  <span className="small text-muted">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input */}
      <div className="bg-light border-top p-3">
        <div className="container">
          <div className="row g-2 align-items-end">
            <div className="col flex-grow-1 position-relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about SQL queries, database design, optimization tips..."
                className="form-control"
                rows="1"
                style={{ maxHeight: '120px', resize: 'none' }}
              />
              <div className="position-absolute end-0 bottom-0 p-2">
                <Sparkles size={18} color="#a259ff" />
              </div>
            </div>
            <div className="col-auto">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="btn btn-primary"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <div className="text-center mt-2 text-muted small">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    dbType: 'postgresql'
  });

  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      name: 'User Analytics Query',
      lastMessage: 'Help me analyze user behavior data',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 8
    },
    {
      id: 2,
      name: 'Database Optimization',
      lastMessage: 'How to optimize slow queries?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 12
    },
    {
      id: 3,
      name: 'Schema Design',
      lastMessage: 'Best practices for table relationships',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messageCount: 6
    }
  ]);

  const [currentSession, setCurrentSession] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your SQL assistant. I can help you write queries, explain SQL concepts, and optimize your database operations. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);

  const generateSQLResponse = (query) => {
    const responses = [
      "Here's a SQL query that should help:\n\n```sql\nSELECT u.name, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY order_count DESC;\n```\n\nThis query joins users with their orders and counts the total orders per user.",
      "I can help you optimize that query! Here's an improved version:\n\n```sql\nSELECT \n  p.product_name,\n  SUM(oi.quantity * oi.price) as total_revenue\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nWHERE oi.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)\nGROUP BY p.id, p.product_name\nHAVING total_revenue > 1000\nORDER BY total_revenue DESC;\n```\n\nThis will give you the top-performing products in the last 30 days.",
      "Great question! Here's how you can structure that:\n\n```sql\nCREATE INDEX idx_user_email ON users(email);\nCREATE INDEX idx_order_date ON orders(created_at);\nCREATE INDEX idx_product_category ON products(category_id);\n```\n\nThese indexes will significantly improve query performance for common operations."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (content) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: generateSQLResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleNewChat = () => {
    const newSession = {
      id: chatSessions.length + 1,
      name: 'New Chat',
      lastMessage: 'Started new conversation',
      timestamp: new Date(),
      messageCount: 0
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession.id);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hi! I'm your SQL assistant. I can help you write queries, explain SQL concepts, and optimize your database operations. What would you like to work on today?",
        timestamp: new Date()
      }
    ]);
  };

  const handleDeleteSession = (sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession === sessionId) {
      setCurrentSession(chatSessions[0]?.id || null);
    }
  };

  const testConnection = () => {
    alert('Connection test - this would connect to your database in a real implementation');
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className={`bg-dark text-light border-end position-fixed h-100 p-3 ${isSidebarOpen ? 'd-block' : 'd-none'} d-lg-block`} style={{ width: 320, zIndex: 1050 }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">SQL Assistant</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-outline-light d-lg-none"
          >
            <X size={20} />
          </button>
        </div>
        <div className="btn-group w-100 mb-3">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`btn btn-sm ${activeTab === 'credentials' ? 'btn-primary' : 'btn-outline-light'}`}
          >
            <Settings size={16} className="me-1" />
            DB Config
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-outline-light'}`}
          >
            <History size={16} className="me-1" />
            History
          </button>
        </div>
        <div className="flex-grow-1 overflow-auto">
          {activeTab === 'credentials' ? (
            <form className="mb-3">
              <div className="mb-3">
                <label className="form-label">Database Type</label>
                <select
                  value={dbCredentials.dbType}
                  onChange={(e) => setDbCredentials(prev => ({ ...prev, dbType: e.target.value }))}
                  className="form-select"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mssql">SQL Server</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <Server size={16} className="me-1" />
                  Host
                </label>
                <input
                  type="text"
                  value={dbCredentials.host}
                  onChange={(e) => setDbCredentials(prev => ({ ...prev, host: e.target.value }))}
                  placeholder="localhost"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Port</label>
                <input
                  type="text"
                  value={dbCredentials.port}
                  onChange={(e) => setDbCredentials(prev => ({ ...prev, port: e.target.value }))}
                  placeholder="5432"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <Database size={16} className="me-1" />
                  Database
                </label>
                <input
                  type="text"
                  value={dbCredentials.database}
                  onChange={(e) => setDbCredentials(prev => ({ ...prev, database: e.target.value }))}
                  placeholder="mydb"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={dbCredentials.username}
                  onChange={(e) => setDbCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="username"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <Key size={16} className="me-1" />
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={dbCredentials.password}
                    onChange={(e) => setDbCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="password"
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-outline-secondary"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={testConnection}
                className="btn btn-success w-100"
              >
                <Shield size={16} className="me-1" />
                Test Connection
              </button>
            </form>
          ) : (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h3 className="h6 mb-0">Chat History</h3>
                <button
                  onClick={handleNewChat}
                  className="btn btn-sm btn-outline-primary"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="list-group">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${currentSession === session.id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold d-flex align-items-center">
                        <MessageSquare size={16} className="me-2" />
                        {session.name}
                      </div>
                      <div className="small text-muted">{session.lastMessage}</div>
                      <div className="small text-muted">
                        {session.timestamp.toLocaleDateString()} • {session.messageCount} msgs
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: 320 }}>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <div className="flex-grow-1 d-flex flex-column">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;