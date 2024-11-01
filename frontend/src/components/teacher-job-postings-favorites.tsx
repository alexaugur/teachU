"use client";

import TeacherJobPosting from "@/components/teacher-jobboard-posting";
import "../App.css";
import { useStore } from "@/lib/store";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { JobPostings } from "@/lib/types";
import { useEffect } from "react";
//import JobPosting from "../components/job-posting";

export default function FavoriteTeacherJobBoard() {
  // const navigate = useNavigate();
  //   const schoolProfile = useStore((state) => state.schoolProfile);

  const teacherPostings = useStore((state) => state.teacherPostings);
  const { loadTeacherFavoritePostings } = useSchoolPostingQueryPosts();

  useEffect(() => {
    loadTeacherFavoritePostings();
  }, []);

  return (
    <>
      <div className="flex-center-screen">
        <div className="rounded-card top-margin ">
          <div className="form">
            <h3 className="heading2 text-center">Favorites</h3>
          </div>
          <div className="form">
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
                    No favorites.
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
