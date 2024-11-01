import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import { useStore } from "@/lib/store";
import { JobPostings } from "@/lib/types";
import { useEffect } from "react";
import TeacherJobPosting from "../teacher-jobboard-posting";

const TeacherPersonalJobsList = () => {
  const teacherPostings = useStore((state) => state.teacherPostings);
  const { loadTeacherPostings } = useSchoolPostingQueryPosts();

  useEffect(() => {
    // Update the document title using the browser API
    // loadPostings();
    loadTeacherPostings();
  }, []);

  //   const [selectedPostingId, setSelectedPostingId] = useState<string | null>(
  //     null
  //   );
  //   useEffect(() => {
  //     const loadJobData = async () => {
  //       try {
  //         if (selectedPostingId) {
  //           await loadPosting(selectedPostingId);
  //         }
  //       } catch (error) {
  //         console.error("Failed to load teacher postings", error);
  //       }
  //     };

  //     loadJobData();
  //   }, [selectedPostingId]);

  return (
    <div className="px-[3rem] flex flex-row justify-between pt-[2rem] space-x-[3rem]">
      <div className="text-h3 w-1/5">
        Jobs List
        <div className="text-body pt-[0.5rem]">
          {/*TODO: setup API endpoints for applications submitted by teacher using teacher id*/}
          {/* {teacherPostings.map((posting) => (
            <div key={posting.id}>{posting.job_info.title}</div>
          ))} */}
          <div className="rounded-box border border-slate-200 rounded-3xl">
            {teacherPostings &&
              teacherPostings.map((posting: JobPostings) => (
                <TeacherJobPosting params={posting} />
              ))}
          </div>
        </div>
      </div>
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

export default TeacherPersonalJobsList;
