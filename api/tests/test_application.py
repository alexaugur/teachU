
import pytest
from flask import json
from ..src.models import Application

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

@pytest.fixture()
def auth_headers_teachers(client):
    # Sample teachers' credentials for testing authentication
    teachers_data = [
        {"email": "teacher1@example.com", "password": "secure_password1"},
        {"email": "teacher2@example.com", "password": "secure_password2"},
        {"email": "teacher3@example.com", "password": "secure_password3"}
    ]
    headers = []
    for teacher in teachers_data:
        response = client.post("/teachers/login", json=teacher)
        token = response.get_json()['tokens']['access']
        headers.append({'Authorization': f'Bearer {token}'})
    return headers

@pytest.fixture()
def auth_headers_schools(client):
    # Sample schools' credentials for testing authentication
    schools_data = [
        {"email": "school1@example.com", "password": "secure_password1"},
        {"email": "school2@example.com", "password": "secure_password2"},
        {"email": "school3@example.com", "password": "secure_password3"}
    ]
    headers = []
    for school in schools_data:
        response = client.post("/schools/login", json=school)
        token = response.get_json()['tokens']['access']
        headers.append({'Authorization': f'Bearer {token}'})
    return headers


def test_create_application(client, auth_headers_teachers, app):
    for idx, header in enumerate(auth_headers_teachers):
        jobid = [2, 3, 4]
        expected_teacher = teachers_data[idx]
        for job_id in jobid:
            application_data = {"jobposting_id": job_id}
            create_response = client.post("/applications", json=application_data, headers=header)
            assert create_response.status_code == 201
            application_id = create_response.get_json()["application_id"]
     
            # Verify created application via GET
            get_response = client.get(f"/applications/{application_id}", headers=header)
            assert get_response.status_code == 200
            application = get_response.get_json()
            assert application["teacher_id"] == idx + 1

            # Ensure jobposting_id matches the specified one
            assert application["jobposting_id"] == job_id


        
        

            assert application["first_name"] == expected_teacher["first_name"]
            assert application["last_name"] == expected_teacher["last_name"]
            assert application["current_school"] == expected_teacher["current_school"]
            assert application["education"] == expected_teacher["education"]
            assert application["subjects_taught"] == expected_teacher["subjects_taught"]
            assert application["current_state"] == expected_teacher["current_state"]
            assert application["grades_taught"] == expected_teacher["grades_taught"]
            assert application["years_of_experience"] == expected_teacher["years_of_experience"]
            assert application["past_jobs"] == expected_teacher["past_jobs"]
            assert application["accolades"] == expected_teacher["accolades"]
            assert application["accommodations"] == expected_teacher["accommodations"]

def test_delete_application(client, auth_headers_teachers):
    delete_response = client.delete(f"/applications/1", headers=auth_headers_teachers[0])
    assert delete_response.status_code == 201

    delete_response = client.delete(f"/applications/4", headers=auth_headers_teachers[0])
    assert delete_response.status_code == 403




def test_get_my_applications(client, auth_headers_teachers):
    num_apps = [2, 3, 3]
    for index, header in enumerate(auth_headers_teachers):
        get_response = client.get("/applications/my", headers=header)
        assert get_response.status_code == 200
        applications = get_response.get_json()["applications"]

        teacher = teachers_data[index]
        
        assert len(applications) == num_apps[index] 

def test_get_applications_by_posting(client, auth_headers_schools):

    get_response_school1 = client.get("/applications/byposting/2", headers=auth_headers_schools[0])
    assert get_response_school1.status_code == 200
    applications_school1 = get_response_school1.get_json()["applications"]
    assert len(applications_school1) == 2

    get_response_school2 = client.get("/applications/byposting/3", headers=auth_headers_schools[1])
    assert get_response_school2.status_code == 200
    applications_school2 = get_response_school2.get_json()["applications"]
    assert len(applications_school2) == 3

    get_response_school3 = client.get("/applications/byposting/4", headers=auth_headers_schools[2])
    assert get_response_school3.status_code == 200
    applications_school3 = get_response_school3.get_json()["applications"]
    assert len(applications_school3) == 3

def test_update_application(client, auth_headers_schools):
    # Authorized update by School 1 on Application ID 2
    update_data = {"status": "interviewing"}
    response = client.put("/applications/2", json=update_data, headers=auth_headers_schools[1])
    assert response.status_code == 201
    response = client.get(f"/applications/2", headers=auth_headers_schools[1])
    assert response.status_code == 200
    application = response.get_json()
    assert application["app_status"] == "interviewing"

    response = client.put("/applications/4", json=update_data, headers=auth_headers_schools[2]) 
    assert response.status_code == 403




#these are the th teachers in the database
'''
teachers_data = [
        {
            "email": "teacher1@example.com",
            "password": "secure_password1",
            "first_name": "First1",
            "last_name": "Last1",
            "current_school": "School1",
            "education": "Education1",
            "subjects_taught": ["Math", "Science"],
            "current_state": "State1",
            "grades_taught": ["Grade1", "Grade2"],
            "years_of_experience": "5",
            "past_jobs": ["Job1", "Job2"],
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
            "subjects_taught": ["Math", "Science"],
            "current_state": "State2",
            "grades_taught": ["Grade1", "Grade2"],
            "years_of_experience": "3",
            "past_jobs": ["Job1", "Job2"],
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
            "subjects_taught": ["Math", "Science"],
            "current_state": "State2",
            "grades_taught": ["Grade1", "Grade2"],
            "years_of_experience": "3",
            "past_jobs": ["Job1", "Job2"],
            "accolades": "Accolades",
            "accommodations": "Accommodations",
        } ]
'''

#these are the schools in the database
''' 
schools_data = [
        { "email": "school1@example.com", "password": "secure_password1", "name": "School 1", "city": "Baltimore", "state": "MD"},
        { "email": "school2@example.com", "password": "secure_password2", "name": "School 2","city": "Townson", "state": "MD"},
        { "email": "school3@example.com", "password": "secure_password3", "name": "School 3","city": "Chicago", "state": "IL"},
    ]
'''

##there are three postings
#posting id:2 belongs to the first school
#posting id:3 belongs to the second school
#posting id:4 belongs to the third school


##create an auth header function for the teachers


##create an authe header function for the schools


###test create application
#create an application attached to each user by calling the POST endpoint, these applications shouold use posting id 2
#create an application for the first two users using the POST endpoint, these applications should use posting id 3
#call the get function  on each creaed application to make sure that the application exists, verify the returned info against the respective user profile

##test get my applications  
#using the auth header of the first user, call this endpoint and verify that that  user's two applciations are returned
#using the auth header of the second user, call this endpoint and verify that that  user's two applciations are returned


##test get applications by posting
#using the auth header of the first school, call this ednpoint and verify that the first three created applications are returned
#using the auth header of the second school, call this ednpoint and verify that the previous second two created applications are returned
#using the auth header of the third school, call this endpoint and verify that there are no applications


##test update application
#using the auth header of the first school, call this endpoint on the application with id 1
#call the get function and verify that the change has been made

#using the aith header of the first school, call this endpoint on application with id 4
#verify that an unauthorized message was sent

##test delete application
#using the auth header of the first school, call this endpoint on the application with id 1
#call the get function and verify that the application no longer exists

#using the aith header of the first school, call this endpoint on application with id 4
#verify that an unauthorized message was sent





