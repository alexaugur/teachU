"use client";

import { cancelInterviewAsSchool } from "@/lib/api";
import {  PostingForApplication, TeacherInterview } from "@/lib/types";
// import React, { useState } from "react";
import "../App.css";
// import ApplicationSchoolButtons from "./application-posting-school-buttons";
import ApplicationTeacherButtons from "./application-posting-teacher-buttons";
import TeacherInterviewingButton from "./teacher-interviewing-button";
// import JobPostingSchoolButtons from "./job-posting-school-buttons";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

export default function SchoolInterview({ interview }: {interview: TeacherInterview}) {

  const { loadInterviews } = useApplicationPosts();

  async function cancelInterview() {
    try {
      await cancelInterviewAsSchool(interview.id);
      loadInterviews();
    }
    catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to cancel interview",
        description: (error as Error).message || "There was an error cancelling the interview",
      })
    }
  }
  return (
    <>
      <div className="list">
        <div>
          <p className="text1"> Date: {interview?.date} </p>
          <p className="text1"> Start Time: {interview?.start_time}</p>
          <p className="text1"> End Time: {interview?.end_time}</p>
        </div>
        <Button onClick={cancelInterview}>
          Cancel
        </Button>
        {/* <div>{<ApplicationTeacherButtons application={application} />}</div> */}
      </div>
    </>
  );
}
