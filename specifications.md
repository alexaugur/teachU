# Software Requirement Specification


## Problem Statement
Teachers are stressed when searching for teaching positions. Furthermore, teachers are underpaid and usually have part-time jobs on top of teaching full time. Schools are hit hard with a nationwide teacher shortage and oftentimes face teaching vacancies going into the school year/term. Parents recognize their child may be behind their supposed grade level, exacerbated by the COVID pandemic and see the need for tutoring, now more than ever. Who better to hire than a teacher in the subject of need?

## Proposed Solution
A job board centered around teachers and made for the K-12 education niche.
Connect teachers with schools. Teachers find a job and schools fill teaching vacancies.
Connect schools with teachers. Schools can make and manage job postings to hire a teacher.

## Potential Clients
Teachers
School Admin (Public, private, charter, online)
Parents

## Functional Requirements
#### Must-have:

- As a teacher, I want to sign up, authenticate, and log in to my account for a customized experience.
- As a teacher, I want to fill out my profile with relevant experience so employers can see it. 
- As a teacher, I want to view job postings so I can apply
- As a teacher, I want to apply to jobs so I can be hired
- As a school admin, I want to sign up, authenticate, and log in so that I can access the job-board
- As a school admin, I want to create and manage postings so I can keep them up to date. 
- As a school admin, I want to set up applications with short answers, file uploads, etc. for teachers to fill out so that teachers can apply.
- As a school admin, I want to view teacher applications so that I can evaluate potential hires. 
- Schools/Admin can review teacher applications

#### Should-have:

- As a teacher, I want to specify the visibility of my profile to better control my data privacy
- As a teacher, I want to filter posting by pay grade and location to find more relevant job postings
- As a school admin, I want to be alerted when a teacher submits an application so I can promptly review it
- As a School admin, I want to search for teachers satisfying specific background requirements so I can quickly find qualified teachers
- As a school admin, I want to create my school’s profile detailing info, school history, statistics, etc so that teachers can learn more about where they’re applying to.
- As a teacher, I want to have Sentiment Analysis/web-scraping based recommendations on where parents/schools need more teachers so that I can apply to areas in need
- As a teacher, I want to view the status of all my applications so that I can keep track of my job search process.
- As a school admin, I want to change the status of the job posting so that I can control the reception of new applications.
 
#### Nice-to-have:

- As a union, I want to register as an organization so that member teachers can join
- As a teacher, I want to join a union on this website.
- As a teacher, I want to be able to message schools during the interview process to facilitate communication
- As a school, I want to be able to message teachers during the interview process to facilitate communication
- Schools and Teachers are able to message on websites.
- As a school, I want to allows teachers to schedule interviews to facilitate the scheduling process
- As a teacher, I want to schedule my interviews to facilitate the scheduling process.

## Software Architecture & Technology Stack
**Type of Application:** Web Application

**Architecture:** Our web application will follow a typescript based frontend architecture, relying on Next.js for frontend development, and use a python-based flask backend to allow for easy data analysis.

**Frontend:** 

- **Framework**: Next.js, which integrate React for build our user interface.
- **Tailwind**: CSS for utility-first styling, ensuring a responsive and visually appealing design.

**Backend:** 

- **API:** Flask, serving as a lightweight back end framework with tons of support for data analyis libraries.
- **Authentication:** JWT Authentication for secure stateless authentication.

**Database:**

- **Primary Database:** PostgreSQL, chosen for its robustness and compatibility with Next.js and flask.
- **ORM:** SQLAlchemy for database access and easy data management within flask.

**Deployment:**

- **Hosting:** Vercel offering seamless deployment and hosting solutions for Next.js applications, and sufficient support for flask servers.
- **Continuous Integration/Continuous Deployment (CI/CD)**: Integrated within Vercel, allowing for automated testing and deployment pipelines from Github

**Additional Technologies:**
- **Version Control:** Git and GitHub for version control and collaborative development.
- **Testing Frameworks:** Jest and React Testing Library for unit and integration testing, as well as flasks built in testing.


## Similar Existing Apps
There are apps like LinkedIn and Indeed, but they are not tailored specifically for teachers to display information relevant to teacher (for example, working with x number of kids, in y category (like neurodivergent)) and so on. Additionally, we allow for teachers to search for schools that tailor to their skillset(and vice versa), which a broad platform like Linkedin and Indeed cannot do as well.
All in all, our platform meaningfully captures only the relevant information about teachers and schools that aid the job search process for teachers and the talent search process for schools, in which we help derisk their hires.
