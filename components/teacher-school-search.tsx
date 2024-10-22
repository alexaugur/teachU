import { useState } from "react";
import { Button } from "./ui/button";
import useSchoolListQueryPosts from "@/hooks/use-mutations-school-list";

const SchoolSearchBox = ({}) => {
  const { loadSchools } = useSchoolListQueryPosts();

  const [value, setValue] = useState("");

  const onSearchClick = () => {
    loadSchools(value);
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
          placeholder="Enter a name to find schools"
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

export default SchoolSearchBox;
