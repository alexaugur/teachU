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

## Getting started (first time)

Steps for setting up local development environment:
(make sure to have .env file w/ up-to-date content)
.env file shared in team Slack channel. Copy contents into .env file on your local machine. Ensure all updates are reflected in your local copy of the .env file.

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

# Production Link
https://project-team-10.vercel.app/


