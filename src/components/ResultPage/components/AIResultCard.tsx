import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

interface AIResultCardProps {
  data: string;
  answerId: number; // The ID of the current answer from the API
  onSaveAnswer: (id: number) => void;
  onClose: () => void; // This function will close the AI result screen
}

const AIResultCard: React.FC<AIResultCardProps> = ({
  data,
  answerId,
  onSaveAnswer,
  onClose,
}) => {
  return (
    <div className="w-full bg-white mb-4">
      <div className="border border-[#BFBFBF] p-5 rounded-xl">
        {/* Header with the Vector icon */}
        <div className="flex justify-between items-center mb-4">
          <img src="/Vector.svg" alt="Vector Icon" className="w-6 h-6" />
        </div>
        {/* Content */}
        <div className="text-black mb-4">{data}</div>
        {/* Action Buttons */}
        <div className="flex justify-start space-x-4">
          <button
            onClick={() => onSaveAnswer(answerId)}
            className="flex items-center text-[#595959] hover:text-[#227EFF] focus:outline-none"
          >
            <FontAwesomeIcon icon={faListCheck} className="mr-2" />
            <span>Lưu thành kết quả mới</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center text-[#595959] hover:text-red-600 focus:outline-none"
            title="Đóng cửa sổ AI"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            <span>Đóng cửa sổ AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIResultCard;
