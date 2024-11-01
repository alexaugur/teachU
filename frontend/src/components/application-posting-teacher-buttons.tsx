import "../App.css";
import { useNavigate } from "react-router-dom";
import { PostingForApplication } from "@/lib/types";

export default function ApplicationTeacherButtons({
  application,
}: {
  application: PostingForApplication;
}) {
  const navigate = useNavigate();

  function viewPosting() {
    try {
      navigate("/teacher_application_self_review/" + application.id);
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
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
        View Application
      </button>
    </>
  );
}
