import { useEffect} from "react";
import { fetchPostingsBySchool } from "@/lib/api";

import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
// import { Postings } from "@/lib/types";

function useQueryPosts() {
  const { toast } = useToast();
  const posts = useStore((state) => state.schoolPostings);
  const setPostings = useStore((state) => state.setSchoolPostings);
  // const setSelectedPostId = useStore((state) => state.setSelectedPostId);
  // const clearSelectedPostId = useStore((state) => state.clearSelectedPostId);
  // const [post, setPost] = useState<Postings | null>(null);
  const user:any = useStore((state) => state.schoolUser);

    const loadPostings = async () => {
    try {
      if(user) {
        const fetchedPosts = await fetchPostingsBySchool();
        setPostings(fetchedPosts);
      }
      else {
        setPostings([])
      }
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch posts 23",
        description:
          (error as Error).message ||
          "There was an error loading the posts. Please try again later.",
      });
    }
  };

  // const loadPost = async (id: string) => {
  //   let post = null;
  //   try {
  //     post = await fetchPostById(id);
  //     setPost(post);
  //     setSelectedPostId(post.id);
  //   } catch (error) {
  //     setPost(null);
  //     clearSelectedPostId();
  //     toast({
  //       variant: "destructive",
  //       title: "Failed to fetch posts",
  //       description:
  //         (error as Error).message ||
  //         "There was an error loading the posts. Please try again later.",
  //     });
  //   }
  // };
  

  

  useEffect(() => {
    loadPostings();
  }, [user]);

  return { posts, loadPostings
    // , post, loadPost 
  };
}

export default useQueryPosts;