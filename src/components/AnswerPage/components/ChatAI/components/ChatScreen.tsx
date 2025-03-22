import React, { useEffect, useRef, useState } from "react";
import { Input, Spin } from "antd";
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
    <div className="flex flex-col h-[63vh] w-full bg-white rounded-xl shadow-md">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatData.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Input Box */}
      <div className="p-4">
        <div className="flex items-start bg-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all">
          {/* AI Icon inside the input */}
          <img src="/Vector.svg" className="w-5 h-5 mr-2 mt-2" alt="AI icon" />

          {/* TextArea (Auto-resizing) */}
          <TextArea
            name="message"
            disabled={isLoading}
            className="w-full text-base bg-gray-100 text-gray-800 bg-transparent border-none focus:ring-0"
            placeholder="Xin chào! Tôi là Trợ lý thông minh từ thư viện..."
            autoSize={{ minRows: 1, maxRows: 6 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ resize: "none" }}
          />

          {/* Loading Spinner (if applicable) */}
          {isLoading && <Spin size="small" className="ml-3" />}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
