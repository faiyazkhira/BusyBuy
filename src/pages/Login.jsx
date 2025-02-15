import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const errorMessages = {
  "auth/invalid-credential": "Invalid email or password",
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/too-many-requests":
    "Too many attempts. Try again later or reset password",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const isCheckoutRedirect = from === "/checkout";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessages[err.code] || "Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        errorMessages[err.code] || "Google login failed. Please try again."
      );
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
          {isCheckoutRedirect ? "Login to Checkout" : "Welcome Back"}
        </Typography>

        {isCheckoutRedirect && (
          <Alert severity="info" sx={{ width: "100%", mb: 3 }}>
            You need to login to complete your purchase
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Continue to {isCheckoutRedirect ? "Checkout" : "Login"}
          </Button>
          <Typography variant="body1" align="center" sx={{ my: 2 }}>
            ─── OR ───
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            sx={{ mb: 2 }}
          >
            Sign In with Google
          </Button>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <MuiLink
                component={Link}
                to="/signup"
                state={{ from: location.state?.from }}
              >
                Sign up
              </MuiLink>
            </Typography>

            {!isCheckoutRedirect && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <MuiLink component={Link} to="/forgot-password">
                  Forgot password?
                </MuiLink>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
