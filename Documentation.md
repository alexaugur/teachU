# Technical Documentation

## Introduction

### 1.1 Purpose
The TeachU platform is designed as a two-sided marketplace that connects educational institutions with teaching professionals. It facilitates the recruitment process by enabling schools to post job openings and teachers to find and apply for positions that match their qualifications and interests. This platform aims to streamline the hiring process, improve the match quality between schools and teachers, and reduce the time to hire.

### 1.2 Scope
A 2-sided job board platform for K-12 teachers and schools. Teachers can...
- Search & Filter for jobs
- Apply for jobs
- Manage their jobs and applications
- Manage their profile
- Interact with schools via a messaging system
Schools can...
- Search & Filter for talent (job-seeking teachers)
- Create & manage job posting
- Manage their profile
- Interact with teachers via a messaging system

This documentation covers the backend and frontend components of the TeachU platform. It details the system architecture, technologies used, system setup, and operating requirements. The scope includes:
- Backend services built with Flask and Python.
- Frontend interfaces developed using TypeScript and React.
- Integration points between the backend and frontend.
- Data handling using PostgreSQL and SQLAlchemy ORM.


### 1.3 Audience
K-12 Teachers and School Administrators

## System Overview

### 2.1 Architecture
Our application follows a Client-Server Architecture given its advantages in:
- Clear separation of concerns, which enhances scalability and flexibility. This also allowed the development team to work on tasks independently to further enable rapid development with clear responsibilities
- Distributed workload, which boosts performance and allows diverse tech stacks
- Centralized server management, which aids in efficient resource utilization
The client handles the user interface and presentation logic, while the server manages data processing, storage, and business logic, promoting modularity and reusability.

### 2.2 Technologies Used
Client / Frontend:
- React
- Vite
- Typescript
- TailwindCSS

Server / Backend:
- Python
- Flask

Database:
- PostgreSQL

Hosting (using Platform-as-a-Service):
- Client: Vercel
- Server: Render

### 2.3 Dependencies
Backend:
```shell
cd api
pip install -r requirements.txt
flask run
```

Frontend:
```shell
cd frontend
pnpm install
pnpm run dev
```

Please see package.json and requirements.txt for appropriate frontend and backend dependencies packages.

Key technology stack dependencies include:
- Flask and its extensions for backend functionality.
- React and related libraries for the frontend.
- SQL Alchemy and PostgreSQL for ORM and database services.
- Jest for frontend testing.
- pytest for backend testing.


## Installation Guide

### 3.1 Prerequisites
- Python 3.8 or newer.
- Node.js 14.x or newer.
- PostgreSQL 12.0 or newer.
- Yarn or npm for managing JavaScript packages.

### 3.2 System Requirements
Most modern computers should be able to run the app.
- Operating Systems: Linux, macOS, or Windows 10/11.

### 3.3 Installation Steps
To install and run back end server:
```
cd api
pip install -r requirements.txt
flask run
```
To install and run frontend end server:
```
cd frontend
pnpm i
pnpm run dev
```
Feel free to use a different package manager

## Configuration Guide

### 4.1 Configuration Parameters
There are no configuration parameters to my understanding. All necessary pieces are in the .env files. Make sure to have an appropriate .env file in the frontend directory, and in the api directory.

### 4.2 Environment Setup
Our frontend environment file has the following environmental variables:
```
NODE_ENV=
VITE_API_URL=
VITE_WEBSOCKET_URL=

VITE_API_KEY=
VITE_API_CLUSTER=
```
NODE_ENV is the environment, which is set to development locally.
Both the URL's are links to the backend. Having a separate URL for WEBSOCKETS is a legacy change that helped fix prior problems in production, but this is no longer necessary. Thus, both should be set to the same backend url.

VITE_API_KEY and VITE_API_CLUSTER are both keys in order to connect to PUSHER, which is an external service that helps handle web sockets for us, instead of mangaging them internally. 

See slack for sample 

Our backend environment file has the following environmental variables:
```
FLASK_SECRET_KEY=
FLASK_DEBUG=

FLASK_SQLALCHEMY_DATABASE_URI=
SQLALCHEMY_DATABASE_URI=

FLASK_SQLALCHEMY_ECHO=
FLASK_APP=

OPENAI_API_KEY=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```
The secret key is the secret for jwt encryption, and FLASK_DEBUG is a flag for debug mode (which we do not utilize). Both database URI's are links to a postgres database. Both links should match. There are two different ones because sql alchemy has strict requirements on the naming of the database link in the environment file.
FLASK_SQLALCHEMY_ECHO is another debug flag which we do not use.
FLASK_APP is the path to our main app, so that flask run knows where to start serving our app from.
The openAI api key is a key to make calls to Chat gpt.
The 4 pusher variables are related to creating a pusher client in the server in order to manage web socket connections and maek real time messaging possible.


### 4.3 External Services Integration
Due to vercel's serverless architecture, longterm webscokets with socketio are not supported in production. Thus, we instead use Pusher which abstracts websocket logic but still allows for real time notifications for our messaging feature, without needing to explicitly uphold long term connections in websockets. This is the main third party service we use. 

We also use geopy which is a python library that translates City State combinations to latitude longitude coordinates. We transform city and state into latitude and longitude to perform proximity based querying of cities.

## Usage Guide

### 5.1 User Interface Overview
Introduction to the user interface (UI) components and layout.
- The user interface is different for school and teacher users.
- Schools can see a list of all their job postings, submitted candidate applications, teachers, interviews, messages, and their dashboard. 
- Teachers can see a list of all job postings, schools, applied jobs, messages, and their dashboard.
Overview of the main screens/pages.
- These views allow for easy application and review for both sides of the hiring process. Interview scheduling is streamlined by providing the teachers with schools' availability. Among other things, messaging can be used to communicate last minute interview changes.
Description of the navigation system
- We use React-router-dom with useNavigate element which changes the current location when it is rendered.



### 5.2 User Authentication
We use JSON Web Token (JWT) for the authentication process. A token that provides secure credentials is created for each user, allowing for the confirmation of a user’s identity and authorization of API requests. Regarding account creation, we’ve implemented password hashing to safely store a user’s password into our database.

The authentication process:
- Token Creation: When a user successfully logs in, a JWT is generated by the server, containing both access and refresh tokens.
- Token Usage: The JWT must be included in the header of HTTP requests under the Authorization field for accessing protected routes. The server decrypts this token to verify the user’s identity (e.g. getting the user’s ID) and session validity.

Users can register for, sign into, and log out of the application by clicking on the register, log in, and logout buttons, respectively, in the top right of the header navigation bar on the frontend. The application conditionally renders the buttons based on the user login status- register and log in are only visible when no user is signed in, while only logout is visible when a user is signed in.

Our application’s shortcoming in authorization exists with having a token separately created for a teacher and school user, so in very rare cases, a user in one of these groups can access a user in another with matching access tokens. Thus, teachers and schools with matching id's could theoretically access each other's accounts.

### 5.3 Core Functionality
Description of the primary features and functionalities of the web app.
SCHOOLS
- Job Postings: Schools are able to create job postings for teachers to apply to. Schools can add short-answer or yes/no questions for each applicant to fill out to customize the job posting.
- Rubric: Schools can add rubric criteria to each question. For example, if a job posting is created for an art teacher, a school can add a "creativity" or "organization" rubric scale to each question. This makes it so schools can easily score an applicant and compare answers between applicants while focusing on specific qualities the school is looking for.
- Schedule: Schools can add their availability to their profile. By keeping it up to date, schools can easily schedule interviews with applicants. 
TEACHERS
- Job Board: Teachers can search for jobs by location, salary, areas in need, or school on the comprehensive job board. They can also "favorite" postings they want to keep an eye on. This allows teachers to quickly find jobs that fit their needs.
- Applications: Teachers can apply to any job posting and must fill out all questions asked by the school. Teachers can access a list of their submitted applications to easily keep track of them. They can also look at what profile information and question answers were submitted to each job posting. Teachers can add job postings to an application cart, housing multiple jobs of interest, to mass-apply to them all in one click, while answering all the short answer questions in one place.
BOTH
- Profiles: Teachers and schools can create accounts with specific information such as prior experiences, accolades, special accommodations, etc. Opposite party profile information is viewable on both sides to promote transparency in the hiring process.
- Messaging: Teachers and schools can create chat rooms with one another. This creates a simple way of asking each other questions, providing additional information, changing interview times, etc.


### 5.4 Advanced Features
Overview of additional or advanced features beyond the core functionality.
- Advanced feature implementation starts with recommending job postings to teachers based on areas in need. We recommend job postings by finding the location with the highest number of job postings and returning the postings in this location. 
- Schools can also search among teachers by first name, last name, or any of their profile data. It searches across all fields and returns the results.
- When a school wants to offer an interview to a teacher, an availability object is created for each time slot to be available to the teacher. Since a school can choose the duration of the interview, appropriate time slots are displayed to the teacher that are within the school's availability.
- Rubric structure. We have separate rubrics that a school can set for each question, allowing for multiple rubric criteria for each individual question. Additionally, we include a score object that is crated for each answer to a question that links that rubric criteria to the given question.

## API Documentation

### 6.1 Endpoints and 6.2 Request and Response Formats
application cart,  messaging. interviews, teacher and school auth
#### GET /schoolprofiles
- Description: Retrieves a list of all school profiles.
- Authorization: Authenticated user.
- Response Codes:
  - 200 OK: Returns a list of school profiles.

#### PATCH /schoolprofiles/<schoolprofile_id>
- Description: Updates a specific school profile.
- Authorization: Authenticated school that owns the profile.
- URL Parameters:
  - schoolprofile_id: The unique identifier of the school profile.
- Request Body Example:
  - { "name": "New School Name",
  "address": "123 School Lane",
  "city": "Sample City",
  "state": "Sample State",
  "zip": "12345",
  "phone": "+1234567890",
  "website": "https://www.newschoolname.edu"}
- Response Codes:
  - 200 OK: Profile updated successfully.
  - 403 Forbidden: Unauthorized access to update this profile.
  - 404 Not Found: School profile not found.

#### GET /schoolprofiles/my
- Description: Retrieves the authenticated school's profile.
- Authorization: Authenticated school.
- Response Codes:
  - 200 OK: Returns the authenticated school's profile.
  - 404 Not Found: School profile not found for the user.

#### GET /schoolprofiles/school/<schoolprofile_id>
- Description: Retrieves a specific school profile by its unique identifier.
- URL Parameters:
  - schoolprofile_id: The unique identifier of the school profile.
- Response Codes:
  - 200 OK: Returns the specified school profile.
  - 404 Not Found: School profile not found.

#### GET /schoolprofiles/schools
- Description: Retrieves school profiles based on a search query.
- Query Parameters:
  - search: Search term to filter school profiles by (optional).
  - page: Page number for paginated results (optional, defaults to 1).
  - per_page: Number of profiles per page (optional, defaults to 20).
- Response Codes:
  - 200 OK: Returns matching school profiles.
  - 404 Not Found: No matching schools found.

#### GET /teacherprofiles
 - Description: Retrieves a list of all teacher profiles.
- Authorization: Authenticated user.
- Response Codes:
  - 200 OK: Returns a list of teacher profiles.

#### PATCH /teacherprofiles/<teacherprofile_id>
- Description: Updates the specified teacher's profile.
- Authorization: Authenticated teacher whose profile is being updated.
- URL Parameters:
  - teacherprofile_id: The unique identifier of the teacher profile.
- Request Body Example:
  - { "first_name": "John",
  "last_name": "Doe",
  "current_school": "Sample School",
  "education": "Bachelor of Science",
  "subjects_taught": ["Math", "Science"],
  "years_of_experience": 10,
  "accolades": "Best Teacher of the Year",
  "avatar": "https://example.com/avatar.jpg"}
- Response Codes:
  - 200 OK: Profile updated successfully.
  - 403 Forbidden: User not authorized to update this profile.
  - 404 Not Found: Teacher profile not found.

#### GET /teacherprofiles/my
- Description: Retrieves the authenticated teacher's profile.
- Authorization: Authenticated teacher.
- Response Codes:
  - 200 OK: Returns the authenticated teacher's profile.
  - 404 Not Found: Teacher profile not found for the user.

#### GET /teacherprofiles/id/<teacherprofile_id>
- Description: Retrieves a specific teacher profile by its unique identifier.
- Authorization: Authenticated user.
- URL Parameters:
  - teacherprofile_id: The unique identifier of the teacher profile.
- Response Codes:
  - 200 OK: Returns the specified teacher profile.
  - 404 Not Found: Teacher profile not found.

#### GET /teacherprofiles/search
- Description: Searches for teacher profiles based on a search query.
- Authorization: Authenticated school.
- Query Parameters:
  - search: Search term to filter teacher profiles by (optional).
  - page: Page number for paginated results (optional, defaults to 1).
  - per_page: Number of profiles per page (optional, defaults to 20).
- Response Codes:
  - 200 OK: Returns matching teacher profiles.
  - 404 Not Found: School not found for the user.

#### PUT /teacherprofiles/addJob
- Description: Adds a job posting to the authenticated teacher's list of saved jobs.
- Authorization: Authenticated teacher.
- Request Body Example:
  - { "job_id": "12345"}
- Response Codes:
  - 200 OK: Job successfully added to saved jobs.
  - 400 Bad Request: Job already saved.
  - 404 Not Found: Valid job not provided or teacher not found.

#### PUT /teacherprofiles/deleteJob
- Description: Removes a job posting from the authenticated teacher's list of saved jobs.
- Authorization: Authenticated teacher.
- Request Body Example:
  - {  "job_id": "12345"}
- Response Codes:
  - 200 OK: Job successfully removed from saved jobs.
  - 404 Not Found: Valid job not provided or teacher not found.

#### PUT /teacherprofiles/getFavorite
- Description: Checks if a specific job is saved in the authenticated teacher's list of favorites.
- Authorization: Authenticated teacher.
- Request Body Example:
  - {"job_id": "12345"}
- Response Codes:
  - 200 OK: Returns true if the job is saved as a favorite, false otherwise.
  - 404 Not Found: Valid job not provided or teacher not found.

#### POST /postings
- Description: Creates a new job posting for the authenticated school.
- Authorization: Authenticated school.
- Request Body Example:
  - {"title": "Math Teacher",
  "salary_est": 65000,
  "description": "Teach mathematics to students of various grades.",
  "start_date": "2025-02-01",
  "interview_length": 60}
- Response Codes:
  - 201 Created: Posting created successfully.
  - 400 Bad Request: Missing required fields like title.
  - 403 Forbidden: Unauthorized access to create a posting.
  - 404 Not Found: School not found for the user.

#### PUT /postings/posting/<id>
- Description: Updates an existing job posting.
- Authorization: Authenticated school that created the posting.
- URL Parameters:
  - id: The unique identifier of the posting.
- Request Body Example:
 - {"title": "Updated Math Teacher",
  "salary_est": 70000,
  "description": "Teach advanced mathematics to high school students."}
- Response Codes:
  - 201 Updated: Posting updated successfully.
  - 403 Forbidden: School not authorized to update this posting.
  - 404 Not Found: Posting not found.

#### PUT /postings/posting-close/<id>
- Description: Updates the open/closed status of a job posting.
- Authorization: Authenticated school that created the posting.
- URL Parameters:
  - id: The unique identifier of the posting.
- Request Body Example:
  - {"closed": true}
- Response Codes:
  - 201 Updated: Posting status updated successfully.
  - 403 Forbidden: School not authorized to update this posting.
  - 404 Not Found: Posting not found.
  
#### DELETE /postings/<id>
- Description: Deletes a job posting if authorized.
- Authorization: Authenticated school that created the posting.
- URL Parameters:
  - id: The unique identifier of the posting.
- Response Codes:
  - 201 Deleted: Posting deleted successfully.
  - 403 Forbidden: School not authorized to delete this posting.
  - 404 Not Found: Posting not found.

#### GET /postings/my
- Description: Retrieves all job postings created by the authenticated school.
- Authorization: Authenticated school.
- Response Codes:
  - 200 OK: Returns a list of job postings.
  - 404 Not Found: School not found for the user.

#### GET /postings
- Description: Retrieves all open job postings.
- Response Codes:
  - 200 OK: Returns a list of open job postings.

#### GET /postings/favorites
- Description: Retrieves all favorite job postings for the authenticated teacher.
  - Authorization: Authenticated teacher.
- Response Codes:
  - 200 OK: Returns a list of favorite job postings.
  - 404 Not Found: Teacher not found for the user.

#### GET /postings/job/<id>
- Description: Retrieves a specific job posting by its unique identifier.
- Authorization: Authenticated user.
- URL Parameters:
  - id: The unique identifier of the posting.
- Response Codes:
- 200 OK: Returns the job posting details.
- 400 Not Found: Posting not found.

#### GET /postings/proximity
- Description: Retrieves job postings based on location proximity.
- Query Parameters:
  - city: The city to filter postings by.
  - state: The state to filter postings by.
- Response Codes:
  - 200 OK: Returns job postings based on the specified location.
  - 400 Bad Request: Unable to find the location.

#### GET /postings/salary
- Description: Retrieves job postings based on salary range.
- Query Parameters:
  - salary: The target salary to filter postings by.
  - amplitude: The range around the target salary to consider (optional, defaults to 10,000).
- Response Codes:
  - 200 OK: Returns job postings within the specified salary range.

#### GET /postings/title
- Description: Retrieves job postings based on title.
- Query Parameters:
  - title: The job title to filter postings by.
- Response Codes:
  - 200 OK: Returns job postings matching the given title.

#### GET /postings/recommendations
- Description: Retrieves job postings in locations with high teacher demand based on proximity to a specified location.
- Authorization: Authenticated teacher.
- Query Parameters:
  - city: The city to use as a reference for recommendations.
  - state: The state to use as a reference for recommendations.
- Response Codes:
  - 200 OK: Returns recommended postings based on teacher demand.
  - 400 Bad Request: Unable to find the specified location.
  - 404 Not Found: Teacher not found for the user.

#### POST /postings/<posting_id>/questions
 - Description: Creates a new question for the specified job posting.
- Authorization: Authenticated school that created the job posting.
- URL Parameters:
  - posting_id: The unique identifier of the job posting.
- Request Body Example:
  - { "content": "What makes you interested in this job?",
  "type": "open-ended"}
- Response Codes:
  - 201 Created: Question created successfully.
  - 400 Bad Request: Missing content or type.
  - 403 Forbidden: School is not authorized to create the question.
  - 404 Not Found: Job posting not found.
  
#### PUT /postings/question/<question_id>
- Description: Updates the specified question.
- Authorization: Authenticated school that created the job posting associated with the question.
- URL Parameters:
  - question_id: The unique identifier of the question.
- Request Body Example:
- { "content": "Describe your experience working in this field."}
- Response Codes:
  - 201 Updated: Question updated successfully.
  - 403 Forbidden: School is not authorized to update the question.
  - 404 Not Found: Question or associated job posting not found.

#### DELETE /postings/<posting_id>/questions/<id>
- Description: Deletes the specified question if authorized.
- Authorization: Authenticated school that created the job posting associated with the question.
- URL Parameters:
  - posting_id: The unique identifier of the job posting.
  - id: The unique identifier of the question.
- Response Codes:
  - 201 Deleted: Question deleted successfully.
  - 403 Forbidden: School is not authorized to delete the question.
  - 404 Not Found: Question or job posting not found, or question doesn't belong to the specified posting.

#### GET /postings/<posting_id>/questions/<id>
- Description: Retrieves the specified question by its unique identifier.
- Authorization: Authenticated school that created the job posting associated with the question.
- URL Parameters:
  - posting_id: The unique identifier of the job posting.
  - id: The unique identifier of the question.
- Response Codes:
  - 200 OK: Returns the question details.
  - 403 Forbidden: School is not authorized to view the question.
  - 404 Not Found: Question or job posting not found.

#### GET /postings/<posting_id>/questions
- Description: Retrieves all questions associated with a specific job posting.
- Authorization: Authenticated school that created the job posting.
- URL Parameters:
  - posting_id: The unique identifier of the job posting.
- Response Codes:
  - 200 OK: Returns a list of questions.
  - 403 Forbidden: School is not authorized to view these questions.
  - 404 Not Found: Job posting not found.
Let me know if you'd like further clarification or adjustments!

#### POST /applications
- Description: Creates a new job application for the specified job posting.
- Authorization: Authenticated teacher
- Request Body Example:
{ "jobposting_id": "12345" }
- Response Codes:
  - 201 Created: Application created successfully.
  - 400 Bad Request: Missing or invalid jobposting_id.
  - 403 Forbidden: User is not an authnticated teacher
  - 404 Not Found: Posting not found or duplicate application exists.
  
#### GET /applications/my
- Description: Retrieves all applications submitted by the teacher making the request.
- Authorization: Authenticated teacher
- Response Codes:
   - 200 OK: Returns a list of applications.
   - 403 Forbidden: User is not an authnticated teacher.
   - 404 Not Found: Teacher not found.

#### GET /applications/byposting/<jobposting_id>
- Description: Retrieves all applications submitted for a specific job posting.
- Authorization: Authenticated school that created the posting
- URL Parameters:
  - jobposting_id: The unique identifier of the job posting.
- Response Codes:
  - 200 OK: Returns a list of applications for the specified posting.
  - 403 Forbidden: School not authorized to access the posting.
  - 404 Not Found: School or posting not found.
 
#### PUT /applications/<id>
- Description: Updates an existing application’s status or comments.
- Authorization: Authenticated school that created the posting
- URL Parameters:
  - id: The unique identifier of the application.
- Request Body Example:
  { "status": "interviewing",
    "comment": "Please attend the scheduled interview." }
- Response Codes:
  - 201 Updated: Application updated successfully.
  - 403 Forbidden: School not authorized to update the application.
  - 404 Not Found: Application not found.

#### DELETE /applications/<id>
- Description: Deletes an existing application if authorized.
- Authorization: Authenticated teacher that created the application or authenticated school that created the posting that the application is for
- URL Parameters:
  - id: The unique identifier of the application.
- Response Codes:
  - 201 Deleted: Application deleted successfully.
  - 403 Forbidden: Teacher or school not authorized to delete the application.

#### GET /applications/<id>
- Description: Retrieves a specific application by its unique identifier.
- URL Parameters:
  - id: The unique identifier of the application.
- Response Codes:
  - 200 OK: Returns the application details.
  - 403 Forbidden: Not authorized to access this application.
  - 400 Not Found: Application with given id not found.


#### POST /answers
- Description: Creates an answer object to an application question
- Authorization: Authenticated teacher 
- Parameters:
  question_id: the id of the question this is answering
  application_id: the id of the application this answer is being added to
  answer_field: the content of the answer, stored as a string
- Response Codes:
  - 200 OK: Returns the application details.
  - 403 Forbidden: Not authorized to create an answer - not an authenticated teacher
  - 400 Not Found: An answer already exists for this application


#### GET /answers/question/<question_id>
- Description: Retrieves the answers pertailing to a certain question with their applicant details
- Authorization: Must be the authenticated school that has created the posting of which the question belongs to
- URL Parameters:
  - id: The unique identifier of the question.
- Response Codes:
  - 200 OK: Returns the answers with their application information.
  - 400 Not Found: Application not found.
  - 403 Forbidden: Not authorized to access these answers.
  - 404 Not Found: Question with given id not found


####  GET /answers/application/<id>
- Description: Retrieves the answers associated with a certain application. Also returns the questions and the profile associated with that application.
- Authorization: Must be the authenticated school that has created the posting of which the application belongs to or the authenticated teacher that sent the application
- URL Parameters:
  - id: The unique identifier of the application.
- Response Codes:
  - 200 OK: Returns the answers with their questions application details.
  - 403 Forbidden: Not authorized to access these answers
  - 400 Not Found: Application not found.


#### GET /answers/answer/<id>
- Description: Retrieves a specific answer by its unique identifier.
- Authorization: Must be the authenticated school that has created the posting of which the answer belongs to or the authenticated teacher that created the answer
- URL Parameters:
  - id: The unique identifier of the application.
- Response Codes:
  - 200 OK: Returns the answer details.
  - 403 Forbidden: Not authorized to access this answer.
  - 404 Not Found: Answer not found.

#### POST /rubrics/<question_id>/rubric
- Description: Creates a rubric for the specified question.
- Authorization: Authenticated school that created the job posting associated with the question.
- URL Parameters:
  - question_id: The unique identifier of the question.
- Request Body Example:
{"score": 10,
  "criteria": "Clear and concise answers"}
- Response Codes:
  - 201 Created: Rubric created successfully.
  - 400 Bad Request: Missing score or criteria.
  - 403 Forbidden: School is not authorized to create the rubric.
  - 404 Not Found: Question or job posting not found.

#### PUT /rubrics/<id>
- Description: Updates an existing rubric.
- Authorization: Authenticated school that created the job posting associated with the rubric's question.
- URL Parameters:
  - id: The unique identifier of the rubric.
- Request Body Example:
{ "score": 15,
  "criteria": "Detailed explanation required"}
- Response Codes:
  - 201 Updated: Rubric updated successfully.
  - 403 Forbidden: School is not authorized to update the rubric.
  - 404 Not Found: Rubric or associated question/posting not found.

#### DELETE /rubrics/<id>
- Description: Deletes an existing rubric if authorized.
- Authorization: Authenticated school that created the job posting associated with the rubric's question.
- URL Parameters:
  - id: The unique identifier of the rubric.
- Response Codes:
  - 201 Deleted: Rubric deleted successfully.
  - 403 Forbidden: School is not authorized to delete the rubric.
  - 404 Not Found: Rubric, associated question, or job posting not found.

#### GET /rubrics/questions/<question_id>
- Description: Retrieves rubrics for the specified question.
- Authorization: Authenticated school that created the job posting associated with the question.
- URL Parameters:
  - question_id: The unique identifier of the question.
- Response Codes:
  - 200 OK: Returns a list of rubrics.
  - 403 Forbidden: School is not authorized to view these rubrics.
  - 404 Not Found: Question or job posting not found.

#### GET /rubrics/withscore/<answer_id>
- Description: Retrieves rubrics with their associated scores for a specific answer.
- Authorization: Authenticated school that created the job posting associated with the answer's question.
- URL Parameters:
  - answer_id: The unique identifier of the answer.
- Response Codes:
  - 200 OK: Returns a list of rubrics with scores.
  - 403 Forbidden: School is not authorized to view these rubrics.
  - 404 Not Found: Answer, question, or job posting not found.

#### POST /rubrics/<rubric_id>/scores
- Description: Creates a new score for a specific rubric.
- Authorization: Authenticated school that created the job posting associated with the rubric's question.
- URL Parameters:
  - rubric_id: The unique identifier of the rubric.
- Request Body Example:
{ "answer_id": "6789",
  "points": 8}
- Response Codes:
  - 201 Created: Score created successfully.
  - 400 Bad Request: Missing answer_id or points.
  - 403 Forbidden: School is not authorized to create the score.
  - 404 Not Found: Question or job posting not found.

#### PUT /rubrics/<rubric_id>/scores/<score_id>
- Description: Updates an existing score for a specific rubric.
- Authorization: Authenticated school that created the job posting associated with the rubric's question.
- URL Parameters:
  - rubric_id: The unique identifier of the rubric.
  - score_id: The unique identifier of the score.
- Request Body Example:
{ "points": 9}
- Response Codes:
  - 201 Updated: Score updated successfully.
  - 403 Forbidden: School is not authorized to update the score.
  - 404 Not Found: Score or associated question/posting not found.

### 6.3 Authentication and Authorization
We use JSON Web Token (JWT) for the authentication process. A token that provides secure credentials is created for each user, allowing for the confirmation of a user’s identity and authorization of API requests. Regarding account creation, we’ve implemented password hashing to safely store a user’s password into our database.

The authentication process:
Token Creation: When a user successfully logs in, a JWT is generated by the server, containing both access and refresh tokens.
Token Usage: The JWT must be included in the header of HTTP requests under the Authorization field for accessing protected routes. The server decrypts this token to verify the user’s identity (e.g. getting the user’s ID) and session validity.

Users can register for, sign into, and log out of the application by clicking on the register, log in, and logout buttons, respectively, in the top right of the header navigation bar on the frontend. The application conditionally renders the buttons based on the user login status- register and log in are only visible when no user is signed in, while only logout is visible when a user is signed in.

Our application’s shortcoming in authorization exists with having a token separately created for a teacher and school user, so in very rare cases, a user in one of these groups can access a user in another with matching access tokens.

## Database Schema

### 7.1 Entity-Relationship Diagram
See Diagram below:


<img width="548" alt="ERD" src="https://github.com/cs421sp24-homework/project-team-10/assets/123839928/aeeaad84-aa7b-499a-80c7-541edfd19754">



### 7.2 Table Definitions
We have the following tables in our database:
- Teacher: A teacher object containing email and password
- TeacherProfile: profile object containg any personal information 
- School: A school object containing email and password
- SchoolProfile: profile object containg any personal information about school
- JobPosting: An object representing a job posting, and linking to questions + application, without specific info about the posting
- JobInfo: Specific Information about the posting
- Question: A question asked in a job posting
- Answer: A specific answer a teacher has to a question, as a part of a submitted application.
- Rubric: A specific criteria tied to a question
- Score: A specific score tied to both a rubric(and it's question) and a specific answer
- Application: A teacher's submitted application to a posting, contaning their profile info, and an id to get all their question-- specific answers
- School Availability: Object representing start to end time ranges that a school is available on a particular day.
- Teacher Interview: Object representing a specific time and date for an interview
- Application Cart: An object tieing a teacher to a list of postings they add to their cart.
### 7.3 Relationships and Constraints
Here are the key relationships:
- A Teacher must have a teacher profile, and an application cart on account creation
- A School must have a school profile on account creations.
- A School has many job postings
- Each Job Posting has one job info
- Each Job Info contains many questions
- Each Job Posting contains many applications
- Each Teacher contains many applications
- Each Application corresponds to exactly one teacher, and one job posting, and this application is unique
- Each Question can have many rubrics(for each criteria)
- Each Question can have many answers
- Each Answer has many scores (based on number of rubrics applied to the question)
- Each combination of rubric and application has exactly one, unique score
- Each School can have multiple availabilities
- Each Teacher can have many interviews
- Each Application can have at most one interview.
- Each Application cart belongs to one teacher, but can contain many postings
## Testing

### 8.1 Test Plan
Frontend- Jest React Testing
Backend- pytest Library


### 8.2 Test Results

Frontend: 54% (among files that are tested. Thus, our actual coverage is regretably much lower). Admittedly, we left our frontend testing off much too late and had trouble figuring out how to set it up. As the complexity of our app grew, it became more difficult to properly mock things from scratch, so we were unable to write many frontend tests, aside from basic navigation.

Backend: 51% (overall). Our backend coverage is decent, and we are able to verify many of the core applications of our app work, such as user authentication, profile creations, job postings, applying to jobs, and more. However, we needed to be more thorough.

Overall, we definitely feel short in our testing requirements as we should have prioritize it more and were trying to tackle this challenge with 1 less member than average.

### 8.3 Known Issues and Limitations
- Authentication. Some schools and teachers can theoretically access each other's endpoints and data (using external systems like Postman)
- One issue a user may encounter is slow fetches. The reason for our slow backend is because it is a free and accessible one that we chose to use. Thus, our job query is slow
- It is possible to apply to jobs with unanswered questions.
- Due to stale states not triggered new fetches, when reviewing different applications, it may require page reload in order to see the up to data application data.
- The frontend app allows you to try and apply to jobs you have already applied to, but in the backend, a new application will not be submitted
- Occasional toasts are thrown indicating an issue, even though know issue has occured. This has been fixed in many cases, but it is possible this still exists.
- Deleting a job posting does not delete all related applications. Thus teacher's will still the application after it has been deleted.
- Messaging will not always scroll to the bottom every time a new message shows up.

## Deployment

### 9.1 Deployment Process
Our frontend deploys to vercel, and our backend deploys to render. We have continous integrations tests that ensure that both our frontend(vite react) and our backend (flask python) can build, which runs on every pr to development and main. Given these tests pass, we push to our main branch, which is then continously deployed to our production environments. 

In order to deploy to the frontend, we run the command 
```
pnpm run build
```
which creates an output build directory that vercel serves our app through.

In order to deploy our backend, we have a web service on render that uses gunicorn to start up a productin environment flask server. It is built using the command:
```
gunicorn src.run.app
```

## Glossary

### 10.1 Terms and Definitions
Postings refer to job postings.
Teacher profiles refer to profiles that teacher's fill out with much of their information. This is submitted to every application, and is meant to contain key information.

Availability refers to time slots schools set in which they are available to interview candidates. 

Application refers to an entire application of a teacher, specific to one job posting.

Question refers to each question asked within a job posting.

Answer refers to an individual teacher's answer, which then corresponding to both a specific application, and teacher, and question.
