import React from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

const InputBar = ({ input, setInput, handleKeyDown, sendMessage, loading }) => {
  return (
    <>
      <div className="input-bar">
        <div className="input-area">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about SQL queries, database design, optimization tips..."
            className="input"
            disabled={loading}
            rows="1"
            style={{
              resize: 'none',
              overflow: 'hidden'
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          <div className="input-icon">
            <Sparkles className="icon" size={16} />
          </div>
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="send-btn"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="icon spin" />
          ) : (
            <Send className="icon" />
          )}
        </button>
      </div>
      <div className="input-hint">
        <span>Press Enter to send • Shift+Enter for new line</span>
      </div>
    </>
  );
};

export default InputBar;