import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

export default function ChatWindow({ chatHistory, onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      <Box sx={{ minHeight: 400, mb: 2 }}>
        {chatHistory.map((msg, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 1, background: msg.role === "user" ? "#e3f2fd" : "#f1f8e9" }}>
            <Typography variant="body2" color="textSecondary">{msg.role === "user" ? "You" : "Bot"}</Typography>
            <Typography>{msg.content}</Typography>
          </Paper>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Box>
  );
}