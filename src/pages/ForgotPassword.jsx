import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ForgotPassword.module.css";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography className={styles.formTitle} component="h1" variant="h5">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={email}
            label="Email"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Email
          </Button>
          {message && (
            <Alert severity="info" sx={{ width: "100%", mb: 3 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}
