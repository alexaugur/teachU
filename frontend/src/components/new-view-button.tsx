
  import { Button } from "@/components/ui/button";
  // import { HomeIcon } from "@radix-ui/react-icons";
  import { HeartIcon } from "@radix-ui/react-icons";

  import { useNavigate } from "react-router-dom";

  const NewViewButton = () => {

    const navigate = useNavigate()
    const onHomeClick = () => {
        navigate('/')
    }

    

    return (
          <Button variant="default" size="sm" onClick ={onHomeClick}>
             <HeartIcon/>
          </Button>
    );
  };
  
  export default NewViewButton;
  