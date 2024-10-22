import jwt
import pytest
from ..src.models import Teacher, TeacherProfile

def test_register_teacher(client, app):
    """
    Test registering new teachers and creating their profiles.
    """
    teachers_data = [
        {
            "email": "teacher1@example.com",
            "password": "secure_password1",
            "first_name": "First1",
            "last_name": "Last1",
            "current_school": "School1",
            "education": "Education1",
            "subjects_taught": "Math Science",
            "current_state": "State1",
            "grades_taught": "Grade1 Grade2",
            "years_of_experience": "5",
            "past_jobs": "Job1 Job2",
            "accolades": "Accolades",
            "accommodations": "Accommodations",
        },
        {
            "email": "teacher2@example.com",
            "password": "secure_password2",
            "first_name": "First2",
            "last_name": "Last2",
            "current_school": "School2",
            "education": "Education2",
            "subjects_taught": "Math Science",
            "current_state": "State2",
            "grades_taught": "Grade1 Grade2",
            "years_of_experience": "3",
            "past_jobs": "Job1 Job2",
            "accolades": "Accolades",
            "accommodations": "Accommodations",
        },
         {
            "email": "teacher3@example.com",
            "password": "secure_password3",
            "first_name": "First2",
            "last_name": "Last2",
            "current_school": "School2",
            "education": "Education2",
            "subjects_taught": "Math Science",
            "current_state": "State2",
            "grades_taught": "Grade1 Grade2",
            "years_of_experience": "3",
            "past_jobs": "Job1 Job2",
            "accolades": "Accolades",
            "accommodations": "Accommodations",
        }
        # Add additional teacher data as needed
    ]

    for teacher in teachers_data:
        response = client.post('/teachers/register', json=teacher)
        assert response.status_code == 201, f"Failed to create {teacher['email']}"
        assert b"Teacher created" in response.data, f"Failed to create {teacher['email']}"

    with app.app_context():
        assert Teacher.query.count() == len(teachers_data), "Not all teachers were created."
        for teacher in teachers_data:
            db_teacher = Teacher.query.filter_by(email=teacher['email']).first()
            assert db_teacher is not None, f"Teacher with email {teacher['email']} was not found."
            assert db_teacher.email == teacher['email'], "Teacher email does not match expected."

            # Now check for the existence of TeacherProfile
            db_teacher_profile = TeacherProfile.query.filter_by(teacher_id=db_teacher.id).first()
            assert db_teacher_profile is not None, "TeacherProfile was not created."
            assert db_teacher_profile.first_name == teacher["first_name"], "TeacherProfile first name does not match."
            assert db_teacher_profile.first_name == teacher["first_name"], f"TeacherProfile first name does not match for {teacher['email']}."
            assert db_teacher_profile.last_name == teacher["last_name"], f"TeacherProfile last name does not match for {teacher['email']}."
            assert db_teacher_profile.current_school == teacher["current_school"], f"TeacherProfile current school does not match for {teacher['email']}."
            assert db_teacher_profile.education == teacher["education"], f"TeacherProfile education does not match for {teacher['email']}."
            #assert db_teacher_profile.subjects_taught == ','.join(teacher["subjects_taught"]), f"TeacherProfile subjects taught do not match for {teacher['email']}."
            assert db_teacher_profile.current_state == teacher["current_state"], f"TeacherProfile current state does not match for {teacher['email']}."
            assert db_teacher_profile.grades_taught == teacher["grades_taught"], f"TeacherProfile grades taught do not match for {teacher['email']}."
            assert db_teacher_profile.years_of_experience == teacher["years_of_experience"], f"TeacherProfile years of experience does not match for {teacher['email']}."
            assert db_teacher_profile.past_jobs == teacher["past_jobs"], f"TeacherProfile past jobs do not match for {teacher['email']}."
            assert db_teacher_profile.accolades == teacher["accolades"], f"TeacherProfile accolades do not match for {teacher['email']}."
            assert db_teacher_profile.accommodations == teacher["accommodations"], f"TeacherProfile accommodations do not match for {teacher['email']}."

def test_login_teacher(client):
    teachers_data = [
        { "email": "teacher1@example.com", "password": "secure_password1"},
        { "email": "teacher2@example.com", "password": "secure_password2"},
        { "email": "teacher3@example.com", "password": "secure_password3"},
    ]

    for teacher in teachers_data:
        #client.post('/teachers/register', json={"email": teacher["email"], "password": teacher["password"]})
        login_response = client.post("/teachers/login", json={"email": teacher["email"], "password": teacher["password"]})
        assert login_response.status_code == 200, f"Failed to log in {teacher['email']}"
        response_data = login_response.get_json()
        assert "Logged In" in response_data['message'], "Login message not as expected"
        assert "access" in response_data['tokens'], "Access token not found in login response"

        access_token = response_data['tokens']['access']

        try:
            decoded_token = jwt.decode(access_token, options={"verify_signature": False})
            #assert decoded_token.get('sub') == teacher["id"], f"Token 'sub' claim does not match expected id"
            assert 'exp' in decoded_token, "Token does not have an expiration"
        except jwt.PyJWTError as e:
            pytest.fail(f"JWT token validation failed for {teacher['email']}: {e}")
