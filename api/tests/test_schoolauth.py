import jwt
import pytest
from ..src.models import School

def test_register_school(client, app):
    """
    Test registering new schools.
    """
    schools_data = [
        { "email": "school1@example.com", "password": "secure_password1", "name": "School 1", "city": "Baltimore", "state": "MD"},
        { "email": "school2@example.com", "password": "secure_password2", "name": "School 2","city": "Townson", "state": "MD"},
        { "email": "school3@example.com", "password": "secure_password3", "name": "School 3","city": "Chicago", "state": "IL"},
    ]

    for school in schools_data:
        response = client.post('/schools/register', json=school)
        assert response.status_code == 201, f"Failed to create {school['email']}"
        assert b"School created" in response.data, f"Failed to create {school['email']}"

    with app.app_context():
        
        assert School.query.count() == len(schools_data), "Not all schools were created."
        for school in schools_data:
            db_school = School.query.filter_by(email=school['email']).first()
            assert db_school is not None, f"School with email {school['email']} was not found."
            assert db_school.email == school['email'], f"School email {db_school.email} does not match expected {school['email']}."

def test_login_school(client):
    schools_data = [
        { "email": "school1@example.com", "password": "secure_password1"},
        { "email": "school2@example.com", "password": "secure_password2"},
        { "email": "school3@example.com", "password": "secure_password3"},
    ]

    for school in schools_data:
        #client.post('/schools/register', json={"email": school["email"], "password": school["password"]})
        login_response = client.post("/schools/login", json={"email": school["email"], "password": school["password"]})
        assert login_response.status_code == 200, f"Failed to log in {school['email']}"
        response_data = login_response.get_json()
        assert "Logged In" in response_data['message'], "Login message not as expected"
        assert "access" in response_data['tokens'], "Access token not found in login response"

        access_token = response_data['tokens']['access']

        try:
            decoded_token = jwt.decode(access_token, options={"verify_signature": False})
            #assert decoded_token.get('sub') == school["id"], f"Token 'sub' claim does not match expected id"
            assert 'exp' in decoded_token, "Token does not have an expiration"
        except jwt.PyJWTError as e:
            pytest.fail(f"JWT token validation failed for {school['email']}: {e}")
