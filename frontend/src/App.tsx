// import Feed from "./components/feed";
import { Toaster } from "./components/ui/toaster";
// import { LoginDialog } from "./components/login-dialog";
import { useStore } from "./lib/store";
// import { LogoutDialog } from "./components/logout-dialog";
// import { RegisterDialog } from "./components/register-dialog";
import { useEffect } from "react";
// import {
//   getAuthenticatedUserToken,
//   isTokenExpired,
//   removeAuthenticatedUserToken,
// } from "./lib/auth";
import { useToast } from "./components/ui/use-toast";
import ApplicationQuestionView from "./views/application-question-view";
// import Aside from "./components/aside";
import MainView from "./views/main-view";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./views/error-page";
// import PostView from "./views/post-view";
import SignedUpTeacher from "./views/signed-up-teacher";
import CreateJobPostView from "./views/create-job-post-view";
import JobBoardSchoolView from "./views/job-board-school-view";
import DetailsJobPosting from "./views/details-job-posting";
import TeacherAccountView from "./views/teacher-account-view";
import JobBoardTeacherView from "./views/job-board-teacher-view";
import TeacherDetailsJobPosting from "./views/teacher-details-job-posting";
import ApplyJobPosting from "./views/apply-job-posting-view";
import SchoolListTeacherView from "./views/school-list-teacher-view";
import ApplicationReview from "./views/application-review-postings";
import IndApplicationReview from "./views/app-review";
import TeacherApplicationList from "./views/teacher-application-list-view";
import TeacherScheduleInterviewView from "./views/teacher-schedule-interview-view";
import {
  getAuthenticatedTeacherUserToken,
  isTeacherTokenExpired,
  removeAuthenticatedTeacherUserToken,
} from "./lib/teacherauth";
import {
  getAuthenticatedSchoolUserToken,
  isSchoolTokenExpired,
  removeAuthenticatedSchoolUserToken,
} from "./lib/schoolauth";
// import SchoolAccountView from "./views/school-profile-view";
import SchoolProfileView from "./views/school-profile-view";
import TeacherApplicationReview from "./views/teacher-application-review";
import TeacherApplicationSelfReview from "./views/teacher-application-self-view";
import FavoriteJobBoardTeacherView from "./views/job-board-favorite-teacher-view";
import SchoolSearchView from "./views/school-search-view";
import TeacherListSchoolView from "./views/teacher-list-school-view";
import TeacherSearchView from "./views/teacher-search-view";
// import SchoolAccountView from "./views/school-account-view";
import SchoolScheduleView from "./views/school-schedule-view";
import SchoolInterviewList from "./views/school-upcoming-interview-view";
import TeacherMessagingView from "./views/teacher-messaging-view";
import SchoolMessagingView from "./views/school-messaging-view";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/createjobpost",
    element: <CreateJobPostView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/jobboardschoolview",
    element: <JobBoardSchoolView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/jobboardteacherview",
    element: <JobBoardTeacherView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/detailsjobposting/:postId",
    element: <DetailsJobPosting />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacherdetailsjobposting/:postId",
    element: <TeacherDetailsJobPosting />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolaccountview",
    element: <JobBoardSchoolView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolprofileview",
    element: <SchoolProfileView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacheraccountview",
    element: <TeacherAccountView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/posts/:postId",
    element: <MainView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signed-up-teacher",
    element: <SignedUpTeacher />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/applyjobposting/:postId",
    element: <ApplyJobPosting />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/school-list-teacher-view",
    element: <SchoolListTeacherView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacher-list-school-view",
    element: <TeacherListSchoolView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin_teacher_view",
    element: <SignedUpTeacher />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/application_list/:postId",
    element: <ApplicationReview />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/application_review/:appId",
    element: <IndApplicationReview />, //school
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacher_application_review/:appId",
    element: <TeacherApplicationReview />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacher_application_self_review/:appId",
    element: <TeacherApplicationSelfReview />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacher-application-view",
    element: <TeacherApplicationList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/jobboardteacherview-favorites",
    element: <FavoriteJobBoardTeacherView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/application_review/:postId/question/:questionId",
    element: <ApplicationQuestionView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/school-search/:schoolId",
    element: <SchoolSearchView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolschedule",
    element: <SchoolScheduleView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacherschedule/:postId",
    element: <TeacherScheduleInterviewView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolinterviews",
    element: <SchoolInterviewList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teachermessaging/:schoolId",
    element: <TeacherMessagingView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teachermessaging",
    element: <TeacherMessagingView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolmessaging/:teacherId",
    element: <SchoolMessagingView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/schoolmessaging",
    element: <SchoolMessagingView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/teacher-search/:teacherId",
    element: <TeacherSearchView/>,
    errorElement: <ErrorPage />,
  },

  // {
  //   path: "/schoolinfoteacherview/:username",
  //   element: <SchoolInfoTeacherView />,
  //   errorElement: <ErrorPage />,
  // },
]);

function App() {
  // const user = useStore((state) => state.user);
  const clearTeacherUser = useStore((state) => state.clearTeacherUser);
  const clearSchoolUser = useStore((state) => state.clearSchoolUser);
  const { toast } = useToast();

  useEffect(() => {
    const token = getAuthenticatedTeacherUserToken();
    if (token) {
      const isExpired = isTeacherTokenExpired(token);
      if (isExpired) {
        clearTeacherUser();
        removeAuthenticatedTeacherUserToken();
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your teacher session has expired. Please login again.",
        });
      }
    }
    const schoolToken = getAuthenticatedSchoolUserToken();
    if (schoolToken) {
      const isExpired = isSchoolTokenExpired(schoolToken);
      if (isExpired) {
        clearSchoolUser();
        removeAuthenticatedSchoolUserToken();
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your school session has expired. Please login again.",
        });
      }
    }
  }, );

  return (
    <div className="flex justify-center min-h-screen">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
