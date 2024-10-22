import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";

import { toast } from "@/components/ui/use-toast";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
const CreateJobPostView = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [salary_est, setSalary_est] = useState("");
  const [start_date, setStart_date] = useState("");
  const [interview_length, setInterview_length] = useState(45);

  const [qList, setQList] = useState([]);
  const [tList, setTList] = useState([]);

  const { addPostings } = useSchoolPostingQueryPosts();
  const { addQuestions } = usePostingQuestions();

  function isValidFloat(str: string): boolean {
    return /^\d*\.?\d+$/.test(str);
  }

  function isValidDate(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(str);
  }

  async function handlePost() {
    try {

      if (!position || !description || !salary_est || !start_date) {
        toast({
          variant: "destructive",
          title: "Sorry! All fields must be filled!",
          description: `Please fill out all fields to make a posting.`,
        });
        return;
      }
      if (!isValidFloat(salary_est)) {
        toast({
          variant: "destructive",
          title: "Sorry! Salary must be a number!",
          description: `Please input a number representing the annual salary.`,
        });
        return;
      }

      if (!isValidDate(start_date)) {
        toast({
          variant: "destructive",
          title: "Sorry! Start date must be a valid date!",
          description: `Please input a date in the YYYY-MM-DD format.`,
        });
        return;
      }

      const postingId = await addPostings(
        description,
        position,
        salary_est,
        start_date,
        interview_length
      );

      if (postingId) {
        if (qList) {
          qList.forEach(async (question, index) => {
            if (qList[index]) {
              await addQuestions(question, question, tList[index], postingId);
            }
          });
        }
        navigate("/schoolaccountview");
      } else {
        toast({
          variant: "destructive",
          title: "Sorry! All failed to apply",
          description: `Please try again later.`,
        });
      }
    } catch (error) {
      alert("Could not create job post. Please try again.");
    }
    // navigate("/schoolaccountview");
  }

  const handleAddQuestion = () => {
    setQList([...qList, ""]);
    setTList([...tList, "short-answer"]);
  };

  const handleInputChange = (index, value) => {
    const newQList = [...qList];
    newQList[index] = value;
    setQList(newQList);
  };

  const handleSelectChange = (index, value) => {
    const newTList = [...tList];
    newTList[index] = value;
    setTList(newTList);
  };

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      <div className="flex-center-screen">
        <div className="rounded-card">
          <div className="form">
            <h3 className="heading2 text-center">Create a Job Posting</h3>
            <p className="heading1 text-center">Fill out all fields</p>
          </div>
          <div
            className="form"
            style={{ overflow: "auto", maxHeight: "42rem" }}
          >
            <div className="bottom-margin">
              <label htmlFor="eventname" className="label1">
                POSITION TITLE
              </label>
              <input
                id="position-title"
                required
                className="one-line-input"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              ></input>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdescrip" className="label1">
                ANNUAL SALARY ESTIMATE ($)
              </label>
              <input
                id="salary_est"
                required
                className="one-line-input"
                value={salary_est}
                onChange={(e) => setSalary_est(e.target.value)}
              ></input>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventdate" className="label1">
                START DATE (YYYY-MM-DD)
              </label>
              <input
                id="start_date"
                required
                className="one-line-input"
                value={start_date}
                onChange={(e) => setStart_date(e.target.value)}
              ></input>
            </div>
            <div className="bottom-margin">
              <label htmlFor="eventtime" className="label1">
                DESCRIPTION
              </label>
              <input
                id="description"
                required
                className="one-line-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
            <div className="bottom-margin"></div>

            <div className="bottom-margin">
              <label htmlFor="eventtime" className="label1">
                INTERVIEW_LENGTH
              </label>
              <div>
                <select
                  onChange={(e) =>
                    setInterview_length(parseInt(e.target.value))
                  }
                >
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>
              </div>
            </div>
            <div className="bottom-margin"></div>
            <div className="bottom-margin">
              <label htmlFor="questions" className="label1">
                ADDITIONAL QUESTIONS
              </label>
              {qList.map((value, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Type question here."
                    className="one-line-input"
                    style={{ marginBottom: "0.85rem", marginRight: "0.5rem" }}
                  />
                  <select
                    className="select-input"
                    onChange={(e) => handleSelectChange(index, e.target.value)}
                  >
                    <option value="short-answer">Short Answer</option>
                    <option value="yes-no">Y/N</option>
                  </select>
                </div>
              ))}
              <button className="button" onClick={handleAddQuestion}>
                Add Question
              </button>
            </div>
            <button className="button" onClick={handlePost}>
              Create Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPostView;
