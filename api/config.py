class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://teach_u_test_database_user:dIIXlvI3dKExyixsNSEgmyR34cRjtCnZ@dpg-cnqluni1hbls73drird0-a.oregon-postgres.render.com/teach_u_test_database'
    # 'postgresql://teach_u_database_user:rY8C1keKpUZ0lHPHgL3gSflxAMDu5TBy@dpg-cnfhraol5elc73948sg0-a.oregon-postgres.render.com/teach_u_database'
    #SQLALCHEMY_DATABASE_URI ='sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test_secret_key'
    FLASK_SQLALCHEMY_ECHO=True
    OPENAI_API_KEY="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"
    PUSHER_APP_ID=1799788
    PUSHER_KEY="9cebdf7b17997e0fdf8f"
    PUSHER_SECRET="d8edc8d95730fe0dae2b"
    PUSHER_CLUSTER="us2"