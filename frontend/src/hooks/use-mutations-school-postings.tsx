import { useEffect, useState } from "react";
import {
  fetchPostingsByIdAsTeacher,
  createPostings,
  deletePostings,
  fetchAllPostings,
  fetchAllPostingsWithCityAndState,
  fetchPostingsById,
  fetchPostingsBySchool,
  updatedPostings,
  fetchAllPostingsWithSalary,
  fetchAllPostingsWithTitle,
  fetchAllFavorites,
  fetchAllAreasInNeedNearCityAndState,
} from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { JobPostings } from "@/lib/types";

function useSchoolPostingQueryPosts() {
  const { toast } = useToast();
  const posts = useStore((state) => state.schoolPostings);

  // const teacherPostings = useStore((state) => state.teacherPostings);

  const setTeacherPostings = useStore((state) => state.setTeacherPostings);

  const addSchoolPostings = useStore((state) => state.addSchoolPostings);
  // const removeSchoolPostings = useStore((state) => state.removeSchoolPostings);
  // const updateSchoolPostings = useStore((state) => state.updateSchoolPostings);

  const setSchoolPostings = useStore((state) => state.setSchoolPostings);
  const setSelectedPostingId = useStore((state) => state.setSelectedPostingId);
  const clearSelectedPostingId = useStore(
    (state) => state.clearSelectedPostingId
  );
  const [post, setPost] = useState<JobPostings | null>(null);
  const user = useStore((state) => state.schoolUser);
  const userProfile = useStore((state) => state.schoolProfile);

  const loadPostings = async () => {
    try {
      if (user) {
        const fetchedPosts = await fetchPostingsBySchool();
        setSchoolPostings(fetchedPosts);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 8",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherPostings = async () => {
    try {
      const fetchedPosts = await fetchAllPostings();
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 9",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherFavoritePostings = async () => {
    try {
      const fetchedPosts = await fetchAllFavorites();
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 10",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherPostingWithQueries = async (city: string, state: string) => {
    try {
      const fetchedPosts = await fetchAllPostingsWithCityAndState(city, state);
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 11",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherPostingBySalary = async (salary: string) => {
    try {
      const fetchedPosts = await fetchAllPostingsWithSalary(salary);
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 12",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherPostingByTitle = async (title: string) => {
    try {
      const fetchedPosts = await fetchAllPostingsWithTitle(title);
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 12",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const loadTeacherPostingWithRecommendations = async (
    city: string,
    state: string
  ) => {
    try {
      const fetchedPosts = await fetchAllAreasInNeedNearCityAndState(
        city,
        state
      );
      setTeacherPostings(fetchedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 12",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  const addPostings = async (
    experience: string,
    title: string,
    salary_est: string,
    start_date: string,
    interview_length: number,

  ) => {
      try {
        if (user) {
          const newPosting = await createPostings(
            experience,
            title,
            salary_est,
            start_date,
            interview_length
          );
          //   console.log(fetchedPosts);

          addSchoolPostings(newPosting);
          return newPosting.id;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch posts 14",
          description:
            (error as Error).message ||
            "There was an error loading the posts. Please try again later.",
        });
      }
    };

    const updatePostings = async (
      id: number | string,
      description: string,
      title: string,
      salary_est: string,
      start_date: string,
      interview_length: number,
    ) => {
      try {
        if (user) {
          await updatedPostings(id, description, title, salary_est, start_date, interview_length);
          //   console.log(fetchedPosts);
          // console.log(newPosting)
          // console.log("whatsuppp")
          //   updateSchoolPostings(userProfile.id,newPosting);
          loadPostings();
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch posts 15",
          description:
            (error as Error).message ||
            "There was an error loading the posts. Please try again later.",
        });
      }
    };

    const deleteSchoolPostings = async (postingId: number) => {
      try {
        await deletePostings(postingId);
        // removeSchoolPostings(postingId);
        loadPostings();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to delete the post",
          description:
            (error as Error).message ||
            "There was an error deleting the post. Please try again later.",
        });
      }
    };

    //   };

    //   };

    const loadPostingAsTeacher = async (id: string) => {
      try {
        const post = await fetchPostingsByIdAsTeacher(id);

        // console.log(post)
        setPost(post);
        setSelectedPostingId(post.id);
      } catch (error) {
        setPost(null);
        clearSelectedPostingId();
        toast({
          variant: "destructive",
          title: "Failed to fetch posts 16",
          description:
            (error as Error).message ||
            "There was an error loading the posts. Please try again later.",
        });
      }
    };

    const loadPosting = async (id: string) => {
      try {
        const post = await fetchPostingsById(id);

        setPost(post);
        setSelectedPostingId(post.id);
      } catch (error) {
        setPost(null);
        clearSelectedPostingId();
        toast({
          variant: "destructive",
          title: "Failed to fetch posts 17",
          description:
            (error as Error).message ||
            "There was an error loading the posts. Please try again later.",
        });
      }
    };

    useEffect(() => {
      loadPostings();
    }, [user]);

    return {
      posts,
      loadPostings,
      loadTeacherFavoritePostings,
      addPostings,
      deleteSchoolPostings,
      post,
      loadPosting,
      updatePostings,
      loadTeacherPostings,
      loadPostingAsTeacher,
      loadTeacherPostingWithQueries,
      loadTeacherPostingBySalary,
      loadTeacherPostingWithRecommendations,
      loadTeacherPostingByTitle 
    };
};

export default useSchoolPostingQueryPosts;
