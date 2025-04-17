import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper,
  Grid
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Career Crafter
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Discover Your Perfect Career Path
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
            Get personalized career recommendations based on your skills and experience.
            Upload your resume and get instant analysis against job descriptions.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" align="center">Career Matching</Typography>
              <Typography variant="body2" align="center">
                Find careers that match your skills and interests
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" align="center">Resume Analysis</Typography>
              <Typography variant="body2" align="center">
                Get instant feedback on your resume
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" align="center">Skill Development</Typography>
              <Typography variant="body2" align="center">
                Identify skills needed for your dream job
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 