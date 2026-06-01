import { NavLink } from "react-router-dom";
import type { ChatThumbnailProps } from "../../@types/chat";

const ChatThumbnail: React.FC<ChatThumbnailProps> = ({ threadId }) => {
  return (
    <NavLink
      to={`/app/chat/${threadId}`}
      className="w-full h-16 bg-gray-200 rounded-lg flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-300"
    >
      <div className="w-10 h-10 bg-gray-400 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-400 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </NavLink>
  );
};

export default ChatThumbnail;