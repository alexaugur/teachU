import {
  get_applications_by_posting,
  get_applications_by_id,
  get_applications_by_teacher,
  get_answers_by_question,
  getInterviews,
} from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

function useApplicationPosts() {
  const { toast } = useToast();

  const setApplications = useStore((state) => state.setApplications);

  const setPostingApplications = useStore((state) => state.setPostingApplications);

  const setApplication = useStore((state) => state.setApplication);

  const applications = useStore((state) => state.applications);

  const setAnswers = useStore((state) => state.setAnswer); 

  const interviews = useStore((state) => state.interviews);
  const setInterviews = useStore((state) => state.setInterviews);

  const schoolUser = useStore((state) => state.schoolUser);


  const loadAnswers = async ( questionId: string ) => {
   
    try {
      
        const fetchedAnswers = await get_answers_by_question(questionId);
        setAnswers(fetchedAnswers);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 4",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  }; 

  const loadInterviews = async () => {
   
    try {
        if(schoolUser) {
          const fetchedInterviews = await getInterviews()
          setInterviews(fetchedInterviews)
        }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts",
        description:
          (error as Error).message ||
          "There was an error loading interview listings",
      });
    }
  }; 



  const loadApplications = async (postId: string, status = "submitted") => {
    try {
      if (postId) {
        const fetchedPosts = await get_applications_by_posting(postId, status);
        setApplications(fetchedPosts);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 5",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };



  const loadTeacherApplications = async (status = "submitted") => {
    try {
      const fetchedPosts = await get_applications_by_teacher(status);
      setPostingApplications(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 6",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };


  const loadApplication = async (applicatonId: string, school: boolean) => {
    try {
      if (applicatonId) {
        const fetchedPosts = await get_applications_by_id(applicatonId, school);
        setApplication(fetchedPosts);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 7",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  return { loadApplications, loadApplication, loadTeacherApplications, applications, loadAnswers, loadInterviews };
}

export default useApplicationPosts;
