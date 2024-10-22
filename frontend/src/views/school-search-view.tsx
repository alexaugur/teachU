"use client";
import "../App.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { QuestionsAnswers } from "@/lib/types";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolTeacherProfilePreview from "@/components/teachers/school-teacher-preview";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { fetchOtherSchoolProfileDetails } from "../lib/api";
import SchoolProfileTeacherPreview from "../components/school/school-profile-teacher-view";


export default function SchoolSearchView() {
  const { schoolId } = useParams();
  // the above is the id of the school, not the profile, you can change that if needed by navigating to the button on the school page

  const [profileData, setProfileData] = useState(null);
  
//   const application = useStore((state) => state.application);

//   const { loadApplication } = useApplicationPosts();

//   useEffect(() => {
//     if (!application) {
//       loadApplication(appId);
//     }
//   }, [appId]);

  useEffect(() => {
    if(schoolId) {
    fetchOtherSchoolProfileDetails(schoolId)
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }); 
    }
  }, [schoolId]);


//   const schoolProfile = await fetchOtherSchoolProfileDetails(schoolId);

  //fetch schoolProfileData (ignore the line above)
//then pass it in as a prop to SchoolTeacherProfilePreview

  return (
    <div className="w-full-screen">
        <HeaderNavBar />
      <div>
        {profileData && <SchoolProfileTeacherPreview user={profileData} />}
      </div>
    </div>
  );
}
