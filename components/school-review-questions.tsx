"use client";

import "../App.css";
import { QuestionsAnswers } from "@/lib/types";
import GradingCriteria from "./grading-criteria";

export default function SchoolQuestionsReview({
  information,
}: {
  information: QuestionsAnswers;
}) {


  return (
    <>
      <div>
        <div>
          <div>
            <p className="text1">{information?.question_text}</p>
          </div>
          <div className="flex" style={{ marginLeft: "10px" }}>
            <div style={{ marginRight: "auto" }}>
              <p className="text3">{information?.answer_field}</p>
            </div>
            <GradingCriteria answerId={information.answer_id}/>
          </div>
        </div>
      </div>
    </>
  );
}
