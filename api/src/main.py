from flask import Flask, jsonify, Blueprint, request
from .extensions import db, jwt
#from .endpoints.users import user_bp
from .endpoints.teacher import teachers_bp
from .endpoints.schools import schools_bp
from .endpoints.applications import applications_bp
from .endpoints.answer import answers_bp
from .endpoints.question import questions_bp
from .endpoints.posting import postings_bp
from .endpoints.rubric import rubrics_bp
from .endpoints.interviews import interview_bp, availability_bp

from .models import TokenBlocklist, Teacher, School, Message, TeacherProfile, SchoolProfile
from flask_cors import CORS, cross_origin
from .endpoints.teacherprofile import teacherprofile_bp
from flask_migrate import Migrate 
from .endpoints.schoolprofile import schoolprofile_bp
from .endpoints.applicationcart import applicationcart_bp
from datetime import timedelta
from flask_socketio import SocketIO, join_room, leave_room, emit
import datetime
import pusher
import os
from flask_jwt_extended import jwt_required, get_jwt_identity

# from models import db, Message, Teacher 
from .schemas import MessageSchema, TeacherProfileSchema, SchoolProfileSchema


def create_app(config_object=None):
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:

        app.config.from_prefixed_env()

    # initialize exts
    db.init_app(app)
    jwt.init_app(app)

    Migrate(app, db) 
    socketio = SocketIO(app, cors_allowed_origins="*")

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)


    pusher_client = pusher.Pusher(
    app_id=os.environ.get('PUSHER_APP_ID', "1799788"),
    key=os.environ.get('PUSHER_KEY', ""), #os.environ['PUSHER_KEY'],
    secret=os.environ.get('PUSHER_SECRET', ""), #os.environ['PUSHER_SECRET'],
    cluster=os.environ.get('PUSHER_CLUSTER', ""), #os.environ['PUSHER_CLUSTER'],
    ssl=True
    )

    with app.app_context():
        from .models import (
            Message, Teacher, TeacherProfile, School, SchoolProfile, JobPosting,
            JobInfo, Question, Answer, Rubric, Score, Comment, Application,
            SchoolAvailability, TeacherInterview, ApplicationCart, TokenBlocklist
        )
        db.create_all()



    # register bluepints
    app.register_blueprint(schoolprofile_bp, url_prefix="/schoolprofiles")
    app.register_blueprint(teacherprofile_bp, url_prefix="/teacherprofiles")
    app.register_blueprint(teachers_bp, url_prefix="/teachers")
    app.register_blueprint(schools_bp, url_prefix="/schools")
    app.register_blueprint(applications_bp, url_prefix="/applications")
    app.register_blueprint(answers_bp, url_prefix="/answers")
    app.register_blueprint(questions_bp, url_prefix="/postings")
    app.register_blueprint(postings_bp, url_prefix="/postings")
    app.register_blueprint(rubrics_bp, url_prefix="/rubrics")
    app.register_blueprint(applicationcart_bp, url_prefix="/application_cart")
    app.register_blueprint(interview_bp, url_prefix="/interviews")
    app.register_blueprint(availability_bp, url_prefix="/availabilities")
    # app.register_blueprint(messages_bp, url_prefix="/messages")

    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=1)



    messages_bp = Blueprint('messages', __name__)


    #gets list of all existing messages right now
    @messages_bp.route('messages_school/<school_id>/<teacher_id>', methods=['GET'])
    @jwt_required()
    def get_messages_school(school_id, teacher_id):
        this_school_id = get_jwt_identity()
        school = School.query.get(this_school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        if school.id != this_school_id:
            return jsonify({"message": "cannot access this conversation"}), 404
        messages = Message.query.filter_by(school_id=school_id, teacher_id=teacher_id).order_by(Message.timestamp).all()
        result = MessageSchema().dump(messages, many=True)
        return (
                jsonify(
                    {
                        "messages": result
                    }
                ),
                200,
            )
    
    @messages_bp.route('create/teacher/<school_id>', methods=['POST'])
    @jwt_required()
    def send_first_message(school_id):
        teacher_id = get_jwt_identity()
        teacher = Teacher.query.get(teacher_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        school = School.query.get(school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        message = Message(content="Hi there!", teacher_id=teacher_id, school_id=school_id, sender_type="teacher", real_message=False )
        message.save()

        return (
                jsonify(
                    {
                        "messages": "Success"
                    }
                ),
                200,
            )
    
    @messages_bp.route('send/teacher/<school_id>', methods=['POST'])
    @jwt_required()
    def send_message_as_teacher(school_id):
        teacher_id = get_jwt_identity()
        teacher = Teacher.query.get(teacher_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        school = School.query.get(school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        data = request.get_json()
        content = data.get("content", "")
        message = Message(content=content, teacher_id=teacher_id, school_id=school_id, sender_type="teacher", real_message=False )
        message.save()
        room = str(school_id) + "-" + str(teacher_id)

        pusher_client.trigger(room, 'receive_message', {
            'content': content,
            'teacher_id': teacher_id,
            'school_id': school_id,
            'sender_type': "teacher",
            'real_message': True
        })

        # socketio.emit('receive_message', {
        #     'content': content,
        #     'teacher_id': teacher_id,
        #     'school_id': school_id,
        #     'sender_type': "teacher",
        #     'real_message': True
        # }, room=room)
        return (
                jsonify(
                    {
                        "messages": "Success"
                    }
                ),
                200,
            )
    
    
    @messages_bp.route('create/school/<teacher_id>', methods=['POST'])
    @jwt_required()
    def send_first_message_as_school(teacher_id):
        school_id = get_jwt_identity()
        school = School.query.get(school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        teacher = Teacher.query.get(teacher_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        
        message = Message(content="Hi there!", teacher_id=teacher_id, school_id=school_id, sender_type="school", real_message=False )
        message.save()
        return (
                jsonify(
                    {
                        "messages": "Success"
                    }
                ),
                200,
            )
    

    @messages_bp.route('send/school/<teacher_id>', methods=['POST'])
    @jwt_required()
    def send_message_as_school(teacher_id):
        school_id = get_jwt_identity()
        school = School.query.get(school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        teacher = Teacher.query.get(teacher_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        data = request.get_json()
        content = data.get("content", "")
        message = Message(content=content, teacher_id=teacher_id, school_id=school_id, sender_type="school", real_message=False )
        message.save()
        room = str(school_id) + "-" + str(teacher_id)

        pusher_client.trigger(room, 'receive_message', {
            'content': content,
            'teacher_id': teacher_id,
            'school_id': school_id,
            'sender_type': "school",
            'real_message': True
        })

        # socketio.emit('receive_message', {
        #     'content': content,
        #     'teacher_id': teacher_id,
        #     'school_id': school_id,
        #     'sender_type': "school",
        #     'real_message': True
        # }, room=room)
        return (
                jsonify(
                    {
                        "messages": "Success"
                    }
                ),
                200,
            )
    
    
    
    
    @messages_bp.route('messages_teacher/<school_id>/<teacher_id>', methods=['GET'])
    @jwt_required()
    def get_messages(school_id, teacher_id):
        teach_id = get_jwt_identity()
        teacher = Teacher.query.get(teach_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        if teacher.id != teach_id:
            return jsonify({"message": "cannot access this conversation"}), 404
        messages = Message.query.filter_by(school_id=school_id, teacher_id=teacher_id).order_by(Message.timestamp).all()
        result = MessageSchema().dump(messages, many=True)
        return (
                jsonify(
                    {
                        "messages": result
                    }
                ),
                200,
            )

    #gets a list of all schools that we are communicating with
    @messages_bp.route('/schools', methods=['GET'])
    @jwt_required()
    def get_teachers_by_school():
        school_id = get_jwt_identity()
        school = School.query.get(school_id)
        if school is None:
            return jsonify({"message": "school not found attached to user"}), 404
        teachers = TeacherProfile.query.join(Message, TeacherProfile.teacher_id== Message.teacher_id).filter(Message.school_id == school_id).distinct().all()
        result = TeacherProfileSchema().dump(teachers, many=True)
        return (
                jsonify(
                    {
                        "teachers": result
                    }
                ),
                200,
            )
    
    #Gets a list of teachers we are communicating with
    @messages_bp.route('/teachers', methods=['GET'])
    @jwt_required()
    def get_schools_by_teacher():
        teacher_id = get_jwt_identity()
        teacher = Teacher.query.get(teacher_id)
        if teacher is None:
            return jsonify({"message": "teacher not found attached to user"}), 404
        schools = SchoolProfile.query.join(Message, SchoolProfile.school_id == Message.school_id).filter(Message.teacher_id == teacher_id).distinct().all()
        print(schools)
        result = SchoolProfileSchema().dump(schools, many=True)
        return (
                jsonify(
                    {
                        "schools": result
                    }
                ),
                200,
            )

    @messages_bp.route('/send', methods=['POST'])
    @jwt_required()
    def send_message():
        sender_id = get_jwt_identity()
        recipient_id = request.json.get('recipient_id')
        content = request.json.get('content')
        
        if not content or not recipient_id:
            return jsonify({'message': 'Content and recipient are required'}), 400
        
        message = Message(content=content, sender_id=sender_id, recipient_id=recipient_id)
        db.session.add(message)
        db.session.commit()
        
        pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})
        socketio.emit('new_message', {'content': content, 'sender_id': sender_id}, room=str(recipient_id))
        return jsonify({'message': 'Message sent successfully', 'message_id': message.id}), 201

    # room is of the format "school_id"-"teacher_id"
    # call join to join the room
    @socketio.on('join')
    def on_join(data):
        join_room(data['room'])
        emit('status', {'msg': f'User {data["room"]} has joined the room.'}, room=data['room'])


    @socketio.on('leave')
    def on_leave(data):
        leave_room(data['room'])
        socketio.emit('status', {'msg': f'User {data["room"]} has left the room.'}, room=data['room'])

    #call store_message for one client to send a message to the server

    # this socketio message receives the message in the server, stores it in database, and then emits it, this shouldn't be used anymore?
    @socketio.on('store_message')
    def store_message(data):
        message = Message(content=data['content'], teacher_id=data['teacher_id'], school_id=data['school_id'], sender_type = data['sender_type'], real_message = data['real_message'])
        message.save()
        socketio.emit('receive_message', {
            'content': data['content'],
            'teacher_id': data['teacher_id'],
            'school_id': data['school_id'],
            'sender_type': data['sender_type'],
            'real_message': data['real_message']
        }, room=data['room'])


        # socketio.emit('status', {'msg': f'User {data["room"]} has left the room.'}, room=data['room'])

    #then server emits a message to all clients in the room, after storing the message in the database

    #call receive_message for server to send to all clients in return 


    # all messages should contain room info to send the message to




    # @messages_bp.route('/history', methods=['GET'])
    # @jwt_required()
    # def get_message_history():
    #     user_id = get_jwt_identity()
    #     messages = Message.query.filter((Message.sender_id == user_id) | (Message.recipient_id == user_id)).all()
    #     results = [{'id': m.id, 'content': m.content, 'sender_id': m.sender_id, 'recipient_id': m.recipient_id} for m in messages]
    #     return jsonify(results), 200


    # @messages_bp.route('/read/<int:message_id>', methods=['POST'])
    # @jwt_required()
    # def mark_as_read(message_id):
    #     user_id = get_jwt_identity()
    #     message = Message.query.filter_by(id=message_id, recipient_id=user_id).first()
    #     if message:
    #         message.read_at = db.func.now()
    #         db.session.commit()
    #         return jsonify({'message': 'Message marked as read'}), 200
    #     return jsonify({'error': 'Message not found'}), 404
    
    app.register_blueprint(messages_bp, url_prefix="/messages")

    # load user
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_headers, jwt_data):
        identity = jwt_data["sub"]
        user_type = jwt_data["user_type"]  # Assuming you've included this claim
        if user_type == "teacher":
            return Teacher.query.filter_by(id=identity).one_or_none()
        elif user_type == "school":
            return School.query.filter_by(id=identity).one_or_none()

    # additional claims

    @jwt.additional_claims_loader
    def make_additional_claims(identity):
        if identity == "janedoe123":
            return {"is_staff": True}
        return {"is_staff": False}

    # jwt error handlers

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Signature verification failed", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "message": "Request doesnt contain valid token",
                    "error": "authorization_header",
                }
            ),
            401,
        )
    
    @jwt.token_in_blocklist_loader
    def token_in_blocklist_callback(jwt_header,jwt_data):
        jti = jwt_data['jti']

        token = db.session.query(TokenBlocklist).filter(TokenBlocklist.jti == jti).scalar()

        return token is not None

    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')


    return app
