import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick} className="flex items-center gap-2">
      <ArrowRight className="h-4 w-4" />
      بازگشت
    </Button>
  );
};

export default BackButton;

