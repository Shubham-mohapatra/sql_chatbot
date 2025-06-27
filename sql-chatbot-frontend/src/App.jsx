import React, { useState } from "react";
import DatabaseConnectForm from "./components/DatabaseConnectorForm";
import ChatWindow from "./components/ChatWindow";
import { Container, Typography, Box, Paper } from "@mui/material";

function App() {
  const [connected, setConnected] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [schema, setSchema] = useState(null);

  // Connect to backend
  const handleConnect = async (form) => {
    const res = await fetch("http://localhost:8000/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.status === "success") {
      setConnected(true);
      setSchema(data.schema);
    } else {
      alert("Connection failed: " + data.detail);
    }
  };

  // Send chat message to backend
  const handleSend = async (message) => {
    setChatHistory([...chatHistory, { role: "user", content: message }]);
    const res = await fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    });
    const data = await res.json();
    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: data.answer || "No response." },
    ]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h2"
              component="div"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              <span role="img" aria-label="robot">
                🤖
              </span>
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              SQL Chatbot
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Connect your database and chat with your data!
            </Typography>
          </Box>
          {!connected ? (
            <DatabaseConnectForm onConnect={handleConnect} />
          ) : (
            <ChatWindow chatHistory={chatHistory} onSend={handleSend} />
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;