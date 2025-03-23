import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import React from "react";
import parse from "html-react-parser"; // Import html-react-parser
import DOMPurify from "dompurify"; // Import DOMPurify
import { DataApiChange } from "./typeDefinitions";

interface InformationScreenProps {
  data: DataApiChange;
  setOption: (option: string) => void;
}

const InformationScreen: React.FC<InformationScreenProps> = ({
  data,
  setOption,
}) => {
  // Function to determine the color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#000000";
      case "approved":
        return "#28a745";
      case "rejected":
        return "#FA425A";
      default:
        return "#595959";
    }
  };

  // Function to sanitize and parse HTML content
  const renderHtmlContent = (html: string) => {
    // Sanitize the HTML to ensure safety
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "ul", "ol", "li"],
      ALLOWED_ATTR: [],
    });
    // Parse the sanitized HTML into React components
    return parse(sanitizedHtml);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-[10%] flex justify-between">
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

      <div className="h-[9%] flex justify-between p-5 bg-[#e7effc] rounded-3xl">
        <p className="flex items-center">{data.new_object.question}</p>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faCircle}
            style={{
              color: getStatusColor(data.status),
            }}
            className="text-[8px] mr-2"
          />
          <p
            style={{
              color: getStatusColor(data.status),
            }}
            className="font-bold"
          >
            {data.status}
          </p>
        </div>
      </div>

      <div className="h-[80%] flex mt-5 h-full">
        <div className="w-1/2 h-full flex flex-col mr-7">
          <div className="flex flex-col h-[50%]">
            <p className="text-xl font-bold">Câu trả lời thay đổi</p>
            <div className="h-full bg-[#e7effc] mt-3 pl-5 pt-7 pr-5 rounded-3xl text-lg overflow-y-auto">
              {data.new_object.answer ? (
                data.new_object.answer &&
                /<\/?[a-z][\s\S]*>/i.test(data.new_object.answer) ? (
                  <div className="answer-content text-sm">
                    {renderHtmlContent(data.new_object.answer)}
                  </div>
                ) : (
                  <p className="text-black text-sm">{data.new_object.answer}</p>
                )
              ) : (
                "Chưa có câu trả lời"
              )}
            </div>
          </div>
          <div className="mt-10 h-[25%]">
            <p className="text-xl font-bold">Hình ảnh, video đính kèm</p>
            <div className="bg-[#e7effc] h-full mt-3 rounded-3xl">
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
          <p className="h-[5%] text-xl font-bold">
            Phản hồi của người kiểm duyệt
          </p>
          <p className="h-[85%] border mt-3 pl-5 pt-7 pr-10 rounded-3xl text-lg">
            {data.reason || "Không có phản hồi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationScreen;
