import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@src/services/AuthContext";

const NavigateToHome = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.type === "brand") {
      navigate("/dashboard-brand", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  }, [userProfile]);

  return null;
};

export default NavigateToHome;
