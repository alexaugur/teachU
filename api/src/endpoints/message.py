from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Message, Teacher  # Make sure Teacher is appropriately defined or imported
from ..extensions import socketio

from flask_socketio import join_room, leave_room, emit

messages_bp = Blueprint('messages', __name__)

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
    
    emit('new_message', {'content': content, 'sender_id': sender_id}, room=str(recipient_id))
    return jsonify({'message': 'Message sent successfully', 'message_id': message.id}), 201

@socketio.on('join')
def on_join(data):
    join_room(data['room'])
    emit('status', {'msg': f'User {data["room"]} has joined the room.'}, room=data['room'])

@socketio.on('leave')
def on_leave(data):
    leave_room(data['room'])
    emit('status', {'msg': f'User {data["room"]} has left the room.'}, room=data['room'])

@messages_bp.route('/history', methods=['GET'])
@jwt_required()
def get_message_history():
    user_id = get_jwt_identity()
    messages = Message.query.filter((Message.sender_id == user_id) | (Message.recipient_id == user_id)).all()
    results = [{'id': m.id, 'content': m.content, 'sender_id': m.sender_id, 'recipient_id': m.recipient_id} for m in messages]
    return jsonify(results), 200

@messages_bp.route('/read/<int:message_id>', methods=['POST'])
@jwt_required()
def mark_as_read(message_id):
    user_id = get_jwt_identity()
    message = Message.query.filter_by(id=message_id, recipient_id=user_id).first()
    if message:
        message.read_at = db.func.now()
        db.session.commit()
        return jsonify({'message': 'Message marked as read'}), 200
    return jsonify({'error': 'Message not found'}), 404

'''
@messages_bp.route('/archive/<int:message_id>', methods=['POST'])
@jwt_required()
def archive_message(message_id):
    user_id = get_jwt_identity()
    message = Message.query.filter_by(id=message_id, recipient_id=user_id).first()
    if message:
        message.archived = True
        db.session.commit()
        return jsonify({'message': 'Message archived successfully'}), 200
    return jsonify({'error': 'Message not found'}), 404
'''