import { useStore } from "@/lib/store";
import { Button } from "../ui/button";
import { TeacherLogoutDialog } from "../auth/teacher-logout-dialog";
import { TeacherRegisterDialog } from "../auth/teacher-register-dialog";
import { TeacherLoginDialog } from "../auth/teacher-login-dialog";
import { useNavigate } from "react-router-dom";

export const HeaderNavBar = () => {
  const teacherUser = useStore((state) => state.teacherUser);

  const navigate = useNavigate();
  const onHomeClick = () => {
    navigate("/jobboardteacherview");
  };

  const onTeachUClick = () => {
    navigate("/");
  };
  const goToTeacherDashboard = () => {
    navigate("/teacheraccountview");
  };

  const onSchoolClick = () => {
    navigate("/school-list-teacher-view");
  };

  const onAppliedJobViewClick = () => {
    navigate("/teacher-application-view");
  };

  const onFavoritesClick = () => {
    navigate("/jobboardteacherview-favorites");
  };

  const onMessagesClick = () => {
    navigate("/teachermessaging");
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
          Job Board
        </Button>
        <Button variant="ghost" size="sm" onClick={onSchoolClick}>
          School List
        </Button>
      </div>

      <div className="flex flex-row">
        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={onFavoritesClick}>
            Favorites
          </Button>
        </div>

        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={onAppliedJobViewClick}>
            Applied Jobs
          </Button>
        </div>

        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={onMessagesClick}>
            Messages
          </Button>
        </div>

        <div className="px-2">
          <Button variant="ghost" size="sm" onClick={goToTeacherDashboard}>
            My Dashboard
          </Button>
        </div>

        <div className="px-4 space-x-4">
          {!teacherUser && <TeacherRegisterDialog />}
          {teacherUser ? <TeacherLogoutDialog /> : <TeacherLoginDialog />}
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

export default HeaderNavBar;
