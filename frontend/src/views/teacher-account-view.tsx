import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar.tsx";
//import { useStore } from "@/lib/store";
//import { users } from "../lib/data.ts";
import TeacherProfilePreview from "@/components/teachers/teacher-profile-preview.tsx";
import { useStore } from "@/lib/store.ts";
import { useEffect, useState } from "react";
import { fetchTeacherProfileDetails } from "@/lib/api.ts";
import TeacherPersonalJobsList from "@/components/teachers/teacher-personal-jobs-list";

const TeacherAccountView = () => {
  const teacherUser = useStore((state) => state.teacherUser);

  // MOCK USER v2:
  //const teacherId = teacherUser?.id;
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchTeacherProfileDetails()
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="w-full">
      <HeaderNavBar />

      {teacherUser ? (
        <div>
          <TeacherProfilePreview user={profileData} />
          {/* <TeacherPersonalJobsList /> */}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your applications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAccountView;
