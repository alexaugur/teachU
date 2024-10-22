"use client";
import "../App.css";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Questions } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import TeacherQuestionsJobPosting from "@/components/teacher-questions-job-posting";
import { useStore } from "@/lib/store";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
// import { create_answers, create_application } from "@/lib/api";

export default function TeacherDetailsJobPosting() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { post, loadPostingAsTeacher } = useSchoolPostingQueryPosts();
  const { questions, loadQuestions, createAnswers, createApplication } =
    usePostingQuestions();
  const answers2 = useStore((state) => state.answers2);

  useEffect(() => {
    // if (postId) {
    //   console.log("occuring")
    // }
    loadPostingAsTeacher(postId);
  }, [postId]);

  useEffect(() => {
    loadQuestions(postId);
  }, [postId]);

  // console.log(post, questions);
  //const router = useRouter();
  async function handleClick() {
    try {
      const appId = await createApplication(postId);

      if (answers2 && appId) {
        answers2.forEach(async (answer, index) => {
          if (answers2[index] && questions[index]) {
            await createAnswers(appId, answer, questions[index].id.toString());
          }
        });
      }
      navigate(`/jobboardteacherview`);
    } catch (error) {
      alert("Could not create job post. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <HeaderNavBar />
      <div className="flex-center-screen">
        <div className="rounded-card top-margin">
          <div className="form">
            <h3 className="heading2 text-center"> {post?.job_info?.title} </h3>
            <p className="heading1 text-center">
              {" "}
              {post?.job_info?.description}{" "}
            </p>
            {/* <p className="text1">School name</p> */}
            <p className="text1">
              {post?.job_info?.city}, {post?.job_info?.state}
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
              <label htmlFor="questions" className="label1">
                QUESTIONS
              </label>
              {questions &&
                questions.map((question: Questions, index) => (
                  <TeacherQuestionsJobPosting
                    question={question}
                    index={index}
                  />
                ))}
            </div>
            <button className="button" onClick={handleClick}>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
