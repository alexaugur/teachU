"use client";

import TeacherJobPosting from "@/components/teacher-jobboard-posting";
import "../App.css";
import { useStore } from "@/lib/store";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { JobPostings } from "@/lib/types";
import { useEffect } from "react";
import SearchPostings from "./teacher-job-search";
//import JobPosting from "../components/job-posting";

export default function TeacherJobBoard() {
  // const navigate = useNavigate();
  //   const schoolProfile = useStore((state) => state.schoolProfile);

  const teacherPostings = useStore((state) => state.teacherPostings);
  const { loadTeacherPostings } = useSchoolPostingQueryPosts();

  useEffect(() => {
    loadTeacherPostings();
  }, []);

  return (
    <>
      <div className="flex-center-screen">
        <div className="rounded-card top-margin">
          <div className="form">
            <h3 className="heading2 text-center">Job Board</h3>
          </div>
          <div className="form">
            <SearchPostings />

            <div className="bottom-margin">
              <div className="rounded-box">
                {teacherPostings && teacherPostings.length > 0 ? (
                  teacherPostings.map((posting: JobPostings) => (
                    <TeacherJobPosting params={posting} />
                  ))
                ) : (
                  <p
                    className="top-margin bottom-margin"
                    style={{ marginLeft: ".85rem" }}
                  >
                    No postings.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
