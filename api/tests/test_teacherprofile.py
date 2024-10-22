import json
import pytest
from flask_jwt_extended import create_access_token

@pytest.fixture
def auth_headers(client, app):
    """
    Fixture to authenticate three teachers and return their access tokens.
    """
    teachers_data = [
        {"email": "teacher1@example.com", "password": "secure_password1"},
        {"email": "teacher2@example.com", "password": "secure_password2"},
        {"email": "teacher3@example.com", "password": "secure_password3"},
    ]
    tokens = []
    for teacher in teachers_data:
        response = client.post("/teachers/login", json=teacher)
        tokens.append(response.get_json()['tokens']['access'])
    return [{'Authorization': f'Bearer {token}'} for token in tokens]

def test_get_my_teacher(client, auth_headers):
    """
    Test retrieving the authenticated teacher's profile.
    """
    for headers in auth_headers:
        response = client.get("/teacherprofiles/my", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert 'teacher_profile' in data

def test_get_teacher(client, auth_headers):
    """
    Test retrieving a specific teacher's profile by ID.
    """
    # Example ID used, replace with actual ID retrieval method
    teacher_profile_id = 1
    for headers in auth_headers:
        response = client.get(f"/teacherprofiles/id/{teacher_profile_id}", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert 'teacher_profile' in data

# def test_update_teacher(client, auth_headers):
#     """
#     Test updating a teacher's profile.
#     """
#     # Example ID and update data used, replace with actual values and methods as needed
#     teacher_profile_id = 1
#     update_data = {
#         "first_name": "UpdatedFirst",
#         "last_name": "UpdatedLast"
#     }
#     for headers in auth_headers:
#         response = client.patch(f"/teacherprofiles/id/{teacher_profile_id}", json=update_data, headers=headers)
#         teacher_profile_id= teacher_profile_id+1
#         assert response.status_code == 200
#         data = response.get_json()
#         assert data['message'] == "teacher profile updated"
#         assert data['teacher_profile']['first_name'] == "UpdatedFirst"
#         assert data['teacher_profile']['last_name'] == "UpdatedLast"

