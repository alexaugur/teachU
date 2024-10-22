import pytest
from ..src.main import create_app
from ..src.extensions import db 
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from ..config import TestConfig  # Assuming you have a separate config class for testing
from ..src.models import * 
from sqlalchemy import text
import os
from dotenv import load_dotenv

# Load environmental variables from .env file
load_dotenv()

'''
sqlalchemy and sqlite

creates database inside memory not in the file system
db = sqlite://
'''

'''
scope='function': The fixture is run once per test function.
scope='class': The fixture is run once per test class.
scope='module': The fixture is run once per module, i.e., for every test file.
scope='session': The fixture is run


'''
ORDERED_FILES = [
    "test_schoolauth.py",
    "test_teacherauth.py",
    "test_postings.py",
    "test_questions.py",
    "test_schoolprofile.py",
    "test_teacherprofile.py",
    "test_application.py",
    "test_answer.py"
]

@pytest.fixture(scope='session')
def app():

    # Set up the Flask test app
    app = create_app(TestConfig)
  

    # Establish an application context before running the tests
    with app.app_context():
        db.create_all()

    yield app
    with app.app_context():
        db.session.execute(text('DROP TABLE IF EXISTS postings CASCADE;'))
        db.session.execute(text('DROP TABLE IF EXISTS schools CASCADE;'))
        db.session.commit()
        db.drop_all()
 
@pytest.fixture()
def client(app):
    """
    Setup an application client, this gets executed for each test function.
    """
    return app.test_client()

# Custom hook to reorder tests based on predefined file order
def pytest_collection_modifyitems(items):
    """Hook to reorder the test files."""
    # Create a mapping to compare file names to their ordered position
    file_order = {name: index for index, name in enumerate(ORDERED_FILES)}

    def file_order_key(item):
        # Extract file name from the item's location
        file_name = item.location[0].split('/')[-1]
        # Provide an order value or fallback to a large value if not in the mapping
        return file_order.get(file_name, float('inf'))

    # Sort items based on the file order key
    items.sort(key=file_order_key)