import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
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
    background: 'url("https://www.transparenttextures.com/patterns/clean-gray-paper.png")',
    opacity: 0.1,
  },
});

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const ActionButton = styled(Button)({
  background: 'linear-gradient(45deg, #00b4d8 30%, #0077b6 90%)',
  border: 0,
  borderRadius: 8,
  color: 'white',
  height: 60,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(0, 180, 216, .3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #0077b6 30%, #00b4d8 90%)',
  },
});

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome to Your Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            Choose your next step in your career journey
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Career Assessment
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Take our comprehensive career assessment to discover the best career paths based on your skills and interests.
                </Typography>
                <ActionButton
                  fullWidth
                  onClick={() => navigate('/career-assessment')}
                >
                  Take Career Assessment
                </ActionButton>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Resume Analysis
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Upload your resume for a detailed analysis and personalized recommendations to improve your job prospects.
                </Typography>
                <ActionButton
                  fullWidth
                  onClick={() => navigate('/resume-analysis')}
                >
                  Analyze Resume
                </ActionButton>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </GradientBackground>
  );
}

export default UserDashboard; 