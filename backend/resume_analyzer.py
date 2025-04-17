import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
import re

class ResumeAnalyzer:
    def __init__(self):
        print("Initializing ResumeAnalyzer...")
        # Initialize vectorizers and models
        self.skills_vectorizer = TfidfVectorizer(max_features=1000)
        self.experience_vectorizer = TfidfVectorizer(max_features=500)
        self.education_vectorizer = TfidfVectorizer(max_features=500)
        self.scaler = StandardScaler()
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        
        # Check if model exists, if not train it
        if not os.path.exists('models/resume_model.joblib'):
            print("Model not found, training new model...")
            self.train_model()
        else:
            print("Loading existing model...")
            self.load_model()
        
        # Enhanced training data with more diverse resumes
        self.sample_resumes = [
            # Senior Software Engineer
            {
                'skills': ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'REST API'],
                'experience': '8 years of experience in software development, 3 years as team lead, multiple large-scale projects',
                'education': 'Masters in Computer Science from Stanford University',
                'score': 95
            },
            # Junior Developer
            {
                'skills': ['JavaScript', 'HTML', 'CSS', 'React', 'Git'],
                'experience': '1 year of internship experience in frontend development',
                'education': 'Bachelors in Computer Science',
                'score': 70
            },
            # Data Scientist
            {
                'skills': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'Data Visualization'],
                'experience': '5 years of experience in data science, published research papers',
                'education': 'PhD in Machine Learning',
                'score': 90
            },
            # DevOps Engineer
            {
                'skills': ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python', 'Shell Scripting'],
                'experience': '6 years of experience in cloud infrastructure and automation',
                'education': 'Bachelors in Computer Engineering',
                'score': 88
            },
            # UI/UX Designer
            {
                'skills': ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping', 'User Research', 'HTML', 'CSS'],
                'experience': '4 years of experience in UI/UX design, worked with multiple startups',
                'education': 'Bachelors in Design',
                'score': 85
            },
            # Project Manager
            {
                'skills': ['Project Management', 'Agile', 'Scrum', 'JIRA', 'Communication', 'Leadership', 'Risk Management'],
                'experience': '7 years of experience in project management, led teams of 20+ members',
                'education': 'MBA in Project Management',
                'score': 87
            },
            # Entry Level Developer
            {
                'skills': ['Python', 'Java', 'SQL', 'Git'],
                'experience': 'Recent graduate with internship experience',
                'education': 'Bachelors in Computer Science',
                'score': 65
            },
            # Senior Data Analyst
            {
                'skills': ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Data Analysis', 'Statistics'],
                'experience': '6 years of experience in data analysis, worked with large datasets',
                'education': 'Masters in Data Science',
                'score': 86
            }
        ]

    def train_model(self):
        try:
            print("Starting model training...")
            # Prepare training data
            skills_texts = [' '.join(resume['skills']) for resume in self.sample_resumes]
            experience_texts = [resume['experience'] for resume in self.sample_resumes]
            education_texts = [resume['education'] for resume in self.sample_resumes]
            scores = [resume['score'] for resume in self.sample_resumes]

            print("Fitting vectorizers...")
            # Fit vectorizers
            skills_features = self.skills_vectorizer.fit_transform(skills_texts).toarray()
            experience_features = self.experience_vectorizer.fit_transform(experience_texts).toarray()
            education_features = self.education_vectorizer.fit_transform(education_texts).toarray()

            print("Combining features...")
            # Combine features
            X = np.hstack([skills_features, experience_features, education_features])
            y = np.array(scores)

            print("Scaling features...")
            # Scale features
            X_scaled = self.scaler.fit_transform(X)

            print("Training model...")
            # Train model
            self.model.fit(X_scaled, y)

            print("Saving model...")
            # Save the trained model and vectorizers
            self.save_model()
            print("Model training completed successfully")
            return True
        except Exception as e:
            print(f"Error in train_model: {str(e)}")
            return False

    def save_model(self):
        try:
            print("Saving model and vectorizers...")
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # Save model and vectorizers
            joblib.dump(self.model, 'models/resume_model.joblib')
            joblib.dump(self.skills_vectorizer, 'models/skills_vectorizer.joblib')
            joblib.dump(self.experience_vectorizer, 'models/experience_vectorizer.joblib')
            joblib.dump(self.education_vectorizer, 'models/education_vectorizer.joblib')
            joblib.dump(self.scaler, 'models/scaler.joblib')
            print("Model and vectorizers saved successfully")
            return True
        except Exception as e:
            print(f"Error in save_model: {str(e)}")
            return False

    def load_model(self):
        try:
            print("Loading model and vectorizers...")
            self.model = joblib.load('models/resume_model.joblib')
            self.skills_vectorizer = joblib.load('models/skills_vectorizer.joblib')
            self.experience_vectorizer = joblib.load('models/experience_vectorizer.joblib')
            self.education_vectorizer = joblib.load('models/education_vectorizer.joblib')
            self.scaler = joblib.load('models/scaler.joblib')
            print("Model and vectorizers loaded successfully")
            return True
        except Exception as e:
            print(f"Error in load_model: {str(e)}")
            return False

    def analyze_resume(self, resume_data):
        try:
            print("Starting resume analysis...")
            
            # Prepare input features
            skills_text = ' '.join(resume_data.get('skills', []))
            experience_text = resume_data.get('experience', '')
            education_text = resume_data.get('education', '')
            
            print(f"Skills text length: {len(skills_text)}")
            print(f"Experience text length: {len(experience_text)}")
            print(f"Education text length: {len(education_text)}")

            # Transform text data
            print("Transforming text data...")
            skills_features = self.skills_vectorizer.transform([skills_text]).toarray()
            experience_features = self.experience_vectorizer.transform([experience_text]).toarray()
            education_features = self.education_vectorizer.transform([education_text]).toarray()

            # Combine features
            print("Combining features...")
            X = np.hstack([skills_features, experience_features, education_features])
            X_scaled = self.scaler.transform(X)

            # Predict score
            print("Predicting score...")
            score = self.model.predict(X_scaled)[0]
            
            # Calculate category scores
            print("Calculating category scores...")
            skills_score = min(100, max(0, score * 0.4))
            experience_score = min(100, max(0, score * 0.35))
            education_score = min(100, max(0, score * 0.25))

            # Generate feedback
            print("Generating feedback...")
            feedback = self.generate_feedback(score, skills_score, experience_score, education_score)

            result = {
                'overall_score': round(score, 2),
                'category_scores': {
                    'skills': round(skills_score, 2),
                    'experience': round(experience_score, 2),
                    'education': round(education_score, 2)
                },
                'feedback': feedback
            }
            
            print("Analysis completed successfully")
            return result
            
        except Exception as e:
            print(f"Error in analyze_resume: {str(e)}")
            return None

    def extract_years_of_experience(self, experience_text):
        # Extract years of experience using regex
        years_pattern = r'(\d+)\s*(?:years?|yrs?)'
        matches = re.findall(years_pattern, experience_text.lower())
        if matches:
            return max([int(match) for match in matches])
        return 0

    def extract_education_level(self, education_text):
        education_text = education_text.lower()
        if 'phd' in education_text or 'doctorate' in education_text:
            return 'phd'
        elif 'master' in education_text or 'ms' in education_text:
            return 'masters'
        elif 'bachelor' in education_text or 'bs' in education_text or 'ba' in education_text:
            return 'bachelors'
        return 'other'

    def adjust_score(self, base_score, years_exp, education_level):
        # Adjust score based on years of experience
        if years_exp >= 5:
            base_score *= 1.1
        elif years_exp >= 3:
            base_score *= 1.05
        elif years_exp < 1:
            base_score *= 0.9

        # Adjust score based on education level
        if education_level == 'phd':
            base_score *= 1.1
        elif education_level == 'masters':
            base_score *= 1.05
        elif education_level == 'bachelors':
            base_score *= 1.0
        else:
            base_score *= 0.95

        return min(100, max(0, base_score))

    def generate_feedback(self, overall_score, skills_score, experience_score, education_score):
        feedback = []
        
        # Overall feedback
        if overall_score < 60:
            feedback.append("Your resume needs significant improvement to be competitive in the job market.")
        elif overall_score < 75:
            feedback.append("Your resume is decent but could use some improvements to stand out.")
        else:
            feedback.append("Your resume looks strong and well-structured.")

        # Skills feedback
        if skills_score < 30:
            feedback.append("Consider adding more relevant technical skills and tools to your resume.")
        elif skills_score < 40:
            feedback.append("Your skills section is good but could be more comprehensive.")
        else:
            feedback.append("Your skills section is well-developed and shows good technical expertise.")

        # Experience feedback
        if experience_score < 25:
            feedback.append("Try to highlight more relevant work experience and quantify your achievements.")
        elif experience_score < 30:
            feedback.append("Your experience section is solid but could be more detailed with specific accomplishments.")
        else:
            feedback.append("Your experience section effectively showcases your professional growth and achievements.")

        # Education feedback
        if education_score < 25:
            feedback.append("Consider adding more details about your education, relevant coursework, and academic projects.")
        elif education_score < 30:
            feedback.append("Your education section is good but could be more detailed with relevant coursework and projects.")
        else:
            feedback.append("Your education section effectively highlights your academic background and achievements.")

        return feedback

    def determine_role_type(self, skills_text):
        skills_text = skills_text.lower()
        
        # Define role-specific keywords
        role_keywords = {
            'software_engineer': ['python', 'java', 'javascript', 'react', 'node.js', 'sql', 'git'],
            'data_scientist': ['machine learning', 'data analysis', 'python', 'r', 'statistics', 'pandas', 'numpy'],
            'devops': ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'terraform', 'jenkins'],
            'ui_ux': ['figma', 'adobe xd', 'ui/ux', 'prototyping', 'user research', 'wireframing']
        }
        
        # Count matches for each role
        role_matches = {}
        for role, keywords in role_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in skills_text)
            role_matches[role] = matches
        
        # Return role with most matches
        return max(role_matches.items(), key=lambda x: x[1])[0] if role_matches else 'other' 