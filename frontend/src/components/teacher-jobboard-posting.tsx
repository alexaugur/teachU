"use client";

import { JobInfo } from "@/lib/types";
// import React, { useState } from "react";
import "../App.css";
// import JobPostingSchoolButtons from "./job-posting-school-buttons";
import JobPostingTeacherButtons from "./job-posting-teacher-buttons";

export default function TeacherJobPosting({
  params,
}: {
  params: { id: number; job_info: JobInfo; school_id: number };
}) {
  return (
    <>
      <div className="list">
        <div>
          <p className="text1">{params.job_info.start_date}</p>
          <p className="heading3">{params.job_info.title}</p>
          <p className="text1">
            {params.job_info.city}, {params.job_info.state}
          </p>
          <p className="text1">{params.job_info.description}</p>
        </div>
        <div>{<JobPostingTeacherButtons params={params} />}</div>
      </div>
    </>
  );
}
