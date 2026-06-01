import { Navigate } from "react-router-dom";
import type { JWToken } from "../../@types/session";
import secureLocalStorage from "../../utils/secureStorage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = secureLocalStorage.getItem("session") as JWToken | null;
  //console.log("ProtectedRoute session:", session);
  /*if (!session || !session.access_token) {
    return <Navigate to="/" replace />;
  }*/

  return <>{children}</>;
};

export default ProtectedRoute;