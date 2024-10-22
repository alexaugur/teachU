
import pytest
from flask import json
from ..src.models import Application

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

import pytest

def test_create_answers(client, auth_headers_teachers):
    header = auth_headers_teachers[0]

    answers = [{
        "application_id": 4,#teacher id 2 app to job id 2
        "question_id": 2,   #job id 2
        "answer_field": "This is my answer"
    },
    {
        "application_id": 4, #teacher id 2 app to job id 2
        "question_id": 5,   #job id 2
        "answer_field": "This is my answer"
    },
    {
        "application_id": 7, #teacher id 3 app to job id 2
        "question_id": 2,   #job id 2
        "answer_field": "2nd teacher answer"
    },
    {
        "application_id": 7,  #teacher id 3 app to job id 2
        "question_id": 5,   #job id 2
        "answer_field": "2nd teacher answer"
    }
    ]
    
    '''
    answer_data = {
        "application_id": 2,
        "question_id": 2,   
        "answer_field": "This is my answer"
    }

    response = client.post("/answers", json=answer_data, headers=header)
    assert response.status_code == 201
    assert response.get_json()["message"] == "Answer created"

    new_answer_id = 1 

    response = client.get(f"/answers/answer/{new_answer_id}", headers=header)
    assert response.status_code == 200

    answer_data_response = response.get_json()
    assert isinstance(answer_data_response, dict)
    assert answer_data_response["answer_field"] == answer_data["answer_field"]
    assert answer_data_response["question_id"] == answer_data["question_id"]

    '''
    teacher_idxs = [1, 1, 2, 2]
    new_answer_id = 1
    for answer_data in answers:
        print('itr')
        response = client.post("/answers", json=answer_data, headers=auth_headers_teachers[teacher_idxs[new_answer_id - 1]])
        response_data = response.get_json()
        print(f"Status Code: {response.status_code}, Message: {response_data.get('message', 'No message available')}")
        assert response.status_code == 201
        assert response.get_json()["message"] == "Answer created"
        
        response = client.get(f"/answers/answer/{new_answer_id}", headers=auth_headers_teachers[teacher_idxs[new_answer_id - 1]])
        response_data = response.get_json()
        print(f"Status Code: {response.status_code}, Message: {response_data.get('message', 'No message available')}")
        assert response.status_code == 200

        answer_data_response = response.get_json()
        assert isinstance(answer_data_response, dict)
        assert answer_data_response["answer_field"] == answer_data["answer_field"]
        assert answer_data_response["question_id"] == answer_data["question_id"]
        new_answer_id += 1




#variables that exist currntly
#three teacher profiles and three school profiles with ids 1,2 and 3
#postings 2,3,and 4 correspond to schools with schools w ids 1,2,and 3
#posting 2 - questions 2 and 5,  posting 3 - questions 3, posting 4 - questions 4
#applications 2 and 3 on posting 2; 4,5,6 on posting 3; 7,8,9 on posting 4

#test create_answers
#create an answer
#for each application
#for each question for that application
#check for correct message
#call get endpoint and verify that all the fields are correct


#test get answers by question
#call it for question with an id of 2 - use auth header at index one
#print what is returned
#call it for question with an id of 5 - use auth header at index one
#print what is returned


#test get answers by application
#call for an application qith id of 4
#call for an application with an id of 2
def test_get_answers_by_question(client, auth_headers_schools):


    # Call the endpoint for question ID 2
    question_id = 2
    response = client.get(f"/answers/question/{question_id}", headers=auth_headers_schools[0])
    assert response.status_code == 200
    data = response.get_json()
    print(f"Returned answers for question ID {question_id}: {data}")

    # Call the endpoint for question ID 5
    question_id = 5
    response = client.get(f"/answers/question/{question_id}", headers=auth_headers_schools[0])
    assert response.status_code == 200
    data = response.get_json()
    print(f"Returned answers for question ID {question_id}: {data}")

# Test getting answers by application
def test_get_answers_by_application(client, auth_headers_teachers):

    application_id_4 = 4
    response = client.get(f"/answers/application/{application_id_4}", headers=auth_headers_teachers[1])
    assert response.status_code == 200
    data = response.get_json()
    print(f"Returned answers for application ID {application_id_4}: {data}")

    application_id_2 = 7
    response = client.get(f"/answers/application/{application_id_2}", headers=auth_headers_teachers[2])
    assert response.status_code == 200
    data = response.get_json()
    print(f"Returned answers for application ID {application_id_2}: {data}")