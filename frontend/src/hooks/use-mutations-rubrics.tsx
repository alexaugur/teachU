// use-mutations-rubrics.js
import {
  create_rubric,
  update_rubric,
  delete_rubric,
  get_rubrics,
} from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

function useMutationsRubrics() {
  const { toast } = useToast();

  const addRubric = useStore((state) => state.addRubric);
  const updateRubric = useStore((state) => state.updateRubric);
  const deleteRubric = useStore((state) => state.deleteRubric);
  const setRubrics = useStore((state) => state.setRubrics);

  const loadRubrics = async (questionId: string) => {
    try {
      const rubrics = await get_rubrics(questionId);
      // @ts-ignore
      setRubrics(parseInt(questionId), rubrics);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load rubrics",
        description:
          (error as Error).message ||
          "There was an error loading the rubrics. Please try again later.",
      });
    }
  };

  const createRubric = async (
    questionId: string,
    criteria: string,
    score: number
  ) => {
    try {
      const rubricId = await create_rubric(questionId, criteria, score);
      // @ts-ignore
      addRubric(parseInt(questionId), { id: rubricId, criteria, score });
      toast({
        variant: "default",
        title: "Rubric Created",
        description: "The rubric has been successfully created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create rubric",
        description:
          (error as Error).message ||
          "There was an error creating the rubric. Please try again later.",
      });
    }
  };

  const updateRubricDetails = async (
    rubricId: string,
    questionId: string,
    criteria: string,
    score: number
  ) => {
    try {
      await update_rubric(rubricId, criteria, score);
      updateRubric(parseInt(questionId), parseInt(rubricId), {
        criteria,
        score,
      });
      toast({
        variant: "default",
        title: "Rubric Updated",
        description: "The rubric has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update rubric",
        description:
          (error as Error).message ||
          "There was an error updating the rubric. Please try again later.",
      });
    }
  };

  const removeRubric = async (rubricId: string, questionId: string) => {
    try {
      await delete_rubric(rubricId);
      deleteRubric(parseInt(questionId), parseInt(rubricId));
      toast({
        variant: "default",
        title: "Rubric Deleted",
        description: "The rubric has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete rubric",
        description:
          (error as Error).message ||
          "There was an error deleting the rubric. Please try again later.",
      });
    }
  };

  return { loadRubrics, createRubric, updateRubricDetails, removeRubric };
}

export default useMutationsRubrics;
