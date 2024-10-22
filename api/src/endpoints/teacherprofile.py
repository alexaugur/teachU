from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Teacher, TeacherProfile, School
from ..schemas import TeacherProfileSchema, TeacherProfileSchema
from ..extensions import db 

teacherprofile_bp = Blueprint('teacherprofiles', __name__)


@teacherprofile_bp.route('', methods=['GET'])
@jwt_required()
def get_teachers():
    teachers = TeacherProfile.query.all()
    return jsonify({"teachers": TeacherProfileSchema(many=True).dump(teachers)}), 200


@teacherprofile_bp.route('/<teacherprofile_id>', methods=['PATCH'])
@jwt_required()
def update_teacher(teacherprofile_id):
    user_id = get_jwt_identity()
    teacher = TeacherProfile.query.get(teacherprofile_id)
    if teacher is None:
        return jsonify({"message": "Teacher not found given id"}), 404
    if teacher.teacher_id != user_id:  # Checking if the job posting's schoolId matches the given ID
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    teacher.first_name = data.get('first_name', teacher.first_name)
    teacher.last_name = data.get('last_name', teacher.last_name)
    teacher.current_school = data.get('current_school', teacher.current_school)
    teacher.education = data.get('education', teacher.education)
    teacher.subjects_taught = data.get('subjects_taught', teacher.subjects_taught)
    teacher.current_state = data.get('current_state', teacher.current_state)
    teacher.grades_taught = data.get('grades_taught', teacher.grades_taught)
    teacher.years_of_experience = data.get('years_of_experience', teacher.years_of_experience)
    teacher.education = data.get('education', teacher.education)
    teacher.past_jobs = data.get('past_jobs', teacher.past_jobs)
    teacher.accolades = data.get('accolades', teacher.accolades)
    teacher.accommodations = data.get('accommodations', teacher.accommodations)
    teacher.avatar = data.get('avatar', teacher.avatar)


    db.session.commit()

    return jsonify({"message": "teacher profile updated", "teacher_profile": TeacherProfileSchema().dump(teacher)}), 200

@teacherprofile_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_teacher(): 
    user_id = get_jwt_identity()

    teacher = Teacher.query.get(user_id)
    

    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    prof = teacher.profile
    
    
    return jsonify({"teacher_profile": TeacherProfileSchema(many=False).dump(prof)}), 200


@teacherprofile_bp.route('/id/<teacherprofile_id>', methods=['GET'])
@jwt_required()
def get_teacher(teacherprofile_id): 
    teacher = TeacherProfile.query.get(teacherprofile_id)
    if teacher is None:
        return jsonify({"message": "teacher not found  attached to user"}), 404
    return jsonify({"teacher_profile": TeacherProfileSchema(many=False).dump(teacher)}), 200

@teacherprofile_bp.route('/search', methods=['GET'])
@jwt_required()
def get_teacher_with_search(): 
    search = request.args.get("search", "", type=str)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    offset = (page - 1) * per_page

    school_id = get_jwt_identity()
    if School.get_by_id(school_id) is None:
        return jsonify({"message": "school not found attached to user"}), 404
    teachers = TeacherProfile.get_with_search(search)
    
    total_count = teachers.count()
    
    if total_count % per_page == 0:
        total_count = total_count/per_page
    else:
        total_count = total_count/per_page
        total_count = int(total_count)
        total_count +=1
    teachers = teachers.offset(offset).limit(per_page).all()
    result = TeacherProfileSchema(many=True).dump(teachers)

    return jsonify({
        "teacher_profiles": result,
        "total_count": total_count,
        "page": page,
        "per_page": per_page
    }), 200





@teacherprofile_bp.route('/addJob', methods=['PUT'])
@jwt_required()
def addFavorite(): 
    user_id = get_jwt_identity()
    data = request.get_json()
    teacher = Teacher.query.get(user_id)
    

    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    
    profile = TeacherProfile.get_by_teacher_id(teacher_id=user_id)

    # savedJobs = prof.saved_jobs
    newJob = data.get("job_id", "")
    if newJob == "":
        return jsonify({"message": "valid job not provided"}), 404
    
    # print(savedJobs)
    for a in profile.saved_jobs:
        if a == newJob :
            return jsonify({"message": "job already saved"}), 400
        
    profile.saved_jobs.append(newJob)

    savedJobs = profile.saved_jobs

    # print(savedJobs)
    # profile.subjects_taught = "hello"
    profile.saved_jobs = []
    db.session.commit()

    profile.saved_jobs = savedJobs
    db.session.commit()

    # profile.save_existing()

    return jsonify({"message": "job saved"}), 200


@teacherprofile_bp.route('/deleteJob', methods=['PUT'])
@jwt_required()
def deleteFavorite(): 
    user_id = get_jwt_identity()

    teacher = Teacher.query.get(user_id)
    
    data = request.get_json()
    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    
    prof = teacher.profile

    savedJobs = prof.saved_jobs
    newJob = data.get("job_id", "")
    if newJob == "":
        return jsonify({"message": "valid job not provided"}), 404
    newJobs = []
    for a in savedJobs:
        if a != newJob :
            newJobs.append(a)
            
    prof.saved_jobs = []
    prof.save_existing()

    prof.saved_jobs = newJobs
    prof.save_existing()

    return jsonify({"message": "job deleted"}), 200


@teacherprofile_bp.route('/getFavorite', methods=['PUT'])
@jwt_required()
def getFavorite(): 
    user_id = get_jwt_identity()

    teacher = Teacher.query.get(user_id)
    
    data = request.get_json()
    if teacher is None:
        return jsonify({"message": "teacher not found attached to user"}), 404
    
    prof = teacher.profile

    savedJobs = prof.saved_jobs
    newJob = data.get("job_id", "")
    if newJob == "":
        return jsonify({"message": "valid job not provided"}), 404
    
    for a in savedJobs:
        if a == newJob :
            return jsonify({"message": True }), 200
    return jsonify({"message": False}), 200

            
