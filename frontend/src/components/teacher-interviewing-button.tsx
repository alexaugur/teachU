import "../App.css";
import { useNavigate } from "react-router-dom";
import { PostingForApplication, TeacherInterview } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cancelInterviewAsTeacher, getInterviewIfExists } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function TeacherInterviewingButton({
  application,
}: {
  application: PostingForApplication;
}) {
  const navigate = useNavigate();
  // check if an availability object exists
  const teacherUser = useStore((state) => state.teacherUser);

  const [interview, setInterview] = useState(false);

  const [interviewData, setInterviewData] = useState<TeacherInterview>();

  function scheduleInterview() {
    try {
      navigate("/teacherschedule/" + application.posting_id);
    } catch (error) {
      alert("Could not open school details. Please try again.");
    }
  }

  async function cancelInterview() {
    try {
      await cancelInterviewAsTeacher(interviewData?.id);
      getInterviewIfExists(application.posting_id)
        .then((data) => {
          if (data["message"] == "No interview scheduled") {
            setInterview(false);
          } else {
            setInterview(true);
            setInterviewData(data["interview"]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      alert("Could not cancel interview");
    }
  }

  useEffect(() => {
    if (teacherUser) {
      getInterviewIfExists(application.posting_id)
        .then((data) => {
          if (data["message"] == "No interview scheduled") {
            setInterview(false);
          } else {
            setInterview(true);
            setInterviewData(data["interview"]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <>
      <div style={{ width: "200px" }}>
        <p className="heading3">Interview Status:</p>
        <>
          {interview ? (
            <>
              <p className="text3">Date: {interviewData?.date}</p>
              <p className="text2">
                Time: {interviewData?.start_time}-{interviewData?.end_time}
              </p>
              <Button onClick={cancelInterview}>Cancel interview</Button>
            </>
          ) : (
            <Button
              className="button"
              style={{
                width: "150px",
              }}
              onClick={scheduleInterview}
            >
              Schedule interview
            </Button>
          )}
        </>
      </div>
    </>
  );
}
