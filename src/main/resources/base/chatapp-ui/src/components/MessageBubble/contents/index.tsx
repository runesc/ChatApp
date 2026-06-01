import type { Message } from "../../../@types/message";
import MessageFooter from "../footer";

export interface ContentProps {
  m: Message;
  onImageClick?: (url: string) => void;
  renderStatus: (status?: string) => React.ReactElement;
}
const ImageContent: React.FC<ContentProps> = ({
  m,
  onImageClick,
  renderStatus,
}) => (
  <>
    <img
      src={m.mediaUrl}
      alt="Sent media"
      className="rounded-lg max-h-60 object-cover cursor-pointer hover:brightness-90 transition-all"
      onClick={() => {
        if (m.mediaUrl && onImageClick) onImageClick(m.mediaUrl);
      }}
    />
    <div className="flex">
      {m.text && <p className="mt-2 leading-relaxed">{m.text}</p>}
      <MessageFooter message={m} renderStatus={renderStatus} />
    </div>
  </>
);
const VideoContent: React.FC<ContentProps> = ({
  m,
  onImageClick,
  renderStatus,
}) => (
  <>
    <div
      className="relative group cursor-pointer"
      onClick={() => m.mediaUrl && onImageClick?.(m.mediaUrl)}
    >
      <video className="rounded-lg max-h-60 w-full pointer-events-none">
        <source src={m.mediaUrl} type="video/mp4" />
      </video>
      {/* Overlay para indicar que es un video reproducible en grande */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all rounded-lg">
        <i className="pi pi-play text-white text-3xl"></i>
      </div>
    </div>
    <div className="flex">
      {m.text && <p className="mt-2 leading-relaxed">{m.text}</p>}
      <MessageFooter message={m} renderStatus={renderStatus} />
    </div>
  </>
);

const AudioContent: React.FC<ContentProps> = ({ m, renderStatus }) => (
  <div className="flex pt-1">
    <audio controls className="w-full max-w-[200px] h-8">
      <source src={m.mediaUrl} type="audio/mpeg" />
    </audio>
    <MessageFooter message={m} renderStatus={renderStatus} />
  </div>
);

const FileContent: React.FC<ContentProps> = ({ m, renderStatus }) => (
  <div className="flex gap-2 pl-2 py-2">
    <a
      href={m.mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-500 hover:underline"
    >
      <i className="pi pi-download text-white hover:text-blue-500"></i>
    </a>
   <div className="flex gap-4">
     {m.text && <p className="leading-relaxed">{m.text}</p>}
    <MessageFooter message={m} renderStatus={renderStatus} />
   </div>
  </div>
);

const TextContent: React.FC<ContentProps> = ({ m, renderStatus }) => (
  <div className={
    // f-string
    `flex ${
      // if message exceds 1 line set flex-col, else align items center
      m.text && m.text.length > 50 ? "flex-col gap-1" : "gap-4"
    }`
  }
  >
    {m.text && <p className="leading-relaxed">{m.text}</p>}
    <MessageFooter message={m} renderStatus={renderStatus} />
  </div>
);

export { ImageContent, VideoContent, AudioContent, FileContent, TextContent };
