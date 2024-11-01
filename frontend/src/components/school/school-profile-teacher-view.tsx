import React, { useState } from "react";
import { SchoolUser } from "../../lib/data.ts";
import { Button } from "@/components/ui/button";

interface SchoolProfilePreviewProps {
  user: SchoolUser;
}

const SchoolProfileTeacherPreview: React.FC<SchoolProfilePreviewProps> = ({
  user,
}) => {
  const [isExpandedProfile, setIsExpandedProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const expandProfile = () => {
    setIsExpandedProfile(!isExpandedProfile);
  };
  const editProfile = () => {
    setIsEditing(true);
  };
  const saveProfile = () => {
    // Save the updated profile...
    setIsEditing(false);
  };
  return (
    <div
      className="bg-[#EFF7FF] pb-[2rem]"
      style={{
        borderBottomLeftRadius: "4rem",
        borderBottomRightRadius: "4rem",
      }}
    >
      <div className="flex flex-row justify-center space-between">
        {/* Left Section */}
        <div className="space-y-3 left-section">
          <div className="text-subtitle">School Info</div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">School Type</div>
            {/*TODO: IN PROGRESS EDITABLE TEXT AREA*/}
            {isEditing ? (
              <textarea
                className="text-body text-area-editable-sm"
                defaultValue={user?.school_type}
                onBlur={saveProfile}
              />
            ) : (
              <div className="text-body" onClick={editProfile}>
                {user?.school_type}
              </div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Physical Address</div>
            <div className="text-body">{user?.physical_address}</div>
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Year Established</div>
            <div className="text-body">{user?.year_established}</div>
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Mission Statement</div>
            <div className="text-body">{user?.mission_statement}</div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col justify-center items-center middle-section">
          <img
            className="h-[11rem] w-[11rem] rounded-xl"
            src={
              user?.avatar ||
              "https://img.freepik.com/free-vector/school-building-illustration_138676-2399.jpg"
            }
            alt="User Avatar"
          />

          <div className="pt-[1rem]">
            <div className="text-h3 flex justify-center">{user?.name}</div>
            <div className="text-body">
              {user?.city}, {user?.state}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-3 right-section">
          <div className="text-subtitle">School Details</div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Grades Served</div>
            <div className="text-body">{user?.grades_served}</div>
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Enrolled Student Count</div>
            <div className="text-body">{user?.num_enrolled_students}</div>
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Average Class Size</div>
            <div className="text-body">{user?.avg_class_size}</div>
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Student:Teacher Ratio</div>
            <div className="text-body">{user?.student_teacher_ratio}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col">
        {isExpandedProfile && (
          <div className="flex flex-row justify-center space-between pt-[1rem] w-full">
            {/* Left Section */}
            <div className="space-y-5 left-section">
              <div className="text-subtitle">Academics</div>

              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Main Curriculum</div>
                <div className="text-body">{user?.curriculum}</div>
              </div>
              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Test Scores</div>
                <div className="text-body">{user?.test_scores}</div>
              </div>
              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Tuition</div>
                <div className="text-body">{user?.tuition}</div>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-3 right-section">
              <div className="text-subtitle">Other Information</div>

              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Profile Verification</div>
                <div className="text-body">
                  {user?.verified ? "Verified!" : "Un-verified"}
                </div>
              </div>
              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Affiliations</div>
                <div className="text-body">{user?.affiliations}</div>
              </div>
            </div>
          </div>
        )}
        <div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfileTeacherPreview;
