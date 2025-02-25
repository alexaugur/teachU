import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleClickHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5 ">
      <h1 className="text-4xl font-bold text-red-500">Not Found (404)</h1>
      <p className="text-lg text-gray-600">
        Oops! The page you're looking for does not exist.
      </p>
      <Button onClick={handleClickHome}>Go Home</Button>
    </div>
  );
};

export default ErrorPage;