"use client";
import "../App.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
// import { useNavigate } from "react-router-dom";
import { QuestionsAnswers } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolTeacherProfilePreview from "@/components/teachers/school-teacher-preview";
import SchoolQuestionsReview from "@/components/school-review-questions";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";

//import JobPosting from "../components/job-posting";
// const { postId } = useParams()
export default function TeacherApplicationReview() {
  const { appId } = useParams();

  const application = useStore((state) => state.application);

  const { loadApplication } = useApplicationPosts();

  useEffect(() => {
    // if (!application) {
      loadApplication(appId, true);
    // }
  }, [appId]);

  // console.log(post);
  //const router = useRouter();

  //   SchoolQuestionsReview
  return (
    <div className="w-full-screen">
        <HeaderNavBar />
      <div>
        <SchoolTeacherProfilePreview user={application?.profile} />
      </div>

      <div className="bottom-margin">
        <label htmlFor="eventlist" className="label1">
          Applications
        </label>

        {application?.answers &&
          application?.answers.map((answer: QuestionsAnswers) => (
            <div className="form">
              <SchoolQuestionsReview information={answer} />
            </div>
          ))}
        <div className="rounded-box"></div>
      </div>
    </div>
  );
}
