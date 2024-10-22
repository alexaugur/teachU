
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from models import Question, TokenBlocklist
from schemas import QuestionSchema
from extensions import db

questions_bp = Blueprint('questions', __name__)

@questions_bp.post("/")
def create_questions():
    data = request.get_json()
    new_question = Question(
        posting_id = data.get("posting_id"),
        title = data.get("title"),
        content=data.get("content"),
        type = data.get("type")
        )
    # new_teacher.set_password(password=data.get("password"))
    
    # new_user.set_password(password=data.get("password"))
    new_question.save()

    return jsonify({"message": "Question created"}), 201


@questions_bp.put("/questions/<id>")
def update_questions(id):
    data = request.get_json()

    question = Question.get_by_id(id=id)
    # answer.get_by_id()
    # if teacher is not None:
        # return jsonify({"error": "Account already exists"}), 409
    if question is not None:
        question.posting_id=data.get("posting_id")
        question.title=data.get("title")
        question.content=data.get("content")
        question.type=data.get("type")
        question.save_existing()
        return jsonify({"message": "Question Updated"}), 201

    # new_answer = Question(
    #         application_id = data.get("application_id"),
    #         teacher_id = data.get("teacher_id"),
    #         answer_field = data.get("answer_field")
    #     )
    # new_teacher.set_password(password=data.get("password"))
    
    # new_user.set_password(password=data.get("password"))
    return jsonify({"message": "Unable to update question"}), 400

@questions_bp.delete("/questions/<id>")
def delete_questions(id):
    data = request.get_json()

    question = Question.get_by_id(id=id)
    # answer.get_by_id()
    # if teacher is not None:
        # return jsonify({"error": "Account already exists"}), 409
    if question is not None:
        question.delete()

    return jsonify({"message": "Question Deleted"}), 201


@questions_bp.get("/postings/<id>")
def get_questions_by_posting_id(id):
    questions = Question.get_by_posting_id(posting_id=id)
    result = QuestionSchema().dump(questions, many=True)

    return (
            jsonify(
                {
                    "questions": result
                }
            ),
            200,
        )

    # return jsonify({"message": "Question Deleted"}), 201

@questions_bp.get("/question/<id>")
def get_questions_by_id(id):
    data = request.get_json()

    question = Question.get_by_id(id=id)
    result = QuestionSchema().dump(question, many=True)

    # question.get_by_id()
    # if teacher is not None:
        # return jsonify({"error": "Account already exists"}), 409
    if question is not None:
        return (
            jsonify(question)
        )
    
    return jsonify({"message": "Question not found"}), 400




