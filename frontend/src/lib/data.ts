export type TeacherUser = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  current_school: string;
  education?: string;
  subjects_taught: string;
  current_state: string;
  grades_taught: string;
  years_of_experience: string;
  past_jobs?: string;
  accolades?: string;
  accommodations?: string;
  avatar?: string;

  teaching_philosophy?: string;
  job_search_status?: string;
  availability?: string;
  verified?: boolean;
  desired_location?: string;
  min_salary?: string;
  max_salary?: string;
  familiar_tools?: string;
  references?: string;
};

export type SchoolUser = {
  id: number;
  username: string;

  affiliations: string;
  avg_class_size: number;
  avatar?: string;
  city: string;
  curriculum: string;
  grades_served: string;
  hiring_needs: string;
  latitude: number;
  longitude: number;
  mission_statement: string;
  name: string;
  num_enrolled_students: number;
  physical_address: string;
  photos?: string;
  school_id: number;
  school_type: string;
  state: string;
  student_teacher_ratio: string;
  test_scores: string;
  tuition: string;
  verified?: boolean;
  year_established: number;
};

export const teacherUsers: TeacherUser[] = [
  {
    id: "1",
    username: "user1",
    first_name: "John",
    last_name: "Doe",
    current_school: "Ali's OOSE Academy",
    education:
      "PhD in Effective Teaching, Masters in Education, Bachelor's in Being Cool",
    subjects_taught: "Math, Science",
    current_state: "California",
    grades_taught: "K-12",
    years_of_experience: "10",
    past_jobs:
      "Ali's Full-Stack Javascript Academy, Ali's Data Structures School",
    accolades: "Teacher of the year, MVP of Ali's OOSE Academy",
    accommodations: "Neurodivergent students, ESL students",
    avatar:
      "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
  },
  {
    id: "7",
    username: "user5",
    first_name: "Sean",
    last_name: "Pak",
    current_school: "Johns Hopkins",
    education: "JHU BEST",
    subjects_taught: "STEM",
    current_state: "Maryland",
    grades_taught: "9-12",
    years_of_experience: "20",
    past_jobs: "JHU BEST Teaching Assistant, Towson University",
    accolades: "Upcoming Teacher of the Year",
    accommodations: "Neurodivergent students, ESL students",
    avatar:
      "https://cleverx.com/api/files/profile/64069ac23e6c5a259f50327f/profilepic-1684929838544.jpeg",

    teaching_philosophy: "No kid left behind",
    job_search_status: "Actively Searching",
    availability: "Full-time, Part-time, Contract, Substitute",
    verified: true,
    desired_location: "California",
    min_salary: "$80,000",
    max_salary: "$120,000",
    familiar_tools: "IXL Learning, Google Classroom, Zoom, Microsoft Teams",
    references: "Ali Madooei, Mom & Dad, Will Tong",
  },
];
