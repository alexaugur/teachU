"use client";

import { SchoolTeacherUser } from "@/lib/types";
// import React, { useState } from "react";
import "../App.css";
import ApplicationSchoolButtons from "./application-posting-school-buttons";
// import JobPostingSchoolButtons from "./job-posting-school-buttons";

export default function SchoolReviewPosting({
  application,
}: {
  application: SchoolTeacherUser;
}) {
  return (
    <>
      <div className="list">
        <div>
          <p className="heading3">
            Applicant: {application?.first_name} {application?.last_name}
          </p>
          <p className="text1">Email: {application?.email}</p>
          <p className="heading3">Score: {application?.score}</p>
        </div>
        <div>{<ApplicationSchoolButtons application={application} />}</div>
      </div>
    </>
  );
}
