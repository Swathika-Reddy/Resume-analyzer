const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Career Crafter API' });
});

// Career Assessment endpoint
app.post('/api/career-assessment', (req, res) => {
  const { skills, currentSalary, expectedSalary, experience, education } = req.body;

  // TODO: Implement actual career matching algorithm
  // This is a mock response
  const recommendations = {
    careers: [
      {
        title: 'Senior Software Engineer',
        match: '95%',
        salary: '$120,000 - $150,000',
        skills: ['React', 'Node.js', 'AWS'],
        description: 'Lead development teams and architect scalable solutions',
      },
      {
        title: 'DevOps Engineer',
        match: '85%',
        salary: '$110,000 - $140,000',
        skills: ['AWS', 'Docker', 'CI/CD'],
        description: 'Implement and maintain cloud infrastructure',
      },
      {
        title: 'Full Stack Developer',
        match: '80%',
        salary: '$100,000 - $130,000',
        skills: ['React', 'Node.js', 'MongoDB'],
        description: 'Develop end-to-end web applications',
      },
    ],
  };

  res.json(recommendations);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 