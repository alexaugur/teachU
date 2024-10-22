import "../App.css";
import { useNavigate } from "react-router-dom";
import { sendFirstMessageAsSchool } from "@/lib/api";
// import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
// import { SchoolJobEditDialog } from "./school-job-edit-dialog";

export default function TeacherSearchResultInfoButtons({ params }) {
  const navigate = useNavigate();

  // const { deleteSchoolPostings } = useSchoolPostingQueryPosts();
  function viewPosting() {
    try {
      navigate("/teacher-search/" + params);
    } catch (error) {
      alert("Could not open school details. Please try again.");
    }
  }

  async function sayHi() {
    try {
      await sendFirstMessageAsSchool(params);
      navigate("/schoolmessaging/" + params);
    } catch (error) {
      alert("Could not open school details. Please try again.");
    }
  }
  return (
    <div className="flex">
      <button
        className="button right-margin"
        onClick={viewPosting}
        style={{
          width: "70px",
        }}
      >
        View
      </button>

      <button
        className="button"
        onClick={sayHi}
        style={{
          width: "70px",
        }}
      >
        Say Hi
      </button>
    </div>
  );
}
