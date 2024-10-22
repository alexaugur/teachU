import pytest
from flask_jwt_extended import create_access_token

@pytest.fixture
def auth_headers(client, app):
    """
    Fixture to authenticate three schools and return their access tokens.
    """
    schools_data = [
        {"email": "school1@example.com", "password": "secure_password1"},
        {"email": "school2@example.com", "password": "secure_password2"},
        {"email": "school3@example.com", "password": "secure_password3"},
    ]
    tokens = []
    for school in schools_data:
        response = client.post("/schools/login", json=school)
        tokens.append(response.get_json()['tokens']['access'])
    return [{'Authorization': f'Bearer {token}'} for token in tokens]

def test_get_my_school(client, auth_headers):
    """
    Test retrieving the authenticated school's profile.
    """
    for headers in auth_headers:
        response = client.get("/schoolprofiles/my", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert 'school_profile' in data

def test_update_school(client, auth_headers):
    """
    Test updating a school's profile.
    """
    # Example ID and update data used, replace with actual values and methods as needed
    school_profile_id = 1
    update_data = {
        "name": "UpdatedSchoolName",
        "city": "UpdatedCity",
        "state": "UpdatedState"
    }
    for headers in auth_headers:
        response = client.patch(f"/schoolprofiles/{school_profile_id}", json=update_data, headers=headers)
        school_profile_id += 1  # Assuming each header corresponds to different school
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == "School profile updated successfully."
        assert data['school_profile']['name'] == "UpdatedSchoolName"
        assert data['school_profile']['city'] == "UpdatedCity"
        assert data['school_profile']['state'] == "UpdatedState"

def test_get_school_profile(client, auth_headers):
    """
    Test retrieving a specific school's profile by ID.
    """
    # Example ID used, replace with actual ID retrieval method
    school_profile_id = 1
    for headers in auth_headers:
        response = client.get(f"/schoolprofiles/school/{school_profile_id}", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert 'school_profile' in data
        school_profile_id += 1  # Assuming to test for each school's profile
