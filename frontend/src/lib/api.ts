import type { Message, AnswerWithAppData, Rubric, SchoolAvailability, ApplicationCart } from "@/lib/types";
import type {
  Questions,
  Answers,
  SchoolUser,
  TeacherUser,
  SchoolProfile,
  JobPostings,
  RubricWithScore
} from "@/lib/types";
// import { nanoid } from "nanoid";
import {
  getAuthenticatedSchoolUser,
  getAuthenticatedSchoolUserToken,
  removeAuthenticatedSchoolUserToken,
  storeAuthenticatedSchoolUserToken,
} from "./schoolauth";

// import { nanoid } from "nanoid";

import {
  getAuthenticatedTeacherUser,
  getAuthenticatedTeacherUserToken,
  removeAuthenticatedTeacherUserToken,
  storeAuthenticatedTeacherUserToken,
} from "./teacherauth";

// for mock call to mock data
//import { users } from "./data.ts";

const API_URL = import.meta.env.VITE_API_URL;

const handleError = (response: Response, message?: string) => {
  if (response.status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  throw new Error(
    `Error: ${response.status} - ${message || response.statusText}`
  );
};

export const fetchPostingsById = async (
  postId: number | string
): Promise<JobPostings> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();
  if (user) {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/postings/job/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      handleError(response, responseJson.message);
    }

    return responseJson;
  } else {
    return null;
  }
};

export const fetchPostingsByIdAsTeacher = async (
  postId: number | string
): Promise<JobPostings> => {
  const user = getAuthenticatedTeacherUser();
  const token = getAuthenticatedTeacherUserToken();
  if (user) {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/postings/job/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      handleError(response, responseJson.message);
    }

    return responseJson;
  } else {
    return null;
  }
};

// Create a post
export const createPostings = async (
  description: string,
  title: string,
  salary_est: string,
  start_date: string,
  interview_length: number,
) => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ description, title, salary_est, start_date, interview_length }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson.data,
    id: responseJson["postingId"],
    user: user,
  };
};

export const updatedPostings = async (
  id: number | string,
  description: string,
  title: string,
  salary_est: string,
  start_date: string,
  interview_length: number
): Promise<JobPostings> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings/posting/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ description, title, salary_est, start_date, interview_length }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
    user: user,
  };
};

export const updatedPostingsStatus = async (
  id: number | string,
  closed: string
): Promise<JobPostings> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings/posting-close/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ closed }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
    user: user,
  };
};

export const deletePostings = async (id: number): Promise<void> => {
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }
};

// Create a question
export const createQuestions = async (
  title: string,
  content: string,
  type: string,
  jobposting_id: string
): Promise<Questions> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(
    `${API_URL}/postings/${jobposting_id}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobposting_id, title, content, type }),
    }
  );

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson.data,
    user: user,
  };
};

export const fetchQuestion = async (
  postingId: string,
  questionId: string
): Promise<Questions> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(
    `${API_URL}/postings/${postingId}/questions/${questionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({}),
    }
  );
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const fetchQuestionsByPosting = async (
  postingid: string
): Promise<Questions[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/postings/${postingid}/questions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({}),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["questions"];
};

export const create_application = async (
  postingid: string
): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobposting_id: postingid }),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["application_id"];
};

export const create_answers = async (
  application_id: string,
  answer_field: string,
  question_id: string
): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(`${API_URL}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ application_id, answer_field, question_id }),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["application_id"];
};

export const get_from_resume = async (file): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_URL}/teachers/upload_resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const create_rubric = async (question_id: string, criteria: string, score: number): Promise<number> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const requestBody = {
    question_id: question_id, 
    criteria: criteria,
    score: score
  };
  const response = await fetch(`${API_URL}/rubrics/${question_id}/rubric`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["rubric_id"];
};

export const delete_rubric = async (rubric_id: string): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/rubrics/${rubric_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "";
};

export const update_rubric = async (
  rubric_id: string,
  criteria: string,
  score: number
): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/rubrics/${rubric_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score }),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "";
};

//return all rubrics for a given question
export const get_rubrics = async (question_id: string): Promise<Rubric> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/rubrics/questions/${question_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["rubrics"];
};


export const get_rubrics_with_scores = async (answer_id: string): Promise<RubricWithScore[]> => {
  const API_URL = import.meta.env.VITE_API_URL; // Ensure the environment variable is set in your .env file
  const token = getAuthenticatedSchoolUserToken(); // Retrieve the JWT token for authorization

  const response = await fetch(`${API_URL}/rubrics/withscore/${answer_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  // console.log(responseJson["rubrics"].map((rubric: any) => ({
  //   id: rubric.id,
  //   question_id: rubric.question_id,
  //   criteria: rubric.criteria,
  //   score: rubric.score,
  //   points: rubric.scoreObj.points,
  //   score_id: rubric.scoreObj.id,
  // })))
  return responseJson["rubrics"].map((rubric: any) => ({
    id: rubric.id,
    question_id: rubric.question_id,
    criteria: rubric.criteria,
    score: rubric.score,
    points: rubric.scoreObj.points,
    score_id: rubric.scoreObj.id,
  }));
};





export const get_applications_by_posting = async (postingid: string, status = "submitted") => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(
    `${API_URL}/applications/byposting/${postingid}?status=${status}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["applications"];
};

export const get_applications_by_teacher = async (status = "submitted") => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(`${API_URL}/applications/my?status=${status}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["applications"];
};

export const reject_application = async (app_id: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/applications/${app_id} `, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "rejected" }),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};

export const put_under_review = async (app_id: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/applications/${app_id} `, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "submitted" }),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};


export const interview_application = async (app_id: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/applications/${app_id} `, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: "interviewing" }),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};

export const updateComment = async (app_id: string, comment: string) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/applications/${app_id} `, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};

export const get_applications_by_id = async (appid: string, school: boolean) => {
  const API_URL = import.meta.env.VITE_API_URL;
  var token = getAuthenticatedSchoolUserToken();
  if (!school) {
    token = getAuthenticatedTeacherUserToken();
  }
  const response = await fetch(`${API_URL}/answers/application/${appid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const updateQuestion = async (
  id: number | string,
  content: string
): Promise<Questions> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings/question/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, content }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
    user: user,
  };
};

// Create a question
export const addFavorite = async (job_id: number | string): Promise<String> => {
  const token = getAuthenticatedTeacherUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/teacherprofiles/addJob`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_id }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return "success";
};

export const deleteFavorite = async (
  job_id: number | string
): Promise<String> => {
  const token = getAuthenticatedTeacherUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/teacherprofiles/deleteJob`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_id }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return "success";
};

export const getFavorite = async (
  job_id: number | string
): Promise<boolean> => {
  const token = getAuthenticatedTeacherUserToken();
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/teacherprofiles/getFavorite`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_id }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return responseJson["message"];
};

// Create a question
export const createAnswers = async (
  posting_id: number | string,
  title: string,
  content: string,
  type: string
): Promise<Answers> => {
  const user = getAuthenticatedSchoolUser();
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ posting_id, title, content, type }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson.data,
    user: user,
  };
};

export const fetchAnswersByPosting = async (
  postingid: number | string
): Promise<Answers[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(
    `${API_URL}/questions/allquestions/${postingid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({}),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["questions"];
};

export const get_answers_by_question = async ( questionId: number | string): Promise<AnswerWithAppData[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/answers/question/${questionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

    
    const responseJson = await response.json();
    if (!response.ok) {
      handleError(response, responseJson.message);
    }

    const transformedAnswers = responseJson.answers.map(item => ({
      id: item.answer.id,
      application_id: item.answer.application_id,
      teacher_id: item.answer.teacher_id,
      question_id: item.answer.question_id,
      answer_field: item.answer.answer_field,
      score: item.answer.score,
  
      first_name: item.application.first_name,
      last_name: item.application.last_name,
      app_id: item.application.id // Use app_id to hold the id of the application
    }));
  
    return transformedAnswers;


}


export const school_login = async (
  email: string,
  password: string
): Promise<SchoolUser> => {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/schools/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify({
      status: response.status,
      message: responseJson.error || response.statusText
    }));
  
  }

  // console.log(responseJson)
  const access_token = responseJson["tokens"]["access"];

  if (!access_token) {
    throw new Error("Authentication token is missing from the response!");
  }

  storeAuthenticatedSchoolUserToken(access_token);
  const user = getAuthenticatedSchoolUser();
  // console.log(user)
  return user;
};

export const fetchPostingsBySchool = async (): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/postings/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
  // // console.log(responseJson)
  // const access_token = responseJson["tokens"]["access"]
  // const userId = responseJson["id"]
  // if (!access_token) {
  //   throw new Error("Authentication token is missing from the response!");
  // }

  // storeAuthenticatedSchoolUserToken(access_token);
  // const user = getAuthenticatedSchoolUser();
  // // console.log(user)
  // return user;
};

export const fetchAllPostings = async (): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/postings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({}),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const fetchAllFavorites = async (): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(`${API_URL}/postings/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({}),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const fetchAllPostingsWithCityAndState = async (
  city: string,
  state: string
): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(
    `${API_URL}/postings/proximity?city=${city}&state=${state}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({}),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const fetchAllAreasInNeedNearCityAndState = async (
  city: string,
  state: string
): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(
    `${API_URL}/postings/recommendations?city=${city}&state=${state}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({}),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const fetchAllPostingsWithSalary = async (
  salary_est: string,
  amplitude: string = "10000"
): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(
    `${API_URL}/postings/salary?salary=${salary_est}&amplitude=${amplitude}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({}),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const fetchAllPostingsWithTitle= async (
  title: string,
): Promise<JobPostings[]> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = getAuthenticatedTeacherUserToken();
  const response = await fetch(
    `${API_URL}/postings/title?title=${title}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({}),
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["postings"];
};

export const get_school = async (): Promise<SchoolProfile> => {
  const token = getAuthenticatedSchoolUserToken();

  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/schoolprofiles/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["school_profile"];
};

export const get_schools = async (
  search: string,
  page: number | string
): Promise<SchoolProfile[]> => {
  const token = getAuthenticatedSchoolUserToken();
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(
    `${API_URL}/schoolprofiles/schools?search=${search}&page=${page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }

  return responseJson;
};

export const fetchSchools = async (postingid: number | string) => {
  //postingid = postingid;
  const token = getAuthenticatedSchoolUserToken();
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/schools`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({}),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["schools"];
};

export const school_logout = async (): Promise<void> => {
  removeAuthenticatedSchoolUserToken();
};

export const teacher_logout = async (): Promise<void> => {
  removeAuthenticatedTeacherUserToken();
};

export const teacher_register = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  current_school: string,
  subjects_taught: string,
  current_state: string,
  grades_taught: string,
  years_of_experience: string,
  past_jobs: string,
  accolades: string,
  accomodations: string,
  education: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/teachers/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      first_name,
      last_name,
      current_school,
      subjects_taught,
      current_state,
      grades_taught,
      years_of_experience,
      past_jobs,
      accolades,
      accomodations,
      education,
    }),
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify({
      status: response.status,
      message: responseJson.error || response.statusText
    }));
  
  }
  /*
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  */
};

export const teacher_login = async (
  email: string,
  password: string
): Promise<TeacherUser> => {
  const response = await fetch(`${API_URL}/teachers/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify({
      status: response.status,
      message: responseJson.error || response.statusText
    }));
  
  }
  const access_token = responseJson["tokens"]["access"];

  if (!access_token) {
    throw new Error("Authentication token is missing from the response!");
  }

  storeAuthenticatedTeacherUserToken(access_token);
  const user = getAuthenticatedTeacherUser();
  // console.log(user)
  return user;
};

export const school_register = async (
  email: string,
  password: string,
  name: string,
  city: string,
  state: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/schools/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, state, city, name }),
  });
  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify({
      status: response.status,
      message: responseJson.error || response.statusText
    }));
  
  }

  /*
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  */
};

export const fetchTeacherProfileDetails = async (): Promise<TeacherUser> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/teacherprofiles/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["teacher_profile"];
};

export const fetchTeachersBySearchTerm = async (search: string = "", current_page: number): Promise<SchoolUser> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/teacherprofiles/search?search=${search}&page=${current_page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const fetchSchoolProfileDetails = async (): Promise<SchoolUser> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/schoolprofiles/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["school_profile"];
};

export const editTeacherProfileDetails = async (
  teacherUser: TeacherUser
): Promise<TeacherUser> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/teacherprofiles/${teacherUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teacherUser),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["teacher_profile"];
};

export const editSchoolProfileDetails = async (
  schoolUser: SchoolUser
): Promise<SchoolUser> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/schoolprofiles/${schoolUser.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(schoolUser),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["school_profile"];
};


export const fetchSchoolsToChatWith = async (): Promise<SchoolProfile[]> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/messages/teachers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["schools"];
};

export const fetchOtherSchoolProfileDetails = async (
  school_id
): Promise<SchoolProfile> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(
    `${API_URL}/schoolprofiles/school/${school_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["school_profile"];
};

export const fetchTeacherApplicationCart = async (
  teacherId: number
): Promise<ApplicationCart> => {
  
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(
    `${API_URL}/application_cart/teacher`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
  // return new Promise((resolve, reject) => {
  //   fetch(`${API_URL}/application_cart/teacher?teacher_id=${teacherId}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((cart) => resolve(cart))
  //     .catch((error) => reject(error));
  // });
};
export const fetchSchoolAvailabilities= async (): Promise<SchoolAvailability[]> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/availabilities/`, {
  
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }

    return responseJson["school_availabilities"];
  };

export const fetchTeachersToChatWith = async (): Promise<TeacherUser[]> => {
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/messages/schools`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["teachers"];
};

export const addSchoolAvailability = async (date:string, start_time: string, end_time: string): Promise<string> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/availabilities/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date, start_time, end_time
    })
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};

export const fetchAllMessagesAsTeacher = async (school_id, teacher_id): Promise<Message[]> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/messages/messages_teacher/${school_id}/${teacher_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};

export const fetchAllMessagesAsSchool = async (school_id, teacher_id): Promise<Message[]> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/messages/messages_school/${school_id}/${teacher_id}`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};


export const sendFirstMessageAsSchool = async (teacher_id): Promise<Message[]> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/messages/create/school/${teacher_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};

export const sendMessageAsSchool = async (teacher_id, content): Promise<Message[]> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/messages/send/school/${teacher_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content
    })
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};

export const deleteSchoolAvailability = async (id: number): Promise<string> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/availabilities/${id.toString()}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return "success";
};

export const getInterviewIfExists = async (posting_id: number): Promise<any> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/interviews/check/${posting_id.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
  // return new Promise((resolve, reject) => {
  //   fetch(`${API_URL}/application_cart/teacher?teacher_id=${teacherId}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((cart) => resolve(cart))
  //     .catch((error) => reject(error));
  // });
};

export const editTeacherApplicationCart = async (
  jobIds: number[]
): Promise<ApplicationCart> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/application_cart/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ job_postings: jobIds }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
  };
};

export const addToTeacherApplicationCart = async (
  jobId: number
): Promise<ApplicationCart> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/application_cart/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ add_job_posting_id: jobId }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
  };
};

export const clearTeacherApplicationCart = async (
): Promise<ApplicationCart> => {
  const response = await fetch(`${API_URL}/application_cart/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ job_postings: [] }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    handleError(response, responseJson.message);
  }

  return {
    ...responseJson,
  };
};

export const getAvailabilityForPosting = async (posting_id: string): Promise<any> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/interviews/teacher/${posting_id.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};


export const scheduleInterview = async (posting_id: string, date: string, start_time: string, end_time: string): Promise<any> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/interviews/teacher-interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      posting_id, date, start_time, end_time
    })
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const sendFirstMessageAsTeacher = async (school_id): Promise<Message[]> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/messages/create/teacher/${school_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};

export const sendMessageAsTeacher = async (school_id, content): Promise<Message[]> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/messages/send/teacher/${school_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content
    })
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["messages"];
};

export const cancelInterviewAsTeacher = async (interview_id): Promise<any> => {
  const token = getAuthenticatedTeacherUserToken();

  const response = await fetch(`${API_URL}/interviews/teacher-interviews/${interview_id.toString()}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const cancelInterviewAsSchool = async (interview_id): Promise<any> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/interviews/school-interviews/${interview_id.toString()}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson;
};

export const getInterviews = async (): Promise<any> => {
  const token = getAuthenticatedSchoolUserToken();
  const response = await fetch(`${API_URL}/interviews/schools/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }
  return responseJson["teacher_interviews"];
};

export const fetchOtherTeacherProfileDetails = async (teacher_id): Promise<TeacherUser> => {
  const token = getAuthenticatedSchoolUserToken();

  const response = await fetch(`${API_URL}/teacherprofiles/id/${teacher_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${
        responseJson.message || response.statusText
      }`
    );
  }

  return responseJson["teacher_profile"];
}





// const handleError = (response: Response, message?: string) => {
//   if (response.status === 401) {
//     removeAuthenticatedUserToken();
//     throw new Error("Your session has expired. Please login again.");
//   }

export const createScore = async (rubric_id, answer_id, points) => {
  const API_URL = import.meta.env.VITE_API_URL; // Ensure the environment variable is set in your .env file
  const token = getAuthenticatedSchoolUserToken(); // Retrieve the JWT token for authorization

  const body = JSON.stringify({
    answer_id,
    points
  });

  const response = await fetch(`${API_URL}/rubrics/${rubric_id}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${responseJson.message || response.statusText}`
    );
  }
  //returns the score id 
  return responseJson.score_id; // This might include some details about the created score
};

export const updateScore = async (rubric_id, score_id, points) => {
  const API_URL = import.meta.env.VITE_API_URL; // Ensure the environment variable is set in your .env file
  const token = getAuthenticatedSchoolUserToken(); // Retrieve the JWT token for authorization

  const body = JSON.stringify({ points });

  const response = await fetch(`${API_URL}/rubrics/${rubric_id}/scores/${score_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error: ${response.status} - ${responseJson.message || response.statusText}`
    );
  }
  return responseJson; // Return the response which should include a success message and possibly the updated score details
};
