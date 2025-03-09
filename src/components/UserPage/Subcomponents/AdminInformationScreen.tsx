import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Input } from "antd";
import React, { useState } from "react";
import { AdminDataChange } from "./typeDefinitions";
import { postApproveOrReject } from "../../../api/api"; // Import the API function

interface AdminInformationScreenProps {
  data: AdminDataChange;
  setOption: (option: string) => void; // Prop to navigate back
  id: number; // The ID to use in API calls
}

const AdminInformationScreen: React.FC<AdminInformationScreenProps> = ({
  data,
  setOption,
  id,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  console.log(id);

  const handleApprove = async () => {
    try {
      await postApproveOrReject(id, {
        action: "approve",
        rejected_reason: "",
      });
      setIsModalOpen(true); // Show success modal
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return; // Ensure a reason is provided
    }
    try {
      await postApproveOrReject(id, {
        action: "reject",
        rejected_reason: rejectReason,
      });
      setIsRejectModalOpen(false); // Close the reject modal
      setOption("main"); // Navigate back
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#000000"; // Orange for Pending
      case "approved":
        return "#28a745"; // Green for Approved
      case "rejected":
        return "#FA425A"; // Red for Rejected
      default:
        return "#000000"; // Default to black if status is unknown
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chưa duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã bị từ chối";
      default:
        return "Trạng thái không xác định";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between">
        <p className="mb-10 text-[#000000] font-bold text-3xl">
          Chi tiết yêu cầu xử lý
        </p>
        <Button onClick={() => setOption("main")}>Quay lại</Button>
      </div>

      <div className="flex justify-between p-5 bg-[#F5F9FF] rounded-3xl">
        <p>{data.old_object.question}</p>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faCircle}
            style={{ color: getStatusColor(data.status) }}
            className="text-[8px] mr-2"
          />
          <p
            style={{ color: getStatusColor(data.status) }}
            className="font-bold"
          >
            {getStatusText(data.status)}
          </p>
        </div>
      </div>

      <div className="flex mt-5 h-full flex-col">
        <div className="flex flex-row h-[60%]">
          {/* Current and Changed Answers */}
          <div className="w-1/2 flex flex-col mr-7">
            <div className="flex flex-col h-1/2">
              <p className="text-lg font-bold">Câu trả lời hiện tại</p>
              <div
                className="h-full bg-[#F5F9FF] mt-3 pl-5 pt-7 pr-5 rounded-3xl text-sm overflow-y-auto"
                style={{ maxHeight: "150px" }}
              >
                {data.old_object.answer}
              </div>
            </div>
            <div className="mt-7 h-1/4">
              <p className="text-lg font-bold">Hình ảnh, video hiện tại</p>
              <div
                className="bg-[#F5F9FF] h-full mt-3 rounded-3xl overflow-x-auto whitespace-nowrap"
                style={{ maxHeight: "150px" }}
              >
                {data.old_object.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Old Image ${index}`}
                    className="inline-block w-24 h-24 object-cover mr-2"
                  />
                ))}
                {data.old_object.videos.map((vid, index) => (
                  <video
                    key={index}
                    src={vid}
                    className="inline-block w-24 h-24 object-cover mr-2"
                    controls
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="flex flex-col h-1/2">
              <p className="text-lg font-bold">Câu trả lời được thay đổi</p>
              <div
                className="h-full bg-[#F5F9FF] mt-3 pl-5 pt-7 pr-5 rounded-3xl text-sm overflow-y-auto"
                style={{ maxHeight: "150px" }}
              >
                {data.new_object.answer}
              </div>
            </div>
            <div className="mt-7 h-1/4">
              <p className="text-lg font-bold">Hình ảnh, video được thay đổi</p>
              <div
                className="bg-[#F5F9FF] h-full mt-3 rounded-3xl overflow-x-auto whitespace-nowrap"
                style={{ maxHeight: "150px" }}
              >
                {data.new_object.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`New Image ${index}`}
                    className="inline-block w-24 h-24 object-cover mr-2"
                  />
                ))}
                {data.new_object.videos.map((vid, index) => (
                  <video
                    key={index}
                    src={vid}
                    className="inline-block w-24 h-24 object-cover mr-2"
                    controls
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-between">
          <Button onClick={() => setIsRejectModalOpen(true)}>
            Huỷ chỉnh sửa
          </Button>
          <Button className="mx-5" type="primary" onClick={handleApprove}>
            Lưu chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Approve Success Modal */}
      <Modal
        centered
        open={isModalOpen}
        footer={false}
        closable={false}
        keyboard={false}
        width="auto"
      >
        <div className="flex flex-col justify-center items-center py-5 px-12">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-6xl mb-5 text-[#227EFF]"
          />
          <p className="text-3xl mb-5 font-medium">Lưu thành công!</p>
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

      {/* Reject Modal */}
      <Modal
        centered
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col">
          <p className="text-xl font-medium mb-3">Lý do từ chối</p>
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do từ chối"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="mt-5 flex justify-end">
            <Button
              onClick={() => setIsRejectModalOpen(false)}
              className="mr-3"
            >
              Huỷ bỏ
            </Button>
            <Button type="primary" onClick={handleReject}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminInformationScreen;
