"use client";

import React, { useState } from "react";
import "../App.css";
import { Questions } from "@/lib/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { toast } from "./ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import RubricManager from "./rubric-manager";

const SchoolQuestionsJobPosting: React.FC<{ question: Questions }> = ({
  question,
}) => {
  const [content, setContent] = useState(question?.content);
  const { updateQuestions } = usePostingQuestions();

  const handleSave = async () => {
    await updateQuestions(question.id.toString(), content);
    // @ts-ignore
    toast({
      // @ts-ignore
      variant: "success",
      title: "Question Saved",
    });
  };

  return (
    <div
      className="flex items-start justify-between"
      style={{ marginBottom: "5px", overflow: "auto" }}
    >
      <div className="flex flex-col" style={{ width: "70%" }}>
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          className="button mt-2"
          onClick={handleSave}
          title="Save"
          style={{ width: "100px" }}
        >
          <FontAwesomeIcon icon={faDownload} /> Save
        </Button>
      </div>
      <div className="flex flex-col" style={{ width: "30%" }}>
        <RubricManager questionId={question.id} />
      </div>
    </div>
  );
};

export default SchoolQuestionsJobPosting;
