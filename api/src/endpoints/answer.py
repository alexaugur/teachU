
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Answer, Teacher, Application, TokenBlocklist, Rubric, Question, JobPosting
from ..schemas import AnswerSchema, ApplicationSchema, QuestionAnswerSchema
from ..extensions import db

answers_bp = Blueprint('answer', __name__)

@answers_bp.post("")
@jwt_required()
def create_answers():
    data = request.get_json()

    ###not needed but prevents someone from crashing backend
    application = Application.get_by_id(id=data.get("application_id"))
    if application is None:
        return jsonify({"message": "application does not exist"}), 404
    question = Question.get_by_id(id=data.get("question_id"))
    if question is None:
        return jsonify({"message": "question does not exist"}), 404




    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type != "teacher":
        return jsonify({"message": "cannot create an answer as school"}), 403
    

    teacher_id = get_jwt_identity()
    if application.teacher_id != teacher_id:
        return jsonify({"message": f"cannot create an answer associated with this application. applciation teacher idd: {application.teacher_id}, provided teacher _id in r1: {teacher_id}"}), 403
    if application.jobposting_id != question.jobposting_id:
        return jsonify({"message": "cannot create an answer with given params"}), 403


    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    

    answer = Answer.check_duplicate(question_id=data.get("question_id"), teacher_id=teacher_id)
    if answer is not None:
        return jsonify({"message": "You've already applied to this job posting"}), 400
    
    new_answer = Answer(
            application_id = data.get("application_id"),
            question_id = data.get("question_id"),
            teacher_id = teacher_id,
            answer_field = data.get("answer_field")
        )
    new_answer.save()

    return jsonify({"message": "Answer created"}), 201




@answers_bp.get("/question/<question_id>")
@jwt_required()
def get_answers_by_question_id(question_id):
    #verify that user is the school
    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type != "school":
        return jsonify({"message": "not accessible to teachers"}), 403
    
    #get question
    question = Question.get_by_id(question_id)
    if question is None:
        return jsonify({"message": "question not found given id"}), 404
    
 
    posting = JobPosting.get_by_id(id=question.jobposting_id)
    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403


    answers = Answer.get_answers_and_applications_by_question_id(question_id=question_id)
  
    answer_schema = AnswerSchema()
    application_schema = ApplicationSchema()
    
    # Manually serialize each result
    serialized_results = []
    for answer, application in answers:
        serialized_result = {
            "answer": answer_schema.dump(answer),
            "application": application_schema.dump(application)
        }
        serialized_results.append(serialized_result)
    
    return jsonify({"answers": serialized_results}), 200


#
@answers_bp.get("/application/<id>")
@jwt_required()
def get_by_app_id(id):

    application = Application.get_by_id(id=id)
    if application is None:
        return jsonify({"message": "Application not found"}), 404

    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type == "teacher":
        teacher_id = get_jwt_identity()

        if teacher_id != application.teacher_id:
            return jsonify({"message": "teacher not authorized to access these answers"}), 403
    if user_type == "school":
        posting = JobPosting.get_by_id(application.jobposting_id)
        school_id = get_jwt_identity()
        if school_id != posting.school_id:
            return jsonify({"message": "school not authorized to access these answers"}), 403 
    

    result = Answer.get_by_application_id_with_refactor(id)
    #application = Application.get_by_id(id=id)
    apps = ApplicationSchema().dump(application)


    response_data = []
    for answer, question, teacher in result:

        response_data.append({
            'answer_id': answer.id,
            'question_id': answer.question_id,
            'answer_field': answer.answer_field,
            'question_text': question.content,

        })
    
    # Returning the response as JSON
    return (
            jsonify(
                {
                    "answers": response_data,
                    "profile": apps
                }
            ),
            200,
        )

  

@answers_bp.get("/answer/<id>")
@jwt_required()
def get_answers_by_id(id):

    answer = Answer.get_by_id(id=id)
    if answer is None:
        return jsonify({"message": "Answer not found"}), 404
    
    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type == "teacher":
        teacher_id = get_jwt_identity()

        if teacher_id != answer.teacher_id:
            return jsonify({"message": "teacher not authorized to access this answer"}), 403
    if user_type == "school":
        question = Question.get_by_id(answer.question_id)
        posting = JobPosting.get_by_id(question.jobposting_id)
        school_id = get_jwt_identity()
        if school_id != posting.school_id:
            return jsonify({
        "message": f"School not authorized to access this answer. Authorized school_id: {posting.school_id}, provided school_id: {school_id}"
    }), 403


    answer_schema = AnswerSchema()
    answer_json = answer_schema.dump(answer)

    return jsonify(answer_json), 200



'''
@answers_bp.delete("/answer/<id>")
def delete_answers(id):
    data = request.get_json()

    answer = Answer.get_by_id(id=id)
    # answer.get_by_id()
    # if teacher is not None:
        # return jsonify({"error": "Account already exists"}), 409
    # if answer is not None:
    application = Application.get_by_id(id=answer.application_id)

    if application is None:
        return jsonify({"message": "Application not found"}), 404
    application.score = application.score - answer.score
    application.save_existing()

    if answer is not None:
        answer.delete()
    

    return jsonify({"message": "Answer Deleted"}), 201
'''


'''

@answers_bp.get("/answer/<id>")
def get_answers_by_application(id):
    data = request.get_json()

    answers = Answer.get_by_application_id(application_id=id)
    # answer.get_by_id()
    # if teacher is not None:
        # return jsonify({"error": "Account already exists"}), 409
    # if answer is not None:
    #     answer.delete()
    result = AnswerSchema().dump(answers, many=True)
    # UserSchema().dump(users, many=True)
    return (
            jsonify(
                {
                    "answers": result
                }
            ),
            200,
        )

    # return jsonify({"message": "Answer Deleted"}), 201
'''
