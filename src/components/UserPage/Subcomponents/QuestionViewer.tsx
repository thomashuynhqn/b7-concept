import { Button } from "antd";
import React from "react";

interface SaveQuestionData {
  saved_questions: DataApi[];
}
interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[]; // Corrected to allow an array of strings
  like_count: number;
  topic: number;
  images: string;
  videos: string;
}

interface WarpCardProps {
  data: DataApi;
  onToggleWatch: () => void;
  onDelete: () => void; // New prop for delete functionality
}

interface WarpCardInforProps {
  data: DataApi;
}

interface QuestionScreenProps {
  data: SaveQuestionData; // Accept list of saved questions as props
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
        <Button onClick={onDelete}>Xoá</Button>
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

const QuestionScreen: React.FC<QuestionScreenProps> = ({ data }) => {
  console.log(data);
  const [isViewingDetails, setIsViewingDetails] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<DataApi | null>(null);

  const handleToggleWatch = (item: DataApi) => {
    setSelectedItem(item);
    setIsViewingDetails(true);
  };

  const handleDelete = (item: DataApi) => {
    // Add delete logic (e.g., API call)
    console.log(`Deleting question with ID: ${item.id}`);
  };

  return (
    <div className="h-full">
      {isViewingDetails && selectedItem ? (
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
            <div>
              {data?.saved_questions?.length > 0 ? (
                data.saved_questions.map((item) => (
                  <WarpCard
                    key={item.id}
                    data={item}
                    onToggleWatch={() => handleToggleWatch(item)}
                    onDelete={() => handleDelete(item)} // Pass delete handler
                  />
                ))
              ) : (
                <div>Chưa có câu hỏi nào được lưu</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
