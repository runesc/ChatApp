import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes } from "react-router-dom";
import { useFetchProfile } from "./hooks/useFetchProfile.ts";
import secureLocalStorage from "./utils/secureStorage";
import renderRoutes from "./utils/router/renderer";
import routes from "./utils//router/index";
import type { JWToken } from "./@types/session";
import type{ RootState } from "./store";


const App = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { refetch: refetchProfile } = useFetchProfile();
  const hasSession = useMemo(() => {
    return secureLocalStorage.getItem("session") as JWToken | null;
  }, []);


  useEffect(() => {
    if (hasSession && !user) {
      refetchProfile();
      return;
    }
  }, [hasSession, user, refetchProfile, navigate]);


  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default App;