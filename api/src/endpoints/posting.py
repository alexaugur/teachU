
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import JobInfo, JobPosting, SchoolProfile, TokenBlocklist, School, Teacher
from ..schemas import PostingSchema, JobPostingSchema
from ..extensions import db

postings_bp = Blueprint('postings', __name__)
from geopy.geocoders import Nominatim



# import json

# data = {"postings":[
#    {
#         "title": "Science Teacher",
#         "description": "Engages students with scientific concepts in areas such as biology, chemistry, and physics.",
#         "salary": 63182,
#         "start_date": "2025-02-21",
#         "city": "Viburnum",
#         "state": "Missouri",
#         "latitude": 37.7149,
#         "longitude": -91.1295
#     },
#     {
#         "title": "Spanish Teacher",
#         "description": "Teaches Spanish language skills and Hispanic cultures.",
#         "salary": 67241,
#         "start_date": "2024-07-09",
#         "city": "Watkins Glen",
#         "state": "New York",
#         "latitude": 42.3801,
#         "longitude": -76.8673
#     },
#     {
#         "title": "ELA Teacher",
#         "description": "Focuses on enhancing students' understanding of English language arts.",
#         "salary": 67556,
#         "start_date": "2024-06-10",
#         "city": "Four Lakes",
#         "state": "Washington",
#         "latitude": 47.5576,
#         "longitude": -117.5818
#     },
#     {
#         "title": "Math Teacher",
#         "description": "Responsible for teaching mathematics concepts to students at various levels.",
#         "salary": 49910,
#         "start_date": "2024-08-22",
#         "city": "Nahunta",
#         "state": "Georgia",
#         "latitude": 31.2065,
#         "longitude": -81.9814
#     },
#     {
#         "title": "Spanish Teacher",
#         "description": "Teaches Spanish language skills and Hispanic cultures.",
#         "salary": 68250,
#         "start_date": "2024-07-21",
#         "city": "Jericho",
#         "state": "New York",
#         "latitude": 40.7875,
#         "longitude": -73.5416
#     },
#     {
#         "title": "Math Teacher",
#         "description": "Responsible for teaching mathematics concepts to students at various levels.",
#         "salary": 65231,
#         "start_date": "2024-05-26",
#         "city": "Lynn",
#         "state": "Indiana",
#         "latitude": 40.0488,
#         "longitude": -84.9424
#     },
#     {
#         "title": "ELA Teacher",
#         "description": "Focuses on enhancing students' understanding of English language arts.",
#         "salary": 68079,
#         "start_date": "2024-10-21",
#         "city": "Fort Hill",
#         "state": "Oregon",
#         "latitude": 45.067,
#         "longitude": -123.5605
#     },
#     {
#         "title": "Math Teacher",
#         "description": "Responsible for teaching mathematics concepts to students at various levels.",
#         "salary": 49882,
#         "start_date": "2025-04-06",
#         "city": "Ruth",
#         "state": "California",
#         "latitude": 40.2943,
#         "longitude": -123.3483
#     },


#     {
#         "title": "Math Teacher",
#         "description": "Responsible for teaching mathematics concepts to students at various levels.",
#         "salary": 49882,
#         "start_date": "2025-04-06",
#         "city": "Ruth",
#         "state": "California",
#         "latitude": 40.2943,
#         "longitude": -123.3483
#     },

#     {
#         "title": "Math Teacher",
#         "description": "Responsible for teaching mathematics concepts to students at various levels.",
#         "salary": 49882,
#         "start_date": "2025-04-06",
#         "city": "Ruth",
#         "state": "California",
#         "latitude": 40.2943,
#         "longitude": -123.3483
#     },
# ]
# }


# @postings_bp.post("/whatever")
# def whatever():
#     # with open('fake_data.json', 'r') as file:
#     # Load the JSON data into a Python dictionary
#         # data = json.load(file)
#         postings = data['postings']
#         for posting in postings:
#             posting['state'] = "TX"
#             posting["city"] = "Houston"
#             posting["latitude"] = 29.7589382
#             posting["longitude"] = -95.3676974
            
#             new_job_posting = JobPosting(school_id = 2)
#             new_job_info = JobInfo(jobposting_id = new_job_posting.id, job_posting = new_job_posting )

#     # school_profile = SchoolProfile.get_by_school_id(school_id)
#             fields = ['title', 'description', 'start_date',]
#             for field in fields:
#                 setattr(new_job_info, field, posting[field])
#             new_job_info.salary_est = posting['salary']
#             new_job_info.interview_length = 45
#             new_job_info.city = posting['city']
#             new_job_info.state = posting['state']
#             new_job_posting.salary_est = posting['salary']
#             new_job_posting.latitude = posting['latitude']
#             new_job_posting.longitude = posting['longitude']
#             new_job_posting.save()
#             new_job_info.save()
#         return jsonify({"message": "Postings Created"}), 201




def get_lat_lon(city, state):
    geolocator = Nominatim(user_agent="httpss")
    location = geolocator.geocode(city + ", " + state)
    return (location.latitude, location.longitude) if location else (None, None)

@postings_bp.post("")
@jwt_required()
def create_postings():
    data = request.get_json()
    if 'title' not in data :
        return jsonify({"error": "Title required"}), 400
    school_id = get_jwt_identity()
    school = School.query.get(school_id)
    

    if school is None:
        return jsonify({"message": "school not found attached to user"}), 404

 
    new_job_positng = JobPosting(school_id = school_id)
    new_job_info = JobInfo(jobposting_id = new_job_positng.id, job_posting = new_job_positng )
    school_profile = SchoolProfile.get_by_school_id(school_id)

    fields = ['title', 'salary_est', 'description', 'start_date', 'interview_length']
    for field in fields:
        if field in data:
            setattr(new_job_info, field, data[field])
    new_job_positng.salary_est = data['salary_est']
    new_job_positng.latitude = school_profile.latitude
    new_job_positng.longitude = school_profile.longitude
    new_job_positng.description = data['description']
    new_job_info.city = school_profile.city
    new_job_info.state = school_profile.state
    new_job_positng.save()
    new_job_info.save()


    return jsonify({
        "message": "Posting created",
        "postingId": new_job_positng.id
        }), 201







@postings_bp.put("/posting/<id>")
@jwt_required()
def update_posting(id):
    data = request.get_json()

    posting = JobPosting.get_by_id(id=id)
    if posting is None:
        return jsonify({"message": "posting not found given id"}), 404
    #user guard
    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    job_info = posting.job_info

    fields = ['title', 'salary_est', 'description', 'start_date', 'interview_length']
    for field in fields:
        if field in data:
            setattr(job_info, field, data[field])
    job_info.save()
    posting.salary_est = data.get('salary_est',posting.salary_est )
    posting.save_existing()
    # db.session.commit()
    return jsonify(JobPostingSchema().dump(posting)), 201

@postings_bp.put("/posting-close/<id>")
@jwt_required()
def update_posting_open(id):
    data = request.get_json()

    posting = JobPosting.get_by_id(id=id)
    if posting is None:
        return jsonify({"message": "posting not found given id"}), 404
    #user guard
    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403

    posting.closed = data['closed']

    posting.save_existing()
    # db.session.commit()
    return jsonify(JobPostingSchema().dump(posting)), 201

@postings_bp.delete("/<id>")
@jwt_required()
def delete_posting(id):
    posting = JobPosting.get_by_id(id=id)
    if posting is None:
        return jsonify({"message": "posting not found given id"}), 404
    #user guard
    school_id = get_jwt_identity()
    if posting.school_id != school_id: 
        return jsonify({"message": "Unauthorized"}), 403
    
    posting.delete()

    return jsonify({"message": "Posting Deleted"}), 201




@postings_bp.get("/my")
@jwt_required()
def get_my_postings():
    school_id = get_jwt_identity()
    school = School.query.get(school_id)
    if school is None:
        return jsonify({"message": "school not found  attached to user"}), 404

    postings = JobPosting.get_by_school_id(school_id=school_id)
    result = JobPostingSchema().dump(postings, many=True)

    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )

@postings_bp.get("")
# @jwt_required()
def get_postings():
    postings = JobPosting.get_all_open()
    result = JobPostingSchema(exclude=("num_applicants",)).dump(postings, many=True)
    # console.log(result)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )



@postings_bp.get("/favorites")
@jwt_required()
def get_postings_by_favorites():
    teacher_id = get_jwt_identity()
    teacher = Teacher.get_by_id(teacher_id)
    if teacher is None: 
        return jsonify({"message": "Teacher not found attached to user"}), 404
    teacher_profile = teacher.profile
    postings = []
    for postingId in teacher_profile.saved_jobs:
        posting = JobPosting.get_by_id(postingId)
        if posting is None or posting.closed=="closed":
            continue
        postings.append(posting)
    # postings = JobPosting.query.all()
    result = JobPostingSchema(exclude=("num_applicants",)).dump(postings, many=True)
    # console.log(result)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )

@postings_bp.get("/job/<id>")
@jwt_required()
def get_postings_by_id(id):
    posting = JobPosting.get_by_id(id=id)
    result = JobPostingSchema().dump(posting)

    if posting is not None:
        return (
            jsonify(result)
        )
    
    return jsonify({"message": "Posting not found"}), 400



@postings_bp.get("/proximity")
# @jwt_required()
def get_postings_by_location():
    city = request.args.get('city') 
    state = request.args.get('state') 
    (latitude, longitude) = get_lat_lon(city, state)
    postings = JobPosting.filter_by_location(latitude=latitude, longitude=longitude, radius_km=0.8)
    # posting = JobPosting.get_by_id(id=id)
    # result = JobPostingSchema().dump(posting)
    result = JobPostingSchema().dump(postings, many=True)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )

@postings_bp.get("/salary")
# @jwt_required()
def get_postings_by_salary():
    print(request.args.get('salary'))
    salary = float(request.args.get('salary'))
    amplitude = 10000
    if('amplitude' in request.args):
        amplitude = float(request.args.get('amplitude'))

    postings = JobPosting.filter_by_salary(salary, 10000)
    # posting = JobPosting.get_by_id(id=id)
    # result = JobPostingSchema().dump(posting)
    result = JobPostingSchema().dump(postings, many=True)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )

@postings_bp.get("/title")
# @jwt_required()
def get_postings_by_title():
    print(request.args.get('title'))
    title = str(request.args.get('title'))
    # amplitude = 10000
    # if('amplitude' in request.args):
        # amplitude = float(request.args.get('amplitude'))

    postings = JobPosting.filter_by_title(title)
    # posting = JobPosting.get_by_id(id=id)
    # result = JobPostingSchema().dump(posting)
    result = JobPostingSchema().dump(postings, many=True)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )


@postings_bp.get("/recommendations")
@jwt_required()
def get_school_recommendations():
    teacher_id = get_jwt_identity()
    teacher = Teacher.query.get(teacher_id)

    if teacher is None:
        return jsonify({"message": "Teacher not found attached to user"}), 404

    city = request.args.get('city')
    state = request.args.get('state')
    latitude, longitude = get_lat_lon(city, state)

    if latitude is None or longitude is None:
        return jsonify({"error": "Could not find the provided location"}), 400

    postings = JobPosting.filter_by_location(latitude=latitude, longitude=longitude, radius_km=5)

    my_dict = {}
    for posting in postings:
        key = posting.job_info.city + ", " + posting.job_info.state
        if key in my_dict:
            my_dict[key] += 1
        else:
            my_dict[key] = 1

    most_frequent_key = max(my_dict, key=my_dict.get)


    for posting in postings:
        key = posting.job_info.city + ", " + posting.job_info.state
        if key == most_frequent_key:
            city = posting.job_info.city
            state =posting.job_info.state
            break
    latitude, longitude = get_lat_lon(city, state)

    if latitude is None or longitude is None:
        return jsonify({"error": "Could not find the provided location"}), 400

    postings = JobPosting.filter_by_location(latitude=latitude, longitude=longitude, radius_km=0.2)
    result = JobPostingSchema().dump(postings, many=True)
    return (
            jsonify(
                {
                    "postings": result
                }
            ),
            200,
        )

    # return jsonify({"recommended_schools": result}), 200

# This needs to be implemented according to how you're tracking applications to job postings per school
# def calculate_demand_supply_ratio_for_schools(schools):
#     schools_with_demand_supply = []
#     for school in schools:
#         total_applications = sum(len(posting.applications) for posting in school.job_postings)
#         ratio = 1 / max(total_applications, 1)  # Avoid division by zero
#         schools_with_demand_supply.append((school, ratio))

#     schools_sorted = sorted(schools_with_demand_supply, key=lambda x: x[1], reverse=True)
#     return [school for school, _ in schools_sorted]


# def calculate_demand_supply_ratio_for_schools(schools):
#     schools_with_demand_supply = []
#     for school in schools:
#         total_applications = sum(len(posting.applications) for posting in school.job_postings)
#         ratio = 1 / max(total_applications, 1)  # Avoid division by zero
#         schools_with_demand_supply.append((school, ratio))

#     schools_sorted = sorted(schools_with_demand_supply, key=lambda x: x[1], reverse=True)
#     return [school for school, _ in schools_sorted]


