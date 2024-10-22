"use client";

import "../App.css";
import { Questions, Rubric, SchoolAvailability } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  create_rubric,
  deleteSchoolAvailability,
  delete_rubric,
  fetchSchoolAvailabilities,
  scheduleInterview,
  update_rubric,
} from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { toast } from "./ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "@/lib/store";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function TeacherAvailability({
  availability,
  interview_length,
}: {
  availability: SchoolAvailability;
  interview_length: number;
}) {
  // const rubrics = await get_rubric(question.id.toString());
  const setAvailabilities = useStore((state) => state.setAvailabilities);

  const { postId } = useParams();
  const navigate = useNavigate();

  function generateInterviewStartTimes(start_time, end_time) {
    // Convert start and end times to Date objects
    const startTime = new Date(`2000-01-01T${start_time}`);
    const endTime = new Date(`2000-01-01T${end_time}`);

    // Calculate the duration of each interview slot in milliseconds
    const slotDuration = interview_length * 60 * 1000;

    const fifteen_slot = 15 * 60 * 1000;

    // Initialize an array to store the result
    const result = [];

    // Iterate over the time range and add interview start times to the result
    let currentStartTime = new Date(startTime.getTime());
    let currentEndTime = new Date(startTime.getTime() + slotDuration);
    while (currentEndTime <= endTime) {
      result.push(
        currentStartTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      // Move to the next interview slot
      currentStartTime = new Date(currentStartTime.getTime() + fifteen_slot);
      currentEndTime = new Date(currentEndTime.getTime() + fifteen_slot);
    }

    return result;
  }

  async function handleSelectTime(time) {
    try {
      const startTime = new Date(`2000-01-01T${time}`);
      const slotDuration = interview_length * 60 * 1000;
      const endTime = new Date(startTime.getTime() + slotDuration);
      const endTimeString = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      await scheduleInterview(postId, availability.date, time, endTimeString);

      navigate("/teacher-application-view");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! Error scheduling interview",
        description: `Please try again.`,
      });
    }

    //create(pass in all parameters needed)
  }

  const [start_times, setStart_times] = useState(
    generateInterviewStartTimes(availability.start_time, availability.end_time)
  );

  useEffect(() => {
    setStart_times(generateInterviewStartTimes(availability.start_time, availability.end_time));
  }), [interview_length];

  //   console.log(generateInterviewStartTimes(availability.start_time, availability.end_time, 30))

  return (
    <>
      <div className="flex" style={{ marginBottom: "5px" }}>
        <div className="flex" style={{ marginRight: "5px" }}>
          {start_times &&
            start_times.length > 0 &&
            start_times.map((start_time) => (
              <Button
                onClick={() => handleSelectTime(start_time)}
                style={{ marginRight: "5px" }}
              >
                {start_time}
              </Button>
            ))}
        </div>
      </div>
    </>
  );
}
