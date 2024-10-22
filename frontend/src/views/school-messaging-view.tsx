import ButtonCard from "@/components/button-card";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import MessagingApp from "@/components/messaging-app";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import MessagingAppSchool from "@/components/messaging-app-school";
import { useParams } from "react-router-dom";

const SchoolMessagingView = () => {
  const schoolUser = useStore((state) => state.schoolUser);

  const { teacherId } = useParams();

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      {schoolUser ? (
        <MessagingAppSchool starting_teacher_id={teacherId} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view your messages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolMessagingView;
