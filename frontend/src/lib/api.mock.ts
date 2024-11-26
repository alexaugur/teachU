// api.mock.ts

export const fetchPostingsById = jest.fn(async (postId: number | string) => {
    return Promise.resolve({
      // Mock response object
      // Modify as needed for your test cases
    });
  });
  
  export const fetchPostingsByIdAsTeacher = jest.fn(async (postId: number | string) => {
    return Promise.resolve({
      // Mock response object
      // Modify as needed for your test cases
    });
  });
  
  export const createPostings = jest.fn(async (
    description: string,
    title: string,
    salary_est: string,
    start_date: string
  ) => {
    return Promise.resolve({
      // Mock response object
      // Modify as needed for your test cases
    });
  });

  export const updatedPostings = jest.fn(async (
    id: number | string,
    description: string,
    title: string,
    salary_est: string,
    start_date: string
  ) => {
    return Promise.resolve({
      // Mock response object for updatedPostings
      id,
      title,
      description,
      salary_est,
      start_date,
      // Add more fields as needed for your test cases
    });
  });

  export const deletePostings = jest.fn(async (id: number) => {
    return Promise.resolve();
  });
  
  export const createQuestions = jest.fn(async (
    title: string,
    content: string,
    type: string,
    jobposting_id: string
  ) => {
    return Promise.resolve({
      // Mock response object for createQuestions
      id: "987654", // Example ID
      title,
      content,
      type,
      jobposting_id,
      // Add more fields as needed for your test cases
    });
  });



export const fetchQuestion = jest.fn(async (postingId: string, questionId: string) => {
  return Promise.resolve({
    // Mock response object for fetchQuestion
    id: questionId,
    postingId,
    content: "Sample question content",
    type: "Multiple Choice",
    // Add more fields as needed for your test cases
  });
});

export const fetchQuestionsByPosting = jest.fn(async (postingid: string) => {
  return Promise.resolve([
    {
      id: "123",
      postingId: postingid,
      content: "Sample question content 1",
      type: "Multiple Choice",
    },
    {
      id: "456",
      postingId: postingid,
      content: "Sample question content 2",
      type: "Essay",
    },
    // Add more mock questions as needed for your test cases
  ]);
});

export const create_application = jest.fn(async (postingid: string) => {
  return Promise.resolve("application_id");
});

export const create_answers = jest.fn(async (
  application_id: string,
  answer_field: string,
  question_id: string
) => {
  return Promise.resolve("application_id");
});

export const  school_login = jest.fn(async (email, password) => {
    
    return Promise.resolve("application_id");
  });
  

  

  
  // Mock other functions and constants as needed...
  