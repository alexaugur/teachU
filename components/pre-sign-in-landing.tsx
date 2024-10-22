import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleSchoolClick = () => {
    navigate("/schoolaccountview");
  };

  const handleTeacherClick = () => {
    navigate("/teacheraccountview");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 bg-[url('/diagonal-grey-circles.png')] bg-repeat">
      <div className="flex flex-col bg-white p-20 rounded-lg shadow-md items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to TeachU</h1>
        <div className="flex items-center justify-center gap-8">
          <Button onClick={handleTeacherClick} className="px-8 py-4 text-lg">
            I'm a Teacher
          </Button>
          <Button onClick={handleSchoolClick} className="px-8 py-4 text-lg">
            I'm a School
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
