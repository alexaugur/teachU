"use client";
import "../App.css";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
import { PostingForApplication } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
// import SchoolReviewPosting from "@/components/school-review-board-application";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import TeacherReview from "@/components/teacher-review-board-application";
// import TeacherInterviewStatus from "@/components/interview-status";
//import JobPosting from "../components/job-posting";
// const { postId } = useParams()
export default function TeacherApplicationList() {
  const postingApplications = useStore((state) => state.postingApplications);

  const teacherUser = useStore((state) => state.teacherUser);

  const { loadTeacherApplications } = useApplicationPosts();
  const [applicationType, setApplicationType] = useState("submitted");

  useEffect(() => {
    if (teacherUser) {
      loadTeacherApplications(applicationType);
    }
  }, [teacherUser, applicationType]);

  // console.log(post);
  //const router = useRouter();

  return (
    <div className="w-full">
      <HeaderNavBar />
      {/* <div className="flex float-right w-[300px]">
      </div> */}
      {teacherUser ? (
        <div className="flex-center-screen">
          <div className="rounded-card top-margin">
            <div className="form">
              <h3 className="heading2 text-center">Applied Jobs</h3>
            </div>

            <div className="form">
              <select
                className="select-input"
                style={{ marginLeft: ".85rem", width: "300px" }}
                onChange={(e) => setApplicationType(e.target.value)}
              >
                <option value="submitted">Under Review</option>
                <option value="interviewing">Currently Interviewing</option>
                <option value="rejected">No Longer Under Consideration</option>
              </select>
              <div className="form">
                <label htmlFor="eventlist" className="label1">
                  APPLICATIONS
                </label>
                <div className="flex rounded-box" style={{ width: "100vw" }}>
                  {postingApplications && postingApplications.length > 0 ? (
                    postingApplications.map(
                      (application: PostingForApplication) => (
                        <div className="flex">
                          <TeacherReview application={application} />
                        </div>
                      )
                    )
                  ) : (
                    <p
                      className="top-margin bottom-margin"
                      style={{ marginLeft: ".85rem" }}
                    >
                      No applications in this category.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your applications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
