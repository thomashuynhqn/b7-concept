import React, { useState, useEffect } from "react";
import ChatCard from "./components/ChatCard";
import ChatScreen from "./components/ChatScreen";
import { AxiosResponse } from "axios";
import {
  postChat,
  postChatHistory,
  clearChatHistory,
} from "../../../../api/api";

export interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  like_count: number;
  topic: {
    id: number;
    name: string;
    description: string;
  };
  images?: string[];
  videos?: string[];
}

export interface ChatMessageData {
  role: string;
  content: string;
  created_at: string;
}

interface ChatContainerProps {
  data: DataApi;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ data }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatData, setChatData] = useState<ChatMessageData[]>([]);
  const [activeTab, setActiveTab] = useState<"aichat" | "savekeyword">(
    "aichat"
  );

  // When the chat opens, fetch the existing chat history using postChatHistory.
  useEffect(() => {
    if (showChat) {
      postChatHistory({
        user_id: Number(localStorage.getItem("user_id")),
        question_answer_pair_id: data.id,
      })
        .then((res: AxiosResponse<{ chat_history: ChatMessageData[] }>) => {
          const chatHistory = Array.isArray(res.data.chat_history)
            ? res.data.chat_history
            : [];
          setChatData(chatHistory);
        })
        .catch((err) => {
          console.error("Error fetching chat history:", err);
        });
    }
  }, [showChat, data.id]);

  const handleChat = (message: string) => {
    // Append the user's message optimistically.
    const userMessage: ChatMessageData = {
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    };
    setChatData((prev) => [...prev, userMessage]);

    // Call postChat to send the new message.
    postChat({
      user_id: Number(localStorage.getItem("user_id")),
      message,
      question_answer_pair_id: data.id,
    })
      .then((res: AxiosResponse<{ response: string }>) => {
        // Create the assistant's message from the response.
        const assistantMessage: ChatMessageData = {
          role: "assistant",
          content: res.data.response,
          created_at: new Date().toISOString(),
        };
        setChatData((prev) => [...prev, assistantMessage]);
      })
      .catch((err) => {
        console.error("Chat error:", err);
      });
  };

  // Clear chat history using the clearChatHistory API.
  const handleClearChat = async () => {
    try {
      await clearChatHistory({
        user_id: Number(localStorage.getItem("user_id")),
        question_answer_pair_id: data.id,
      });
      setChatData([]); // Clear the local chat history.
      console.log("Chat history cleared.");
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <div className="h-full w-full">
      {showChat ? (
        <div className="h-full w-full flex flex-col bg-white rounded-3xl p-10">
          {/* Header with tabs, Clear Chat button and exit */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <div className="flex justify-between space-x-4 w-full">
              <span
                className={`cursor-pointer text-lg ${
                  activeTab === "aichat"
                    ? "font-bold text-black"
                    : "font-normal text-gray-500"
                }`}
                onClick={() => setActiveTab("aichat")}
              >
                AI Chat
              </span>
              <span className="flex items-center space-x-4">
                <button
                  className="text-sm text-gray-600 hover:text-black"
                  onClick={handleClearChat}
                >
                  Clear Chat
                </button>
                <button
                  className="text-xl font-bold text-gray-600 hover:text-black"
                  onClick={() => setShowChat(false)}
                >
                  X
                </button>
              </span>
            </div>
          </div>
          {/* Main content area */}
          <div className="flex-grow overflow-hidden">
            {activeTab === "aichat" ? (
              <ChatScreen chatData={chatData} onSendMessage={handleChat} />
            ) : (
              <div>""</div>
            )}
          </div>
        </div>
      ) : (
        <ChatCard data={data} onChatClick={() => setShowChat(true)} />
      )}
    </div>
  );
};

export default ChatContainer;
