"use client";

import { SchoolProfile, TeacherUser } from "@/lib/types";
// import React from "react";
// import React, { useState } from "react";
import "../App.css";
// import JobPostingSchoolButtons from "./job-posting-school-buttons";
import TeacherSearchResultInfoButtons from "./teacher-search-result-info-buttons";

export default function TeacherSearchResultInfo({
  params,
}: {
  params: {
    teacher: TeacherUser;
  };
}) {
  return (
    <>
      <div className="list">
        <div>
          <p className="heading3">
            {params?.teacher?.first_name} {params?.teacher?.last_name}
          </p>
        </div>
        <div>
          {
            <TeacherSearchResultInfoButtons
              params={params?.teacher?.teacher_id}
            />
          }
        </div>
      </div>
    </>
  );
}
