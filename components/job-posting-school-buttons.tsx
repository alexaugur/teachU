import "../App.css";
import { useNavigate } from "react-router-dom";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { SchoolJobEditDialog } from "./school-job-edit-dialog";
import { JobPostings } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faInfoCircle,
  faTrash,
  faUsers,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { updatedPostingsStatus } from "@/lib/api";
// import { useState } from "react";

export default function JobPostingSchoolButtons({
  params,
  setOpen,
  open,
}: {
  params: JobPostings;
  setOpen: any;
  open: boolean;
}) {
  const navigate = useNavigate();

  const { deleteSchoolPostings } = useSchoolPostingQueryPosts();
  function viewPosting() {
    try {
      navigate("/detailsjobposting/" + params.id);
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }

  function viewApplication() {
    try {
      navigate("/application_list/" + params.id);
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }

  function deletePosting() {
    try {
      deleteSchoolPostings(params.id);
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }

  async function closeApplication() {
    try {
      if (open) {
        await updatedPostingsStatus(params.id, "closed");
        setOpen(false);
      } else {
        await updatedPostingsStatus(params.id, "open");
        setOpen(true);
      }
    } catch (error) {
      alert("Could not create event. Please try again.");
    }
  }
  return (
    <>
      <div className="flex justify-center text-center">
        <button
          className="button"
          onClick={viewPosting}
          style={{
            width: "40px",
            marginLeft: "2px",
          }}
          title="View Details"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button
          className="button"
          onClick={deletePosting}
          style={{
            width: "40px",
            marginLeft: "2px",
          }}
          title="Delete Posting"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          className="button"
          onClick={viewApplication}
          style={{
            width: "40px",
            marginLeft: "2px",
          }}
          title="View Applications"
        >
          <FontAwesomeIcon icon={faUsers} />
        </button>

        {open ? (
          <button
            className="button"
            onClick={closeApplication}
            style={{
              width: "40px",
              marginLeft: "2px",
            }}
            title="Close Posting"
          >
            <FontAwesomeIcon icon={faWindowClose} />
          </button>
        ) : (
          <button
            className="button"
            onClick={closeApplication}
            style={{
              width: "40px",
              marginLeft: "2px",
            }}
            title="Open Posting"
          >
            <FontAwesomeIcon icon={faCheckSquare} />
          </button>
        )}
      </div>
      <SchoolJobEditDialog params={params} />
    </>
  );
}
