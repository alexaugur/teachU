import pytest
from ..src.models import JobInfo, JobPosting
import pytest
from flask import json

@pytest.fixture()
def auth_headers(client, app):

    schools_data = [
        {"email": "school1@example.com", "password": "secure_password1"},
        {"email": "school2@example.com", "password": "secure_password2"},
        {"email": "school3@example.com", "password": "secure_password3"},
    ]
    headers = []
    for school in schools_data:
        response = client.post("/schools/login", json=school)
        token = response.get_json()['tokens']['access']
        headers.append({'Authorization': f'Bearer {token}'})
    return headers



def test_create_question_and_verify(client, auth_headers):
    posting_id = 2
    question_data = {
        "content": "What is your teaching philosophy?",
        "type": "open-ended"
    }
    # Create a question for the first posting
    create_response = client.post(f"/postings/{posting_id}/questions", json=question_data, headers=auth_headers[0])
    assert create_response.status_code == 201
    create_response_data = create_response.get_json()
    assert "Question created" in create_response_data["message"]

    
    #question_id = create_response_data.get('id')  # Assuming the response includes the question ID
    get_response = client.get(f"/postings/{posting_id}/questions/1", headers=auth_headers[0])
    assert get_response.status_code == 200
    question_data = get_response.get_json()
    assert question_data["question"]["content"] == "What is your teaching philosophy?"

def test_update_question_and_verify(client, auth_headers):
    # Assuming at least one question exists; using question_id = 1 for demonstration
    posting_id = 2
    question_id = 1
    update_data = {
        "content": "Updated question content?"
    }
    # Update the first question
    update_response = client.put(f"/postings/question/{question_id}", json=update_data, headers=auth_headers[0])
    assert update_response.status_code == 201

    # Verify the question was updated by retrieving it
    get_response = client.get(f"/postings/{posting_id}/questions/1", headers=auth_headers[0])
    assert get_response.status_code == 200
    question_data = get_response.get_json()
    assert question_data["question"]["content"] == "Updated question content?"

def test_delete_question_and_verify(client, auth_headers):
    posting_id = 2
    question_id = 1
    # Delete the question
    delete_response = client.delete(f"/postings/{posting_id}/questions/{question_id}", headers=auth_headers[0])
    assert delete_response.status_code == 201

    get_response = client.get(f"/postings/{posting_id}/questions/1", headers=auth_headers[0])
    assert get_response.status_code == 404  # Assuming a 404 response for not found



def test_questions_association(client, auth_headers):
    # Assuming postings of IDs 2, 3, and 4 exist and are associated with users 1, 2, and 3 respectively
    postings_ids = [2, 3, 4, 2]
    questions_data = [
        {"content": "What is your teaching experience?", "type": "open-ended"},
        {"content": "Describe a challenging teaching scenario.", "type": "open-ended"},
        {"content": "How do you engage students?", "type": "open-ended"},
        {"content": "How do you engage students?", "type": "open-ended"}
    ]

    # Create questions for each posting
    for i, posting_id in enumerate(postings_ids):
        response = client.post(f"/postings/{posting_id}/questions", json=questions_data[i], headers=auth_headers[i % len(auth_headers)])
        assert response.status_code == 201

    # Verify questions are correctly associated with their postings
    for posting_id in postings_ids:
        get_response = client.get(f"/postings/{posting_id}/questions", headers=auth_headers[0])
        assert get_response.status_code == 200, f"Failed to retrieve questions for posting ID {posting_id}"
        questions = get_response.get_json()["questions"]
        assert len(questions) > 0
        for question in questions:
            assert question["content"] in [qd["content"] for qd in questions_data]
