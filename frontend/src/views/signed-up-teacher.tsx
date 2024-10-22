import ButtonCard from "@/components/button-card";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";

const SignedUpTeacher = () => {
  const navigate = useNavigate();
  const teacherUser = useStore((state) => state.teacherUser);
  function goToJobBoard() {
    try {
      navigate("/jobboardteacherview");
    } catch (error) {
      alert("Could not navigate to job board. Please try again.");
    }
  }

  function goToProfile() {
    try {
      navigate("/teacheraccountview");
    } catch (error) {
      alert("Could not navigate to profile. Please try again.");
    }
  }

  function goToTeacherDashboard() {
    try {
      navigate("/teacheraccountview");
    } catch (error) {
      alert("Could not navigate to profile. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <HeaderNavBar />
      {teacherUser ? (
        <div className="flex flex-col justify-center items-center pt-[6rem]">
          <div>
            <h1 className="text-h1">Welcome to the TeachU Network!</h1>
            <div className="flex justify-center text-subtitle py-[1rem]">
              Choose your next action
            </div>
          </div>
          <div className="flex flex-row space-x-2 py-[3rem]">
            <ButtonCard
              title="Find a Job"
              imgPath="/assets/icon-work.svg"
              description="Search for jobs at schools that match your needs"
              onClick={goToJobBoard}
            />
            <ButtonCard
              title="Build Your Profile"
              imgPath="/assets/icon-profile-build.svg"
              description="Finish your profile to increase your chances of getting hired"
              onClick={goToProfile}
            />
          </div>
          <Button variant="secondary" size="lg" onClick={goToTeacherDashboard}>
            Go to My Dashboard
          </Button>
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

export default SignedUpTeacher;
