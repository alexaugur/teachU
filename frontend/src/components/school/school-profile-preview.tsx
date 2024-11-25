import React, { useState } from "react";
import { SchoolUser } from "../../lib/data.ts";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea.tsx";
import { editSchoolProfileDetails } from "@/lib/api.ts";

interface SchoolProfilePreviewProps {
  user: SchoolUser;
}

const SchoolProfilePreview: React.FC<SchoolProfilePreviewProps> = ({
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

  const saveSchoolTypeChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.school_type = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveAddressChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.physical_address = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveYearEstablishedChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.year_established = parseInt(e.target.value);
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveMissionChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.mission_statement = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveGradeLevelChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.grades_served = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveEnrollmentChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.num_enrolled_students = parseInt(e.target.value);
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveAvgClassSizeChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.avg_class_size = parseInt(e.target.value);
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveClassroomRatioChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.student_teacher_ratio = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveCurriculumChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.curriculum = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveTestScoreChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.test_scores = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveTuitionChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.tuition = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  const saveAffiliationChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.affiliations = e.target.value;
    // @ts-ignore
    editSchoolProfileDetails(user);
  };

  return (
    <div
      className="bg-[#EFF7FF] pb-[2rem]"
      style={{
        borderBottomLeftRadius: "4rem",
        borderBottomRightRadius: "4rem",
      }}
    >
      <div className="flex w-full justify-end pt-[1rem] pr-[3rem]">
        {!isEditing ? (
          <Button variant="secondary" size="lg" onClick={editProfile}>
            <div className="flex flex-row space-x-2 justify-center items-center">
              <img src="/assets/icon-edit.svg"></img>
              <div>Edit Profile</div>
            </div>
          </Button>
        ) : (
          <Button variant="secondary" size="lg" onClick={saveProfile}>
            <div className="flex flex-row space-x-2 justify-center items-center">
              <img src="/assets/icon-save.svg"></img>
              <div>Save Changes</div>
            </div>
          </Button>
        )}
      </div>
      <div className="flex flex-row justify-center space-between">
        {/* Left Section */}
        <div className="space-y-3 left-section">
          <div className="text-subtitle">School Info</div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">School Type</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="school-type"
                name="school_type"
                defaultValue={user?.school_type}
                onChange={saveSchoolTypeChanges}
              />
            ) : (
              <div className="text-body">{user?.school_type}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Physical Address</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="physical-address"
                name="physical_address"
                defaultValue={user?.physical_address}
                onChange={saveAddressChanges}
              />
            ) : (
              <div className="text-body">{user?.physical_address}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Year Established</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="year-established"
                name="year_established"
                defaultValue={user?.year_established}
                onChange={saveYearEstablishedChanges}
              />
            ) : (
              <div className="text-body">{user?.year_established}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Mission Statement</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="mission-statement"
                name="mission_statement"
                defaultValue={user?.mission_statement}
                onChange={saveMissionChanges}
              />
            ) : (
              <div className="text-body">{user?.mission_statement}</div>
            )}
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
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="grades-served"
                name="grades_served"
                defaultValue={user?.grades_served}
                onChange={saveGradeLevelChanges}
              />
            ) : (
              <div className="text-body">{user?.grades_served}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Enrolled Student Count</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="num-enrolled-students"
                name="num_enrolled_students"
                defaultValue={user?.num_enrolled_students}
                onChange={saveEnrollmentChanges}
              />
            ) : (
              <div className="text-body">{user?.num_enrolled_students}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Average Class Size</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="avg-class-size"
                name="navg_class_size"
                defaultValue={user?.avg_class_size}
                onChange={saveAvgClassSizeChanges}
              />
            ) : (
              <div className="text-body">{user?.avg_class_size}</div>
            )}
          </div>
          <div style={{ minHeight: "3rem" }}>
            <div className="text-sm-header">Student:Teacher Ratio</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="student-teacher-ratio"
                name="student_teacher_ratio"
                defaultValue={user?.student_teacher_ratio}
                onChange={saveClassroomRatioChanges}
              />
            ) : (
              <div className="text-body">{user?.student_teacher_ratio}</div>
            )}
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
                {isEditing ? (
                  <Textarea
                    className="text-body text-area-editable-sm"
                    id="curriculum"
                    name="curriculum"
                    defaultValue={user?.curriculum}
                    onChange={saveCurriculumChanges}
                  />
                ) : (
                  <div className="text-body">{user?.curriculum}</div>
                )}
              </div>
              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Test Scores</div>
                {isEditing ? (
                  <Textarea
                    className="text-body text-area-editable-sm"
                    id="test-scores"
                    name="test_scores"
                    defaultValue={user?.test_scores}
                    onChange={saveTestScoreChanges}
                  />
                ) : (
                  <div className="text-body">{user?.test_scores}</div>
                )}
              </div>
              <div style={{ minHeight: "3rem" }}>
                <div className="text-sm-header">Tuition</div>
                {isEditing ? (
                  <Textarea
                    className="text-body text-area-editable-sm"
                    id="tuition"
                    name="tuition"
                    defaultValue={user?.tuition}
                    onChange={saveTuitionChanges}
                  />
                ) : (
                  <div className="text-body">{user?.tuition}</div>
                )}
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
                {isEditing ? (
                  <Textarea
                    className="text-body text-area-editable-sm"
                    id="affiliations"
                    name="affiliations"
                    defaultValue={user?.affiliations}
                    onChange={saveAffiliationChanges}
                  />
                ) : (
                  <div className="text-body">{user?.affiliations}</div>
                )}
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

export default SchoolProfilePreview;
