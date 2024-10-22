# Assuming your project structure is something like this:
# project_root/
# ├── src/
# │   ├── __init__.py
# │   ├── drop.py
# │   ├── extensions.py  (contains db and possibly other extensions)

from .extensions import db
from flask import Flask

app = Flask(__name__)
# Be sure to configure your app, especially the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'your_database_uri'

with app.app_context():
    db.drop_all()
    print("All tables dropped.")
