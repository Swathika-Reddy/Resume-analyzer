from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import re

app = Flask(__name__)
CORS(app)

# User data storage (in production, use a database)
users = []

# Career recommendations based on skills
CAREER_RECOMMENDATIONS = {
    'software': ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer'],
    'data': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer'],
    'design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer'],
    'business': ['Business Analyst', 'Project Manager', 'Product Manager']
}

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def extract_skills(text):
    # Simple skill extraction using common keywords
    skill_keywords = [
        'python', 'java', 'javascript', 'html', 'css', 'react', 'angular', 'vue',
        'sql', 'database', 'aws', 'azure', 'docker', 'kubernetes', 'git',
        'machine learning', 'data analysis', 'project management', 'leadership',
        'communication', 'problem solving', 'teamwork', 'agile', 'scrum'
    ]
    
    found_skills = []
    text_lower = text.lower()
    for skill in skill_keywords:
        if skill in text_lower:
            found_skills.append(skill)
    
    return found_skills

def analyze_resume(resume_text, job_description):
    # Extract skills from both resume and job description
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    
    # Calculate skill match percentage
    matched_skills = set(resume_skills) & set(job_skills)
    match_percentage = (len(matched_skills) / len(job_skills)) * 100 if job_skills else 0
    
    return {
        'matched_skills': list(matched_skills),
        'match_percentage': round(match_percentage, 2)
    }

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    users.append(data)
    return jsonify({'message': 'User registered successfully'})

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    skills = data.get('skills', '').lower()
    
    # Simple recommendation logic based on skills
    recommendations = []
    for category, careers in CAREER_RECOMMENDATIONS.items():
        if category in skills:
            recommendations.extend(careers)
    
    # Return top 3 unique recommendations
    return jsonify({'recommendations': list(set(recommendations))[:3]})

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume_endpoint():
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({'error': 'Missing resume or job description'}), 400
    
    file = request.files['resume']
    job_description = request.form['job_description']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract text based on file type
        if filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(filepath)
        else:
            resume_text = extract_text_from_docx(filepath)
        
        # Analyze resume
        analysis = analyze_resume(resume_text, job_description)
        
        # Clean up
        os.remove(filepath)
        
        return jsonify(analysis)
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)