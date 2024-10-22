
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from ..models import School, TokenBlocklist, SchoolProfile
from ..schemas import SchoolSchema, SchoolProfileSchema
from ..extensions import db
from geopy.geocoders import Nominatim

schools_bp = Blueprint('school', __name__)

def get_lat_lon(city, state):
    try:
        geolocator = Nominatim(user_agent="htt")
        location = geolocator.geocode(city + ", " + state)
        return (location.latitude, location.longitude) if location else (None, None)
    except:
        return (None, None)

@schools_bp.post("/whatever")
def whatever():
    data = request.get_json()
    city = data.get("city")
    state = data.get("state")
    (latitude, longitude) = get_lat_lon(city, state)
    return jsonify({"latitude": latitude, "longitude": longitude});

@schools_bp.post("/register")
def create_schools():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400


    school = School.get_user_by_email(email=data.get("email"))

    if school is not None:
        return jsonify({"error": "Account already exists"}), 409

    new_school = School( email=data["email"] )

    new_school.set_password(password=data["password"])
    new_school_prof = SchoolProfile(school_id = new_school.id, school=new_school)
    
    fields = ['name', 'city', 'state']
    for field in fields:
        if field in data:
            setattr(new_school_prof, field, data[field])
    (latitude, longitude)= get_lat_lon(data['city'], data['state'])
    new_school_prof.latitude = latitude
    new_school_prof.longitude = longitude

    new_school.save()
    new_school_prof.save()

    return jsonify({"message": "School created", "school_profile": SchoolProfileSchema(many=False).dump(new_school_prof)}), 201



@schools_bp.route('', methods=['GET'])
@jwt_required()
def get_schools():
    schools = School.query.all()
    return jsonify({"schools": SchoolSchema(many=True).dump(schools)}), 200


@schools_bp.post("/login")
def login_user():
    data = request.get_json()

    school = School.get_user_by_email(email=data.get("email"))

    if school and (school.check_password(password=data.get("password"))):
        additional_claims = {"user_type": "school"}
        access_token = create_access_token(identity=school.id,  additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=school.id,  additional_claims=additional_claims)

        return (
            jsonify(
                {
                    "message": "Logged In ",
                    "tokens": {"access": access_token, "refresh": refresh_token},
                    "id": school.id,
                }
            ),
            200,
        )

    return jsonify({"error": "Invalid email or password"}), 400


@schools_bp.get("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()

    new_access_token = create_access_token(identity=identity)

    return jsonify({"access_token": new_access_token})


@schools_bp.get('/logout')
@jwt_required(verify_type=False) 
def logout_user():
    jwt = get_jwt()

    jti = jwt['jti']
    token_type = jwt['type']

    token_b = TokenBlocklist(jti=jti)

    token_b.save()

    return jsonify({"message": f"{token_type} token revoked successfully"}) , 200


@schools_bp.get("/profile/<username>")
def get_user_profile(username):
    user = School.get_user_by_username(username=username)
    return jsonify({"school": SchoolSchema().dump(user)})


