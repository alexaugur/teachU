// import SchoolAside from "@/components/aside";
// import Feed from "@/components/feed";
import SchoolInfo from "@/components/school-info";
import { SchoolProfile, TeacherUser } from "@/lib/types";
import { useEffect } from "react";
import useTeacherListQueryPosts from "@/hooks/use-mutations-teacher-list";
import TeacherSearchBox from "@/components/school-teacher-search";
import { useStore } from "@/lib/store";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import TeacherSearchResultInfo from "@/components/teacher-search-result-info";

const TeacherListSchoolView = () => {
  const {
    loadTeachers,
    currentPage,
    teachers,
    setCurrentTeacherPage,
    totalTeacherPages,
  } = useTeacherListQueryPosts();

  useEffect(() => {
    loadTeachers();
  }, [currentPage]);

  function handlePageChange(page: number) {
    setCurrentTeacherPage(page);
  }

  const schoolUser = useStore((state) => state.schoolUser);

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      {schoolUser ? (
        <>
          <div className="flex-center-screen">
            <div className="rounded-card top-margin">
              <div className="form">
                <h3 className="heading2 text-center">Teacher List</h3>
              </div>
              <div className="form">
                <TeacherSearchBox />
                <div className="top-margin bottom-margin">
                  <div className="rounded-box">
                    {teachers &&
                      teachers.map((teacher: TeacherUser) => (
                        <TeacherSearchResultInfo
                          key={teacher.id}
                          params={{ teacher: teacher }}
                        />
                      ))}
                  </div>
                  <label htmlFor="eventlist" className="label1">
                    PAGE: {currentPage}
                  </label>
                  <div className="pagination">
                    {Array.from(
                      { length: totalTeacherPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className="pagination-button"
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Are you logged in?</h2>
            <p className="text-gray-600">
              Please sign in to view the list of teachers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherListSchoolView;
