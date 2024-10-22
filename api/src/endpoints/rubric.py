
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Question, TokenBlocklist, JobPosting, Rubric, Answer, Score
from ..schemas import QuestionSchema, RubricSchema, RubricWithScoreSchema, ScoreSchema
from ..extensions import db

rubrics_bp = Blueprint('rubric', __name__)


@rubrics_bp.route("/<question_id>/rubric", methods=['POST'])
@jwt_required()
def create_rubric(question_id):
    data = request.get_json()

    question = Question.get_by_id(id=question_id)
    if question is None:
        return jsonify({"message": "question not found with id"}), 404

    posting = JobPosting.get_by_id(id=question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found with id"}), 404

    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    if 'score' not in data or 'criteria' not in data:
        return jsonify({"message": "score and criteria required"}), 400

    new_rubric = Rubric(
        question_id = question_id,
        score = data['score'],
        criteria = data['criteria']
    )
    new_rubric.save()
    return jsonify({"message": "Rubric created", "rubric_id": new_rubric.id}), 201




@rubrics_bp.route("/<id>", methods=['PUT'])
@jwt_required()
def update_rubric(id):
    data = request.get_json()
    school_id = get_jwt_identity()

    rubric= Rubric.get_by_id(id=id)
    if rubric is None:
        return jsonify({"message": "rubric not found "}), 404
    question = Question.get_by_id(rubric.question_id)
    if question is None:
        return jsonify({"message": "question not found "}), 404
    posting = JobPosting.get_by_id(id = question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found"}), 404
    
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    rubric.score = data.get("score", rubric.score)
    rubric.criteria = data.get("criteria", rubric.criteria)
    # rubric.current_score = data.get("current_score", rubric.current_score)
    rubric.save()
    return jsonify({"message": "Rubric Updated"}), 201



@rubrics_bp.delete("/<id>")
@jwt_required()
def delete_rubric(id):
    school_id = get_jwt_identity()
    
    rubric= Rubric.get_by_id(id=id)
    if rubric is None:
        return jsonify({"message": "rubric not found "}), 404
    question = Question.get_by_id(rubric.question_id)
    if question is None:
        return jsonify({"message": "question not found "}), 404
    posting = JobPosting.get_by_id(id = question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found"}), 404
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    rubric.delete()
    return jsonify({"message": "Rubric Deleted"}), 201

@rubrics_bp.get("/questions/<question_id>")
@jwt_required()
def get_rubrics_by_questionid(question_id):
    question = Question.get_by_id(id=question_id)
    school_id = get_jwt_identity()
    if question is None:
        return jsonify({"message": "question not found "}), 404
    
    posting = JobPosting.get_by_id(id = question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found"}), 404

    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    rubrics = Rubric.get_by_question_id(question_id=question_id)
    result = RubricSchema(many= True).dump(rubrics)
    if rubrics is not None:
        return (
                jsonify({"rubrics": result}), 200
            )
    else :
        return (
            jsonify({"message": "No rubric for this question"}), 200
        )
    

@rubrics_bp.get("/withscore/<answer_id>")
@jwt_required()
def get_rubrics_and_score(answer_id):
    answer = Answer.get_by_id(id=answer_id)
    question = Question.get_by_id(id=answer.question_id)
    school_id = get_jwt_identity()
    if answer is None:
        return jsonify({"message": "answer not found "}), 404
    
    posting = JobPosting.get_by_id(id = question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found"}), 404

    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    rubrics = Rubric.get_by_question_id(question_id=answer.question_id)
    scores = {score.rubric_id: score for score in Score.query.filter_by(answer_id=answer_id).all()}
    result = []
    for rubric in rubrics:
        rubric_data = RubricWithScoreSchema().dump(rubric)
        rubric_data['scoreObj'] = ScoreSchema().dump(scores.get(rubric.id, None))
        result.append(rubric_data)

    return jsonify({"rubrics": result}), 200




@rubrics_bp.route("/<rubric_id>/scores", methods=['POST'])
@jwt_required()
def create_score(rubric_id):
    data = request.get_json()

    # Check if both answer_id and points exist in the request
    if 'answer_id' not in data or 'points' not in data:
        return jsonify({"message": "Missing answer_id or points in request"}), 400
    answer_id = data.get('answer_id')
    points = data.get('points')

    answer =Answer.get_by_id(id=answer_id)
    question = Question.get_by_id(id=answer.question_id)
    if question is None:
        return jsonify({"message": "question not found with id"}), 404

    posting = JobPosting.get_by_id(id=question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found with id"}), 404

    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    new_score = Score(
        answer_id = answer_id,
        points = points,
        rubric_id = rubric_id

    )
    new_score.save()
    return jsonify({"message": "Score created", "score_id": new_score.id}), 201



@rubrics_bp.route("/<rubric_id>/scores/<score_id>", methods=['PUT'])
@jwt_required()
def update_score(rubric_id, score_id):
    data = request.get_json()

    # Check if both answer_id and points exist in the request
   

    score =Score.get_by_id(id=score_id)

    '''
    question = Question.get_by_id(id=answer.question_id)
    if question is None:
        return jsonify({"message": "question not found with id"}), 404

    posting = JobPosting.get_by_id(id=question.jobposting_id)
    if posting is None:
        return jsonify({"message": "posting not found with id"}), 404

    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    '''
    score.points = data.get("points", score.points)

    score.save()
    return jsonify({"message": "Score updated"}), 201

