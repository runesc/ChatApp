import React from "react";
import type { Message } from "../../@types/message";

const MessageBubble: React.FC<{
  message: Message;
  children: React.ReactNode;
}> = ({ message, children }) => {
  const isMe = message.sender === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[500px] rounded-2xl text-sm shadow-sm transition-all ${message.type === "audio" ? "min-w-[300px]" : ""} ${
          isMe
            ? "bg-[var(--primary-color)] text-white rounded-tr-none"
            : "bg-white text-slate-700 rounded-bl-none border border-slate-200 dark:border-zinc-700"
        }`}
      >
        {/* Contenido específico del mensaje */}
        <div
          className={`${message.type !== "text" ? "px-1 py-1 pb-2" : "px-4 py-2"}`}
        >
          {children}
        </div>

        {/* Footer común: Hora y Checks */}
      </div>
    </div>
  );
};

export default MessageBubble;
