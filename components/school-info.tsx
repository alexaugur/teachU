"use client";

import { SchoolProfile } from "@/lib/types";
// import React from "react";
// import React, { useState } from "react";
import "../App.css";
// import JobPostingSchoolButtons from "./job-posting-school-buttons";
import SchoolInfoTeacherButtons from "./school-info-teacher-buttons";

export default function SchoolInfo({
  params,
}: {
  params: {
    school: SchoolProfile;
  };
}) {
  return (
    <>
      <div className="list">
        <div>
          <p className="heading3">{params?.school?.name}</p>
          <p className="text1">
            {params?.school?.city}, {params?.school?.state}
          </p>
        </div>
        <div>
          {<SchoolInfoTeacherButtons params={params?.school?.school_id} />}
        </div>
      </div>
    </>
  );
}
