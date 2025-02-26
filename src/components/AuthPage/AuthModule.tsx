import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LoginScreen,
  RegisterScreen,
  ForgotScreen,
  ReusableLayout,
} from "./components";

type AuthModuleProps = {
  screen: "login" | "register" | "forgot";
};

const AuthModule: React.FC<AuthModuleProps> = ({ screen }) => {
  const [currentScreen, setCurrentScreen] = useState<
    "login" | "register" | "forgot"
  >(screen);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "login" || path === "register" || path === "forgot") {
      setCurrentScreen(path as "login" | "register" | "forgot");
    }
  }, [location.pathname]);

  const switchScreen = (screen: "login" | "register" | "forgot") => {
    setCurrentScreen(screen);
    navigate(`/${screen}`);
  };

  return (
    <ReusableLayout>
      {currentScreen === "login" && <LoginScreen switchScreen={switchScreen} />}
      {currentScreen === "register" && (
        <RegisterScreen switchScreen={switchScreen} />
      )}
      {currentScreen === "forgot" && (
        <ForgotScreen switchScreen={switchScreen} />
      )}
    </ReusableLayout>
  );
};

export default AuthModule;
