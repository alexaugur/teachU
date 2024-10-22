from .extensions import db
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy import func
import uuid


class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(1024), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    sender_type = db.Column(db.String(), nullable=False)
    real_message = db.Column(db.Boolean, default=True, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read_at = db.Column(db.DateTime)
    archived = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Message {self.id} from {self.sender_id} to {self.recipient_id}>'
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Teacher(db.Model):
    __tablename__ = "teachers"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)    
    email = db.Column(db.String(), nullable=False)
    password = db.Column(db.String(), nullable=False)
    profile = relationship('TeacherProfile', back_populates='teacher', uselist=False, cascade='all, delete-orphan')
    # applications = db.relationship('Application', backref='teacher', lazy=True,  cascade='all, delete-orphan')
    answers = db.relationship('Answer', backref='teacher', lazy=True,  cascade='all, delete-orphan')

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Teacher{self.email}>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)



class TeacherProfile(db.Model):
    __tablename__ = "teacherprofiles"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)    
    teacher_id = db.Column(db.Integer(), db.ForeignKey('teachers.id'), nullable=True, unique=True)
    first_name = db.Column(db.String(), nullable=True)
    last_name = db.Column(db.String(), nullable=True)
    current_school = db.Column(db.String(), nullable=True)
    education = db.Column(db.String(), nullable=True)
    subjects_taught = db.Column(db.String(), nullable=True) # set this back to array later?
    current_state = db.Column(db.String(), nullable=True)
    grades_taught = db.Column(db.String(), nullable=True)
    years_of_experience = db.Column(db.String(), nullable=True)
    past_jobs = db.Column(db.String(), nullable=True)
    accolades = db.Column(db.String(), nullable=True)
    accommodations = db.Column(db.String(), nullable=True)
    avatar = db.Column(db.LargeBinary(), nullable=True)
    teacher = relationship('Teacher', back_populates='profile')
    saved_jobs = db.Column(ARRAY(db.String()), nullable=True, default = [])
    
    
    # accommodations2 = db.Column(db.String(), nullable=True)


    # application_id =  db.Column(db.Integer(), db.ForeignKey('applications.id'), nullable=True, unique=True)

    @classmethod
    def get_user_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_by_teacher_id(cls, teacher_id):
        return cls.query.filter_by(teacher_id=teacher_id).first()
    
    @classmethod
    def get_with_search(cls, search):
        return cls.query.filter(
            (cls.first_name + " " + cls.last_name).ilike(f"%{search}%")
            | (cls.first_name.ilike(f"%{search}%"))
            | (cls.last_name.ilike(f"%{search}%"))
            | (cls.current_school.ilike(f"%{search}%"))
            | (cls.education.ilike(f"%{search}%"))
            | (cls.subjects_taught.ilike(f"%{search}%"))
            | (cls.current_state.ilike(f"%{search}%"))
            | (cls.accolades.ilike(f"%{search}%"))
            # | (cls.past_jobs.ilike(f"%{search}%"))
            | (cls.accommodations.ilike(f"%{search}%"))
            | (cls.years_of_experience.ilike(f"%{search}%"))
            # | (cls.grades_taught.ilike(f"%{search}%"))
            )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<TeacherProfile{self.id}>"



class School(db.Model):
    __tablename__ = "schools"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True,  unique=True)
    email = db.Column(db.String(), nullable=False, )
    password = db.Column(db.String(), nullable=False)
    profile = relationship('SchoolProfile', back_populates='school', uselist=False, cascade='all, delete-orphan')

    job_postings = relationship('JobPosting', backref='school', cascade='all, delete-orphan')


    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    def save(self):
        db.session.add(self)
        db.session.commit()
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    def get_user_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)



# class SchoolProfile(db.Model):
#     __tablename__ = "schoolprofiles"
#     id = db.Column(db.Integer(), primary_key=True, autoincrement=True,  unique=True)
#     school_id = db.Column(Integer, db.ForeignKey('schools.id'), nullable=False, unique=True)
#     name = db.Column(db.String(), nullable=True)
#     city = db.Column(db.String(), nullable=True)
#     state = db.Column(db.String(), nullable=True)
#     latitude = db.Column(db.Float(), nullable=True)
#     longitude = db.Column(db.Float(), nullable=True)
#     school = relationship('School', back_populates='profile')


class SchoolProfile(db.Model):
    __tablename__ = "schoolprofiles"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False, unique=True)
    name = db.Column(db.String(), nullable=False)
    city = db.Column(db.String(), nullable=False)
    state = db.Column(db.String(), nullable=False)
    latitude = db.Column(db.Float(), nullable=True)
    longitude = db.Column(db.Float(), nullable=True)
    school_type = db.Column(db.String(), nullable=True)  
    grades_served = db.Column(db.String(), nullable=True)
    num_enrolled_students = db.Column(db.Integer, nullable=True)
    year_established = db.Column(db.Integer, nullable=True)
    affiliations = db.Column(db.String(), nullable=True)
    avg_class_size = db.Column(db.Integer, nullable=True)
    student_teacher_ratio = db.Column(db.String(), nullable=True)
    mission_statement = db.Column(db.String(), nullable=True)
    curriculum = db.Column(db.String(), nullable=True)
    test_scores = db.Column(db.String(), nullable=True)
    tuition = db.Column(db.String(), nullable=True)
    hiring_needs = db.Column(db.String(), nullable=True)
    photos = db.Column(ARRAY(db.String), nullable=True)  # Using ARRAY to store multiple URLs or file paths
    physical_address = db.Column(db.String(), nullable=True)

    school = relationship('School', back_populates='profile')
    @classmethod
    def get_user_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    @classmethod

    def get_by_school_id(cls, school_id):
        return cls.query.filter_by(school_id=school_id).first()
        
    @classmethod
    def search_by_name(cls, search_string):
        return cls.query.filter(cls.name.ilike(f"%{search_string}%")).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<SchoolProfile{self.id}>"




class JobPosting(db.Model):
    __tablename__ = "jobpostings"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)

    school_id = db.Column(db.Integer(), db.ForeignKey('schools.id', ondelete='CASCADE'), nullable=False,  unique=False)

    job_info = relationship('JobInfo', backref='job_posting', uselist=False, cascade='all, delete-orphan')

    questions = db.relationship('Question', backref='job_posting', lazy=True,  cascade='all, delete-orphan')

    applications = db.relationship('Application', backref='job_posting', lazy=True,  cascade='all, delete-orphan')

    num_applicants = db.Column(db.Integer, default=0, nullable=False)
    
    closed = db.Column(db.String(), nullable=True, default = "open")

    latitude = db.Column(db.Float(), nullable=True)
    longitude = db.Column(db.Float(), nullable=True)
    salary_est = db.Column(db.Integer(), nullable=True)



    @classmethod
    def filter_by_location(cls, latitude, longitude, radius_km):
        # distance_expression = func.earth_distance(
        #     func.ll_to_earth(latitude, longitude),
        #     func.ll_to_earth(SchoolProfile.latitude, SchoolProfile.longitude)
        # ).label('distance')

        query = db.session.query(cls).join(School, JobPosting.school_id == School.id).join(SchoolProfile)
        # print("hello")
        # print("hello2")

        # print("hello2")
        # print("hello2")

        query = query.filter(JobPosting.latitude > float(latitude) - radius_km)
        query = query.filter(JobPosting.latitude < float(latitude) + radius_km)
        query = query.filter(JobPosting.longitude > float(longitude) - radius_km)
        query = query.filter(JobPosting.longitude < float(longitude) + radius_km) #(JobPosting.latitude > float(latitude) - radius_km and JobPosting.latitude < float(latitude) + radius_km and JobPosting.longitude > float(longitude) - radius_km and JobPosting.longitude < float(longitude) + radius_km)
        query = query.filter(JobPosting.closed == "open")

        return query.all()

    @classmethod
    def filter_by_salary(cls, salary, amplitude):
        # distance_expression = func.earth_distance(
        #     func.ll_to_earth(latitude, longitude),
        #     func.ll_to_earth(SchoolProfile.latitude, SchoolProfile.longitude)
        # ).label('distance')

        query = db.session.query(cls).join(JobInfo, JobPosting.id == JobInfo.jobposting_id)


        query = query.filter(JobInfo.salary_est > float(salary) - amplitude, JobInfo.salary_est < float(salary) + amplitude, )
        query = query.filter(JobPosting.closed == "open")
        return query.all()
    
    @classmethod
    def filter_by_title(cls, title):
        # distance_expression = func.earth_distance(
        #     func.ll_to_earth(latitude, longitude),
        #     func.ll_to_earth(SchoolProfile.latitude, SchoolProfile.longitude)
        # ).label('distance')

        query = db.session.query(cls).join(JobInfo, JobPosting.id == JobInfo.jobposting_id)


        query = query.filter(JobInfo.title.ilike(f"%{title}%"), JobPosting.closed == "open")
        query = query.filter(JobPosting.closed == "open")
        return query.all()

 

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def inc_applicants(cls, id):
        job_posting = cls.query.get(id)
        job_posting.num_applicants += 1
        db.session.commit()

    @classmethod
    def get_by_school_id(cls, school_id):
        return cls.query.filter_by(school_id=school_id).all()

    @classmethod
    def get_all_open(cls):
        return cls.query.filter_by(closed="open").all()


    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 


class JobInfo(db.Model):
    __tablename__ = "jobinfos"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)
    jobposting_id = db.Column(db.Integer(), db.ForeignKey('jobpostings.id'), nullable=False, unique=True)

    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=True)
    salary_est = db.Column(db.Float(), nullable=True)
    city = db.Column(db.String(), nullable=True)
    state = db.Column(db.String(), nullable=True)


    post_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    start_date = db.Column(db.String(), nullable=True)
    interview_length = db.Column(db.Integer(), nullable=True)


    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()


    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 

class Question(db.Model):
    __tablename__ = "questions"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    jobposting_id = db.Column(db.Integer(), ForeignKey("jobpostings.id", ondelete='CASCADE'), nullable=False)
    content = db.Column(db.String(), nullable=False)
    type = db.Column(db.String(), nullable=False)
    answers = db.relationship('Answer', backref='question', lazy=True,  cascade='all, delete-orphan')

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_by_posting_id(cls, posting_id):
        return cls.query.filter_by(jobposting_id=posting_id).all()

    def save(self):
        db.session.add(self)
        db.session.commit()
    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Answer(db.Model):
    __tablename__ = "answers"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)   
    application_id = db.Column(db.Integer(), ForeignKey("applications.id", ondelete='CASCADE'), nullable=False)   
    question_id = db.Column(db.Integer(), ForeignKey("questions.id", ondelete='CASCADE'), nullable=False)
    teacher_id = db.Column(db.Integer(), ForeignKey("teachers.id", ondelete='CASCADE'), nullable=False)
    answer_field= db.Column(db.String(), nullable= False)
    score= db.Column(db.Integer(), nullable=True, default=0)


    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_by_application_id(cls, application_id):
        return cls.query.filter_by(application_id=application_id).all()

    @classmethod
    def get_by_question_id(cls, question_id):
        return cls.query.filter_by(question_id=question_id).all()
    
    @classmethod
    def check_duplicate(cls, teacher_id, question_id):
        return cls.query.filter_by(teacher_id=teacher_id, question_id=question_id).first()
    
    @classmethod
    def get_answers_and_applications_by_question_id(cls, question_id):
        query = db.session.query(Answer, Application).join(Application, Answer.application_id == Application.id)
        query = query.filter(Answer.question_id == question_id)
        return query.all()


    @classmethod
    def get_by_application_id_with_refactor(cls, application_id):
        query = db.session.query(Answer, Question, TeacherProfile).join(Question, Answer.question_id == Question.id).join(TeacherProfile, Answer.teacher_id == TeacherProfile.teacher_id)
        query = query.filter(Answer.application_id == application_id)
        return query.all()  
      
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 

class Rubric(db.Model):
    __tablename__ = "rubrics"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)
    question_id = db.Column(db.Integer(), ForeignKey("questions.id", ondelete='CASCADE'), nullable=False)

    criteria = db.Column(db.String(), nullable= False)
    score= db.Column(db.Integer(), nullable= True)
    
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_question_id(cls, question_id):
        return cls.query.filter_by(question_id=question_id).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 

class Score(db.Model):
    __tablename__ = "scores"
    id = db.Column(db.Integer, primary_key=True)
    rubric_id  = db.Column(db.Integer, db.ForeignKey('rubrics.id', ondelete='CASCADE'), nullable=False)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id', ondelete='CASCADE'), nullable=False)
    points = db.Column(db.Integer, nullable=False)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_rubric_id(cls, rubric_id):
        return cls.query.filter_by(rubric_id=rubric_id).all()
    
    @classmethod
    def get_by_answer_id(cls, answer_id):
        return cls.query.filter_by(answer_id=answer_id).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey('answers.id', ondelete='CASCADE'), nullable=False)
    comment = db.Column(db.String, nullable=False)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_answer_id(cls, answer_id):
        return cls.query.filter_by(answer_id=answer_id).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 


class Application(db.Model):
    __tablename__ = "applications"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)   
    email = db.Column(db.String(), nullable=True)

    teacher_id = db.Column(db.Integer(), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    jobposting_id =  db.Column(db.Integer(), ForeignKey("jobpostings.id", ondelete="CASCADE"), nullable=False)   

    first_name = db.Column(db.String(), nullable=True)
    last_name = db.Column(db.String(), nullable=True)
    current_school = db.Column(db.String(), nullable=True)
    education = db.Column(db.String(), nullable=True)
    subjects_taught = db.Column(db.String(), nullable=True)
    current_state = db.Column(db.String(), nullable=True)
    grades_taught = db.Column(db.String(), nullable=True)
    years_of_experience = db.Column(db.String(), nullable=True)
    past_jobs = db.Column(db.String(), nullable=True)
    accolades = db.Column(db.String(), nullable=True)
    accommodations = db.Column(db.String(), nullable=True)
    avatar = db.Column(db.LargeBinary(), nullable=True)
    score = db.Column(db.Integer(), nullable=True, default = 0)
    totalScore = db.Column(db.Integer(), nullable=True, default = 0)
    rubricWanted = db.Column(db.String(), nullable=True)    
    app_status = db.Column(db.String(), nullable=False, default="submitted")
    comment = db.Column(db.String(), nullable=True)


    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    

    @classmethod
    def get_by_teacher(cls, teacher_id, app_status):
        return cls.query.filter_by(teacher_id=teacher_id, app_status=app_status).all()
    
    @classmethod
    def get_by_teacher_and_posting(cls, teacher_id, jobposting_id):
        return cls.query.filter_by(teacher_id=teacher_id, jobposting_id=jobposting_id).first()
    

    @classmethod
    def get_by_teacher_with_posting(cls, teacher_id, app_status):
        query = db.session.query(Application, JobPosting,JobInfo, SchoolProfile).join(JobPosting, Application.jobposting_id == JobPosting.id).join(JobInfo, JobPosting.id == JobInfo.jobposting_id).join(SchoolProfile, JobPosting.school_id == SchoolProfile.school_id)
        query = query.filter(Application.teacher_id == teacher_id, Application.app_status == app_status)
        query.order_by(Application.score.desc())
        return query.all()

    @classmethod
    def check_duplicate(cls, teacher_id, jobposting_id):
        return cls.query.filter_by(teacher_id=teacher_id, jobposting_id=jobposting_id).first()
    
    @classmethod
    def get_by_posting(cls, jobposting_id, app_status):
        return cls.query.filter_by(jobposting_id=jobposting_id, app_status=app_status).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

# Define an association table for the many-to-many relationship
# application_cart_job_postings = db.Table('application_cart_job_postings',
#     db.Column('application_cart_id', db.Integer, db.ForeignKey('application_cart.id')),
#     db.Column('job_posting_id', db.Integer, db.ForeignKey('jobpostings.id'))
# )

# class ApplicationCart(db.Model):
#     __tablename__ = "application_cart"
#     id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)
#     teacher_id = db.Column(db.Integer(), db.ForeignKey('teachers.id'), nullable=True, unique=False)   
#     job_postings = db.relationship('JobPosting', secondary=application_cart_job_postings, backref='application_carts')
    # need to write api's for schools to create availability objects
    # need to write api's for school to modify availability objects, potentially merge them
    # need to write api's for schools to delete availability objects
    # schools can cancel interviews if they want 
class SchoolAvailability(db.Model):
    __tablename__ = "school_availabilities"
    id = db.Column(db.Integer, primary_key=True)
    school_id = db.Column(db.Integer(), ForeignKey('schools.id'), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    start_time = db.Column(db.Time(), nullable=False)
    end_time = db.Column(db.Time(), nullable=False)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_school(cls, school_id):
        return cls.query.filter_by(school_id=school_id).order_by(cls.date, cls.start_time).all()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


# need to write api's for teachers to create interview objects
# can cancel / pick other times
class TeacherInterview(db.Model):
    __tablename__ = "teacher_interviews"
    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer(), ForeignKey('teachers.id'), nullable=False)
    school_id = db.Column(db.Integer(), ForeignKey('schools.id'), nullable=False)
    date = db.Column(db.Date(), nullable=False)
    start_time = db.Column(db.Time(), nullable=False)
    end_time = db.Column(db.Time(), nullable=False)
    posting_id = db.Column(db.Integer(), ForeignKey('jobpostings.id'), nullable=False)
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_teacher_and_postingid(cls, teacher_id, posting_id):
        return cls.query.filter_by(teacher_id=teacher_id, posting_id=posting_id).first()
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


# Define an association table for the many-to-many relationship
application_cart_job_postings = db.Table('application_cart_job_postings',
    db.Column('application_cart_id', db.Integer, db.ForeignKey('application_cart.id')),
    db.Column('job_posting_id', db.Integer, db.ForeignKey('jobpostings.id'))
)

class ApplicationCart(db.Model):
    __tablename__ = "application_cart"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, unique=True)
    teacher_id = db.Column(db.Integer(), db.ForeignKey('teachers.id'), nullable=True, unique=False)   
    job_postings = db.relationship('JobPosting', secondary=application_cart_job_postings, backref='application_carts')

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_teacher_id(cls, teacher_id):
        return cls.query.filter_by(teacher_id=teacher_id).first()

    def save(self):
        db.session.add(self)
        db.session.commit()


class TokenBlocklist(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    jti = db.Column(db.String(), nullable=True)
    create_at = db.Column(db.DateTime(), default=datetime.utcnow)

    def __repr__(self):
        return f"<Token {self.jti}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
