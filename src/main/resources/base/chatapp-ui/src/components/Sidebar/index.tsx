import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "primereact/avatar";
import secureLocalStorage from "../../utils/secureStorage";
import AuthorizationService from "../../services/auth";
import type { User } from "../../@types/user";
import type { RootState } from "../../store";
import type { SidebarLinks } from "../../@types/sidebar";

const NavLinks: SidebarLinks[] = [
  { label: "Projects", icon: <i className="pi pi-home" />, to: "/dashboard" },
  {
    label: "Clients",
    icon: <i className="pi pi-sitemap" />,
    to: "/dashboard/clients",
  },
  {
    label: "Proposals",
    icon: <i className="pi pi-play" />,
    to: "/dashboard/proposals",
  },
  {
    label: "Invoices",
    icon: <i className="pi pi-envelope" />,
    to: "/dashboard/invoices",
  },
  { label: "Teams", icon: <i className="pi pi-users" />, to: "/dashboard/teams" },
  {
    label: "Templates",
    icon: <i className="pi pi-file" />,
    to: "/dashboard/templates",
  },
  { label: "Projects", icon: <i className="pi pi-home" />, to: "/dashboard" },
  {
    label: "Clients",
    icon: <i className="pi pi-sitemap" />,
    to: "/dashboard/clients",
  },
  {
    label: "Proposals",
    icon: <i className="pi pi-play" />,
    to: "/dashboard/proposals",
  },
  {
    label: "Invoices",
    icon: <i className="pi pi-envelope" />,
    to: "/dashboard/invoices",
  },
  { label: "Teams", icon: <i className="pi pi-users" />, to: "/dashboard/teams" },
  {
    label: "Templates",
    icon: <i className="pi pi-file" />,
    to: "/dashboard/templates",
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user) as User;


  const logoutMutation = useMutation({
    mutationFn: () => AuthorizationService.logout(),
    onSuccess: () => {
      secureLocalStorage.clear();
      navigate("/");
    },
  });
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-5 px-6 flex flex-col min-h-[calc(100dvh-40px)]">
      <div className="mt-4 mb-2">
        <span className="text-xs font-light capitalize text-zinc-500">
          menu
        </span>
      </div>
      <div className="flex flex-col h-dvw overflow-y-auto">
        {NavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to || "#"}
            className="flex items-center gap-2 px-2 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md cursor-pointer"
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="at_bottom flex flex-col mt-auto gap-3">
        <div className="flex gap-3 bt-1 border-t pt-3 items-center border-zinc-300 dark:border-zinc-700 cursor-pointer ">
          {!user ? (
            <Skeleton width="100%" height="2rem" className="mb-2" />
          ) : (
            <Avatar
              image={user.photo || "U"}
              pt={{
                root: { className: "min-w-[2.5rem] min-h-[2.5rem]" },
              }}
              shape="circle"
            />
          )}
          <div className="flex flex-col text-sm">
            <span className="font-semibold">
              {user ? `${user.name} ${user.last_name}` : "User"}
            </span>
            <span className="text-xs text-zinc-500">
              {user ? user.email : "user@example.com"}
            </span>
          </div>
          <div className="ml-auto">
            <Button
              className="p-button-text p-button-plain"
              onClick={() => logoutMutation.mutate()}
            >
              <i className="pi pi-sign-out text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;