"use client";
import "../App.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
// import { useNavigate } from "react-router-dom";
import { QuestionsAnswers } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolTeacherProfilePreview from "@/components/teachers/school-teacher-preview";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import TeacherQuestionsReview from "@/components/teacher-review-questions";

//import JobPosting from "../components/job-posting";
// const { postId } = useParams()
export default function TeacherApplicationSelfReview() {
  const { appId } = useParams();
  const navigate = useNavigate();

  const application = useStore((state) => state.application);

  const { loadApplication } = useApplicationPosts();

  useEffect(() => {
    // if (!application) {
    loadApplication(appId, false);
    // }
  }, [appId]);

  const goBack = () => {
    try {
      navigate("/teacher-application-view");
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  return (
    <div className="w-full">
      <HeaderNavBar />
      <div className="flex-center-screen bottom-margin">
        <div className="flex">
          <button
            className="button top-margin"
            style={{
              color: "#ffffff",
              backgroundColor: "#007bff",
              width: "180px",
              marginLeft: ".85rem",
            }}
            onClick={goBack}
          >
            Go Back To Applications
          </button>
          <SchoolTeacherProfilePreview user={application?.profile} />
        </div>

        <div className="rounded-card top-margin">
          <div className="form">
            <label htmlFor="eventlist" className="label1">
              YOUR APPLICATION ANSWERS
            </label>
            <div className="rounded-box">
              {application?.answers && application?.answers.length > 0 ? (
                application?.answers.map((answer: QuestionsAnswers) => (
                  <div className="form">
                    <TeacherQuestionsReview information={answer} />
                  </div>
                ))
              ) : (
                <p
                  className="top-margin bottom-margin"
                  style={{ marginLeft: ".85rem" }}
                >
                  No questions were asked by the school in this application.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
