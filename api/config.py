import os
from dotenv import load_dotenv

# Load the .env file in the same directory
load_dotenv()

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')
    FLASK_SQLALCHEMY_ECHO=True
    OPENAI_API_KEY=os.getenv('OPENAI_API_KEY')
    PUSHER_APP_ID=os.getenv('PUSHER_APP_ID')
    PUSHER_KEY=os.getenv('PUSHER_KEY')
    PUSHER_SECRET=os.getenv('PUSHER_SECRET')
    PUSHER_CLUSTER=os.getenv('PUSHER_CLUSTER')