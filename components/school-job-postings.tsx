"use client";
import JobPosting from "@/components/job-postings";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import useMutationSchoolUser from "@/hooks/use-mutations-schools";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { JobPostings } from "@/lib/types";
import { useEffect } from "react";
import { Button } from "./ui/button";
//import JobPosting from "../components/job-posting";

export default function SchoolJobBoard() {
  const navigate = useNavigate();
  // const schoolUser: any = useStore((state) => state.schoolUser);
  const schoolProfile = useStore((state) => state.schoolProfile);
  //   const schoolProfile = useStore((state) => state.schoolProfile);

  const schoolPostings = useStore((state) => state.schoolPostings);

  const { getSchoolProfile } = useMutationSchoolUser();
  const { loadPostings } = useSchoolPostingQueryPosts();

  useEffect(() => {
    getSchoolProfile();
  }, []);

  if (!schoolPostings) {
    loadPostings();
  }

  function handleClick() {
    try {
      navigate("/createjobpost");
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }

  return (
    <>
      <div className="flex-center-screen">
        <div className="rounded-card top-margin">
          <div className="form">
            <h3 className="heading2 text-center">
              Welcome {schoolProfile?.name}
            </h3>
          </div>
          <div className="form">
            <Button
              className="button bottom-margin"
              onClick={handleClick}
              style={{
                width: "170px",
              }}
            >
              Create New Posting
            </Button>
            <div className="bottom-margin">
              <label htmlFor="eventlist" className="label1">
                POSTINGS
              </label>
              <div className="rounded-box">
                {schoolPostings && schoolPostings.length > 0 ? (
                  schoolPostings.map((posting: JobPostings) => (
                    <JobPosting params={posting} />
                  ))
                ) : (
                  <p
                    className="top-margin bottom-margin"
                    style={{ marginLeft: ".85rem" }}
                  >
                    No job postings created.
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
