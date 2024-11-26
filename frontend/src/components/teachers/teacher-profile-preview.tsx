import React, { useState } from "react";
import { TeacherUser } from "../../lib/data.ts";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea.tsx";
import { editTeacherProfileDetails } from "@/lib/api.ts";

interface TeacherProfilePreviewProps {
  user: TeacherUser;
}

const TeacherProfilePreview: React.FC<TeacherProfilePreviewProps> = ({
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

  const saveEducationChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.education = e.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveSubjectsTaughtChanges = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.subjects_taught = e.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveCurrentStateChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.current_state = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveGradesTaughtChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.grades_taught = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveYOEChanges = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    user.years_of_experience = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveCurrentSchoolChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.current_school = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const savePastJobsChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.past_jobs = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveAccoladesChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.accolades = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
  };

  const saveAccommodationsChanges = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    user.accommodations = event.target.value;
    // @ts-ignore
    editTeacherProfileDetails(user);
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
        <div className="space-y-5 left-section">
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Education</div>
            {isEditing ? (
              <Textarea
                className="text-body text-area-editable-sm"
                id="education"
                name="education"
                defaultValue={user?.education}
                onChange={saveEducationChanges}
              />
            ) : (
              <div className="text-body">{user?.education}</div>
            )}
          </div>
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Subjects Taught</div>
            {isEditing ? (
              <Textarea
                id="subjects-taught"
                name="subjects_taught"
                defaultValue={user?.subjects_taught}
                onChange={saveSubjectsTaughtChanges}
              />
            ) : (
              <div className="text-body">{user?.subjects_taught}</div>
            )}
          </div>
          <div className="flex flex-row space-x-[6rem]">
            <div>
              <div className="text-sm-header">Current State</div>
              {isEditing ? (
                <Textarea
                  id="current-state"
                  name="current_state"
                  defaultValue={user?.current_state}
                  onChange={saveCurrentStateChanges}
                />
              ) : (
                <div className="text-body">{user?.current_state}</div>
              )}
            </div>
            <div>
              <div className="text-sm-header">Grades Taught</div>
              {isEditing ? (
                <Textarea
                  id="grades-taught"
                  name="grades_taught"
                  defaultValue={user?.grades_taught}
                  onChange={saveGradesTaughtChanges}
                />
              ) : (
                <div className="text-body">{user?.grades_taught}</div>
              )}
            </div>
            <div>
              <div className="text-sm-header">Years of Experience</div>
              {isEditing ? (
                <Textarea
                  id="years-of-experience"
                  name="years_of_experience"
                  defaultValue={user?.years_of_experience}
                  onChange={saveYOEChanges}
                />
              ) : (
                <div className="text-body flex justify-center">
                  {user?.years_of_experience}
                </div>
              )}
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
            {isEditing ? (
              <div>
                <div className="text-body">Teacher @ </div>
                <Textarea
                  id="current-school"
                  name="current_school"
                  defaultValue={user?.current_school}
                  onChange={saveCurrentSchoolChanges}
                />
              </div>
            ) : (
              <div className="text-body">Teacher @ {user?.current_school}</div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-5 right-section">
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Recently Worked At</div>
            {isEditing ? (
              <div>
                <Textarea
                  id="past-jobs"
                  name="past_jobs"
                  defaultValue={user?.past_jobs}
                  onChange={savePastJobsChanges}
                />
              </div>
            ) : (
              <div className="text-body">{user?.past_jobs}</div>
            )}
          </div>
          <div style={{ minHeight: "5rem" }}>
            <div className="text-sm-header">Awards & Accomplishments</div>
            {isEditing ? (
              <div>
                <Textarea
                  id="accolades"
                  name="accolades"
                  defaultValue={user?.accolades}
                  onChange={saveAccoladesChanges}
                />
              </div>
            ) : (
              <div className="text-body">{user?.accolades}</div>
            )}
          </div>
          <div>
            <div className="text-sm-header">Special Accommodations</div>
            {isEditing ? (
              <div>
                <Textarea
                  id="accommodations"
                  name="accommodations"
                  defaultValue={user?.accommodations}
                  onChange={saveAccommodationsChanges}
                />
              </div>
            ) : (
              <div className="text-body">{user?.accommodations}</div>
            )}
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

export default TeacherProfilePreview;
