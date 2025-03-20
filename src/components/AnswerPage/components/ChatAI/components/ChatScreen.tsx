import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import ChatMessage, { ChatMessageData } from "./ChatMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const { TextArea } = Input;

interface ChatScreenProps {
  chatData: ChatMessageData[];
  onSendMessage: (message: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chatData, onSendMessage }) => {
  const isLoading = useSelector((state: RootState) => state.loading.status);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Scroll to bottom when chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue.trim());
        setInputValue("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages container with min-h-0 prevents overflow in a flex layout */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {chatData.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="pt-4 border-t flex items-start" />
      {/* Input area with prefix */}
      <div className="pt-4 border flex items-start bg-[#F5F9FF] p-2 rounded-3xl">
        {/* Prefix Icon */}
        <img src="/Vector.svg" className="w-6 h-6 mx-2" alt="AI icon" />

        {/* TextArea */}
        <TextArea
          name="message"
          disabled={isLoading}
          className="w-full text-base border-none resize-none bg-transparent focus:outline-none"
          placeholder="Xin chào! Tôi là Trợ lý thông minh từ thư viện..."
          autoSize={{ minRows: 1, maxRows: 10 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default ChatScreen;
