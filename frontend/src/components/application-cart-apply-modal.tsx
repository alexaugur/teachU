import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { JobPostings, Postings, Questions } from "@/lib/types";
import { Button } from "./ui/button";
import { useEffect } from "react";
// import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import TeacherQuestionsJobPosting from "@/components/teacher-questions-job-posting";
import { useStore } from "@/lib/store";
import { editTeacherApplicationCart } from "@/lib/api";

function ApplicationCartApplyModal({
  onExitClick,
  jobs,
}: {
  onExitClick: () => void;
  jobs: JobPostings[];
}) {
  const { questions, createAnswers, createApplication, loadCartQuestions } =
    usePostingQuestions();
  const appCartQuestions = useStore((state) => state.applicationCartQuestions);

  const answers2 = useStore((state) => state.answers2);
  

  const exitModal = () => {
    onExitClick();
  };

  async function submitApplications() {
    try {
      var index = 0;
      for (const job of jobs) {
        const appId = await createApplication(job.id.toString());

        const jobQuestions = appCartQuestions[job.id.toString()];
        if (jobQuestions && appId) {
          for (const question of jobQuestions) {

            await createAnswers(
              appId,
              answers2[index++],
              question.id.toString()
            );
          }
        }
      }
      console.log("Applications submitted successfully");
    } catch (error) {
      console.log(error);
      alert("Could not create job post. Please try again.");
    }
    editTeacherApplicationCart([]);
    onExitClick();
  }

  useEffect(() => {
    const jobIds = jobs.map((job) => job.id);
    loadCartQuestions(jobIds);
  }, [jobs]);

  // useEffect(() => {
  //   console.log("applicationCartQuestions:", appCartQuestions);
  // }, [appCartQuestions]);

  return (
    <div className="border w-[50%] h-[40%] p-5 rounded-xl bg-slate-200 flex flex-col justify-between">
      <div className="flex flex-row justify-between">
        <div className="text-subtitle">
          Your Pending Application Submissions
        </div>
        <div
          className="border border-blue-600 rounded-lg px-1"
          onClick={exitModal}
        >
          X
        </div>
      </div>
      <div
        className="h-[70%] border border-slate-300 rounded-xl"
        style={{ overflowY: "auto" }}
      >
        {/* {questions &&
          questions.map((question: Questions, index) => (
            <TeacherQuestionsJobPosting question={question} index={index} />
          ))} */}
        <div>
          {questions &&
            questions.map((question: Questions, index) => (
              <TeacherQuestionsJobPosting question={question} index={index} />
            ))}
        </div>
        <div></div>
      </div>
      <div className="flex justify-end ">
        <Button onClick={submitApplications}>Submit Applications</Button>
      </div>
    </div>
  );
}

export default ApplicationCartApplyModal;
