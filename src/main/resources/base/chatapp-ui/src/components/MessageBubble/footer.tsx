import type { Message } from "../../@types/message";

const MessageFooter: React.FC<{
  message: Message;
  renderStatus: (status?: string) => React.ReactElement;
}> = ({ message, renderStatus }) => {
  const isMe = message.sender === "me";
  return (
    <div className="flex items-center justify-end gap-1 mt-1 ml-auto items-end">
      <span className="text-[9px] opacity-70">
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isMe && renderStatus(message.status)}
    </div>
  );
};


export default MessageFooter;