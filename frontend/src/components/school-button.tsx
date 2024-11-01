import { Button } from "@/components/ui/button";
import { HomeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const SchoolButton = () => {

  const navigate = useNavigate()
  const onHomeClick = () => {
      navigate('/jobboardschoolview')
  }

  return (
        <Button variant="default" size="sm" onClick ={onHomeClick}>
           <HomeIcon/>
        </Button>
  );
};

export default SchoolButton;