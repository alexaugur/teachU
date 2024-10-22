"use client";
import "../App.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
import { SchoolTeacherUser } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolReviewPosting from "@/components/school-review-board-application";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { useNavigate } from "react-router-dom";
import {  FaArrowCircleLeft } from "react-icons/fa";

// import SchoolInterviewStatus from "@/components/interview-status";

export default function ApplicationReview() {
  const { postId } = useParams();

  const applicationType = useStore((state) => state.applicationType);
  const setApplicationType = useStore((state) => state.setApplicationType);
  const clearAnswers = useStore((state) => state.clearAnswers);
  const questions = useStore((state) => state.postingQuestions);
  const { loadQuestions } = usePostingQuestions();
  const navigate = useNavigate();

  const { loadApplications, applications } = useApplicationPosts();

  useEffect(() => {
    if (postId) {
      loadApplications(postId, applicationType);
      loadQuestions(postId);
      clearAnswers();
  
    }
  }, [postId, applicationType]);

  const viewQuestion = (questionId) => {

    try {
      navigate("/application_review/" + postId + "/question/" + questionId);
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  const goBack = () => {
    try {
      navigate("/schoolaccountview");
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  return (
    <div>
      <div className="w-full">
        <SchoolHeaderNavBar />
        <button
        className="ml-4 my-4 bg-gray-200 p-2 rounded hover:bg-gray-300 flex items-center"
        onClick={goBack}
        title="Go Back to Dashboard" 
      >
        <FaArrowCircleLeft className="mr-1" /> Back
      </button>
      </div>
      <div className="flex-center-screen top-margin">
        <div className="rounded-box text-center bottom-margin" key="viewBy">
          <h2 className="text3">View applications by:</h2>
          <div className="questions-nav">
            {questions &&
              questions.map((question) => (
                <button
                  key={question.id}
                  className="question-btn"
                  onClick={() => viewQuestion(question.id)}
                >
                  {question.content}
                </button>
              ))}
          </div>
        </div>

        <select
          className="select-input bottom-margin"
          onChange={(e) => setApplicationType(e.target.value)}
        >
          <option value="submitted"> Under Review</option>
          <option value="interviewing">Currently Interviewing</option>
          <option value="rejected">No Longer Under Consideration</option>
        </select>
        <div className="rounded-card">
          <div className="form">
            <div className="rounded-card">
              <div className="form">
                <div className="bottom-margin">
                  <label htmlFor="eventlist" className="label1">
                    Applications
                  </label>
                  <div className="rounded-box">
                    {applications && applications.length > 0 ? (
                      applications.map((application: SchoolTeacherUser) => (
                        <>
                          <SchoolReviewPosting application={application} />
                        </>
                      ))
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
        </div>
      </div>
    </div>
  );
}
