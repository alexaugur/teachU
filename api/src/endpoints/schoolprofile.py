from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import School, SchoolProfile
from ..schemas import SchoolProfileSchema
from ..extensions import db 

schoolprofile_bp = Blueprint('schoolprofiles', __name__)


@schoolprofile_bp.route('', methods=['GET'])
@jwt_required()
def get_schools():
    schools = SchoolProfile.query.all()
    return jsonify({"schools": SchoolProfileSchema(many=True).dump(schools)}), 200



@schoolprofile_bp.route('/<schoolprofile_id>', methods=['PATCH'])
@jwt_required()
def update_school(schoolprofile_id):
    user_id = get_jwt_identity()  # Assuming this returns the school ID

    school_profile = SchoolProfile.query.get(schoolprofile_id)
    if not school_profile:
        return jsonify({"message": "School profile not found."}), 404

    if school_profile.school_id != user_id:  # Ensure the updater owns the school profile
        return jsonify({"message": "Unauthorized access."}), 403

    data = request.get_json()
    schema = SchoolProfileSchema(partial=True)  # `partial=True` allows for partial updates

    try:
        # Validate and deserialize input
        update_data = schema.load(data, session=db.session, instance=school_profile, partial=True)
    except ValidationErr as err:
        # Return a nice message if validation fails
        return jsonify(err.messages), 400

    db.session.commit()
    return jsonify({"message": "School profile updated successfully.", "school_profile": schema.dump(update_data)}), 200


@schoolprofile_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_school(): 
    user_id = get_jwt_identity()

    school = School.query.get(user_id)
    

    if school is None:
        return jsonify({"message": "school not found  attached to user"}), 404
    prof = school.profile 
    
    return jsonify({"school_profile": SchoolProfileSchema(many=False).dump(prof)}), 200



@schoolprofile_bp.route('/school/<schoolprofile_id>', methods=['GET'])
# @jwt_required()
def get_school(schoolprofile_id): 
    school = School.query.get(schoolprofile_id)
    if school is None:
        return jsonify({"message": "school not found  attached to user"}), 404
    prof = school.profile 
    
    return jsonify({"school_profile": SchoolProfileSchema(many=False).dump(prof)}), 200

@schoolprofile_bp.route('schools', methods=['GET'])
# @jwt_required()
def get_school_profiles(): 
    # page = request.args.get('page', 1, type=int)
    # per_page = request.args.get('per_page', 10, type=int)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search= request.args.get('search', "", type=str)

    offset = (page - 1) * per_page

    # print(page)
    # print(per_page)
    schools=SchoolProfile.query.filter(SchoolProfile.name.contains(search))
    total_count = schools.count()

    if total_count % per_page == 0:
        total_count = total_count/per_page
    else:
        total_count = total_count/per_page
        total_count = int(total_count)
        total_count +=1
    schools = schools.offset(offset).limit(per_page).all()

    # if(search == ""):
    #     schools = SchoolProfile.query.all()

    result = SchoolProfileSchema(many=True).dump(schools)

    # return jsonify({"school_profiles": result}), 200
    return jsonify({
        "school_profiles": result,
        "total_count": total_count,
        "page": page,
        "per_page": per_page
    }), 200

    # schools = pagination.items
    # if not school:
    #     return jsonify({"message": "school not found  attached to user"}), 404
    # return jsonify({"school_profiles": SchoolProfileSchema(many=True).dump(schools), "total_pages": pagination.pages, "current_page": pagination.page}), 200





