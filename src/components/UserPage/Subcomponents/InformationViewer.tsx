import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { DataApiChange } from "./typeDefinitions"; // Assuming ChangeDetailsApi is the type for the response

interface InformationScreenProps {
  data: DataApiChange; // Use the correct type for API response
  setOption: (option: string) => void; // Prop to navigate back
}

const InformationScreen: React.FC<InformationScreenProps> = ({
  data,
  setOption,
}) => {
  // Function to determine the color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#000000"; // Orange for Pending
      case "approved":
        return "#28a745"; // Green for Approved
      case "rejected":
        return "#FA425A"; // Red for Rejected
      default:
        return "#595959"; // Default grey
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between">
        <p className="mb-10 text-[#000000] font-bold text-3xl">
          Chi tiết tiến trình xử lý
        </p>
        <div>
          <Button onClick={() => setOption("main")}>Quay lại</Button>
          <Button
            type="primary"
            className="ml-7"
            onClick={() => setOption("edit")}
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="flex justify-between p-5 bg-[#F5F9FF] rounded-3xl">
        <p>{data.new_object.question}</p>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              color: getStatusColor(data.status), // Apply status color
            }}
            className="text-[8px] mr-2"
          />
          <p
            style={{
              color: getStatusColor(data.status), // Apply status color to text
            }}
            className="font-bold"
          >
            {data.status}
          </p>
        </div>
      </div>

      <div className="flex mt-5 h-full">
        <div className="w-1/2 h-full flex flex-col mr-7">
          <div className="flex flex-col h-3/5">
            <p className="text-xl font-bold">Câu trả lời thay đổi</p>
            <p className="h-full bg-[#F5F9FF] mt-3 pl-5 pt-7 pr-5 rounded-3xl text-lg overflow-y-auto">
              {data.new_object.answer || "Chưa có câu trả lời"}
            </p>
          </div>
          <div className="mt-10 h-1/5">
            <p className="text-xl font-bold">Hình ảnh, video đính kèm</p>
            <div className="bg-[#F5F9FF] h-full mt-3 rounded-3xl">
              {/* Map through images or videos */}
              {data.new_object?.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Attached Image ${index}`}
                  className="inline-block w-24 h-24 object-cover mr-2"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full">
          <p className="text-xl font-bold">Phản hồi của người kiểm duyệt</p>
          <p className="h-[85%] border mt-3 pl-5 pt-7 pr-10 rounded-3xl text-lg">
            {data.reason || "Không có phản hồi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationScreen;
