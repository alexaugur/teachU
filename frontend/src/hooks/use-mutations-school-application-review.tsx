import { useEffect } from "react";
import {
  fetchQuestionsByPosting,
  fetchAnswersByPosting,
} from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

function useApplicationReview() {
  const { toast } = useToast();
  const currentPost = useStore((state) => state.selectedPostingId);
  const questions = useStore((state) => state.postingQuestions);

  const userProfile = useStore((state) => state.schoolProfile);



  const loadApplicationQuestions = async (currentPost: number | string) => {
    try {
      if (userProfile && currentPost) {
        console.log("currentPost: " + currentPost);
        await fetchQuestionsByPosting(currentPost.toString());
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch questions",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadApplicationAnswers = async (currentPost: number | string) => {
    try {
      if (userProfile && currentPost) {
        await fetchAnswersByPosting(currentPost);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch answers",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  useEffect(() => {
    loadApplicationQuestions(currentPost);
  }, [currentPost]);

  return {
    loadApplicationQuestions,
    loadApplicationAnswers,
    questions,
  };
}

export default useApplicationReview;
