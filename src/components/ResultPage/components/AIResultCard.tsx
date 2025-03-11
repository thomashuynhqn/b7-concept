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
  // Function to format text and check for markdown bold formatting.
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full bg-white mb-4">
      <div className="border border-[#BFBFBF] p-5 rounded-xl">
        {/* Header with the Vector icon */}
        <div className="flex justify-between items-center mb-4">
          <img src="/Vector.svg" alt="Vector Icon" className="w-6 h-6" />
        </div>
        {/* Content with scroll added */}
        <div className="text-black mb-4 overflow-y-auto max-h-96">
          {data.split("\n").map((line, index) => {
            // Check if the line is a markdown heading (###)
            if (line.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-bold mb-2">
                  {formatText(line.slice(4))}
                </h3>
              );
            }
            return (
              <p key={index} className="leading-relaxed mb-2">
                {formatText(line)}
              </p>
            );
          })}
        </div>
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
