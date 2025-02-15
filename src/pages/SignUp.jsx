import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";

const errorMessages = {
  "auth/email-already-in-use": "Email already in use",
  "auth/invalid-email": "Invalid email address",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/operation-not-allowed": "Signup is currently disabled",
};

export default function SignUp() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || "/";
  const isCheckoutRedirect = from === "/checkout";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await signUp(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(errorMessages[error.code] || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      setError(
        errorMessages[error.code] || "Google signup failed. Please try again."
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
        <Typography component="h1" variant="h5" gutterBottom>
          {isCheckoutRedirect ? "Sign Up to Checkout" : "Create Account"}
        </Typography>

        {isCheckoutRedirect && (
          <Alert severity="info" sx={{ width: "100%", mb: 3 }}>
            Create an account to complete your purchase
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
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Account
          </Button>
          <Typography variant="body1" align="center" sx={{ my: 2 }}>
            ─── OR ───
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleGoogleSignIn}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                state={{ from: location.state?.from }}
              >
                Log in
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
