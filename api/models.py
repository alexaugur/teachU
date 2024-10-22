from extensions import db
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Integer
from sqlalchemy.dialects.postgresql import ARRAY

from sqlalchemy import ForeignKey

import uuid

# def generate_uuid():
#     return uuid4()
    

class User(db.Model):
    __tablename__ = "users"
    # id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # id = db.Column(db.String(), primary_key=True, default=str(uuid.uuid4))
    id = db.Column(Integer, primary_key=True, autoincrement=True)    
    username = db.Column(db.String(), nullable=True, primary_key=True)
    email = db.Column(db.String(), nullable=True)
    password = db.Column(db.Text())

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()




class Teacher(db.Model):
    __tablename__ = "teachers"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)    
    username = db.Column(db.String(), nullable=True, primary_key=True)
    email = db.Column(db.String(), nullable=True)
    password = db.Column(db.String(), nullable=True)
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

    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()
    
    def save(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Teacher{self.username}>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Application(db.Model):
    __tablename__ = "applications"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)   
    teacher_id = db.Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=True, unique=True)   
    posting_id =  db.Column(Integer, ForeignKey("postings.id", ondelete="CASCADE"), nullable=True)   
    question_id = ARRAY(db.Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=True))
    answer_id = ARRAY(db.Column(Integer, ForeignKey("answers.id"), nullable=True) )
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_teacher(cls, teacher_id):
        return cls.query.filter_by(teacher_id=teacher_id).all()
    def save(self):
        db.session.add(self)
        db.session.commit()
    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Answer(db.Model):
    __tablename__ = "answers"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)   
    application_id = db.Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=True)   
    teacher_id =  db.Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=True)   
    answer_field = db.Column(Integer, ForeignKey("answers.id", ondelete="CASCADE"), nullable=True)
    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_application_id(cls, application_id):
        return cls.query.filter_by(application_id=application_id).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_existing(self):
        # db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit() 

class School(db.Model):
    __tablename__ = "schools"
    id = db.Column(db.Integer(), primary_key=True, autoincrement=True,  unique=True)
    name = db.Column(db.String(), nullable=True)
    city = db.Column(db.String(), nullable=True)
    state = db.Column(db.String(), nullable=True)
    email = db.Column(db.String(), nullable=True)
    username = db.Column(db.String(), nullable=True, )
    password = db.Column(db.String(), nullable=True)

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
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)



class Posting(db.Model):
    __tablename__ = "postings"
    id = db.Column(Integer, primary_key=True, autoincrement=True, unique=True)
    title = db.Column(db.String(), nullable=True)
    experience = db.Column(db.String(), nullable=True)
    city = db.Column(db.String(), nullable=True)
    state = db.Column(db.String(), nullable=True)

    salary_est = db.Column(db.String(), nullable=True)
    start_date = db.Column(db.String(), nullable=True)
    # experience = db.Column(db.String(), nullable=True)

    # question_id = db.Column(ARRAY(db.Integer, ForeignKey("questions.id", ondelete="CASCADE")), nullable=True)
    school_id = db.Column(db.Integer, ForeignKey("schools.id", ondelete="CASCADE"), nullable=True)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_school_id(cls, school_id):
        return cls.query.filter_by(school_id=school_id).all()
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
    title = db.Column(db.String(), nullable=True)
    content = db.Column(db.String(), nullable=True)
    type = db.Column(db.String(), nullable=True)
    posting_id = db.Column(Integer, ForeignKey("postings.id", ondelete="CASCADE"), nullable=True)


    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
    
    @classmethod
    def get_by_posting_id(cls, posting_id):
        return cls.query.filter_by(posting_id=posting_id).all()
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    def delete(self):
        db.session.delete(self)
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