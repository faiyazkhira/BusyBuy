import React from "react";
import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography>
        Go back to <Link to="/">Home</Link>
      </Typography>
    </Container>
  );
};

export default NotFound;
