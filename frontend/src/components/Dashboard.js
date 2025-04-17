import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [careerPath, setCareerPath] = useState({
    currentRole: 'Software Engineer',
    targetRole: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    timeline: '6 months',
  });

  const [recommendations, setRecommendations] = useState([
    'Complete advanced React course',
    'Learn system design principles',
    'Contribute to open source projects',
    'Get AWS certification',
  ]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Career Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Career Path Overview */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Career Path Overview
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Current Role"
                    secondary={careerPath.currentRole}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Target Role"
                    secondary={careerPath.targetRole}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Timeline"
                    secondary={careerPath.timeline}
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/resume-analysis')}
                sx={{ mt: 2 }}
              >
                Update Career Path
              </Button>
            </Paper>
          </Grid>

          {/* Skills Overview */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Skills Overview
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {careerPath.skills.map((skill, index) => (
                  <Card key={index} sx={{ minWidth: 120 }}>
                    <CardContent>
                      <Typography variant="body1">{skill}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Add New Skill
              </Button>
            </Paper>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <List>
                {recommendations.map((recommendation, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={recommendation} />
                      <Button size="small" color="primary">
                        Mark Complete
                      </Button>
                    </ListItem>
                    {index < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard; 