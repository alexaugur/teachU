// import SchoolAside from "@/components/aside";
// import Feed from "@/components/feed";
import FavoriteTeacherJobBoard from "@/components/teacher-job-postings-favorites";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { useStore } from "@/lib/store";
// import { useStore } from "@/lib/store";
const FavoriteJobBoardTeacherView = () => {
  const teacherUser = useStore((state) => state.teacherUser);

  return (
    <>
      <div className="w-full">
        <HeaderNavBar />
        {teacherUser ? (
          <FavoriteTeacherJobBoard />
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
              <p className="text-gray-600">
                Please sign in to view your favorited job listings.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default FavoriteJobBoardTeacherView;
