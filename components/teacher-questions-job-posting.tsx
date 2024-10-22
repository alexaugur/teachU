"use client";

import { useState } from "react";
import "../App.css";
import { Questions } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function TeacherQuestionsJobPosting( {question, index}: { question: Questions, index: number} ) {
  let questionSection;
  const type = question.type;
  const [inputValue, setInputValue] = useState("");
  
  // const answers = useStore((state) => state.answers);

  // const setAnswer2Length = useStore((state) => state.setAnswer2Length);
  const setAnswer2Index = useStore((state) => state.setAnswerAtIndex);

  // if( !answers2 || index >= answers2.length) {
  //   setAnswer2Length(index);
  // }

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setAnswer2Index(e.target.value, index);
  };

  switch (type) {
    case "short-answer":
      questionSection = (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="one-line-input"
          placeholder="Enter your answer"
        />
      );
      break;
    case "yes-no":
      questionSection = (
        <select
          value={inputValue}
          onChange={handleChange}
          className="select-input"
        >
          {/* <option value="">Select an option</option> */}
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      );
      break;
    default:
      questionSection = null;
  }

  return (
    <>
      <div>
        <div>
          <p className="text1">{question.content}</p>
          {questionSection}
        </div>
      </div>
    </>
  );
}
