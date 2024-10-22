import ButtonCard from "@/components/button-card";
import { useNavigate } from "react-router-dom";

const MainView = () => {
  const navigate = useNavigate();
  const onSchoolClick = () => {
    navigate("/schoolaccountview");
  };

  const onTeacherClick = () => {
    //navigate('/teacheraccountview')
    navigate("/signed-up-teacher");
  };
  return (
    <div className="w-full">
      {/* <Landing /> */}
      <div className="flex flex-col justify-center items-center pt-[6rem]">
        <div>
          <h1 className="text-h1">Welcome to the TeachU Network!</h1>
          <div className="flex justify-center text-subtitle py-[1rem]">
            Are you a
          </div>
        </div>
        <div className="flex flex-row space-x-2 py-[3rem]">
          <ButtonCard
            title="School"
            imgPath="/assets/icon-work.svg"
            description="Make job postings and find qualified candidates"
            onClick={onSchoolClick}
          />
          <ButtonCard
            title="Teacher"
            imgPath="/assets/icon-profile-build.svg"
            description="Make your profile and search through job postings to increase your chances of getting hired"
            onClick={onTeacherClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MainView;
