import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AppLayout: React.FC = () => {
  return (
    <div className="flex gap-4 p-5">
      <div className="w-[330px] flex-none ">
        <Sidebar />
      </div>
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;