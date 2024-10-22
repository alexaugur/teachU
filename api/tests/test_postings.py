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



def test_create_postings(client, auth_headers):
    # Use the first user's auth headers to create a posting
    posting_data = {
        "title": "Science Teacher",
        "salary_est": 55000,
        "description": "Teach science classes.",
        "start_date": "2023-09-01"
    }
    create_response = client.post("/postings", json=posting_data, headers=auth_headers[0])
    assert create_response.status_code == 201
    create_response_data = create_response.get_json()
    assert "Posting created" in create_response_data["message"]

    # Retrieve the created posting using its ID
    get_response = client.get(f"postings/job/1", headers=auth_headers[0])
    assert get_response.status_code == 200
    retrieved_posting = get_response.get_json()

    # Adjust assertions to match nested structure
    assert retrieved_posting["job_info"]["title"] == posting_data["title"]
    assert retrieved_posting["job_info"]["salary_est"] == posting_data["salary_est"]
    assert retrieved_posting["job_info"]["description"] == posting_data["description"]
    assert retrieved_posting["job_info"]["start_date"] == posting_data["start_date"]

def test_update_posting(client, auth_headers):
    posting_id = 1  # Adjust based on your setup
    update_data = {
        "title": "Updated Science Teacher",
        "description": "Updated description."
    }
    response = client.put(f"/postings/posting/{posting_id}", json=update_data, headers=auth_headers[0])
    assert response.status_code == 201  # Adjust according to your API

    update_response = client.get(f"postings/job/{posting_id}", headers=auth_headers[0])
    assert update_response.status_code == 200
    updated_posting = update_response.get_json()

    
    assert updated_posting['job_info']['title'] == update_data["title"]
    assert updated_posting['job_info']['description'] == update_data["description"]

def test_delete_posting(client, auth_headers):
    posting_id = 1  
    delete_response = client.delete(f"/postings/{posting_id}", headers=auth_headers[0])
    assert delete_response.status_code == 201 

    get_response = client.get(f"postings/job/{posting_id}", headers=auth_headers[0])
    assert get_response.status_code == 400  

def test_get_my_postings(client, auth_headers):

    posting_data_user1 = {
        "title": "Math Teacher",
        "salary_est": 50000,
        "description": "Teach math classes.",
        "start_date": "2023-09-01"
    }
    
    
    
    posting_data_user2 = {
        "title": "Science Teacher",
        "salary_est": 55000,
        "description": "Teach science classes.",
        "start_date": "2023-09-01"
    }
    


    posting_data_user3 = {
        "title": "Gym Teacher",
        "salary_est": 40000,
        "description": "Teach gym classes.",
        "start_date": "2023-09-01"
    }

    client.post("/postings", json=posting_data_user1, headers=auth_headers[0])
    client.post("/postings", json=posting_data_user2, headers=auth_headers[1])
    client.post("/postings", json=posting_data_user3, headers=auth_headers[2])
    # Get postings for the first user
    get_response_user1 = client.get("/postings/my", headers=auth_headers[0])
    postings_user1 = get_response_user1.get_json()["postings"]

    # Validate the posting matches the posted data, considering nested structure
    assert len(postings_user1) == 1
    assert postings_user1[0]["job_info"]["title"] == posting_data_user1["title"]
    assert postings_user1[0]["job_info"]["description"] == posting_data_user1["description"]


def test_get_all_postings(client, auth_headers):
    posting_data_user1 = {
        "title": "Math Teacher",
        "salary_est": 50000,
        "description": "Teach math classes.",
        "start_date": "2023-09-01"
    }
    

    posting_data_user2 = {
        "title": "Science Teacher",
        "salary_est": 55000,
        "description": "Teach science classes.",
        "start_date": "2023-09-01"
    }

    posting_data_user3 = {
        "title": "Gym Teacher",
        "salary_est": 40000,
        "description": "Teach gym classes.",
        "start_date": "2023-09-01"
    }

    get_response = client.get("/postings", headers=auth_headers[0])
    postings = get_response.get_json()["postings"]
    
    assert len(postings) == 3 
    
    titles = [posting["job_info"]["title"] for posting in postings]
    
    assert posting_data_user1["title"] in titles
    assert posting_data_user2["title"] in titles
    assert posting_data_user3["title"] in titles