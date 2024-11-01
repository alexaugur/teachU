"use client";

import "../App.css";
import { Questions, Rubric, SchoolAvailability } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  create_rubric,
  deleteSchoolAvailability,
  delete_rubric,
  fetchSchoolAvailabilities,
  update_rubric,
} from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { toast } from "./ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "@/lib/store";

export default function Availability({
  availability,
}: {
  availability: SchoolAvailability;
}) {
  // const rubrics = await get_rubric(question.id.toString());
  const setAvailabilities = useStore((state) => state.setAvailabilities);

  async function handleDelete() {
    try {
      await deleteSchoolAvailability(availability.id);
      fetchSchoolAvailabilities()
        .then((data) => {
          const dictionary = {};
          data.forEach((availability) => {
            if (availability.date in dictionary) {
              dictionary[availability.date].push(availability);
            } else {
              dictionary[availability.date] = [availability];
            }
          });

          setAvailabilities(dictionary);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      ("error deleting availability");
    }
  }

  return (
    <>
      <div className="flex" style={{ marginBottom: "5px" }}>
        <div className="flex " style={{ width: "69.5%" }}>
          <div
            className="flex text-area"
            style={{ width: "36%", marginRight: "10px" }}
          >
            <div className="text4">
              {availability.start_time} - {availability.end_time}
            </div>
          </div>
          <Button onClick={handleDelete} style={{ height: "50px" }}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
