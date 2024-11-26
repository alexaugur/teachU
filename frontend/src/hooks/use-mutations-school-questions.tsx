import { useEffect } from "react";
import {
  createQuestions,
  create_answers,
  create_application,
  fetchQuestionsByPosting,
  updateQuestion,
  fetchQuestion,
} from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { Questions } from "@/lib/types";

function usePostingQuestions() {
  const { toast } = useToast();
  const currentPost = useStore((state) => state.selectedPostingId);
  const questions = useStore((state) => state.postingQuestions);

  const setPostingQuestions = useStore((state) => state.setPostingQuestions);
  const addPostingQuestions = useStore((state) => state.addPostingQuestions);
  const setApplicationCartQuestions = useStore(
    (state) => state.setApplicationCartQuestions
  );

  const setAnswer2Length = useStore((state) => state.setAnswer2Length);

  const setQuestion = useStore((state) => state.setQuestion);

  const setRubricPresent = useStore((state) => state.setRubricPresent);
  const setRubricScore = useStore((state) => state.setRubricScore);

  // const user = useStore((state) => state.schoolUser);
  const user = useStore((state) => state.schoolUser);

  const loadQuestion = async (postId: string, questionId: string) => {
    try {
      const question = await fetchQuestion(postId, questionId);
      setQuestion(question["question"]);
      setRubricPresent(question["rubricPresent"]);
      setRubricScore(question["rubricScore"]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch question",
        description:
          (error as Error).message ||
          "There was an error loading the question. Please try again later.",
      });
    }
  };

  const loadQuestions = async (currentPost: number | string) => {
    try {
      if (currentPost) {
        const fetchedQuestions = await fetchQuestionsByPosting(
          currentPost.toString()
        );
        setAnswer2Length(fetchedQuestions.length);
        setPostingQuestions(fetchedQuestions);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 18",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadCartQuestions = async (postIds: number[] | string[]) => {
    try {
      const questionsArrays = await Promise.all(
        
        postIds.map((postId) => fetchQuestionsByPosting(postId.toString()))
      );
      const questionsDict: { [key: string]: Questions[] } = {};
      postIds.forEach((postId, index) => {
        questionsDict[postId.toString()] = questionsArrays[index];
      });
      setApplicationCartQuestions(questionsDict);
      const allQuestions = questionsArrays.flat();
      setPostingQuestions(allQuestions);
      setAnswer2Length(allQuestions.length);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  // const setCartQuestions = async (jobId: number) => {
  //   try {
  //     const questions = await fetchQuestionsByPosting(jobId.toString());
  //     const questionsDict: { [key: string]: Questions[] } = {};
  //     questionsDict[jobId.toString()] = questions;
  //     setApplicationCartQuestions(questionsDict);
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Failed to fetch posts",
  //       description:
  //         (error as Error).message ||
  //         "There was an error loading the posts. Please try again later.",
  //     });
  //   }
  // };

  const createAnswers = async (
    appId: string,
    answer_field: string,
    questionId: string
  ) => {
    try {
      await create_answers(appId, answer_field, questionId);

      return answer_field;
      // setAnswer2Length(fetchedQuestions.length);
      // setPostingQuestions(fetchedQuestions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 19",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const createApplication = async (postId: string) => {
    try {
      const appId = await create_application(postId);
      return appId;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 20",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  //note, this creates a new question object in the backedn, not add it to a crud ai
  const addQuestions = async (
    title: string,
    content: string,
    type: string,
    postingId: string
  ) => {
    try {
      // if (user) {
        const newQuestion = await createQuestions(
          title,
          content,
          type,
          postingId
        );
        //   console.log(fetchedPosts);
        // addPostingQuestions(newQuestion);
      // }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 21",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const updateQuestions = async (id: number | string, content: string) => {
    try {
      if (user) {
        await updateQuestion(id, content);
        
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 22",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  useEffect(() => {
    loadQuestions(currentPost);
  }, [currentPost]);

  return {
    loadQuestions,
    loadQuestion,
    addQuestions,
    updateQuestions,
    questions,
    createAnswers,
    createApplication,
    loadCartQuestions,
    // setCartQuestions,
    // , post, loadPost
  };
}

export default usePostingQuestions;
