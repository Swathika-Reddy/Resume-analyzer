from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import joblib
import os
from resume_analyzer import ResumeAnalyzer
import PyPDF2
from io import BytesIO
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize resume analyzer
print("Initializing ResumeAnalyzer...")
resume_analyzer = ResumeAnalyzer()

# Sample career data (in a real application, this would come from a database)
careers_data = {
    'Software Engineer': {
        'skills': ['Python', 'Java', 'JavaScript', 'SQL', 'Git', 'Problem Solving', 'Algorithms'],
        'salary_range': {'min': 80000, 'max': 150000},
        'description': 'Develop and maintain software applications'
    },
    'Data Scientist': {
        'skills': ['Python', 'R', 'Machine Learning', 'Statistics', 'Data Analysis', 'SQL'],
        'salary_range': {'min': 90000, 'max': 160000},
        'description': 'Analyze complex data sets and build predictive models'
    },
    'Product Manager': {
        'skills': ['Project Management', 'Communication', 'Market Research', 'Agile', 'Leadership'],
        'salary_range': {'min': 85000, 'max': 155000},
        'description': 'Manage product development and strategy'
    },
    'DevOps Engineer': {
        'skills': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Scripting'],
        'salary_range': {'min': 95000, 'max': 170000},
        'description': 'Implement and maintain cloud infrastructure'
    },
    'UX Designer': {
        'skills': ['UI/UX', 'Figma', 'User Research', 'Prototyping', 'Wireframing'],
        'salary_range': {'min': 75000, 'max': 140000},
        'description': 'Design user interfaces and experiences'
    },
    'Frontend Developer': {
        'skills': ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'UI/UX'],
        'salary_range': {'min': 70000, 'max': 130000},
        'description': 'Create responsive and interactive web interfaces'
    },
    'Backend Developer': {
        'skills': ['Node.js', 'Python', 'Java', 'SQL', 'REST API', 'Microservices'],
        'salary_range': {'min': 80000, 'max': 140000},
        'description': 'Develop server-side applications and APIs'
    }
}

# Create TF-IDF vectorizer
vectorizer = TfidfVectorizer()

# Prepare training data
all_skills = [' '.join(career['skills']) for career in careers_data.values()]
vectorizer.fit(all_skills)

def calculate_career_match(user_skills, career_skills):
    try:
        # Convert skills to TF-IDF vectors
        user_vector = vectorizer.transform([' '.join(user_skills)])
        career_vector = vectorizer.transform([' '.join(career_skills)])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(user_vector, career_vector)[0][0]
        return similarity * 100
    except Exception as e:
        print(f"Error in calculate_career_match: {str(e)}")
        return 0

def adjust_match_by_salary(match_score, user_expected_salary, career_salary_range):
    try:
        salary_match = 1.0
        if user_expected_salary > career_salary_range['max']:
            salary_match = 0.7
        elif user_expected_salary < career_salary_range['min']:
            salary_match = 0.9
        return match_score * salary_match
    except Exception as e:
        print(f"Error in adjust_match_by_salary: {str(e)}")
        return match_score

@app.route('/api/career-recommendations', methods=['POST'])
def get_career_recommendations():
    try:
        data = request.json
        
        user_skills = data.get('skills', [])
        expected_salary = data.get('expected_salary', 0)
        years_experience = data.get('years_experience', 0)
        education_level = data.get('education_level', '')
        
        if not user_skills:
            return jsonify({'error': 'Please provide at least one skill'}), 400
        
        recommendations = []
        
        for career_name, career_data in careers_data.items():
            # Calculate base match score
            match_score = calculate_career_match(user_skills, career_data['skills'])
            
            # Adjust score based on salary expectations
            match_score = adjust_match_by_salary(
                match_score,
                expected_salary,
                career_data['salary_range']
            )
            
            # Additional adjustments based on experience and education
            if years_experience >= 5:
                match_score *= 1.1
            if education_level.lower() in ['masters', 'phd']:
                match_score *= 1.05
                
            recommendations.append({
                'career': career_name,
                'match_score': round(match_score, 2),
                'description': career_data['description'],
                'required_skills': career_data['skills'],
                'salary_range': career_data['salary_range']
            })
        
        # Sort by match score and return top 3
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return jsonify({'recommendations': recommendations[:3]})
    
    except Exception as e:
        print(f"Error in get_career_recommendations: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

def extract_text_from_pdf(pdf_file):
    try:
        print("Reading PDF file...")
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        print(f"Extracted {len(text)} characters from PDF")
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return None

def extract_resume_data(text):
    try:
        print("Extracting resume data from text...")
        # Initialize sections
        skills = []
        experience = ""
        education = ""
        
        # Split text into lines
        lines = text.split('\n')
        
        # Keywords to identify sections
        skill_keywords = ['skills', 'technical skills', 'expertise', 'proficiencies']
        experience_keywords = ['experience', 'work history', 'employment', 'professional experience']
        education_keywords = ['education', 'academic background', 'qualifications']
        
        current_section = None
        
        for line in lines:
            line = line.strip().lower()
            
            # Check for section headers
            if any(keyword in line for keyword in skill_keywords):
                current_section = 'skills'
                continue
            elif any(keyword in line for keyword in experience_keywords):
                current_section = 'experience'
                continue
            elif any(keyword in line for keyword in education_keywords):
                current_section = 'education'
                continue
            
            # Process content based on current section
            if current_section == 'skills' and line:
                # Split skills by common delimiters
                skills.extend([skill.strip() for skill in re.split(r'[,;]', line) if skill.strip()])
            elif current_section == 'experience' and line:
                experience += line + " "
            elif current_section == 'education' and line:
                education += line + " "
        
        print(f"Extracted {len(skills)} skills, {len(experience)} characters of experience, {len(education)} characters of education")
        return {
            'skills': skills,
            'experience': experience.strip(),
            'education': education.strip()
        }
    except Exception as e:
        print(f"Error extracting resume data: {str(e)}")
        return None

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        print("Received request to analyze resume")
        
        if 'file' not in request.files:
            print("No file in request.files")
            print("Request files:", request.files)
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        print(f"Received file: {file.filename}")
        
        if file.filename == '':
            print("Empty filename")
            return jsonify({'error': 'No file selected'}), 400
            
        if not file.filename.lower().endswith('.pdf'):
            print(f"Invalid file type: {file.filename}")
            return jsonify({'error': 'Only PDF files are supported'}), 400
            
        print("Extracting text from PDF...")
        # Extract text from PDF
        text = extract_text_from_pdf(file)
        if text is None:
            print("Failed to extract text from PDF")
            return jsonify({'error': 'Failed to extract text from PDF'}), 400
            
        print("Extracting resume data...")
        # Extract resume data
        resume_data = extract_resume_data(text)
        if resume_data is None:
            print("Failed to extract resume data")
            return jsonify({'error': 'Failed to extract resume data'}), 400
            
        print("Analyzing resume...")
        # Analyze resume
        analysis = resume_analyzer.analyze_resume(resume_data)
        if analysis is None:
            print("Failed to analyze resume")
            return jsonify({'error': 'Failed to analyze resume'}), 500
            
        print("Analysis completed successfully")
        return jsonify(analysis)
        
    except Exception as e:
        print(f"Error in analyze_resume endpoint: {str(e)}")
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Train the model if it hasn't been trained yet
    if not os.path.exists('models/resume_model.joblib'):
        print("Training the resume analyzer model...")
        if not resume_analyzer.train_model():
            print("Failed to train the model")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 