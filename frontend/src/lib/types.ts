export type SchoolUser = {
  // id: number;
  // username: string;
  // city: string;
  // state: string;
  // email: string;
  id: number;
  username: string;

  affiliations: string;
  avg_class_size: number;
  city: string;
  curriculum: string;
  grades_served: string;
  hiring_needs: string;
  latitude: number;
  longitude: number;
  mission_statement: string;
  name: string;
  num_enrolled_students: number;
  photos?: string;
  physical_address: string;
  school_id: number;
  school_type: string;
  state: string;
  student_teacher_ratio: string;
  test_scores: string;
  tuition: string;
  year_established: number;
  sub: string;
};

export type SchoolProfile = {
  id: number;
  name: string;
  city: string;
  school_id: string;
  state: string;
};

export type Postings = {
  id: number;
  title: string;
  experience: string;
  school_id: number;
  salary_est: string;
  start_date: string;
  city: string;
  state: string;
};

export type Questions = {
  id: number;
  title: string;
  content: string;
  type: string;
  rubric?: boolean;
};

export type Answers = {
  id: number;
  application_id: number;
  teacher_id: number;
  question_id: number;
  answer_field: string;
  score: number;
};

export type AnswerWithAppData = {
  id: number
  application_id: number;
  teacher_id: number;
  question_id: number;
  answer_field: string;
  score: number

  first_name?: string;
  last_name?: string;
  app_id?: number
};

export type Rubric = {
  id: number;
  question_id: number;
  criteria: string
  score: number;
};

export type RubricWithScore = {
  id: number;
  question_id: number;
  criteria: string
  score: number;
  points: number;
  score_id: number
};



export type QuestionsAnswers = {
  answer_field: string;
  answer_id: string;
  question_id: string;
  question_text: string;
  rubricPresent: boolean;
  rubric_id: number;
  current_score: number;
  total_score: number;
};

export type ApplicationProfile = {
  profile: SchoolTeacherUser;
  answers: QuestionsAnswers[];
};

export type TeacherUser = {
  id?: string;
  teacher_id?: string;
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
  sub: string;

};

//this is just the application essentialy
export type SchoolTeacherUser = {
  accolades: string;
  accommodations?: string;
  avatar?: string;
  current_school?: string;
  current_state?: string;
  education?: string;
  email?: string;
  first_name?: string;
  id?: string;
  jobposting_id?: string;
  last_name?: string;
  status?: string;
  teacher_id?: string;
  years_of_experience?: string;
  subjects_taught?: string;
  grades_taught?: string;
  past_jobs?: string;
  app_status?: string;
  comment?: string;
  score: number;
};

export type School = {
  username: string;
  email: string;
  state: string;
  city: string;
  name: string;
};
export type JobPostings = {
  id: number;
  job_info: JobInfo;
  school_id: number;
  num_applicants: number;
  closed: string;
};

export type PostingForApplication = {
  id: number;
  title: string;
  school: string;
  city: string;
  state: string;
  app_status: string;
  posting_id: number;
}

export type JobInfo = {
  description: string;
  id: number;
  jobposting_id: number;
  post_date: string;
  salary_est: 1000;
  title: string;
  city: string;
  state: string;
  start_date: string;
  interview_length: number;
};

export type ApplicationCart = {
  id: number;
  job_postings: Array<JobPostings>;
  teacher_id: number;
};

export type SchoolAvailability = {
  id: number;
  school_id: number;
  date: string;
  start_time: string;
  end_time: string;
};

export type TeacherInterview = {
  id: number;
  teacher_id: number;
  school_id: number;
  date: string;
  start_time: string;
  end_time: string;
  posting_id: number;
};
export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
}

export interface IConversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar?: string;
}


export interface Message {
  id: string;
  content: string;
  school_id: string;
  teacher_id: string;
  sender_type: string;
  real_message:boolean;
}



