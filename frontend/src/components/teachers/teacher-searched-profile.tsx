import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {TeacherUser } from "../../lib/types";
interface TeacherSearchedProfilePreviewProps {
  user: TeacherUser;
  
}

const TeacherSearchedProfilePreview: React.FC<TeacherSearchedProfilePreviewProps> = ({
  user,
}) => {
  const [isExpandedProfile, setIsExpandedProfile] = useState(false);
  const expandProfile = () => {
    setIsExpandedProfile(!isExpandedProfile);
  };

  return (
    <div
      className="bg-[#EFF7FF]"
      style={{
        borderBottomLeftRadius: "4rem",
        borderBottomRightRadius: "4rem",
      }}
    >
      <div className="flex w-full justify-end pt-[1rem] pr-[3rem]">
      </div>
      <div className="flex flex-row justify-center space-between">
        {/* Left Section */}
        <div className="space-y-5 left-section">
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Education</div>
            {/*TODO: IN PROGRESS EDITABLE TEXT AREA*/}
              <div className="text-body">
                {user?.education}
              </div>
            
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
        className="flex justify-center items-center flex-col"
        style={{ transform: "translateY(-2rem)" }}
      >
        {isExpandedProfile && (
          <div className="flex flex-row justify-center space-between pt-[1rem] w-full">
            {/* Left Section */}
            <div className="space-y-5 left-section">
              <div className="text-subtitle">Job Search Status</div>

              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Job Search Status</div>
                <div className="text-body">{user?.job_search_status}</div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Availability</div>
                <div className="text-body">{user?.availability}</div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Desired Location</div>
                <div className="text-body">{user?.desired_location}</div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">
                  Expected Anuual Salary Range
                </div>
                <div className="text-body">
                  {user?.min_salary && user?.max_salary
                    ? `${user.min_salary} - ${user.max_salary}`
                    : user?.min_salary
                      ? `Min. Salary: ${user.min_salary}`
                      : user?.max_salary
                        ? `Max. Salary: ${user.max_salary}`
                        : "None"}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-5 left-section">
              <div className="text-subtitle">
                Additional Teacher Information
              </div>

              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Profile Verification</div>
                <div className="text-body">
                  {user?.verified ? "Verified!" : "Un-verified"}
                </div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Teaching Philosophy</div>
                <div className="text-body">{user?.teaching_philosophy}</div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">Familiar Tools</div>
                <div className="text-body">{user?.familiar_tools}</div>
              </div>
              <div style={{ minHeight: "2rem" }}>
                <div className="text-sm-header">References</div>
                <div className="text-body">{user?.references}</div>
              </div>
            </div>
          </div>
        )}
        <div>
          {!isExpandedProfile ? (
            <Button variant="default" size="lg" onClick={expandProfile}>
              See Full Profile
            </Button>
          ) : (
            <Button variant="default" size="lg" onClick={expandProfile}>
              Collapse Full Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSearchedProfilePreview;
