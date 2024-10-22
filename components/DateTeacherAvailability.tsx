"use client";

import "../App.css";
import { Questions, Rubric, SchoolAvailability } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  addSchoolAvailability,
  create_rubric,
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
import Availability from "./availability";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useStore } from "@/lib/store";
import { Select } from "./ui/select";
import TeacherAvailability from "./availability-teacher";

export default function DateTeacherAvailability({
  availabilities,
  date,
  interview_length,
}: {
  availabilities: SchoolAvailability[];
  date: string;
  interview_length: number;
}) {
  //grab all availabilities for the school
  // iterate through start and end time
  // get interview length

  const [start_hour, setStart_hour] = useState("00");
  const [start_minute, setStart_minute] = useState("00");

  const [end_hour, setEnd_hour] = useState("00");
  const [end_minute, setEnd_minute] = useState("00");

  const setAvailabilities = useStore((state) => state.setAvailabilities);

  const handleNewTime = async () => {
    try {
      if (start_hour > end_hour) {
        toast({
          variant: "destructive",
          title: "Sorry! End Time must be greater than Start Time!",
          description: `Please enter valid times`,
        });
        return;
      }

      if (start_hour == end_hour) {
        if (start_minute > end_minute) {
          toast({
            variant: "destructive",
            title: "Sorry! End Time must be greater than Start Time!",
            description: `Please enter valid times`,
          });
        }
        return;
      }

      const start_time = start_hour + ":" + start_minute + ":00";
      const end_time = end_hour + ":" + end_minute + ":00";

      await addSchoolAvailability(date, start_time, end_time);
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
      toast({
        variant: "destructive",
        title: "Sorry! Something went wrong!",
        description: `There was error adding the availability.`,
      });
    }
  };

  const handleCancel = () => {
    setEnd_hour("00");
    setEnd_minute("00");
    setStart_hour("00");
    setStart_minute("00");
  };


  return (
    <>
      <div className="form">
        <strong>DATE: {date}</strong>
        {availabilities &&
          availabilities.map((availability) => (
            <div>
              <label className="text2">TIMES AVAILABLE:</label>
              <TeacherAvailability
                availability={availability}
                interview_length={interview_length}
              />
            </div>
          ))}
      </div>
    </>
  );
}
