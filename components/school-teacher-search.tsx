import { useState } from "react";
import { Button } from "./ui/button";
import useTeacherListQueryPosts from "@/hooks/use-mutations-teacher-list";

const TeacherSearchBox = ({}) => {
  const { loadTeachers } = useTeacherListQueryPosts();

  const [value, setValue] = useState("");

  const onSearchClick = () => {
    loadTeachers(value);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <>
      <div className="flex items-center space-x-4 justify-center margin-top-10 rounded-md">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Enter a name or skill to find teachers"
          className="one-line-input"
        />
        <Button
          onClick={onSearchClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </Button>
      </div>
    </>
  );
};

export default TeacherSearchBox;
