import React, { useEffect, useState, type KeyboardEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useRef } from "react";
import {
  TextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  FileContent,
} from "../../../components/MessageBubble/contents";
import ContextualButton from "../../../components/ContextualButton";
import MessageBubble from "../../../components/MessageBubble";
import type { Message } from "../../../@types/message";

interface GalleriaItem {
  src: string;
  type: "image" | "video";
  alt: string;
}
interface ContentProps {
  m: Message;
  onImageClick: (url: string) => void;
  renderStatus: (status?: string) => React.ReactElement;
}
import { Galleria } from "primereact/galleria";

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! esto es una prueba",
      sender: "external",
      type: "text",
      timestamp: new Date(),
      status: "read",
    },
    {
      id: 2,
      text: "Mira esto jejje",
      sender: "me",
      type: "image",
      mediaUrl:
        "https://fastly.picsum.photos/id/807/1920/1080.jpg?hmac=3sb3IQBdY1Uc2HPdPAgxVratmxHAa3kUFn-eIc1XGp8",
      timestamp: new Date(),
      status: "delivered",
    },
    {
      id: 3,
      text: "apoco no se ve chido?",
      sender: "me",
      type: "video",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      timestamp: new Date(),
      status: "sent",
    },
    {
      id: 4,
      text: "Aquí tienes el documento",
      sender: "me",
      type: "file",
      mediaUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      timestamp: new Date(),
      status: "read",
    },
    {
      id: 5,
      text: "Escucha esto",
      sender: "me",
      type: "audio",
      mediaUrl: "https://www.w3schools.com/html/horse.mp3",
      timestamp: new Date(),
      status: "read",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const galleria = useRef<Galleria>(null);
  const [activeItem, setActiveItem] = useState<GalleriaItem[]>([]);

  const sendMessage = (): void => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "me",
        type: "text",
        timestamp: new Date(),
        status: "sent",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    }
  };

  useEffect(() => {
    const container = document.querySelector("main");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Renderiza los checks de 8px según el estado
  const renderStatus = (status?: string) => {
    const isRead = status === "read";
    const isDelivered = status === "delivered" || isRead;
    const colorClass = isRead ? "text-blue-400" : "text-white opacity-70";

    return (
      <div className="relative flex items-center h-3 w-3">
        {/* Primer Check */}
        <i
          className={`pi pi-check ${colorClass} absolute`}
          style={{ fontSize: "8px", left: isDelivered ? "0px" : "2px" }}
        ></i>
        {/* Segundo Check (Superpuesto) */}
        {isDelivered && (
          <i
            className={`pi pi-check ${colorClass} absolute`}
            style={{ fontSize: "8px", left: "4px" }}
          ></i>
        )}
      </div>
    );
  };

  const onMediaClick = (url: string, type: "image" | "video"): void => {
    setActiveItem([{ src: url, type: type, alt: "Media content" }]);
    setTimeout(() => galleria.current?.show(), 10);
  };

  const handleMessage = (message: Message) => {
    const contentMap: Record<Message["type"], React.FC<ContentProps>> = {
      image: ImageContent,
      video: VideoContent,
      audio: AudioContent,
      file: FileContent,
      text: TextContent,
    };

    const Content = contentMap[message.type] || TextContent;

    return (
      <MessageBubble
        key={message.id}
        message={message}
      >
        <Content
          m={message}
          renderStatus={renderStatus}
          onImageClick={(url) =>
            onMediaClick(url, message.type as "image" | "video")
          }
        />
      </MessageBubble>
    );
  };
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <section className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                icon="pi pi-user"
                shape="circle"
                className="bg-purple-100 text-blue-600"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                Username
              </p>
              <p className="text-[10px] text-green-500 font-medium">
                Activo ahora
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-3 bg-white dark:bg-zinc-800">
          {messages.map((message) => handleMessage(message))}
        </main>

        <footer className="p-4 border-t border-slate-200 bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-center gap-4">
            <ContextualButton />
            <div className="flex-1 flex gap-3 items-center min-w-0 relative">
              <InputText
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                className="flex-1 pl-4 pr-4 py-3 border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Button
                rounded
                size="small"
                icon="pi pi-send"
                onClick={sendMessage}
                disabled={!input.trim()}
              />
            </div>
          </div>
        </footer>
      </section>
      <Galleria
        ref={galleria}
        value={activeItem} // Usamos el nuevo estado
        fullScreen
        circular
        showThumbnails={false}
        showItemNavigators={activeItem.length > 1}
        item={(item: GalleriaItem) => {
          return item.type === "video" ? (
            <video controls autoPlay className="w-full block max-h-[90vh]">
              <source src={item.src} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          ) : (
            <img
              src={item.src}
              alt={item.alt}
              className="w-full block max-h-[90vh] object-contain"
            />
          );
        }}
      />
    </div>
  );
};

export default ChatApp;
