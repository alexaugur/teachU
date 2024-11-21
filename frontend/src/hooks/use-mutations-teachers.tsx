import { teacher_login, teacher_logout, teacher_register } from "@/lib/api";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { getAuthenticatedTeacherUser } from "@/lib/teacherauth";
import { TeacherUser } from "@/lib/types";

function useMutationTeacherUser() {
  const { toast } = useToast();
  const setTeacherUser = useStore((state) => state.setTeacherUser);
  const clearTeacherUser = useStore((state) => state.clearTeacherUser);

  const loginTeacherUser = async (email: string, password: string) => {
    try {
      const user: TeacherUser | void = await teacher_login(email, password);
      setTeacherUser(user as unknown as TeacherUser);
    } catch (error) {
      const errorObj = JSON.parse((error as Error).message);
      
      if (errorObj.status === 400 && errorObj.message === "Invalid email or password") {

        toast({
          variant: "destructive",
          title: "Invalid email or password",
          description:
            "Please re-enter your credentials.",
        });


      }
      else {
        toast({
          variant: "destructive",
          title: "Failed to login",
          description:
            (error as Error).message ||
            "There was an error signing you in. Please try again later.",
        });

      }
    }
  };

  const logoutTeacherUser = async () => {
    try {
      await teacher_logout();
      clearTeacherUser();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to logout",
        description:
          (error as Error).message ||
          "There was an error signing you out. Please try again later.",
      });
    }
  };

  const registerTeacherUser = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    current_school: string,
    subjects_taught: string,
    current_state: string,
    grades_taught: string,
    years_of_experience: string,
    past_jobs: string,
    accolades: string,
    accomodations: string,
    education: string
  ) : Promise<boolean> =>{

    try {
      await teacher_register(
        email,
        password,
        first_name,
        last_name,
        current_school,
        subjects_taught,
        current_state,
        grades_taught,
        years_of_experience,
        past_jobs,
        accolades,
        accomodations,
        education
      );
      return true
      // toast({
      //   variant: "default",
      //   title: "Registration successful",
      //   description: "Please login with your credentials.",
      // });
    } catch (error) {
      const errorObj = JSON.parse((error as Error).message);
      if (errorObj.status == 409 && errorObj.message == "Account already exists") {
        toast({
          variant: "destructive",
          title: "Account already exists with given email",
          description:
            "Please use a different email address.",
        });
      } else {
        toast({
        variant: "destructive",
        title: "Failed to register",
        description:
          (error as Error).message ||
          "There was an error registering. Please try again later.",
      });
      } 
      return false;
    }
  };

  useEffect(() => {
    try {
      const user = getAuthenticatedTeacherUser();
      setTeacherUser(user);
    } catch (error) {
      clearTeacherUser();
    }
  }, []);

  return { loginTeacherUser, logoutTeacherUser, registerTeacherUser };
}

export default useMutationTeacherUser;
