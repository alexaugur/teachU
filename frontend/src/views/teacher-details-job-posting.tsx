"use client";
import "../App.css";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Questions } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import TeacherQuestionsJobPosting from "@/components/teacher-questions-job-posting";
// import TeacherButton from "@/components/teacher-button";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { useStore } from "@/lib/store";
import { addFavorite, deleteFavorite, getFavorite } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function TeacherDetailsJobPosting() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { questions, loadQuestions } = usePostingQuestions();
  const { post, loadPostingAsTeacher } = useSchoolPostingQueryPosts();

  const [favorited, setFavorited] = useState(false);

  const fetchFavorited = async () => {
    const favorite = await getFavorite(postId);
    setFavorited(favorite);
  };

  useEffect(() => {
    if (postId) {
      fetchFavorited();
    }
  }, [postId]);

  const teacherUser = useStore((state) => state.teacherUser);

  useEffect(() => {
    if (postId) {
      loadPostingAsTeacher(postId.toString());
    }
  }, [postId, teacherUser]);

  useEffect(() => {
    if (questions) {
      loadQuestions(postId);
    }
  }, [postId, teacherUser]);

  //const router = useRouter();
  async function handleClick() {
    try {
      navigate(`/applyjobposting/${postId}`);
    } catch (error) {
      alert("Could not create job post. Please try again.");
    }
  }

  async function handleFavorite() {
    try {
      if (favorited) {
        await deleteFavorite(postId);
        setFavorited(false);
      } else {
        await addFavorite(postId);
        setFavorited(true);
      }
    } catch (error) {
    }
  }

  return (
    <div>
      <HeaderNavBar />

      {teacherUser && (
        <div className="flex-center-screen">
          <Button onClick={handleFavorite}>
            {" "}
            {favorited ? "Unfavorite" : "Favorite"}{" "}
          </Button>
          <div className="rounded-card">
            <div className="form">
              <h3 className="heading2 text-center">
                {" "}
                {post?.job_info?.title}{" "}
              </h3>
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
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {!teacherUser && <h1>Please login to view this page.</h1>}
    </div>
  );
}
