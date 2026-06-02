import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes } from "react-router-dom";
import { useFetchProfile } from "./hooks/useFetchProfile.ts";
import secureLocalStorage from "./utils/secureStorage";
import renderRoutes from "./utils/router/renderer";
import routes from "./utils//router/index";
import type { JWToken } from "./@types/session";
import type { RootState } from "./store";

declare global {
  interface Window {
    bridge?: {
      send: (message: string) => Promise<string>;
    };
  }
}

const App = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const { refetch: refetchProfile } = useFetchProfile();
  const [hasSession, setHasSession] = useState<JWToken | null>(null);

  useEffect(() => {
    const resolveSession = async () => {
      if (import.meta.env.VITE_ORIGIN === "desktop") {
        const waitForBridge = setInterval(() => {
          if (window.bridge) {
            clearInterval(waitForBridge);

            window.bridge
              .send(
                JSON.stringify({
                  event: "check_session",
                  payload: "session",
                }),
              )
              .then((responseJSON: string) => {
                const response = JSON.parse(responseJSON);
                if (response.success) {
                  setHasSession(response.data as JWToken);
                  secureLocalStorage.setItem("session", response.data);
                } else {
                  setHasSession(null);
                }
              })
              .catch(() => setHasSession(null));
          }
        }, 50);
      } else {
        const localSession = secureLocalStorage.getItem(
          "session",
        ) as JWToken | null;
        setHasSession(localSession);
      }
    };

    resolveSession();
  }, []);

  useEffect(() => {
    if (hasSession && !user) {
      refetchProfile();
    }
  }, [hasSession, user, refetchProfile, navigate]);

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default App;
