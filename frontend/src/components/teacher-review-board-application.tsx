"use client";

import { PostingForApplication } from "@/lib/types";
import "../App.css";
import ApplicationTeacherButtons from "./application-posting-teacher-buttons";
import TeacherInterviewingButton from "./teacher-interviewing-button";

export default function TeacherReview({
  application,
}: {
  application: PostingForApplication;
}) {
  return (
    <>
      <div className="list" style={{ width: "375px" }}>
        <div className="right-margin" style={{ width: "200px" }}>
          <p className="text3">Title: {application?.title} </p>
          <p className="text1">{application?.school}</p>
          <p className="text1">
            {application?.city}, {application?.state}
          </p>
          <ApplicationTeacherButtons application={application} />
        </div>
        {application.app_status == "interviewing" && (
          <TeacherInterviewingButton application={application} />
        )}
      </div>
    </>
  );
}
