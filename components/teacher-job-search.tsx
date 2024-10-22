import { useState } from "react";
import { Button } from "./ui/button";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import ComboboxDemo from "./StateComboBox";
import CityComboboxDemo from "./CityComboBox";
import { useStore } from "@/lib/store";
import { toast } from "./ui/use-toast";
import "../App.css";

const Autocomplete = ({}) => {
  const [searchMode, setSearchMode] = useState("Location");
  const {
    loadTeacherPostingWithQueries,
    loadTeacherPostingBySalary,
    loadTeacherPostingWithRecommendations,
    loadTeacherPostingByTitle 
  } = useSchoolPostingQueryPosts();

  const city = useStore((state) => state.city);
  const state = useStore((state) => state.state);

  const [value, setValue] = useState("60000");

  const [title, setTitle] = useState("");


  const onSearchClick = () => {
    if (searchMode === "Location") {
      if (city && state) {
        loadTeacherPostingWithQueries(city, state);
      } else {
        toast({
          variant: "destructive",
          title:
            "Sorry! Please input a valid city and state to search by location! 🙁",
          description: `Please enter the required information to search.`,
        });
        return;
      }
    }

    if (searchMode === "Salary") {
      loadTeacherPostingBySalary(value);
    }

    if (searchMode === "Recommendation") {
      if (city && state) {
        loadTeacherPostingWithRecommendations(city, state);
      } else {
        toast({
          variant: "destructive",
          title:
            "Sorry! Please input a valid city and state to search by location! 🙁",
          description: `Please enter the required information to search.`,
        });
        return;
      }
    }

    if (searchMode === "Title") {
      if (title) {
        loadTeacherPostingByTitle(title);
      } else {
        toast({
          variant: "destructive",
          title:
            "Sorry! Please input a title! 🙁",
          description: `Please enter the required information to search.`,
        });
        return;
      }
    }
  };

  const handleOptionChange = (e) => {
    setSearchMode(e.target.value);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Allow empty input or input that is a valid integer
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleInputTitleChange = (e) => {
    const inputValue = e.target.value;
    setTitle(inputValue);

  };

  return (
    <div className="bottom-margin">
      <div className="flex items-center space-x-4 justify-center margin-top-10 rounded-md">
        <p className="text3">Search by:</p>
        <select
          onChange={handleOptionChange}
          className="select-input"
          style={{ width: "150px" }}
        >
          <option value="Location">Location</option>
          <option value="Salary">Salary</option>
          <option value="Recommendation">Areas in Need</option>
          <option value="Title">Job Title</option>
        </select>
        {searchMode === "Location" && (
          <>
            <ComboboxDemo />
            <CityComboboxDemo />
          </>
        )}
        {searchMode === "Recommendation" && (
          <>
            <ComboboxDemo />
            <CityComboboxDemo />
          </>
        )}
        {searchMode === "Salary" && (
          <>
            $
            <input
              type="number"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter desired salary"
              min={0} // Optionally, you can set a minimum value if required
              step={100000} // This ensures that only integer steps are allowed
            />
          </>
        )}
        {searchMode === "Title" && (
          <>
            <input
              value={title}
              onChange={handleInputTitleChange}
              placeholder="Enter position"
            />
          </>
        )}
        <Button
          onClick={onSearchClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </Button>
      </div>
      <div className="flex items-center space-x-4 justify-center margin-top-10 rounded-md top-margin">
        {searchMode === "Location" && (
          <p className="text2">Returning all jobs within a 50 mile radius.</p>
        )}

        {searchMode === "Salary" && (
          <p className="text2">
            Returning all jobs within $10000 of your desired pay.
          </p>
        )}

        {searchMode === "Recommendation" && (
          <p className="text2">
            Returning a list of job postings belonging to areas in need, in a
            region near your desired location.
          </p>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
