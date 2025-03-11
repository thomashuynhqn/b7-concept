import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { DataApi } from "../ChatContainer";

interface ChatCardProps {
  data: DataApi;
  onChatClick: () => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ data, onChatClick }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white p-6 rounded-3xl shadow">
      <div className="flex justify-between items-center mb-4">
        <img src="/Vector.svg" alt="Vector" className="w-5 h-5" />
        <button
          type="button"
          onClick={onChatClick}
          className="px-4 py-2 bg-orange-500 text-white rounded-full border border-transparent transition-colors hover:bg-white hover:text-orange-500 hover:border-orange-500"
        >
          Chat với AI
        </button>
      </div>
      <div className="flex-1 overflow-y-auto text-black">
        {data.answer && /<\/?[a-z][\s\S]*>/i.test(data.answer) ? (
          // Là HTML
          <div dangerouslySetInnerHTML={{ __html: data.answer }} />
        ) : (
          // Là chuỗi văn bản
          <p className="text-black text-sm">{data.answer}</p>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center text-gray-600 cursor-pointer">
          <FontAwesomeIcon icon={faListCheck} />
          <span className="ml-2">Lưu thành kết quả mới</span>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
