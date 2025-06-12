# TeachU : K-12 Talent Marketplace tailored for Teachers

A 2-sided job board platform for K-12 teachers and schools.
Teachers can...

- Search & Filter for jobs
- Apply for jobs
- Manage their jobs and applications
- Manage their profile
- Interact with schools via a messaging system

Schools can...

- Search & Filter for talent (job-seeking teachers)
- Create & manage job posting
- Manage their profile
- Interact with teachers via a messaging system

# Environment Setup
Our frontend environment file has the following environmental variables:
```
NODE_ENV=
VITE_API_URL=
VITE_WEBSOCKET_URL=

VITE_API_KEY=
VITE_API_CLUSTER=
```
NODE_ENV is the environment, which is set to development locally.
Both the URL's are links to the backend. Having a separate URL for WEBSOCKETS is a legacy change that helped fix prior problems in production, but this is no longer necessary. Thus, both should be set to the same backend url.

VITE_API_KEY and VITE_API_CLUSTER are both keys in order to connect to PUSHER, which is an external service that helps handle web sockets for us, instead of mangaging them internally. 


Our backend environment file has the following environmental variables:
```
FLASK_SECRET_KEY=
FLASK_DEBUG=

FLASK_SQLALCHEMY_DATABASE_URI=
SQLALCHEMY_DATABASE_URI=

FLASK_SQLALCHEMY_ECHO=
FLASK_APP=

OPENAI_API_KEY=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```
The secret key is the secret for jwt encryption, and FLASK_DEBUG is a flag for debug mode (which we do not utilize). Both database URI's are links to a postgres database. Both links should match. There are two different ones because sql alchemy has strict requirements on the naming of the database link in the environment file.
FLASK_SQLALCHEMY_ECHO is another debug flag which we do not use.
FLASK_APP is the path to our main app, so that flask run knows where to start serving our app from.
The openAI api key is a key to make calls to Chat gpt.
The 4 pusher variables are related to creating a pusher client in the server in order to manage web socket connections and maek real time messaging possible.

## Getting started (first time)
To run the project locally, you need both a working PostgreSQL database and a Pusher Channel. The database link and Pusher app keys will both be added to the .env files. After that the following commands can be ran to start the app:

Backend:

```shell
cd api
pip install -r requirements.txt
flask run
```

Frontend:

```shell
cd frontend
pnpm install
pnpm run dev
```

## Running the project (subsequent times)

Backend:

```shell
cd api
flask run
```

Frontend:

```shell
cd frontend
pnpm run dev
```

## Running the tests

Backend:

```shell
cd api
pytest
```

Frontend:

```shell
cd frontend
pnpm jest
```

## Tech Stack:

# Frontend

Next.JS, React, TailwindCSS, TypeScript

# Backend

Flask, Python, PostgreSQL

# Testing

Jest, React Testing Library, Flask's Built-in Testing

# Deployment

Frontend: Vercel
Backend: Render




