import { useStore } from "@/lib/store";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { SchoolLogoutDialog } from "../auth/school-logout-dialog";
import { SchoolLoginDialog } from "../auth/school-login-dialog";
import { SchoolRegisterDialog } from "../auth/school-register-dialog";

export const SchoolHeaderNavBar = () => {
  const schoolUser = useStore((state) => state.schoolUser);

  const navigate = useNavigate();
  const onHomeClick = () => {
    navigate("/schoolaccountview");
  };

  const onTeachUClick = () => {
    navigate("/");
  };
  const goToMySchedule = () => {
    navigate("/schoolschedule");
  };

  const onTeacherListClick = () => {
    navigate("/teacher-list-school-view");
  };

  const goToTeacherDashboard = () => {
    navigate("/schoolprofileview");
  };

  const goToInterviews = () => {
    navigate("/schoolinterviews");
  };
  const goToSchoolMessages = () => {
    navigate("/schoolmessaging");
  };

  return (
    <div className="bg-custom-white h-[4rem] flex flex-row justify-between items-center px-[3rem] div-underline">
      <div className="flex flex-row">
        <Button variant="ghost" size="sm">
          <img
            className="h-[2.5rem]"
            src="/assets/Logo.png"
            alt="logo"
            onClick={onTeachUClick}
          />
        </Button>
        <Button variant="ghost" size="sm" onClick={onHomeClick}>
          My Dashboard
        </Button>

        <Button variant="ghost" size="sm" onClick={onTeacherListClick}>
          Teacher List
        </Button>
      </div>

      <div className="flex flex-row">
        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={goToInterviews}>
            My Interviews
          </Button>
        </div>
        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={goToMySchedule}>
            My Schedule
          </Button>
        </div>

        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={goToSchoolMessages}>
            Messages
          </Button>
        </div>

        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={goToTeacherDashboard}>
            Profile
          </Button>
        </div>

        <div className="px-4 space-x-4">
          {!schoolUser && <SchoolRegisterDialog />}
          {schoolUser ? <SchoolLogoutDialog /> : <SchoolLoginDialog />}
        </div>

        {/* account icon button - (unlikely, but if needed, reintroduce after
        absorbing login/logout functionality) */}
        {/* <Button variant="ghost" size="icon">
          <img
            className="h-[1.5rem]"
            src="/assets/icon-account.svg"
            alt="logo"
          />
        </Button> */}
      </div>
    </div>
  );
};

export default SchoolHeaderNavBar;
