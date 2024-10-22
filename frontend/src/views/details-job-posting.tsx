"use client";
import "../App.css";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { Questions } from "@/lib/types";
import SchoolQuestionsJobPosting from "@/components/school-questions-job-postings";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";

export default function DetailsJobPosting() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { post, loadPosting } = useSchoolPostingQueryPosts();
  const { questions, loadQuestions } = usePostingQuestions();
  const open = true; // Placeholder for backend status

  useEffect(() => {
    if (!post) {
      loadPosting(postId);
    }
  }, [postId, post]);

  useEffect(() => {
    if (!questions) {
      loadQuestions(postId);
    }
  }, [postId, questions]);

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
          className="button top-margin"
          style={{
            color: "#ffffff",
            backgroundColor: "#007bff",
            width: "180px",
            marginLeft: ".85rem",
          }}
          onClick={goBack}
        >
          Go Back To Dashboard
        </button>
      </div>
      <div className="flex-center-screen">
        <div className="rounded-card top-margin">
          <div className="form">
            <h3 className="heading2 text-center">{post?.job_info?.title}</h3>
            <p className="text1 text-center">
              {post?.job_info?.city}, {post?.job_info?.state}
            </p>
            <p className="text2 text-center">
              Status: {open ? "Open" : "Closed"}
            </p>
          </div>
          <div className="form">
            <div className="bottom-margin">
              <label htmlFor="eventname" className="label1">
                POSITION TITLE
              </label>
              <p className="text1">{post?.job_info?.title}</p>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdescrip" className="label1">
                SALARY ESTIMATE
              </label>
              <p className="text1">{post?.job_info?.salary_est}</p>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdate" className="label1">
                START DATE
              </label>
              <p className="text1">{post?.job_info?.start_date}</p>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdate" className="label1">
                DESCRIPTION
              </label>
              <p className="text1">{post?.job_info?.description}</p>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdate" className="label1">
                INTERVIEW LENGTH
              </label>
              <p className="text1">{post?.job_info?.interview_length}</p>
            </div>
            <div className="bottom-margin flex justify-between items-center">
              <div>
                <label htmlFor="eventdate" className="label1">
                  QUESTIONS
                </label>
              </div>
              <div>
                <label
                  htmlFor="eventdate"
                  className="label1"
                  style={{ textAlign: "center", color: "#E57373" }}
                >
                  GRADING CRITERIA
                </label>
              </div>
            </div>
            {questions &&
              questions.map((question: Questions) => (
                <SchoolQuestionsJobPosting
                  key={question.id}
                  question={question}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
