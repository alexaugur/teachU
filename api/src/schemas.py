from marshmallow import fields, Schema
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from .models import SchoolProfile, TeacherProfile, JobPosting, JobInfo, Question, Application, Answer, Rubric, ApplicationCart, Score, SchoolAvailability, TeacherInterview, Message


class NewApplicationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Application
        include_fk = True


class UserSchema(Schema):
    id = fields.String()
    username = fields.String()
    email = fields.String()


class TeacherSchema(Schema):
    id = fields.String()
    username = fields.String()
    email = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    current_school = fields.String()
    education = fields.String()
    subjects_taught = fields.String()
    current_state = fields.String()
    grades_taught = fields.String()
    years_of_experience = fields.String()
    past_jobs = fields.String()
    accolades = fields.String()
    accommodations = fields.String()
    avatar = fields.String()


class ApplicationSchema(Schema):
    id = fields.String()
    teacher_id = fields.String()
    posting_id = fields.String()
    question_id = fields.List(fields.String())
    answer_id = fields.List(fields.String())


class ApplicationWithPostingSchema(Schema):
    id = fields.String()
    title = fields.String()
    experience = fields.String()
    salary_est = fields.String()
    start_date = fields.String()
    state = fields.String()
    city = fields.String()
    school_id = fields.String()



class AnswerSchema(Schema):
    id = fields.String()
    application_id = fields.String()
    teacher_id = fields.String()
    answer_field = fields.String()


class QuestionAnswerSchema(Schema):
    id = fields.String()
    application_id = fields.String()
    teacher_id = fields.String()
    answer_field = fields.String()
    content = fields.String()

class SchoolSchema(Schema):
    id = fields.String()
    name = fields.String()
    city = fields.String()
    state = fields.String()
    email = fields.String()


class PostingSchema(Schema):
    id = fields.String()
    title = fields.String()
    experience = fields.String()
    salary_est = fields.String()
    start_date = fields.String()
    state = fields.String()
    city = fields.String()
    school_id = fields.String()


class QuestionSchema(Schema):
    id = fields.String()
    title = fields.String()
    content = fields.String()
    type = fields.String()
    jobposting_id = fields.String()


# class ApplicationCartSchema(Schema):
#     id = fields.String()
#     teacher_id = fields.String()
#     job_posting_ids = fields.List(fields.String())
    

class SchoolProfileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SchoolProfile
        load_instance = True  # Optional: Deserialization will create model instances
        include_fk = True 

class TeacherProfileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TeacherProfile
        load_instance = True  # Optional: Deserialization will create model instances
        include_fk = True 

class QuesrionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Question
        load_instance = True  # Optional: Deserialization will create model instances
        include_fk = True 

class JobInfoSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = JobInfo
        include_fk = True  # Optionally include foreign keys if needed

class JobPostingSchema(SQLAlchemyAutoSchema):
    job_info = Nested(JobInfoSchema)  # Nest the JobInfoSchema for related JobInfo
    school_profile= Nested(SchoolProfileSchema)

    class Meta:
        model = JobPosting
        include_fk = True  

class AnswerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Answer
        include_fk = True

class RubricSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Rubric
        include_fk = True


class TeacherInterviewSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = TeacherInterview
        include_fk = True

class SchoolAvailabilitySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SchoolAvailability
        include_fk = True


class ApplicationSchema(SQLAlchemyAutoSchema):
    profile_snapshot = Nested(TeacherProfileSchema)  # Nest the JobInfoSchema for related JobInfo
    answers = fields.List(fields.Nested(AnswerSchema))

    class Meta:
        model = Application
        include_fk = True  

class ApplicationCartSchema(SQLAlchemyAutoSchema):
    teacher = fields.Nested(TeacherProfileSchema)
    job_postings = fields.List(fields.Nested(JobPostingSchema))

    class Meta:
        model = ApplicationCart
        include_fk = True


class ScoreSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Score
        load_instance = True  
        include_fk = True 

class RubricWithScoreSchema(Schema):
    id = fields.Int()
    criteria = fields.Str()
    question_id = fields.Int()
    score = fields.Int()  # Maps 'score' in Rubric to 'total_points' in the schema
    scoreObj = fields.Nested(ScoreSchema, missing=None)


class MessageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Message
        include_fk = True
