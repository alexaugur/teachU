import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar.tsx";
//import { useStore } from "@/lib/store";
//import { users } from "../lib/data.ts";
import SchoolProfilePreview from "@/components/school/school-profile-preview";
import { useStore } from "@/lib/store.ts";
import { useEffect, useState } from "react";
import { fetchSchoolProfileDetails } from "@/lib/api.ts";
import SchoolJobListingSection from "@/components/school/school-job-listing-section";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";

const SchoolProfileView = () => {
  const schoolUser = useStore((state) => state.schoolUser);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchSchoolProfileDetails()
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />

      {schoolUser ? (
        <div>
          <SchoolProfilePreview user={profileData} />
          {/* <SchoolJobListingSection /> */}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolProfileView;
