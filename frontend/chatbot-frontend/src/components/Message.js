import React from 'react';
import { Code, Copy, Check } from 'lucide-react';

const Message = ({ text, copyToClipboard }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = (text) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (text.includes('```sql')) {
    return text.split('```sql').map((part, index) => {
      if (index === 0) return <span key={index}>{part}</span>;
      const [code, ...rest] = part.split('```');
      return (
        <div key={index}>
          <div className="sql-code-block">
            <div className="sql-code-header">
              <div className="sql-code-title">
                <Code className="icon" />
                <span>SQL</span>
              </div>
              <button 
                onClick={() => handleCopy(code.trim())}
                className="copy-btn"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="icon" />
                ) : (
                  <Copy className="icon" />
                )}
              </button>
            </div>
            <pre>
              <code>{code.trim()}</code>
            </pre>
          </div>
          {rest.length > 0 && <span>{rest.join('```')}</span>}
        </div>
      );
    });
  }
  return <span className="message-text">{text}</span>;
};

export default Message;