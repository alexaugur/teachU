"use client";

import "../App.css";
import { QuestionsAnswers } from "@/lib/types";


export default function TeacherQuestionsReview({
  information,
}: {
  information: QuestionsAnswers;
}) {
  const hasRubric = true;

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
            {hasRubric && <div style={{ marginLeft: "10px" }}></div>}
          </div>
        </div>
      </div>
    </>
  );
}
