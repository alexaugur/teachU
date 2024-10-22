import { useEffect } from "react";
import { fetchTeachersBySearchTerm, get_schools } from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
//import { School } from "@/lib/types";

function useTeacherListQueryPosts() {
  const { toast } = useToast();
  const teachers = useStore((state) => state.teachers);
  const setTeachers = useStore((state) => state.setTeachers);

  const currentPage = useStore((state) => state.currentTeacherPage);
  const setCurrentTeacherPage = useStore((state) => state.setCurrentTeacherPage);
  const totalTeacherPages = useStore((state) => state.totalTeacherPages);
  const setTotalTeacherPages = useStore((state) => state.setTotalTeacherPages);
  // const schoolsPerPage = 20;

  const user = useStore((state) => state.schoolUser);
  // const userProfile = useStore((state) => state.schoolProfile);

  const loadTeachers = async (search: string = "") => {
    try {
      if (user) {
      const fetchedTeachers = await fetchTeachersBySearchTerm(search, currentPage);
      setTeachers(fetchedTeachers["teacher_profiles"]);
      setCurrentTeacherPage(fetchedTeachers["page"]);
      setTotalTeacherPages(fetchedTeachers["total_count"]);
      // setTotalSchoolPages(Math.ceil(fetchedSchools.length / schoolsPerPage));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch teachers",
        description:
          (error as Error).message ||
          "There was an error loading the teachers. Please try again later.",
      });
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [user, currentPage]);

  return {
    loadTeachers,
    teachers,
    currentPage,
    setCurrentTeacherPage,
    totalTeacherPages,
  };
}

export default useTeacherListQueryPosts;
