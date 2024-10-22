// import SchoolAside from "@/components/aside";
// import Feed from "@/components/feed";
import SchoolInfo from "@/components/school-info";
import HeaderNavBar from "@/components/teachers/teacher-header-nav-bar";
import { SchoolProfile } from "@/lib/types";
import { useEffect } from "react";
import useSchoolListQueryPosts from "@/hooks/use-mutations-school-list";
import SchoolSearchBox from "@/components/teacher-school-search";
import { useStore } from "@/lib/store";
// import { useStore } from "@/lib/store";
const SchoolListTeacherView = () => {
  const {
    loadSchools,
    currentPage,
    schools,
    setCurrentSchoolPage,
    totalSchoolPages,
  } = useSchoolListQueryPosts();

  useEffect(() => {
    loadSchools();
  }, [currentPage]);

  function handlePageChange(page: number) {
    setCurrentSchoolPage(page);
  }

  const teacherUser = useStore((state) => state.teacherUser);

  return (
    <div className="w-full">
      <HeaderNavBar />
      {teacherUser ? (
        <>
          <div className="flex-center-screen">
            <div className="rounded-card top-margin">
              <div className="form">
                <h3 className="heading2 text-center">School List</h3>
              </div>
              <div className="form">
                <SchoolSearchBox />
                <div className="top-margin bottom-margin">
                  <div className="rounded-box">
                    {schools && schools.length > 0 ? (
                      schools.map((school: SchoolProfile) => (
                        <SchoolInfo
                          key={school.id}
                          params={{ school: school }}
                        />
                      ))
                    ) : (
                      <p
                        className="top-margin bottom-margin"
                        style={{ marginLeft: ".85rem" }}
                      >
                        No schools.
                      </p>
                    )}
                  </div>

                  <label htmlFor="eventlist" className="label1">
                    PAGE: {currentPage}
                  </label>
                  <div className="pagination">
                    {Array.from(
                      { length: totalSchoolPages },
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
              Please sign in to view your school listings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolListTeacherView;
