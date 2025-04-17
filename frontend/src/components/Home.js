import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
    opacity: 0.1,
  },
});

const AnimatedButton = styled(Button)({
  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
  },
});

const InteractiveImage = styled(Box)({
  width: '400px',
  height: '400px',
  backgroundImage: 'url("https://img.freepik.com/free-vector/career-development-concept-illustration_114360-4503.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '50%',
  margin: '0 auto 2rem',
  position: 'relative',
  animation: 'float 6s ease-in-out infinite',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
    '100%': { transform: 'translateY(0px)' },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    animation: 'pulse 4s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 0.5 },
    '50%': { transform: 'scale(1.05)', opacity: 0.8 },
    '100%': { transform: 'scale(1)', opacity: 0.5 },
  },
});

function Home() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <InteractiveImage />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeIn 1s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Career Crafter
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              animation: 'fadeIn 1s ease-in 0.3s',
              animationFillMode: 'both',
            }}
          >
            Discover your perfect career path
          </Typography>
          <AnimatedButton
            onClick={() => navigate('/register')}
            size="large"
          >
            Get Started
          </AnimatedButton>
        </Box>
      </Container>
    </GradientBackground>
  );
}

export default Home; 