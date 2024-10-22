import "../App.css";
import { useNavigate } from "react-router-dom";
import { SchoolTeacherUser } from "@/lib/types";
import {
  interview_application,
  put_under_review,
  reject_application,
} from "@/lib/api";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import { useParams } from "react-router-dom";
import { useStore } from "@/lib/store";

export default function ApplicationSchoolButtons({
  application,
}: {
  application: SchoolTeacherUser;
}) {
  const navigate = useNavigate();
  const { postId } = useParams();
  const applicationType = useStore((state) => state.applicationType);

  function viewPosting() {
    try {
      navigate("/application_review/" + application.id);
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }

  const { loadApplications } = useApplicationPosts();

  async function review() {
    await put_under_review(application.id);
    loadApplications(postId, applicationType);
  }
  async function reject() {
    await reject_application(application.id);
    loadApplications(postId, applicationType);
  }

  async function interview() {
    await interview_application(application.id);
    loadApplications(postId, applicationType);
    // TODO: navigate to correct schedule with id from backend
    //navigate("/schoolschedule")
  }

  return (
    <>
      <button
        className="button"
        onClick={viewPosting}
        style={{
          width: "150px",
        }}
      >
        View In More Detail
      </button>

      <button
        className="button"
        onClick={review}
        style={{
          width: "150px",
        }}
      >
        Put Under Review
      </button>

      <button
        className="button"
        onClick={interview}
        style={{
          width: "150px",
        }}
      >
        Interview
      </button>

      <button
        className="button"
        onClick={reject}
        style={{
          width: "150px",
        }}
      >
        Reject
      </button>
    </>
  );
}
