import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBookmark, faListCheck } from "@fortawesome/free-solid-svg-icons";

export interface ChatMessageData {
  role: string;
  content: string;
  created_at: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.role === "user") {
    return (
      <div className="mb-5 w-auto">
        <div className="flex justify-end">
          <p className="px-7 text-base max-w-[50%] break-words rounded-3xl rounded-br-lg border py-4 bg-blue-600 text-white mr-4">
            {message.content}
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mb-5 w-4/5">
        <div className="flex flex-col border px-7 py-4 max-w-[66%] break-words rounded-3xl rounded-bl-lg">
          <div className="flex justify-between items-center mb-3">
            <img src="/Vector.svg" alt="Assistant icon" className="w-5 h-5" />
            {/* <div>
              <FontAwesomeIcon
                icon={faBookmark}
                color="#595959"
                className="mr-5"
              />
              <FontAwesomeIcon icon={faListCheck} color="#595959" />
            </div> */}
          </div>
          <p className="text-base break-words">{message.content}</p>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
