// import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
// import { JobPostings } from "@/lib/types";
// import TeacherJobPosting from "../teacher-jobboard-posting";
// import { useEffect, useState } from "react";

const SchoolJobListingSection = () => {
  //   const teacherPostings = useStore((state) => state.teacherPostings);
  // const { loadPostings } = useSchoolPostingQueryPosts();

  return (
    <div className="px-[3rem] flex flex-row justify-between pt-[2rem] space-x-[3rem]">
      <div className="text-h3 w-1/5">Jobs List</div>
      <div className="w-4/5">
        <div className="flex text-subtitle justify-end pb-[1rem]">
          Job Description
        </div>
        <div className="border border-slate-200 rounded-3xl h-full p-[2rem]">
          *SPECIFIC JOB DATA*
          {/*REFACTOR FRONTEND CODEBASE FOR JOB DATA FETCHING*/}
        </div>
      </div>
    </div>
  );
};

export default SchoolJobListingSection;
