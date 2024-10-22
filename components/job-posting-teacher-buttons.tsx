import "../App.css";
import { useNavigate } from "react-router-dom";
import { JobInfo } from "@/lib/types";
import { useStore } from "@/lib/store";
import { addToTeacherApplicationCart } from "@/lib/api";
import { useToast } from "./ui/use-toast";
// import useSchoolPostingQueryPosts from "@/hooks/use-mutations-school-postings";
// import { SchoolJobEditDialog } from "./school-job-edit-dialog";

export default function JobPostingTeacherButtons({
  params,
}: {
  params: { id: number; job_info: JobInfo; school_id: number };
}) {
  const navigate = useNavigate();
  const addJobIdToCart = useStore((state) => state.addJobIdToCart);
  const jobsInCart = useStore((state) => state.jobIds_in_cart);
  const { toast } = useToast();

  // const { deleteSchoolPostings } = useSchoolPostingQueryPosts();
  function applyPosting() {
    try {
      navigate(`/applyjobposting/${params.id}`);
    } catch (error) {
      alert("Could not open this job post. Please try again.");
    }
  }
  function openDetailsPosting() {
    try {
      navigate(`/teacherdetailsjobposting/${params.id}`);
    } catch (error) {
      alert("Could not open this job post. Please try again.");
    }
  }

  const successfulAddToCart = () => {
    // TODO add in exception handling
    toast({
      variant: "default",
      title: "Job successfully added to cart!",
      description: `Click on application cart to view all jobs in cart.`,
    });
  };

  return (
    <>
      <button
        className="button"
        onClick={applyPosting}
        style={{
          width: "70px",
        }}
      >
        Apply
      </button>
      <button
        className="button"
        onClick={openDetailsPosting}
        style={{
          width: "70px",
        }}
      >
        Details
      </button>
      <button
        className="button"
        onClick={() => {
          addJobIdToCart(params.id);
          addToTeacherApplicationCart(params.id);
          successfulAddToCart();
        }}
        style={{
          width: "70px",
        }}
      >
        Add to Cart
      </button>
    </>
  );
}
