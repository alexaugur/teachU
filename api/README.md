# How to run the project

2. Install requirements

```bash
pip install -r requirements.txt
```

3. Create a `.env` file and set environment variables

```
FLASK_SECRET_KEY=<your-secret-key>
FLASK_DEBUG=<your-debug-boolean-value>
FLASK_SQLALCHEMY_DATABASE_URI=<your-sqlalchemy-db-uri>
FLASK_SQLALCHEMY_ECHO=<your-sqlalchemy-echo-value>
export FLASK_APP=./main.py
```

5. Create the database by running

```bash
flask shell
```

6. In the interactive shell run the following

```
Python 3.11.1 (tags/v3.11.1:a7a450f, Dec  6 2022, 19:58:39) [MSC v.1934 64 bit (AMD64)] on win32
App: main
Instance: C:\Users\jod35\Documents\coding\JWT Auth flask\instance
>>> from api.src import models
>>> db.create_all()
>>> exit()
```

to create migrations run
flask db init

anytime models are changed run:
flask db migrate
flask db upgrade

7. Finally run the application with
   `flask run`

8. In order to run tetss, use the command
   `pytest`
