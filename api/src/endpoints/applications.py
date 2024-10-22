
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Application, TeacherInterview, TokenBlocklist, Teacher, TeacherProfile, Answer, School, Question, JobPosting, Message, Score

# from ..models import Message as CustomMessage
from ..schemas import ApplicationSchema, NewApplicationSchema
from ..extensions import db
# from mailbox import Message
from mailjet_rest import Client

applications_bp = Blueprint('applications', __name__)



@applications_bp.route("", methods=['POST'])
@jwt_required()
def create_application():
    data = request.get_json()
    if 'jobposting_id' not in data:
        return jsonify({"error": "jobposting_id is required"}), 400

    posting = JobPosting.get_by_id(data["jobposting_id"])
    if posting is None:
        return jsonify({"message": "no posting associated with given id"}), 404


    school = School.get_by_id(posting.school_id)

    
    claims = get_jwt()
    user_type = claims.get("user_type")

    if user_type != "teacher":
        return jsonify({"message": "cannot create an application as school"}), 403
    


    teacher_id = get_jwt_identity()
    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    application = Application.check_duplicate(teacher_id=teacher_id, jobposting_id=data["jobposting_id"])
    if application is not None:
        return jsonify({"message": "You've already applied to this job posting!"}), 404

    posting.num_applicants += 1
    posting.save()

    application = Application(teacher_id = teacher_id, jobposting_id = data["jobposting_id"])
    application.save()
    #get a snapshot of the current schools profile
    teacher_profile = TeacherProfile.get_by_teacher_id(teacher_id)
    application.email = teacher.email
    application.first_name=teacher_profile.first_name
    application.last_name=teacher_profile.last_name
    application.current_school=teacher_profile.current_school
    application.education=teacher_profile.education
    application.subjects_taught=teacher_profile.subjects_taught
    application.current_state=teacher_profile.current_state
    application.grades_taught=teacher_profile.grades_taught
    application.years_of_experience=teacher_profile.years_of_experience
    application.past_jobs=teacher_profile.past_jobs
    application.accolades=teacher_profile.accolades
    application.accommodations=teacher_profile.accommodations
    application.avatar=teacher_profile.avatar

    API_KEY = "ddbed74f0e5baf06dc331611d95348ef"
    API_SECRET = "bc8c5a253bb6e7f704d455d5e09ce8f1"
    mailjet = Client(auth=(API_KEY, API_SECRET), version='v3.1')
    data = {
            'Messages': [
                {
                "From": {
                    "Email": "teachu.notifications@gmail.com",
                    "Name": "Me"
                },
                "To": [
                    {
                    "Email": school.email,
                    "Name": "You"
                    }
                ],
                "Subject": "Teachu Notifications!",
                "TextPart": "This is to inform you that a user " + application.first_name + " "  + application.last_name + " has applied to your job posting.",
                # "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
                }
            ]
            }
    mailjet.send.create(data=data)
            # return result

    message = Message(
        content = "Application submitted for " + teacher_profile.first_name + " " + teacher_profile.last_name + " to " + posting.job_info.title,
        teacher_id = teacher_id,
        school_id = school.id,
        sender_type = "automated",
    )
    message.save()
    # application_id = application.id
    # )
    # application.profile_snapshot = snapshot_profile
    db.session.commit()
    application.save()

    

    return jsonify({"message": "Application created", "application_id": application.id}), 201


@applications_bp.route("/my", methods=['GET'])
@jwt_required()
def get_applications_by_teacher():
    status = request.args.get("status", "submitted")
    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type != "teacher":
        return jsonify({"message": "school does not have applications"}), 403
    
    teacher_id = get_jwt_identity()
    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    applications = Application.get_by_teacher_with_posting(teacher_id=teacher_id, app_status=status)

    # result = ApplicationSchema().dump(applications, many=True)
    # return (
    #         jsonify(
    #             {
    #                 "applications": result
    #             }
    #         ),
    #         200,
    #     )
    response_data = []


    for application, posting, jobinfo, school_profile in applications:
        response_data.append({
            'id': application.id,
            'title': jobinfo.title,
            'school': school_profile.name,
            'city': school_profile.city,
            'state': school_profile.state,
            'app_status': application.app_status,
            'posting_id': posting.id,

        })
    return (
            jsonify(
                {
                    "applications": response_data,
                }
            ),
            200,
        )


@applications_bp.route("/byposting/<jobposting_id>", methods=['GET'])
@jwt_required()
def get_applications_by_posting(jobposting_id):
    status = request.args.get("status", "submitted")
    school_id = get_jwt_identity()
    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "school not found attached to user"}), 404
    #TODO
    #check if id of job posting  matches user id

    applications = Application.get_by_posting(jobposting_id=jobposting_id, app_status=status)

    for app in applications:
        answers = Answer.get_by_application_id(app.id)
        total_score = 0
        for answer in answers:
            scores = Score.get_by_answer_id(answer.id)
            
            for score in scores:
                total_score += score.points

        #to calculate the total score add up the variables score.points for each score
        app.score = total_score

    result = ApplicationSchema().dump(applications, many=True)
    return (
            jsonify(
                {
                    "applications": result
                }
            ),
            200,
        )




@applications_bp.route("/<id>", methods=['PUT'])
@jwt_required()
def update_application(id):
    data = request.get_json()
    application = Application.get_by_id(id=id)
    if application is None:
        return jsonify({"message": "application not found"}), 404
    jobposting = JobPosting.get_by_id(id=application.jobposting_id)
    if jobposting is None:
        return jsonify({"message": "Job posting not found"}), 404
    claims = get_jwt()
    user_type = claims.get("user_type")

    if user_type != "school":
        return jsonify({"message": "cannot update application as teacher"}), 403
        
    school_id = get_jwt_identity()
    if school_id != jobposting.school_id:
        return jsonify({
        "message": f"School not authorized to access this application. Authorized school_id: {jobposting.school_id}, provided school_id: {school_id}"
    }), 403

    #once an application is submitted it cannot be edited. the only editing that can happen is the school marking the status
    
    
    if application is not None:
        if application.app_status == "interviewing" and data.get("status", application.app_status) != "interviewing":
            interview =TeacherInterview.get_by_teacher_and_postingid(teacher_id=application.teacher_id, posting_id=application.jobposting_id)
            if interview is not None:
                interview.delete()
        if application.app_status != data.get("status", application.app_status):
            message = Message(
                school_id= jobposting.school_id,
                teacher_id=application.teacher_id,
                content=f"Your application for {jobposting.job_info.title} has been changed to {data.get('status', application.app_status)}",
                sender_type="automated",
            )
            message.save()
        application.app_status=data.get("status", application.app_status)
        application.comment=data.get("comment", application.comment)
        db.session.commit()
        return jsonify({"message": "Application Updated"}), 201

    return jsonify({"message": "Unable to update application"}), 400




@applications_bp.route("/<id>", methods=['DELETE'])
@jwt_required()
def delete_application(id):
  

    application = Application.get_by_id(id=id)
    if application is None:
        return jsonify({"message": "application not found"}), 404
    #check if application belongs to teacher
    claims = get_jwt()
    user_type = claims.get("user_type")

    if user_type == "teacher":
        teacher_id = get_jwt_identity()

        if teacher_id != application.teacher_id:
            return jsonify({"message": "teacher not authorized to delete this application"}), 403
    if user_type == "school":
        posting = JobPosting.get_by_id(application.jobposting_id)
        school_id = get_jwt_identity()
        if school_id != posting.school_id:
            return jsonify({"message": "school not authorized to delete this application"}), 403 


    teacher_id = get_jwt_identity()
    if teacher_id != application.teacher_id:
        return jsonify({"message": "school not authorized to delete this application"}), 403
  

    application.delete()

    return jsonify({"message": "Application Deleted"}), 201




@applications_bp.route("/<id>", methods=['GET'])
@jwt_required()
def get_application_by_id(id):

    application= Application.get_by_id(id=id)
    if application is None:
        return jsonify({"message": "Application not found"}), 404
    claims = get_jwt()
    user_type = claims.get("user_type")
    if user_type == "teacher":
        teacher_id = get_jwt_identity()

        if teacher_id != application.teacher_id:
            return jsonify({"message": "teacher not authorized to access this application"}), 403
    if user_type == "school":
        posting = JobPosting.get_by_id(application.jobposting_id)
        school_id = get_jwt_identity()
        if school_id != posting.school_id:
            return jsonify({
        "message": f"School not authorized to access this application. Authorized school_id: {posting.school_id}, provided school_id: {school_id}"
    }), 403
    
    

    result = NewApplicationSchema().dump(application, many=False)

    return (
            jsonify(result)
        )

    

