import { Button, message, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { getSaveQuestions, postDeleteSavedQuestion } from "../../../api/api"; // Ensure correct API import

interface SaveQuestionData {
  saved_questions: DataApi[];
}
interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  like_count: number;
  topic: number;
  images: string;
  videos: string;
}

interface WarpCardProps {
  data: DataApi;
  onToggleWatch: () => void;
  onDelete: () => void;
}

interface WarpCardInforProps {
  data: DataApi;
}

const WarpCard: React.FC<WarpCardProps> = ({
  data,
  onToggleWatch,
  onDelete,
}) => {
  return (
    <div className="w-full h-full flex justify-between items-center border-b border-b-[#BFBFBF] py-2">
      <p className="text-black text-base">{data.question}</p>
      <div>
        <Button type="primary" className="mr-3" onClick={onToggleWatch}>
          Xem
        </Button>
        <Button
          danger
          onClick={onDelete}
          type="primary"
          className="border hover:bg-white hover:text-red-500"
        >
          Xoá
        </Button>
      </div>
    </div>
  );
};

const WarpCardInfor: React.FC<WarpCardInforProps> = ({ data }) => {
  return (
    <div className="h-full">
      <p className="mt-7 mb-3 text-lg font-bold">Câu hỏi ban đầu</p>
      <p className="text-base bg-[#F5F9FF] p-5 rounded-3xl">{data.question}</p>

      <p className="mt-7 mb-3 text-lg font-bold">Câu trả lời đã lưu</p>
      <div
        className="h-full border p-5 rounded-3xl text-lg overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        {data.answer || "Chưa có câu trả lời"}
      </div>
    </div>
  );
};

const QuestionScreen: React.FC = () => {
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataApi | null>(null);
  const [questions, setQuestions] = useState<DataApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      const user_id = localStorage.getItem("user_id") || "";

      if (!user_id) {
        message.error("User ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await getSaveQuestions(user_id);
        setQuestions(response.data.saved_questions || []);
      } catch (error) {
        message.error("Lỗi khi tải câu hỏi đã lưu.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQuestions();
  }, []);

  const handleToggleWatch = (item: DataApi) => {
    setSelectedItem(item);
    setIsViewingDetails(true);
  };

  const handleDelete = async (item: DataApi) => {
    const user_id = localStorage.getItem("user_id") || "";

    if (!user_id) {
      message.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      await postDeleteSavedQuestion(Number(user_id), item.id);
      message.success("Xoá câu hỏi thành công");

      // Update local state to remove the deleted question
      setQuestions((prev) => prev.filter((q) => q.id !== item.id));
    } catch (error) {
      message.error("Lỗi khi xoá câu hỏi");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : isViewingDetails && selectedItem ? (
        <div className="h-full flex flex-col">
          <div className="flex flex-row justify-between">
            <p className="mb-10 text-[#000000] font-bold text-3xl">
              Câu trả lời được lưu
            </p>
            <Button
              onClick={() => setIsViewingDetails(false)}
              size="middle"
              className="py-4 px-5"
            >
              Quay lại
            </Button>
          </div>
          <div className="h-2/3">
            <WarpCardInfor data={selectedItem} />
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-10 text-[#000000] font-bold text-3xl">
            Câu trả lời được lưu
          </p>
          <div>
            {questions.length > 0 ? (
              questions.map((item) => (
                <WarpCard
                  key={item.id}
                  data={item}
                  onToggleWatch={() => handleToggleWatch(item)}
                  onDelete={() => handleDelete(item)}
                />
              ))
            ) : (
              <div>Chưa có câu hỏi nào được lưu</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
