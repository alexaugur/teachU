"use client";
import "../App.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Make sure to import useNavigate
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaUser, FaArrowLeft, FaArrowRight, FaArrowCircleLeft } from "react-icons/fa";
import { useState } from "react";
import GradingCriteria from "@/components/grading-criteria";

export default function ApplicationQuestionView() {
  const { postId, questionId } = useParams();
  const answers = useStore((state) => state.answers);
  const clearAnswers = useStore((state) => state.clearAnswers);
  const rubricPresent = useStore((state) => state.rubricPresent);
  const rubricScore = useStore((state) => state.rubricScore);

  const questions = useStore((state) => state.postingQuestions);

  const question = useStore((state) => state.question);
  const { loadAnswers } = useApplicationPosts();
  const { loadQuestion } = usePostingQuestions();
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    if (postId && questionId) {
      loadAnswers(questionId);
      loadQuestion(postId, questionId);
    }
  }, [postId, questionId]);

  if (!answers) {
    return (
      <div>
        <SchoolHeaderNavBar />
        <div>Loading answers...</div>
      </div>
    );
  }

  const viewApp = (appId) => {
    try {
      clearAnswers();
      navigate("/application_review/" + appId);
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  const goBack = () => {
    try {
      navigate("/application_list/" + postId);
    } catch (error) {
      alert("Could not navigate.");
    }
  };
  const handleLeftButtonClick = () => {
    const currentIndex = questions.findIndex((q) => q.id.toString()  === questionId);
    let newIndex = (currentIndex - 1) % questions.length
    if (newIndex < 0) {
      newIndex += questions.length;
    }
    try {
      
      navigate("/application_review/" + postId + "/question/" + questions[newIndex].id);
    } catch (error) {
      alert("Could not navigate.");
    }
    // Your logic for the left button click (e.g., go to the previous item/page)
  };

  const handleRightButtonClick = () => {
    const currentIndex = questions.findIndex((q) => q.id.toString()  == questionId);
    let newIndex = (currentIndex +1) % questions.length
  
    try {
      
      navigate("/application_review/" + postId + "/question/" + questions[newIndex].id);
    } catch (error) {
      alert("Could not navigate.");
    }
    //
    // Your logic for the right button click (e.g., go to the next item/page)
  };


  //console.log(answers)
  // Render the list of answers
  // Make sure to import the icon components from the library you are using, for example:
  // import { FaRegEye } from 'react-icons/fa';

  return (
    <div className="w-full">
      <SchoolHeaderNavBar />
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded"
        onClick={handleLeftButtonClick}
        title="Previous Question" 
      >
        <FaArrowLeft />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded"
        onClick={handleRightButtonClick}
        title="Next Question" 
      >
        <FaArrowRight />
      </button>
      <button
        className="ml-4 my-4 bg-gray-200 p-2 rounded hover:bg-gray-300 flex items-center"
        onClick={goBack}
        title="Go Back to Application List" 
      >
        <FaArrowCircleLeft className="mr-1" /> Back
      </button>


      <h2 className="text-center">
        Question: {question?.content}
        <button
          onClick={toggleDetails}
          className="ml-4 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
        >
          {showDetails ? "Make Anonymous" : "Show Applicant Details"}
        </button>
      </h2>
      <div className="answers-container">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div
              key={answer.id}
              className="answer flex flex-col justify-between items-start p-4 border-b"
            >
              <div className="answer-details w-full">
                <p>{answer.answer_field}</p>
                {/* {rubricPresent && (
                  <QuestionGradingRubric
                    information={answer}
                    rubricScore={rubricScore}
                  />
                )} */}
                {showDetails && (
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        navigate("/application_review/" + answer.app_id)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      <FaRegEye className="mr-2" /> View Application
                    </button>
                    <div className="ml-4 text-lg flex flex-col items-center">
                      <FaUser className="text-xl mb-2" />
                      <p>
                        {answer.first_name} {answer.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Grading Criteria Component for each answer */}
              <div className="grading-criteria-container mt-4 w-full">
                <GradingCriteria answerId={answer.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="flex justify-center items-center h-40">No answers available.</p>
        )}
      </div>
    </div>
  );
}

/*
import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "@/lib/store";
import useApplicationPosts from "@/hooks/use-mutations-answers";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import usePostingQuestions from "@/hooks/use-mutations-school-questions";
import { FaRegEye, FaUser, FaArrowLeft, FaArrowRight, FaArrowCircleLeft } from "react-icons/fa";
import GradingCriteria from "@/components/grading-criteria";

export default function ApplicationQuestionView() {
  const { postId, questionId } = useParams();
  const answers = useStore((state) => state.answers);
  const clearAnswers = useStore((state) => state.clearAnswers);
  const rubricPresent = useStore((state) => state.rubricPresent);
  const rubricScore = useStore((state) => state.rubricScore);
  const question = useStore((state) => state.question);
  const { loadAnswers } = useApplicationPosts();
  const { loadQuestion } = usePostingQuestions();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  useEffect(() => {
    if (postId && questionId) {
      loadAnswers(questionId);
      loadQuestion(postId, questionId);
    }
  }, [postId, questionId]);

  const viewApp = (appId) => {
    try {
      clearAnswers();
      navigate("/application_review/" + appId);
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  const goBack = () => {
    try {
      navigate("/application_list/" + postId);
    } catch (error) {
      alert("Could not navigate.");
    }
  };

  const handleLeftButtonClick = () => {
    // Your logic for the left button click (e.g., go to the previous item/page)
  };

  const handleRightButtonClick = () => {
    // Your logic for the right button click (e.g., go to the next item/page)
  };

  return (
    <div className="w-full relative">
      <SchoolHeaderNavBar />
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded"
        onClick={handleLeftButtonClick}
      >
        <FaArrowLeft />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded"
        onClick={handleRightButtonClick}
      >
        <FaArrowRight />
      </button>
      <button
        className="ml-4 my-4 bg-gray-200 p-2 rounded hover:bg-gray-300 flex items-center"
        onClick={goBack}
      >
        <FaArrowCircleLeft className="mr-1" /> Back
      </button>
      <h2 className="text-center">
        Question: {question?.content}
        <button
          onClick={toggleDetails}
          className="ml-4 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
        >
          {showDetails ? "Make Anonymous" : "Show Applicant Details"}
        </button>
      </h2>
      <div className="answers-container">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div
              key={answer.id}
              className="answer flex flex-col justify-between items-start p-4 border-b"
            >
              <div className="answer-details w-full">
                <p>{answer.answer_field}</p>
                {showDetails && (
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => viewApp(answer.app_id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      <FaRegEye className="mr-2" /> View Application
                    </button>
                    <div className="ml-4 text-lg flex flex-col items-center">
                      <FaUser className="text-xl mb-2" />
                      <p>
                        {answer.first_name} {answer.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="grading-criteria-container mt-4 w-full">
                <GradingCriteria answerId={answer.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="flex justify-center items-center h-40">No answers available.</p>
        )}
      </div>
    </div>
  );
}
*/