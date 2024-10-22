import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar.tsx";
//import { useStore } from "@/lib/store";
//import { users } from "../lib/data.ts";
import SchoolProfilePreview from "@/components/school/school-profile-preview";
import { useStore } from "@/lib/store.ts";
import { useEffect, useState } from "react";
import { fetchSchoolProfileDetails } from "@/lib/api.ts";
import SchoolJobListingSection from "@/components/school/school-job-listing-section";
import TeacherHeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { useNavigate } from "react-router-dom";
import TimeSlots from "../components/time-slots";
import { useParams } from "react-router-dom";
import { getAvailabilityForPosting } from "@/lib/api";
import DateTeacherAvailability from "@/components/DateTeacherAvailability";

const TeacherScheduleInterviewView = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const teacherUser = useStore((state) => state.teacherUser);

  const [interview_length, setInterviewLength] = useState();

  const availabilities = useStore((state) => state.availabilities);
  const setAvailabilities = useStore((state) => state.setAvailabilities);

  useEffect(() => {
    if (teacherUser && postId) {

      getAvailabilityForPosting(postId)
        .then((data) => {
          const dictionary = {};
          const availabilityData = data["school_availabilities"];
          availabilityData.forEach((availability) => {
            if (availability.date in dictionary) {
              dictionary[availability.date].push(availability);
            } else {
              dictionary[availability.date] = [availability];
            }
          });

          setAvailabilities(dictionary);
          setInterviewLength(data["interview_length"]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [teacherUser]);

  async function handleSave() {
    navigate("/teacherschedule");
  }

  return (
    <div className="w-full">
      <TeacherHeaderNavBar />
      {teacherUser ? (
        <div className="flex-center-screen">
          <div className="rounded-card top-margin">
            <div className="form">
              <h3 className="heading2 text-center">Pick a Time Slot</h3>
              <p className="heading1 text-center">
                Congratulations on earning an interview!
              </p>
            </div>
            <div
              className="form"
              style={{ overflow: "auto", maxHeight: "42rem" }}
            >
              <div>
                <label htmlFor="eventdescrip" className="label1">
                  DURATION : 
                </label>
                <p className="text1">{interview_length} minutes</p>
              </div>
              {availabilities &&
                Object.keys(availabilities).map((key) => {
                  return (
                    <DateTeacherAvailability
                      availabilities={availabilities[key]}
                      date={key}
                      interview_length={interview_length}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div>"Please sign in to schedule an interview" </div>
      )}
    </div>
  );
};

export default TeacherScheduleInterviewView;
