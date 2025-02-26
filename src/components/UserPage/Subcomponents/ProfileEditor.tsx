import { faCheck, faCircle, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "antd";
import React from "react";
import TextEditor from "../../../utils/RichTextEditor/Editor";
import { DataApiChange } from "./typeDefinitions";

interface EditScreenProps {
  data: DataApiChange;
  setOption: (option: string) => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ data, setOption }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // Function to determine the color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF7600"; // Orange for Pending
      case "approved":
        return "#28a745"; // Green for Approved
      case "rejected":
        return "#FA425A"; // Red for Rejected
      default:
        return "#595959"; // Default to grey
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between">
        <p className="mb-10 text-[#000000] font-bold text-3xl">
          Chi tiết tiến trình xử lý
        </p>
        <div>
          <Button onClick={() => setOption("main")}>Huỷ chỉnh sửa</Button>
          <Button type="primary" className="ml-7" onClick={showModal}>
            Lưu chỉnh sửa
          </Button>
          <Modal
            centered
            open={isModalOpen}
            footer={false}
            closable={false}
            keyboard={false}
          >
            <div className="h-full w-full flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faCheck}
                className="text-6xl mb-5 text-[#227EFF]"
              />
              <p className="text-3xl font-medium">Lưu thành công!</p>
              <p className="text-center mb-5">
                Thay đổi của bạn đang được chúng tôi xử lý. Theo dõi tiến trình
                xử lý câu trả lời tại "Tài khoản {">"} Tiến trình xử lý"
              </p>
              <Button
                type="primary"
                size="middle"
                onClick={() => setOption("main")}
                className="px-5"
              >
                Tiếp tục
              </Button>
            </div>
          </Modal>
        </div>
      </div>

      <div className="flex justify-between p-5 bg-[#F5F9FF] rounded-3xl">
        <p>{data.status}</p>
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
        <div className="w-full h-full flex flex-col">
          <div className="flex flex-col h-3/5">
            <p className="text-xl font-bold">Câu trả lời thay đổi</p>
            <div className="h-full border border-[#BFBFBF] mt-3 pl-5 pt-7 pr-5 rounded-3xl text-lg">
              <TextEditor
                toolbarWidth={"35%"}
                editorHeight="30dvh"
                defaultValue={""}
              />
              <FontAwesomeIcon
                icon={faFlag}
                className="text-xl text-[#595959] absolute right-[16%] top-[30.5%]"
              />
            </div>
          </div>
          <div className="mt-10 h-1/5">
            <p className="text-xl font-bold">Hình ảnh, video đính kèm</p>
            <div className="h-full border-2 border-dashed border-[#BFBFBF] mt-3 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScreen;
