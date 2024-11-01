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

export default function DateAvailability({
  availabilities,
  date,
}: {
  availabilities: SchoolAvailability[];
  date: string;
}) {
  // const rubrics = await get_rubric(question.id.toString());

  //   const [start_time, setStart_time] = useState("");
  //   const [end_time, setEnd_time] = useState("");

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
        handleCancel();
        return;
      }

      if (start_hour == end_hour) {
        if (start_minute > end_minute) {
          toast({
            variant: "destructive",
            title: "Sorry! End Time must be greater than Start Time!",
            description: `Please enter valid times`,
          });
          handleCancel();
          return;
        }
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
          handleCancel();
          console.error("Error:", error);
        });
        handleCancel();

    } catch (error) {
      handleCancel();
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
      {/* <div className="flex" style={{ marginBottom: "5px" }}> */}
      {/* <div className="flex justify-center" style={{ width: "69.5%" }}> */}
      <div className="rounded-card bottom-margin" style={{ padding: ".75rem" }}>
        <strong>DATE: {date}</strong>
        {availabilities &&
          availabilities.map((availability) => (
            <>
              <div>
                <label className="text2">TIMES:</label>
                <Availability availability={availability} />
              </div>
            </>
          ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label={"Click to login"}
              variant="default"
              style={{ marginLeft: "2px", marginTop: "2px", width: "166px" }}
            >
              Add Another Time
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Time</DialogTitle>
              <DialogDescription>
                Add a new time that doesn't overlap with other ones here:
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="username" className="text-right">
                  Start Time
                </Label>
                <select onChange={(e) => setStart_hour(e.target.value)}>
                  <option value="00">00</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                </select>
                <select onChange={(e) => setStart_minute(e.target.value)}>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="username" className="text-right">
                  End Time
                </Label>
                <select onChange={(e) => setEnd_hour(e.target.value)}>
                  <option value="00">00</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                </select>
                <select onChange={(e) => setEnd_minute(e.target.value)}>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant={"secondary"}
                  type="reset"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleNewTime}>
                  Update
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* </div> */}
      {/* //   </div> */}
    </>
  );
}
