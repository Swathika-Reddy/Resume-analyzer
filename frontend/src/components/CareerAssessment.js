import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slider,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

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

function CareerAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skills: [],
    currentSalary: 0,
    expectedSalary: 0,
    education: '',
    interests: '',
    yearsExperience: 0
  });

  const [recommendations, setRecommendations] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/career-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: formData.skills,
          expected_salary: formData.expectedSalary,
          years_experience: formData.yearsExperience,
          education_level: formData.education
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      if (!data.recommendations || data.recommendations.length === 0) {
        throw new Error('No recommendations found. Please try with different skills.');
      }

      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message || 'Failed to get career recommendations. Please try again.');
      console.error('Error:', err);
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
            Career Assessment
          </Typography>

          <StyledPaper elevation={3} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Your Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      size="small"
                      helperText="Enter your skills one by one"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSkill}
                      disabled={!newSkill}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Years of Experience
                  </Typography>
                  <Slider
                    value={formData.yearsExperience}
                    onChange={(e, newValue) =>
                      setFormData({ ...formData, yearsExperience: newValue })
                    }
                    min={0}
                    max={20}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Expected Salary
                  </Typography>
                  <Slider
                    value={formData.expectedSalary}
                    onChange={(e, newValue) =>
                      setFormData({ ...formData, expectedSalary: newValue })
                    }
                    min={0}
                    max={200000}
                    step={10000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Education Level"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    select
                  >
                    <MenuItem value="high_school">High School</MenuItem>
                    <MenuItem value="bachelors">Bachelor's Degree</MenuItem>
                    <MenuItem value="masters">Master's Degree</MenuItem>
                    <MenuItem value="phd">PhD</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isLoading || formData.skills.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Analyzing...
                      </>
                    ) : (
                      'Get Career Recommendations'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledPaper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {recommendations && (
            <Grid container spacing={3}>
              {recommendations.map((career, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {career.career}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Match Score: {career.match_score}%
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {career.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {career.required_skills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            color={formData.skills.includes(skill) ? 'primary' : 'default'}
                            size="small"
                          />
                        ))}
                      </Box>
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Salary Range: ${career.salary_range.min.toLocaleString()} - ${career.salary_range.max.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </LightBackground>
  );
}

export default CareerAssessment; 