import { Outlet } from "react-router-dom";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import DialogPopUp from "../../components/Dialog";
import ShareContact from "../../components/ShareContact";

const AppLayout: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [addContactVisible, setAddContactVisible] = useState<boolean>(false);

  return (
    <>
      <DialogPopUp
        visible={addContactVisible}
        title="Iniciar nuevo chat"
        width="w-[900px]"
        children={<ShareContact />}
        onClose={() => setAddContactVisible(false)}
        onConfirm={() => setAddContactVisible(false)}
      />
      <div className="flex gap-4">
        <div className="w-[60px] flex-none hidden md:block">
          <div className="bg-white dark:bg-zinc-800 rounded-lg flex flex-col h-dvh items-center gap-4 pt-3">
            <NavLink
              to="/app"
              className="w-[40px] h-[40px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center justify-center"
            >
              <i className="pi pi-inbox text-2xl" />
            </NavLink>

            <button
              className="mt-auto mb-5 w-[40px] h-[40px] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center justify-center"
              onClick={() => setVisible(true)}
            >
              <i className="pi pi-cog text-2xl" />
            </button>
          </div>
          <DialogPopUp
            visible={visible}
            title="Settings"
            onClose={() => setVisible(false)}
            onConfirm={() => setVisible(false)}
          />
        </div>

        <div className="w-[330px] flex-none">
          <div className="bg-white dark:bg-zinc-800 rounded-lg flex flex-col h-dvh items-center gap-4 pt-3 overflow-y-scroll px-4 pl-2">
            <div className="flex flex-col w-full">
              <div className="flex items-center">
                <span className="text-xs font-light capitalize text-zinc-500">
                  chats
                </span>
                <button
                  className="ml-auto p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  onClick={() => setAddContactVisible(true)}
                >
                  <i className="pi pi-plus text-sm" />
                </button>
              </div>
            </div>
            {
              //*Array.from({ length: 20 }).map((_, index) => (
              //  <ChatThumbnail key={index} />
              //))
            }
          </div>
        </div>

        <div className="flex-1 hidden md:block">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
