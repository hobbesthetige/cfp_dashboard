"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Container,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { useAuth } from "../../contexts/authContext";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const { error } = await login(username, password);
    if (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      setPassword("");
      passwordRef.current?.focus();
    } else {
      router.push("/dashboard");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="sm">
        <Paper sx={{ padding: 2 }}>
          <Stack direction="column" spacing={3}>
            <Typography variant="h4">Login to CFP Dashboard</Typography>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyPress}
              inputRef={passwordRef}
            />
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            <Button
              disabled={loading}
              variant="contained"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
