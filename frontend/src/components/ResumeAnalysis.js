import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const LightBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
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
    background: 'url("https://www.transparenttextures.com/patterns/light-wool.png")',
    opacity: 0.05,
  },
});

const StyledPaper = styled(Paper)({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(100, 181, 246, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(100, 181, 246, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending file:', file.name);
      
      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LightBackground>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Resume Analysis
          </Typography>

          <StyledPaper elevation={3} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Upload Your Resume
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      accept=".pdf"
                      style={{ display: 'none' }}
                      id="resume-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Choose File
                      </Button>
                    </label>
                    {file && (
                      <Typography variant="body1" sx={{ ml: 2 }}>
                        Selected file: {file.name}
                      </Typography>
                    )}
                  </Box>
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={!file || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Resume'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {analysis && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Overall Score: {analysis.overall_score}%
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Category Scores
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">
                            Skills: {analysis.category_scores.skills}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={analysis.category_scores.skills}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">
                            Experience: {analysis.category_scores.experience}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={analysis.category_scores.experience}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle1">
                            Education: {analysis.category_scores.education}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={analysis.category_scores.education}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      Feedback
                    </Typography>
                    <List>
                      {analysis.feedback.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </LightBackground>
  );
};

export default ResumeAnalysis; 