import React from "react";
import { Button } from "@/components/ui/button";
import { SchoolTeacherUser } from "@/lib/types";

interface SchoolTeacherProfilePreviewProps {
  user: SchoolTeacherUser;
}


const SchoolTeacherProfilePreview: React.FC<SchoolTeacherProfilePreviewProps> = ({
  user,
}: {user: SchoolTeacherUser}) => {
  return (
    <>
      <div className="flex flex-row justify-center space-between pt-[1rem]">
        {/* Left Section */}
        <div className="space-y-5 left-section">
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Education</div>
            <div className="text-body">{user?.education}</div>
          </div>
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Subjects Taught</div>
            <div className="text-body">{user?.subjects_taught}</div>
          </div>
          <div className="flex flex-row space-x-[6rem]">
            <div>
              <div className="text-sm-header">Current State</div>
              <div className="text-body">{user?.current_state}</div>
            </div>
            <div>
              <div className="text-sm-header">Grades Taught</div>
              <div className="text-body">{user?.grades_taught}</div>
            </div>
            <div>
              <div className="text-sm-header">Years of Experience</div>
              <div className="text-body flex justify-center">
                {user?.years_of_experience}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col justify-center items-center middle-section">
          <img className="h-[11rem] w-[11rem]" src={user?.avatar}></img>
          <div className="pt-[1rem]">
            <div className="text-h3 flex justify-center">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-body">Teacher @ {user?.current_school}</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-5 right-section">
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Recently Worked At</div>
            <div className="text-body">{user?.past_jobs}</div>
          </div>
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Awards & Accomplishments</div>
            <div className="text-body">{user?.accolades}</div>
          </div>
          <div>
            <div className="text-sm-header">Special Accommodations</div>
            <div className="text-body">{user?.accommodations}</div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-center"
        style={{ transform: "translateY(-2rem)" }}
      >
        <Button variant="secondary" size="lg">
          See Full Profile
        </Button>
      </div>
    </>
  );
};

export default SchoolTeacherProfilePreview;
