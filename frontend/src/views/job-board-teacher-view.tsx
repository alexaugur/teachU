// import SchoolAside from "@/components/aside";
// import Feed from "@/components/feed";
import TeacherJobBoard from "@/components/teacher-job-postings";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { useStore } from "@/lib/store";
import { ApplicationCart } from "@/components/application-cart";
import { useState } from "react";
import ApplicationCartApplyModal from "@/components/application-cart-apply-modal";
import { JobPostings, Postings } from "@/lib/types";
// import { useStore } from "@/lib/store";
const JobBoardTeacherView = () => {
  const teacherUser = useStore((state) => state.teacherUser);
  const [isApplyAllClicked, setApplyAllClicked] = useState(false);
  const [jobs, setJobs] = useState<JobPostings[]>([]);

  return (
    <>
      <div className="w-full">
        <HeaderNavBar />
        <div>
          {teacherUser ? (
            <div>
              {isApplyAllClicked && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999, // high value to ensure it's on top of other elements
                    backgroundColor: "rgba(0, 0, 30, 0.3)",
                  }}
                >
                  <ApplicationCartApplyModal
                    onExitClick={() => setApplyAllClicked(false)}
                    jobs={jobs}
                  />
                </div>
              )}
              <TeacherJobBoard />
              <div className="fixed bottom-5 right-5 z-50">
                <ApplicationCart
                  onApplyAllClick={() => setApplyAllClicked(true)}
                  onJobsLoaded={(jobs) => {
                    setJobs(jobs);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
                <p className="text-gray-600">
                  Please sign in to view your job listings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobBoardTeacherView;
