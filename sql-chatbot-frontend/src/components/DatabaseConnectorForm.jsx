import React, { useState } from "react";
import { Button, TextField, MenuItem, Box } from "@mui/material";

const dbTypes = [
  { value: "postgres", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "oracle", label: "Oracle" },
  { value: "mongodb", label: "MongoDB" },
];

export default function DatabaseConnectForm({ onConnect }) {
  const [form, setForm] = useState({
    type: "postgres",
    host: "",
    port: "",
    user: "",
    password: "",
    database: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField select label="Database Type" name="type" value={form.type} onChange={handleChange}>
        {dbTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </TextField>
      <TextField label="Host" name="host" value={form.host} onChange={handleChange} required />
      <TextField label="Port" name="port" value={form.port} onChange={handleChange} required />
      <TextField label="Username" name="user" value={form.user} onChange={handleChange} required />
      <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
      <TextField label="Database Name" name="database" value={form.database} onChange={handleChange} required />
      <Button type="submit" variant="contained">Connect</Button>
    </Box>
  );
}