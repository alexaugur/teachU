"use client";
import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SchoolAside from "@/components/school-aside";
// import { useNavigate } from "react-router-dom";
import { QuestionsAnswers } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolTeacherProfilePreview from "@/components/teachers/school-teacher-preview";
import SchoolQuestionsReview from "@/components/school-review-questions";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateComment } from "@/lib/api";

export default function IndApplicationReview() {
  const { appId } = useParams();

  const application = useStore((state) => state.application);
  const navigate = useNavigate();

  const { loadApplication } = useApplicationPosts();
  const [comment, setComment] = useState(application?.profile?.comment);

  useEffect(() => {
    loadApplication(appId, true);
  }, [appId]);

  useEffect(() => {
    setComment(application?.profile.comment);
  }, [application]);

  const onSave = () => {
    updateComment(appId, comment);
  };

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      <div>
        <SchoolTeacherProfilePreview user={application?.profile} />
      </div>
      <div className="flex flex-row space-x-5 px-[3rem]">
        <div
          className="rounded-card"
          style={{ marginTop: "30px", width: "90%" }}
        >
          <div className="form">
            <div className="flex">
              <p className="text3 right-margin">Application Status:</p>
              <p className="text3">
                {`${application?.profile?.app_status
                  .charAt(0)
                  .toUpperCase()}${application?.profile?.app_status.slice(1)}`}
              </p>
            </div>
            {application?.profile?.app_status == "interviewing" && (
              <div className="bottom-margin">
                <label htmlFor="eventlist" className="label1">
                  INTERVIEW INFORMATION
                </label>
                <div className="rounded-box" style={{ padding: ".75rem" }}>
                  <p className="text1">Interview Status: </p>
                  <p className="text3">Date: </p>
                  <p className="text3">Time: </p>
                  <p className="text3">Location: </p>
                </div>
              </div>
            )}
            <div className="bottom-margin">
              <label htmlFor="eventlist" className="label1">
                QUESTION ANSWERS
              </label>
              <div className="rounded-box">
                {application?.answers &&
                  application?.answers.map((answer: QuestionsAnswers) => (
                    <div className="form">
                      <SchoolQuestionsReview information={answer} />
                    </div>
                  ))}
              </div>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventlist" className="label1">
                COMMENTS
              </label>
              <div className="rounded-box" style={{ padding: ".75rem" }}>
                <Input
                  className="one-line-input bottom-margin"
                  type="text"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  placeholder="Add a comment"
                />
                <Button onClick={onSave}> Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
