import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar.tsx";
//import { useStore } from "@/lib/store";
//import { users } from "../lib/data.ts";
import SchoolProfilePreview from "@/components/school/school-profile-preview";
import { useStore } from "@/lib/store.ts";
import { useEffect, useState } from "react";
import { fetchSchoolProfileDetails } from "@/lib/api.ts";
import SchoolJobListingSection from "@/components/school/school-job-listing-section";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { useNavigate } from "react-router-dom";
import TimeSlots from "../components/time-slots";
import { addSchoolAvailability, fetchSchoolAvailabilities } from "@/lib/api";
import DateAvailability from "@/components/DateAvailability";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function SchoolScheduleView() {
  const navigate = useNavigate();
  const schoolUser = useStore((state) => state.schoolUser);

  // const [profileData, setProfileData] = useState(null);
  const [dList, setDList] = useState([""]);

  const availabilities = useStore((state) => state.availabilities);
  const setAvailabilities = useStore((state) => state.setAvailabilities);

  const [start_hour, setStart_hour] = useState("00");
  const [start_minute, setStart_minute] = useState("00");

  const [end_hour, setEnd_hour] = useState("00");
  const [end_minute, setEnd_minute] = useState("00");


  const [date, setDate] = useState<Date>(new Date());

  const handleCancel = () => {
    setEnd_hour("00");
    setEnd_minute("00");
    setStart_hour("00");
    setStart_minute("00");
  };

  const handleNewTime = async () => {
    //  start_minute, end_hour, end_minute)
    try {
      const formattedDate = date.toISOString().slice(0, 10);

      if (formattedDate == "") {
        toast({
          variant: "destructive",
          title: "Sorry! Date is required!",
          description: `Please enter valid date.`,
        });
        setEnd_hour("00");
        setEnd_minute("00");
        setStart_hour("00");
        setStart_minute("00");
        handleCancel();

        return;
      }

      if (start_hour > end_hour) {
        toast({
          variant: "destructive",
          title: "Sorry! End Time must be greater than Start Time!",
          description: `Please enter valid times`,
        });
        setEnd_hour("00");
        setEnd_minute("00");
        setStart_hour("00");
        setStart_minute("00");
        handleCancel();
        return;
      }

      if (start_hour == end_hour) {
        if (start_minute >= end_minute) {
          toast({
            variant: "destructive",
            title: "Sorry! End Time must be greater than Start Time!",
            description: `Please enter valid times`,
          });
          setEnd_hour("00");
          setEnd_minute("00");
          setStart_hour("00");
          setStart_minute("00");
          handleCancel();
          return;
        }
      }

      const start_time = start_hour + ":" + start_minute + ":00";
      const end_time = end_hour + ":" + end_minute + ":00";
      await addSchoolAvailability(formattedDate, start_time, end_time);
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
          setEnd_hour("00");
          setEnd_minute("00");
          setStart_hour("00");
          setStart_minute("00");
          handleCancel();
          console.error("Error:", error);
        });
      setEnd_hour("00");
      setEnd_minute("00");
      setStart_hour("00");
      setStart_minute("00");
      handleCancel();

      // setAvailabilities(await fetchSchoolAvailabilities());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! Something went very very  wrong!",
        description: `There was error adding the availability.`,
      });
      setEnd_hour("00");
      setEnd_minute("00");
      setStart_hour("00");
      setStart_minute("00");
      handleCancel();
    }
  };

  // const [availabilities, setAvailabilities] = useState({});

  useEffect(() => {
    if (schoolUser) {
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
    }
  }, [schoolUser]);

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      {schoolUser ? (
        <div className="flex-center-screen">
          <div className="rounded-card top-margin">
            <div className="form">
              <h3 className="heading2 text-center">Schedule</h3>
            </div>
            <div style={{ padding: ".75rem" }}>
              {availabilities &&
                Object.keys(availabilities).map((key) => {
                  return (
                    <DateAvailability
                      availabilities={availabilities[key]}
                      date={key}
                    />
                  );
                })}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    aria-label={"Click to login"}
                    variant="default"
                    style={{
                      marginLeft: "2px",
                      marginTop: "2px",
                      width: "166px",
                    }}
                  >
                    Add Another Date
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Time</DialogTitle>
                    <DialogDescription>
                      Add a new time that doesn't overlap with other ones here:
                    </DialogDescription>
                  </DialogHeader>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your schedule.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
