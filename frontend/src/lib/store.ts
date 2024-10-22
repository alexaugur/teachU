// import { PostWithUserData, User } from "./types";
import { SchoolUser, TeacherUser, SchoolProfile, JobPostings, Questions, Answers, SchoolTeacherUser, ApplicationProfile, PostingForApplication, AnswerWithAppData, Rubric, SchoolAvailability, TeacherInterview   } from "./types";

// import { log } from "./logger";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Dictionary<T> = { [key: string]: T };

type State = {
  teacherUser: TeacherUser | null;
  schoolUser: SchoolUser | null;
  schoolProfile: SchoolProfile | null;
  schoolPostings: JobPostings[] | null;
  selectedPostingId: number | string | null;
  state: string;
  city: string;
  teacherPostings: JobPostings[] | null;

  postingQuestions: Questions[] | null,
  answers: AnswerWithAppData[] | null,
  answers2: string[] | null,

  question: Questions | null;

  // Add more state variables
  schools: SchoolProfile[] | null,
  teachers: TeacherUser[] | null,

  currentSchoolPage: number | null,
  totalSchoolPages: number | null,

  currentTeacherPage: number | null,
  totalTeacherPages: number | null,

  application: ApplicationProfile | null,

  applications: SchoolTeacherUser[] | null,
  postingApplications: PostingForApplication[] | null,
  applicationType: string,
  rubricPresent: boolean,
  rubricScore: number
  availabilities: Dictionary<SchoolAvailability[]>

  interviews: TeacherInterview[] | null

  rubrics: { [questionId: number]: Rubric[] };

  applicationCartQuestions: { [key: string]: Questions[] };
  jobIds_in_cart: number[];
};
type Action = {
  // Add more actions

  setSchoolUser: (schoolUser: SchoolUser) => void;
  clearSchoolUser: () => void;

  setSchoolProfile: (schoolUser: SchoolProfile) => void;
  clearSchoolProfile: () => void;

  setSchoolPostings: (posts: JobPostings[]) => void;
  // removeSchoolPostings: (id: number) => void;
  addSchoolPostings: (post: JobPostings) => void;
  // updateSchoolPostings: (id: number, updatedPost: Postings) => void;

  setSelectedPostingId: (id: number | string) => void;
  clearSelectedPostingId: () => void;
  setTeacherUser: (teacherUser: TeacherUser) => void;
  clearTeacherUser: () => void;

  setTeacherPostings: (posts: JobPostings[]) => void;

  setState: (state: string) => void;
  setCity: (city: string) => void;

  setQuestion: (question: Questions) => void;

  setPostingQuestions: (posts: Questions[]) => void;
  addPostingQuestions: (post: Questions) => void;

  setAnswer: (posts: Answers[]) => void;
  setAnswer2: (posts: string[]) => void;
  setAnswer2Length: (integer: number) => void;
  clearAnswers: () => void;

  setAnswerAtIndex: (answer: string, index: number) => void;

  // addAnswer: (post: Answers) => void;
  setSchools: (schools: SchoolProfile[]) => void;

  setTeachers: (teachers: TeacherUser[]) => void;

  setCurrentSchoolPage: (page: number) => void;

  setTotalSchoolPages: (page: number) => void;

  setCurrentTeacherPage: (page: number) => void;

  setTotalTeacherPages: (page: number ) => void;

  setApplication: (application: ApplicationProfile) => void;

  setApplications: (applications: SchoolTeacherUser[]) => void;

  setPostingApplications: (applications: PostingForApplication[]) => void;

  setApplicationType: (applicationType: string) => void;

  setRubricPresent: (rubricPresent: boolean) => void;
  
  setRubricScore: (rubricScore: number) => void;

  addRubric: (questionId: number, rubric: Rubric) => void;
  updateRubric: (questionId: number, rubricId: number, updatedRubric: Partial<Rubric>) => void;
  deleteRubric: (questionId: number, rubricId: number) => void;

  setRubrics: (questionId: number, rubrics: Rubric[]) => void; 
  clearRubrics: () => void; 

  setAvailabilities: (availabilities:  Dictionary<SchoolAvailability[]>
    ) => void

  setInterviews: (interviews: TeacherInterview[]) => void

  setApplicationCartQuestions: (applicationCartQuestions: {
    [key: string]: Questions[];
  }) => void;

  addJobIdToCart: (jobId: number) => void;
};
// define the initial state
const initialState: State = {
  schoolUser: null,
  schoolProfile: null,
  schoolPostings: null,
  selectedPostingId: null,
  teacherUser: null,
  teacherPostings: null,
  postingQuestions: null,
  answers: null,
  answers2: null,

  question: null,
  schools: null,
  teachers: null,
  currentSchoolPage: null,
  totalSchoolPages: null,

  currentTeacherPage: null,
  totalTeacherPages: null,

  state: "",
  city: "",

  application: null,

  applications: null,

  postingApplications: null,

  applicationType: "submitted",

  rubricPresent: false,
  rubricScore: 0,

  rubrics: {},
  availabilities: {},

  interviews: null,

  applicationCartQuestions: {},

  jobIds_in_cart: [],
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setTeacherUser: (teacherUser) => set({ teacherUser }),

    clearTeacherUser: () => set({ teacherUser: null }),

    setSchoolUser: (schoolUser) => set({ schoolUser }),

    clearSchoolUser: () => set({ schoolUser: null }),

    setSchoolProfile: (schoolUser) => set({ schoolProfile: schoolUser }),

    clearSchoolProfile: () => set({ schoolProfile: null }),

    setSchoolPostings: (schoolPostings) =>
      set({ schoolPostings: schoolPostings }),

    setTeacherPostings: (teacherPostings) =>
      set({ teacherPostings: teacherPostings }),

    setSelectedPostingId: (selectedPostingId) => set({ selectedPostingId }),

    clearSelectedPostingId: () => set({ selectedPostingId: null }),

    addSchoolPostings: (post) => {
      set({ schoolPostings: [post, ...get().schoolPostings] });
    },

    setPostingQuestions: (postingQuestions) =>
      set({ postingQuestions: postingQuestions }),
    addPostingQuestions: (newQuestion) => {
      set({ postingQuestions: [newQuestion, ...get().postingQuestions] });
    },

    setQuestion: (question) => set({ question: question }),

    setAnswer: (answers) => set({ answers: answers }),

    setAnswer2: (answers) => set({ answers2: answers }),

    setAnswerAtIndex: (answer, index) => {
      const newAnswers = [...get().answers2];
      newAnswers[index] = answer;
      set({ answers2: newAnswers });
    },

    addAnswer: (newAnswer) => {
      set({ answers: [newAnswer, ...get().answers] });
    },

    clearAnswers: () => set({ answers: null }),

    setAnswer2Length: (integer) => {
      const emptyArray = Array(integer).fill(null);
      set({ answers2: emptyArray });
    },

    // updateSchoolPostings: (postId, updatedPost) => {
    //   const newPosts = get().posts.filter((post) => post.id !== postId);
    //   // const posts = get().posts.map( (post) => {
    //   //   if (post.id === postId) {
    //   //     return updatedPost;
    //   //   }
    //   //   return post;
    //   // });
    //   // set({ posts });
    //   set({ posts: [...newPosts, updatedPost] });
    setSchools: (schools) => set({ schools }),

    setTeachers: (teachers) => set({ teachers}),


    setCurrentSchoolPage: (currentSchoolPage) => set({ currentSchoolPage: currentSchoolPage }),
    
    setTotalSchoolPages: (totalSchoolPages) => set({ totalSchoolPages: totalSchoolPages }),

    setCurrentTeacherPage: (currentTeacherPage) => set({ currentTeacherPage: currentTeacherPage }),
    
    setTotalTeacherPages: (totalTeacherPages) => set({ totalTeacherPages: totalTeacherPages }),

    setState: (state) => set({ state }),
    setCity: (city) => set({ city }),

    setApplication: (application) => set({ application: application }),

    setApplications: (applications) => {
      set({ applications: applications });
    },

    setPostingApplications: (postingApplications) => {
      set({ postingApplications: postingApplications });
    },
    setApplicationType: (applicationType) =>
      set({ applicationType: applicationType }),

    setRubricPresent: (rubricPresent) => set({ rubricPresent: rubricPresent }),

    setRubricScore: (rubricScore) => set({ rubricScore: rubricScore }),

    setApplicationCartQuestions: (applicationCartQuestions) =>
      set({ applicationCartQuestions }),

    addRubric: (questionId, rubric) => set(state => {
  // Directly access and manipulate the state using the provided 'state' parameter
        if (!Array.isArray(state.rubrics[questionId])) {
          state.rubrics[questionId] = [];
        }
        
        state.rubrics[questionId].push(rubric); // Use push to add to the array, which is immer-safe
      }),

  
updateRubric: (questionId, rubricId, updatedRubric) => set(state => {
  if (state.rubrics[questionId]) {
    const index = state.rubrics[questionId].findIndex(r => r.id === rubricId);
    if (index !== -1) {
      state.rubrics[questionId][index] = { ...state.rubrics[questionId][index], ...updatedRubric };
    }
  }
}),
  
    deleteRubric: (questionId, rubricId) => set(state => {
      const rubrics = state.rubrics[questionId];
      if (rubrics) {
        state.rubrics[questionId] = rubrics.filter(r => r.id !== rubricId);
      }
    }),
  
    setRubrics: (questionId, newRubrics) => set((state) => {
    
      // Now safely set newRubrics to the specific questionId
      state.rubrics[questionId] = newRubrics;

    }),
    
  
    clearRubrics: () => set(() => {
      get().rubrics = {};
    }),

    setAvailabilities: (availabilities) => set({ availabilities: availabilities }),
        
    setInterviews: (interviews) => set({ interviews: interviews }),

    addJobIdToCart: (jobId) =>
    set((state) => ({ jobIds_in_cart: [...state.jobIds_in_cart, jobId] })),
  })),
);

//     addJobIdToCart: (jobId) =>
//       set((state) => ({ jobIds_in_cart: [...state.jobIds_in_cart, jobId] })),
//   }))
// );
