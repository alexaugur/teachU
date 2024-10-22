// import SchoolAside from "@/components/aside";
// import Feed from "@/components/feed";
import SchoolJobBoard from "@/components/school-job-postings";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { useStore } from "@/lib/store";
const JobBoardSchoolView = () => {
  const schoolUser = useStore((state) => state.schoolUser);

  return (
    <>
      <div className="w-full">
        <SchoolHeaderNavBar />
        {schoolUser ? (
          <SchoolJobBoard />
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
              <p className="text-gray-600">
                Please sign in to view your postings.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* <Feed /> */}
      {/* <SchoolAside /> */}

      {/* <Aside /> */}
    </>
  );
};

export default JobBoardSchoolView;
