from flask import Blueprint, request, jsonify
from ..models import ApplicationCart, Application, TokenBlocklist, Teacher, TeacherProfile, Answer, School, Question, JobPosting
from ..schemas import ApplicationCartSchema
from ..extensions import db

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)

applicationcart_bp = Blueprint('application_cart', __name__)


# @applicationcart_bp.route('', methods=['POST'])
# def create_application_cart():
#     data = request.get_json()
#     cart_schema = ApplicationCartSchema()
#     new_cart_data = cart_schema.load(data)

#     # Look up instances of related classes
#     related_class_instances = [JobPosting.query.get(jp['id']) for jp in new_cart_data['job_postings']]
#     if None in related_class_instances:
#         return jsonify({'message': 'One or more JobPostings not found'}), 404

#     new_cart_data['job_postings'] = related_class_instances

#     new_cart = ApplicationCart(**new_cart_data)
#     db.session.add(new_cart)
#     db.session.commit()
#     # return cart_schema.jsonify(new_cart), 201
#     return jsonify(cart_schema.dump(new_cart)), 201

@applicationcart_bp.route('/teacher', methods=['GET'])
@jwt_required()
def get_application_cart_by_teacher():
    teacher_id = get_jwt_identity()
    # teacher_id = request.args.get('teacher_id')
    # if teacher_id is None:
    #     return jsonify({'message': 'No teacher_id provided'}), 400
    # # Convert teacher_id to integer
    # try:
    #     teacher_id = int(teacher_id)
    # except ValueError:
    #     return jsonify({'message': 'Invalid teacher_id'}), 400

    teacher = Teacher.query.get(teacher_id)
    if teacher is None:
        return jsonify({'message': 'Teacher not found'}), 403

    cart = ApplicationCart.query.filter_by(teacher_id=teacher_id).first()
    if cart is None:
        return jsonify({'message': 'Cart not found'}), 404

    cart_schema = ApplicationCartSchema()
    return jsonify(cart_schema.dump(cart)), 200

# @applicationcart_bp.route('/<application_cart_id>', methods=['PUT'])
# def update_application_cart(application_cart_id):
#     data = request.get_json()
#     cart = ApplicationCart.query.get(application_cart_id)
#     if cart is None:
#         return jsonify({'message': 'Cart not found'}), 404

#     # Check if teacher_id is in the request data
#     if 'teacher_id' in data:
#         teacher_id = data['teacher_id']
#         # Validate teacher_id
#         teacher = Teacher.query.get(teacher_id)
#         if teacher is None:
#             return jsonify({'message': 'Teacher not found'}), 404
#         # Update the teacher_id of the cart
#         cart.teacher_id = teacher_id

#     # Check if job_postings is in the request data
#     if 'job_postings' in data:
#         job_posting_ids = [jp['id'] for jp in data['job_postings']]
#         # Validate job_posting_ids
#         job_postings = JobPosting.query.filter(JobPosting.id.in_(job_posting_ids)).all()
#         if len(job_postings) != len(job_posting_ids):
#             return jsonify({'message': 'One or more Job postings not found'}), 404
#         # Update the job postings of the cart
#         cart.job_postings = job_postings

#     db.session.commit()
#     cart_schema = ApplicationCartSchema()
#     return jsonify(cart_schema.dump(cart))

@applicationcart_bp.route('/', methods=['PUT'])
@jwt_required()
def update_application_cart():
    data = request.get_json()
    teacher_id = get_jwt_identity()
    teacher = Teacher.query.get(teacher_id)
    if teacher is None:
        return jsonify({'message': 'Teacher not found'}), 404
    
    cart = ApplicationCart.query.filter_by(teacher_id=teacher_id).first()
    if cart is None:
        return jsonify({'message': 'Cart not found'}), 404

    # # Update teacher_id if provided
    # if 'teacher_id' in data:
    #     teacher_id = data['teacher_id']
    #     teacher = Teacher.query.get(teacher_id)
    #     if teacher is None:
    #         return jsonify({'message': 'Teacher not found'}), 404
    #     cart.teacher_id = teacher_id

    # Handle job postings: replace, add, or clear
    if 'job_postings' in data:
        job_posting_ids = [jp['id'] for jp in data['job_postings']]
        if not job_posting_ids:  # Check if the list is empty
            cart.job_postings = []  # Clear job postings
        else:
            job_postings = JobPosting.query.filter(JobPosting.id.in_(job_posting_ids)).all()
            if len(job_postings) != len(job_posting_ids):
                return jsonify({'message': 'One or more Job postings not found'}), 404
            cart.job_postings = job_postings

    # Add a single job posting if provided
    if 'add_job_posting_id' in data:
        job_posting_id = data['add_job_posting_id']
        job_posting = JobPosting.query.get(job_posting_id)
        if job_posting is None:
            return jsonify({'message': 'Job posting not found'}), 404
        if job_posting not in cart.job_postings:
            cart.job_postings.append(job_posting)

    db.session.commit()
    cart_schema = ApplicationCartSchema()
    return jsonify(cart_schema.dump(cart))


@applicationcart_bp.route('/<application_cart_id>', methods=['DELETE'])
def delete_application_cart(id):
    cart = ApplicationCart.get_by_id(id)
    if cart is None:
        return jsonify({'message': 'Cart not found'}), 404
    db.session.delete(cart)
    db.session.commit()
    return jsonify({'message': 'Cart deleted'})