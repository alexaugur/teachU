import {
  get_school,
  school_login,
  school_logout,
  school_register,
} from "@/lib/api";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { getAuthenticatedSchoolUser } from "@/lib/schoolauth";
import { fetchOtherSchoolProfileDetails } from "../lib/api";

function useMutationSchoolUser() {
  const { toast } = useToast();

  const setSchoolUser = useStore((state) => state.setSchoolUser);

  const clearSchoolUser = useStore((state) => state.clearSchoolUser);

  const setSchoolProfile = useStore((state) => state.setSchoolProfile);
  // const clearSchoolProfile = useStore((state) => state.clearSchoolProfile);

  const loginSchoolUser = async (email: string, password: string) => {
    try {
      const user = await school_login(email, password);
      // console.log(userId);
      // console.log(user);
      setSchoolUser(user);
      // setSchoolId(userId);
    } catch (error) {
      const errorObj = JSON.parse((error as Error).message);
      if (errorObj.status === 400 && errorObj.message === "Invalid email or password") {
        toast({
          variant: "destructive",
          title: "Invalid email or password",
          description:
            "Please re-enter your credentials.",
        });
      } else {
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

  const getSchoolProfile = async () => {
    try {
      const user = await get_school();
      setSchoolProfile(user);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to login",
        description:
          (error as Error).message ||
          "There was an error signing you in. Please try again later.",
      });
    }
  };

  const getSchoolProfileFromId = async (school_id:string) => {
    try {
      const user = await fetchOtherSchoolProfileDetails(school_id);
      setSchoolProfile(user);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to login",
        description:
          (error as Error).message ||
          "There was an error signing you in. Please try again later.",
      });
    }
  };

  const logoutSchoolUser = async () => {
    try {
      await school_logout();
      clearSchoolUser();
      // clearSchoolProfile();
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

  const registerSchoolUser = async (
    email: string,
    password: string,
    name: string,
    city: string,
    state: string
  ): Promise<boolean> => {
    try {
      await school_register(email, password, name, city, state);
      return true;

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
      const user = getAuthenticatedSchoolUser();
      setSchoolUser(user);
    } catch (error) {
      clearSchoolUser();
    }
  }, []);

  return {
    loginSchoolUser,
    logoutSchoolUser,
    registerSchoolUser,
    getSchoolProfile,
  };
}

export default useMutationSchoolUser;
