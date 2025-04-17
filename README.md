# Resume Analysis System

A full-stack web application that analyzes resumes using machine learning to provide detailed feedback and scores.

## Features

- PDF resume upload and analysis
- Machine learning-based scoring system
- Detailed feedback on skills, experience, and education
- Modern React frontend with Material-UI
- Flask backend with scikit-learn for ML processing

## Tech Stack

### Frontend
- React.js
- Material-UI
- Axios for API calls

### Backend
- Python Flask
- scikit-learn for machine learning
- PyPDF2 for PDF processing
- joblib for model persistence

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer
```

2. Install backend dependencies:
```bash
cd backend
pip install flask flask-cors scikit-learn numpy PyPDF2 joblib
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. Upload your resume in PDF format
2. The system will analyze your resume and provide:
   - Overall score
   - Category scores (Skills, Experience, Education)
   - Detailed feedback and suggestions
   - Role-specific recommendations

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── app.py              # Flask server
│   ├── resume_analyzer.py  # ML model and analysis
│   └── models/             # Saved ML models
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   └── App.js          # Main application
    └── package.json        # Frontend dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 