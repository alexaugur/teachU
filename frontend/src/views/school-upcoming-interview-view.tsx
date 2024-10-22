"use client";
import "../App.css";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
import { PostingForApplication, TeacherInterview } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
// import SchoolReviewPosting from "@/components/school-review-board-application";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import TeacherReview from "@/components/teacher-review-board-application";
// import TeacherInterviewStatus from "@/components/interview-status";
import SchoolInterview from "@/components/school-interview";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
//import JobPosting from "../components/job-posting";
// const { postId } = useParams()
export default function SchoolInterviewList() {
  const interviews = useStore((state) => state.interviews);

  const schoolUser = useStore((state) => state.schoolUser);

  const { loadInterviews } = useApplicationPosts();
  //   const [applicationType, setApplicationType] = useState("submitted");

  useEffect(() => {
    console.log(schoolUser);
    if (schoolUser) {
      loadInterviews();
    }
  }, [schoolUser]);

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      {schoolUser ? (
        <div className="flex-center-screen">
          <div className="rounded-card top-margin">
            <div className="form">
              <h3 className="heading2 text-center">Interviews</h3>
            </div>
            <div className="form">
              <div className="flex rounded-box">
                {interviews && interviews.length > 0 ? (
                  interviews.map((interview: TeacherInterview) => (
                    <div className="flex">
                      <SchoolInterview interview={interview} />
                    </div>
                  ))
                ) : (
                  <p
                    className="top-margin bottom-margin"
                    style={{ marginLeft: ".85rem" }}
                  >
                    No interviews scheduled.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your interviews.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
