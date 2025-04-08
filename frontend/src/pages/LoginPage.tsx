import React from 'react';
import { Container, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {/* Login Form kommt hier */}
      <Typography>Login Form Platzhalter</Typography>
    </Container>
  );
};

export default LoginPage; 