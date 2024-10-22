import { useEffect } from "react";
import { get_schools } from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
//import { School } from "@/lib/types";

function useSchoolListQueryPosts() {
  const { toast } = useToast();
  const schools = useStore((state) => state.schools);
  const setSchools = useStore((state) => state.setSchools);

  const currentPage = useStore((state) => state.currentSchoolPage);
  const setCurrentSchoolPage = useStore((state) => state.setCurrentSchoolPage);
  const totalSchoolPages = useStore((state) => state.totalSchoolPages);
  const setTotalSchoolPages = useStore((state) => state.setTotalSchoolPages);
  // const schoolsPerPage = 20;

  const user = useStore((state) => state.schoolUser);
  // const userProfile = useStore((state) => state.schoolProfile);

  const loadSchools = async (search: string = "") => {
    try {
      // if (user) {
      const fetchedSchools = await get_schools(search, currentPage);
      setSchools(fetchedSchools["school_profiles"]);
      setCurrentSchoolPage(fetchedSchools["page"]);
      setTotalSchoolPages(fetchedSchools["total_count"]);
      // setTotalSchoolPages(Math.ceil(fetchedSchools.length / schoolsPerPage));
      // }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch schools",
        description:
          (error as Error).message ||
          "There was an error loading the schools. Please try again later.",
      });
    }
  };

  useEffect(() => {
    loadSchools();
  }, [user, currentPage]);

  return {
    loadSchools,
    schools,
    currentPage,
    setCurrentSchoolPage,
    totalSchoolPages,
  };
}

export default useSchoolListQueryPosts;
