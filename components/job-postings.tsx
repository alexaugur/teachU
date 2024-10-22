"use client";

import { JobPostings } from "@/lib/types";
import { useStore } from "../lib/store";
import "../App.css";
import JobPostingSchoolButtons from "./job-posting-school-buttons";
// import JobPostingTeacherButtons from "./job-posting-teacher-buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  // faTimesCircle,
  // faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function JobPosting({ params }: { params: JobPostings }) {
  const schoolUser = useStore((state) => state.schoolUser);
  const applicants = params.num_applicants;
  15; //TODO: change to count applications array
  // const rejected = 5; //TODO: pull from backend
  // const review = applicants - rejected;
  // const open = params.closed == "open"; //TODO: pull from backend

  const [open, setOpen] = useState(params.closed == "open"); //TODO: pull from backend

  function setPosting(par) {
    setOpen(par);
  }

  return (
    <>
      <div className="list">
        <div>
          <p className="text1">{params?.job_info?.post_date}</p>
          <p className="heading3">{params?.job_info?.title}</p>
          <p className="text1">
            {params?.job_info?.city}, {params?.job_info?.state}
          </p>
          {schoolUser && (
            <p className="flex text2">
              <div style={{ marginRight: "7px" }}>
                <FontAwesomeIcon icon={faUsers} /> {applicants}
              </div>
              <div>
                <p>Status: {open ? "Open" : "Closed"} </p>
              </div>
            </p>
          )}
        </div>
        <div>
          {
            <JobPostingSchoolButtons
              params={params}
              setOpen={setPosting}
              open={open}
            />
          }
        </div>
      </div>
    </>
  );
}
