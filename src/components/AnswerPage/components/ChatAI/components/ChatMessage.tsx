import React, { useEffect, useState } from "react";

export interface ChatMessageData {
  role: string;
  content: string;
  created_at: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [visibleText, setVisibleText] = useState<string[]>([]);

  useEffect(() => {
    if (!isUser) {
      const words = message.content.split("\n");
      let i = 0;
      const interval = setInterval(() => {
        setVisibleText(words.slice(0, i + 1));
        i++;
        if (i > words.length) clearInterval(interval);
      }, 50); // Adjust speed for a smooth fade-in effect
      return () => clearInterval(interval);
    } else {
      setVisibleText(message.content.split("\n"));
    }
  }, [message.content, isUser]);

  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`mb-5 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative px-5 py-3 max-w-[65%] break-words rounded-3xl ${
          isUser
            ? "bg-blue-600 text-white rounded-br-lg"
            : "bg-gray-100 text-black rounded-bl-lg"
        } shadow-md transition-opacity duration-500`}
      >
        {!isUser && (
          <div className="absolute -top-7 left-3 flex items-center">
            <img
              src="/Vector.svg"
              alt="Assistant icon"
              className="w-5 h-5 mr-2"
            />
            <span className="text-sm text-gray-500">AI Assistant</span>
          </div>
        )}

        {/* Render AI message line by line, with bold formatting */}
        {visibleText.map((line, index) => (
          <p key={index} className="text-base leading-relaxed fade-in">
            {formatText(line)}
          </p>
        ))}

        <div className="text-xs text-gray-400 mt-2 text-right">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>

      {/* CSS for smooth fade-in effect */}
      <style>
        {`
          .fade-in {
            opacity: 0;
            animation: fadeIn 0.5s ease-in-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ChatMessage;
