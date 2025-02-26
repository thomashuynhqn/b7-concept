import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import ChatMessage, { ChatMessageData } from "./ChatMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

interface ChatScreenProps {
  chatData: ChatMessageData[];
  onSendMessage: (message: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chatData, onSendMessage }) => {
  const isLoading = useSelector((state: RootState) => state.loading.status);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Scroll to the bottom every time chatData updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages container with min-h-0 prevents overflow in a flex layout */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {chatData.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {/* Dummy element for scrolling */}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <div className="pt-4 border-t">
        <Input
          name="message"
          disabled={isLoading}
          style={{ backgroundColor: "#F5F9FF" }}
          className="w-full h-12"
          placeholder="Xin chào! Tôi là Trợ lý thông minh từ thư viện..."
          prefix={<img src="/Vector.svg" className="w-5 h-5" alt="AI icon" />}
          onKeyDown={handleKeyDown}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatScreen;
