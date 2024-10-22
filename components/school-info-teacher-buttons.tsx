import "../App.css";
import { useNavigate } from "react-router-dom";
import { sendFirstMessageAsSchool, sendFirstMessageAsTeacher } from "@/lib/api";
// import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
// import { SchoolJobEditDialog } from "./school-job-edit-dialog";

export default function SchoolInfoTeacherButtons({ params }) {
  const navigate = useNavigate();

  // const { deleteSchoolPostings } = useSchoolPostingQueryPosts();
  function viewPosting() {
    try {
      navigate("/school-search/" + params);
    } catch (error) {
      alert("Could not open school details. Please try again.");
    }
  }

  async function sendMessage() {
    try {
      await sendFirstMessageAsTeacher(params);
      navigate("/teachermessaging/" + params);
    } catch (error) {
      alert("Could not say hi. Please try again later");
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
        onClick={sendMessage}
        style={{
          width: "70px",
        }}
      >
        Say Hi
      </button>
    </div>
  );
}
