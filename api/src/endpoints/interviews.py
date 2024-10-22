from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import Application, JobInfo, JobPosting, SchoolAvailability, TeacherInterview, Teacher, School, Message
from ..schemas import SchoolAvailabilitySchema, TeacherInterviewSchema
from ..extensions import db
from sqlalchemy import Date
from datetime import datetime



availability_bp = Blueprint('availabilities', __name__)
interview_bp = Blueprint('interviews', __name__)



# as an input, we need to have the date we are looking for
# we need to have the start time of the availability
# we need to have the end time of the availability
# check that it is non overlapping
@availability_bp.route('/', methods=['POST'])
@jwt_required()
def create_school_availability():
    school_id = get_jwt_identity()
    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "Not a valid school"}), 404
    
    data = request.get_json()
    availabilities = SchoolAvailability.query.filter_by(school_id=get_jwt_identity()).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    # start_time = data["start_time"]
    # end_time = data["end_time"]
    start_time = datetime.strptime(data["start_time"], "%H:%M:%S").time()
    end_time =  datetime.strptime(data["end_time"], "%H:%M:%S").time()
    date = datetime.strptime(data['date'], "%Y-%m-%d").date()
    if start_time >= end_time:
        return jsonify({"message": "Start time must be before end time"}), 400
    for availability in availabilities:
        new_start_time = availability.start_time
        new_end_time = availability.end_time
        if availability.date == date and ((start_time >= new_start_time and start_time < new_end_time) or (end_time > new_start_time and end_time <= new_end_time)):
            return jsonify({"message": "Availability overlaps with existing availability"}), 400
    for i in range(0, len(availabilities)-1):
        availability = availabilities[i]
        new_start_time = availability.start_time
        new_end_time = availability.end_time

        next_availability = availabilities[i+1]
        next_new_start_time = next_availability.start_time
        next_new_end_time = next_availability.end_time
        if date == availability.date and date == next_availability.date:
            if (start_time >= new_start_time and start_time == new_end_time) and (end_time == next_new_start_time and end_time <= next_new_end_time):
                availability.end_time = next_availability.end_time
                next_availability.delete()
                availability.save()
                return jsonify({"message": "Availability created successfully"}), 201
        if date == availability.date and (start_time >= new_start_time and start_time == new_end_time):
            availability.end_time = data["end_time"]
            availability.save()
            return jsonify({"message": "Availability created successfully"}), 201
        if date == next_availability.date and (end_time == next_new_start_time and end_time <= next_new_end_time):
            next_availability.start_time = data["start_time"]
            next_availability.save()
            return jsonify({"message": "Availability created successfully"}), 201
    new_availability = SchoolAvailability(school_id = school_id, date = data['date'], start_time = data['start_time'], end_time = data['end_time'])
    # print(data['start_time'], data['end_time'])
    new_availability.save()
    return jsonify({"message": "Availability created successfully"}), 201

@availability_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_school_availability(id):
    school_id = get_jwt_identity()
    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "Not a valid school"}), 404
    school_availability = SchoolAvailability.get_by_id(id=id)
    if school_availability is not None:
        school_availability.delete()

    return jsonify({"message": "Availability deleted successfully"}), 201

# @availability_bp.route('', methods=['GET'])
# def get_school_availabilities():
#     availabilities = SchoolAvailability.query.order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
#     return jsonify({"school_availabilities": SchoolAvailabilitySchema(many=True).dump(availabilities)}), 200


@availability_bp.route('/', methods=['GET'])
@jwt_required()
def get_school_availabilities_by_school():
    school_id = get_jwt_identity()
    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "Not a valid school"}), 404
    availabilities = SchoolAvailability.query.filter_by(school_id=get_jwt_identity()).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    return jsonify({"school_availabilities": SchoolAvailabilitySchema(many=True).dump(availabilities)}), 200


@interview_bp.route('teacher/<posting_id>', methods=['GET'])
@jwt_required()
def get_school_availabilities_by_posting(posting_id):
    teacher_id = get_jwt_identity()
    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "Not a valid teacher"}), 404
    
    posting = JobPosting.get_by_id(id=posting_id)
    if posting is None:
        return jsonify({"message": "Not a valid job posting"}), 404
    availabilities = SchoolAvailability.query.filter_by(school_id=posting.school_id).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    info = posting.job_info
    if info is None:
        return jsonify({"message": "No valid job info"}), 404
    interview_length = info.interview_length
    return jsonify({ "interview_length": interview_length, "school_availabilities": SchoolAvailabilitySchema(many=True).dump(availabilities)}), 200

@interview_bp.route('/teacher-interviews', methods=['POST'])
@jwt_required()
def schedule_teacher_interview():
    teacher_id = get_jwt_identity()
    data = request.get_json()
    posting_id = data['posting_id']

    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "Not a valid teacher"}), 404
    
    posting = JobPosting.get_by_id(id=posting_id)

    if JobPosting is None:
        return jsonify({"message": "Not a valid posting"}), 404
    
    application = Application.get_by_teacher_and_posting(teacher_id=teacher_id, jobposting_id=posting_id)

    if application is None or application.app_status != "interviewing":
        return jsonify({"message": "Not able to schedule an interview at this time"}), 404

    interview = TeacherInterview.get_by_teacher_and_postingid(teacher_id=teacher_id, posting_id=posting_id)
    if interview is not None:
        return jsonify({"message": "Already scheduled an interview"}), 400
    availabilities = SchoolAvailability.query.filter_by(school_id=posting.school_id).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    start_time = datetime.strptime(data["start_time"], "%H:%M:%S").time()
    end_time =  datetime.strptime(data["end_time"], "%H:%M:%S").time()
    date = datetime.strptime(data['date'], "%Y-%m-%d").date()

    if start_time >= end_time:
        return jsonify({"message": "Start time must be before end time"}), 400
    for availability in availabilities:
        new_start = availability.start_time
        new_end =  availability.end_time
        if availability.date == date and ((start_time >= new_start and start_time <= new_end) and (end_time >= new_start and end_time <= new_end)):
            if start_time == new_start and end_time == new_end:
                x = 1 + 1
            elif start_time == new_start:
                new_availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = end_time, end_time = new_end)
                new_availability.save()
            elif end_time == new_end:
                new_availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = new_start, end_time = start_time)
            else:
                new_availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = new_start, end_time = start_time)
                new_availability.save()
                new_availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = end_time, end_time = new_end)
                new_availability.save()
            interview = TeacherInterview(teacher_id = teacher_id, school_id = posting.school_id, date = availability.date, start_time = start_time, end_time = end_time, posting_id = posting_id)
            interview.save()
            message = Message(teacher_id = teacher_id, school_id = posting.school_id, content = "An interview has been scheduled for " + str(availability.date) + " at " + str(start_time) + " to " + str(end_time) + " for posting " + str(posting.job_info.title), sender_type = "automated")
            message.save()
            availability.delete()
            return jsonify({"message": "Interview Scheduled"}), 200
    return jsonify({"message": "Not a valid time slot"}), 400


@interview_bp.route('/teacher-interviews/<interview_id>', methods=['DELETE'])
@jwt_required()
def cancel_teacher_interview(interview_id):
    teacher_id = get_jwt_identity()
    # data = request.get_json()
    # posting_id = data['posting_id']

    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "Not a valid teacher"}), 404
    
    interview = TeacherInterview.get_by_id(id=interview_id)

    if interview is None:
        return jsonify({"message": "Interview deleted"}), 200
    
    if teacher_id != interview.teacher_id:
        return jsonify({"message": "Interview deleted"}), 200
    
    posting = JobPosting.get_by_id(id=interview.posting_id)
    
    
    availabilities = SchoolAvailability.query.filter_by(school_id=posting.school_id).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    
    start_time = interview.start_time
    end_time =  interview.end_time
    date = interview.date

    for x in range(0, len(availabilities)-1):
        availability = availabilities[x]
        nextAvailability = availabilities[x+1]
        if availability.date == date and nextAvailability.date == date:
            if start_time >= availability.end_time and start_time <= nextAvailability.start_time:
                if start_time == availability.end_time and end_time == nextAvailability.start_time:
                    availability.end_time = nextAvailability.end_time
                    nextAvailability.delete()
                    # delete both objects and create a brand new one
                elif start_time == availability.end_time:
                    availability.end_time = end_time
                    availability.save_existing()
                elif end_time == nextAvailability.start_time:
                    nextAvailability.start_time = start_time
                    nextAvailability.save_existing()
                    # delete the second object and create a brand new one
                else:
                    availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = start_time, end_time = end_time)
                    availability.save()
                interview.delete()
                message = Message(teacher_id = teacher_id, school_id = availability.school_id, content = "An interview has been canceled for " + str(availability.date) + " at " + str(start_time) + " to " + str(end_time) + " for posting " + str(posting.job_info.title), sender_type = "automated")
                message.save()
                return jsonify({"message": "Interview deleted"}), 200
    interview.delete()
    return jsonify({"message": "Interview deleted"}), 200


@interview_bp.route('/school-interviews/<interview_id>', methods=['DELETE'])
@jwt_required()
def cancel_interview_as_school(interview_id):
    school_id = get_jwt_identity()
    # data = request.get_json()
    # posting_id = data['posting_id']

    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "Not a valid teacher"}), 404
    
    interview = TeacherInterview.get_by_id(id=interview_id)
    if interview is None:
        return jsonify({"message": "Interview deleted"}), 200
    
    posting = JobPosting.get_by_id(id=interview.posting_id)
    if posting is None:
        return jsonify({"message": "Not a valid posting"}), 404
    
    if school_id != posting.school_id:
        return jsonify({"message": "Interview deleted"}), 200
    
    availabilities = SchoolAvailability.query.filter_by(school_id=posting.school_id).order_by(SchoolAvailability.date, SchoolAvailability.start_time).all()
    
    start_time = interview.start_time
    end_time =  interview.end_time
    date = interview.date

    for x in range(0, len(availabilities)-1):
        availability = availabilities[x]
        nextAvailability = availabilities[x+1]
        if availability.date == date and nextAvailability.date == date:
            if start_time >= availability.end_time and start_time <= nextAvailability.start_time:
                if start_time == availability.end_time and end_time == nextAvailability.start_time:
                    availability.end_time = nextAvailability.end_time
                    nextAvailability.delete()
                    # delete both objects and create a brand new one
                elif start_time == availability.end_time:
                    availability.end_time = end_time
                    availability.save_existing()
                elif end_time == nextAvailability.start_time:
                    nextAvailability.start_time = start_time
                    nextAvailability.save_existing()
                    # delete the second object and create a brand new one
                else:
                    availability = SchoolAvailability(school_id = availability.school_id, date = availability.date, start_time = start_time, end_time = end_time)
                    availability.save()
                message = Message(teacher_id = interview.teacher_id, school_id = availability.school_id, content = "An interview has been canceled for " + str(availability.date) + " at " + str(start_time) + " to " + str(end_time) + " for posting " + str(posting.job_info.title), sender_type = "automated")
                message.save()
                interview.delete()
                return jsonify({"message": "Interview deleted"}), 200
    interview.delete()
    return jsonify({"message": "Interview deleted"}), 200

@interview_bp.route('/check/<posting_id>', methods=['GET'])
@jwt_required()
def check(posting_id):
    teacher_id = get_jwt_identity()

    teacher = Teacher.get_by_id(id=teacher_id)
    if teacher is None:
        return jsonify({"message": "Not a valid teacher"}), 404
        
    application = Application.get_by_teacher_and_posting(teacher_id=teacher_id, jobposting_id=posting_id)

    if application is None or application.app_status != "interviewing":
        return jsonify({"message": "Not able to schedule an interview at this time"}), 404

    interview = TeacherInterview.get_by_teacher_and_postingid(teacher_id=teacher_id, posting_id=posting_id)
    if interview is not None:
        return jsonify({"message": "Interview Scheduled", "interview": TeacherInterviewSchema().dump(interview)}), 200
    return jsonify({"message": "No interview scheduled"}), 200



@interview_bp.route('/teacher-interviews', methods=['GET'])
def get_teacher_interviews():
    interviews = TeacherInterview.query.all()
    return jsonify({"teacher_interviews": TeacherInterviewSchema(many=True).dump(interviews)}), 200


@interview_bp.route('/schools/my', methods=['GET'])
@jwt_required()
def get_my_teacher_interviews():
    school_id = get_jwt_identity()
    school = School.get_by_id(id=school_id)
    if school is None:
        return jsonify({"message": "Not a valid school"}), 404
    interviews = TeacherInterview.query.filter_by(school_id=school_id).all()
    return jsonify({"teacher_interviews": TeacherInterviewSchema(many=True).dump(interviews)}), 200
