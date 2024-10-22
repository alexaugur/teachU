
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Teacher, TeacherProfile, TokenBlocklist, ApplicationCart
from ..schemas import TeacherSchema, TeacherProfileSchema
from ..extensions import db


teachers_bp = Blueprint('teachers', __name__)

@teachers_bp.post("/register")
def create_teachers():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    teacher = Teacher.get_user_by_email(email=data.get("email"))

    if teacher is not None:
        return jsonify({"error": "Account already exists"}), 409
    
    new_teacher = Teacher(
        email=data["email"],
        )

    new_teacher.set_password(password=data["password"])
    new_teacher_prof = TeacherProfile(teacher_id = new_teacher.id, teacher=new_teacher)

    # Optionally set additional TeacherProfile fields if provided in the request
    fields = ['first_name', 'last_name', 'current_school', 'subjects_taught', 
              'current_state', 'grades_taught', 'years_of_experience', 'education', 'past_jobs', 
              'accolades', 'accommodations', 'avatar']
    for field in fields:
        if field in data:
            setattr(new_teacher_prof, field, data[field])
    
    new_teacher_prof.save()
    new_teacher.save()

    application_cart = ApplicationCart(teacher_id = new_teacher.id)
    application_cart.save()

    return jsonify({"message": "Teacher created", "teacher_profile": TeacherProfileSchema(many=False).dump(new_teacher_prof)}), 201



@teachers_bp.route('', methods=['GET'])
@jwt_required()
def get_teacherss():
    teachers = Teacher.query.all()
    return jsonify({"teachers": TeacherSchema(many=True).dump(teachers)}), 200


@teachers_bp.post("/login")
def login_user():
    data = request.get_json()

    teacher = Teacher.get_user_by_email(email=data.get("email"))

    if teacher and (teacher.check_password(password=data.get("password"))):
        additional_claims = {"user_type": "teacher"}
        access_token = create_access_token(identity=teacher.id, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=teacher.id, additional_claims=additional_claims)

        return (
            jsonify(
                {
                    "message": "Logged In ",
                    "tokens": {"access": access_token, "refresh": refresh_token},
                }
            ),
            200,
        )

    return jsonify({"error": "Invalid email or password"}), 400


@teachers_bp.get("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()

    new_access_token = create_access_token(identity=identity)

    return jsonify({"access_token": new_access_token})


@teachers_bp.get('/logout')
@jwt_required(verify_type=False) 
def logout_user():
    jwt = get_jwt()

    jti = jwt['jti']
    token_type = jwt['type']

    token_b = TokenBlocklist(jti=jti)

    token_b.save()

    return jsonify({"message": f"{token_type} token revoked successfully"}) , 200



import openai
openai.api_key = "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"


from PyPDF2 import PdfReader
import json


def extract_text_from_pdf(pdf_file):
    text = ""
    pdf_reader = PdfReader(pdf_file)
    num_pages = len(pdf_reader.pages)
    for page_number in range(num_pages):
        page = pdf_reader.pages[page_number]
        text += page.extract_text()
    return text



@teachers_bp.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return 'No file uploaded', 400
    file = request.files['resume']

    text = extract_text_from_pdf(file)
    # for page in file:
    #     text += page.get_text()
    client = openai.OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
             { "role": "system", "content": "Utilizing the information received from the following resume textdump, please tell me the following first_name, last_name, current_school,  subjects_taught, current_state, grades_taughtyears_of_experience, past_jobs, accolades,  accomodations. Don't give me any fluff; simply fill in the fields as I asked in a json format. If you do not know a field, leave it blank but still return a JSON formatted string. The type of every field should just be a string" + text},
    ])

    try:
        json_answer = json.loads(completion.choices[0].message.content)
        return json_answer, 200
    except json.JSONDecodeError:
        return jsonify({"message": "Error parsing resume, please fill out fields normally"}), 400
    # return file.filename