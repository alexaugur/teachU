
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Question, TokenBlocklist, JobPosting, Rubric
from ..schemas import QuestionSchema
from ..extensions import db

questions_bp = Blueprint('questions', __name__)


@questions_bp.route("/<posting_id>/questions", methods=['POST'])
@jwt_required()
def create_question(posting_id):
    data = request.get_json()
    posting = JobPosting.get_by_id(id=posting_id)
    if posting is None:
        return jsonify({"message": "posting not found with id"}), 404

    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    if 'content' not in data or 'type' not in data:
        return jsonify({"error": "Content and type required"}), 400

    new_question = Question(
        jobposting_id = posting_id,
        content=data.get("content"),
        type = data.get("type")
        )

    new_question.save()

    return jsonify({"message": "Question created"}), 201




# @questions_bp.route("/<posting_id>/questions/<id>", methods=['PUT'])
# @jwt_required()
# def update_questions(posting_id, id):
#     data = request.get_json()
#     school_id = get_jwt_identity()

#     question = Question.get_by_id(id=id)
#     if question is None:
#         return jsonify({"message": "question not found "}), 404
#     posting = JobPosting.get_by_id(id = posting_id)
#     if posting is None:
#         return jsonify({"message": "posting not"}), 404
#     if posting.id != question.jobposting_id :
#         return jsonify({"question does not belong to posting"}), 404
#     if posting.school_id != school_id: 
#         return jsonify({"message": "Unauthorized"}), 403
    
#     question.content=data.get("content")
#     question.experience=data.get("type")
#     return jsonify({"message": "Question Updated"}), 201

@questions_bp.route("/question/<question_id>", methods=['PUT'])
@jwt_required()
def update_questions(question_id):
    data = request.get_json()
    school_id = get_jwt_identity()

    question = Question.get_by_id(id=question_id)
    if question is None:
        return jsonify({"message": "question not found "}), 404
    
    posting = JobPosting.get_by_id(id = question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not"}), 404
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    question.content= data.get("content")
    # question.experience=data.get("type")
    question.save()
    return jsonify({"message": "Question Updated"}), 201


@questions_bp.delete("/<posting_id>/questions/<id>")
@jwt_required()
def delete_questions(posting_id,id):
    question = Question.get_by_id(id=id)
    school_id = get_jwt_identity()
    if question is None:
        return jsonify({"message": "question not found "}), 404
    posting = JobPosting.get_by_id(id = posting_id)
    if posting is None:
        return jsonify({"message": "posting not"}), 404
    if posting.id != question.jobposting_id :
        return jsonify({"question does not belong to posting"}), 404
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    
    
    
    question.delete()

    return jsonify({"message": "Question Deleted"}), 201

@questions_bp.get("/<posting_id>/questions/<id>")
@jwt_required()
def get_questions_by_id(posting_id, id):
    # Fetch the question by its ID
    question = Question.get_by_id(id=id)
    if question is None:
        return jsonify({"message": "Question not found"}), 404

    # Fetch the job posting by its ID
    posting = JobPosting.get_by_id(id=posting_id)
    if posting is None:
        return jsonify({"message": "Posting not found"}), 404

    # Check if the question belongs to the given posting
    #if posting.id != question.jobposting_id:
        #return jsonify({"message": "Question does not belong to posting"}), 404

    # Serialize the question using a schema
    result = QuestionSchema().dump(question)
    return jsonify({"question": result}), 200





@questions_bp.get("/<posting_id>/questions")
# @jwt_required()
def get_questions_by_posting_id(posting_id):

    questions = Question.get_by_posting_id(posting_id=posting_id)
    result = QuestionSchema().dump(questions, many=True)

    return (
            jsonify(
                {
                    "questions": result
                }
            ),
            200,
        )






