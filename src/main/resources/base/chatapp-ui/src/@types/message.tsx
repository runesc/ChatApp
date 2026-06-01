export interface Message {
  id: number;
  text: string;
  type: "text" | "image" | "video" | "audio" | "file";
  mediaUrl?: string; // Para mensajes de imagen, video o archivo
  sender: "me" | "external";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}