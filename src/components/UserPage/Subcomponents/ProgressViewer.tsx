import { faCircle, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Popover, Spin } from "antd";
import React, { useState } from "react";
import { getDetailsChanges } from "../../../api/api"; // API call for change details
import InformationScreen from "./InformationViewer";
import EditScreen from "./ProfileEditor";
import { DataApi, DataApiChange } from "./typeDefinitions"; // Assuming these are your types

interface WarpCardProps {
  data: DataApi;
  setOption: (option: string, id?: number) => void;
}

interface ProgressScreenProps {
  dataList: DataApi[]; // The fetched data will be passed as props
}

const WarpCard: React.FC<WarpCardProps> = ({ data, setOption }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF7600"; // Orange for Pending
      case "approved":
        return "#28a745"; // Green for Approved
      case "rejected":
        return "#FA425A"; // Red for Rejected
      default:
        return "#595959"; // Default grey
    }
  };

  // Function to translate and localize status
  const getLocalizedStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Được duyệt";
      case "rejected":
        return "Từ chối duyệt";
      default:
        return "Không xác định"; // Fallback for unknown statuses
    }
  };

  return (
    <div className="w-full h-full flex justify-between items-center border-b border-b-[#BFBFBF] py-2">
      <p className="text-black text-base w-1/3">{data.question}</p>
      <div className="flex items-center w-1/4">
        <FontAwesomeIcon
          icon={faCircle}
          style={{
            color: getStatusColor(data.status), // Apply color based on status
          }}
          className="text-[8px] mr-2"
        />
        <p
          style={{
            color: getStatusColor(data.status), // Apply color to text based on status
          }}
        >
          {getLocalizedStatus(data.status)}{" "}
          {/* Translate and localize status */}
        </p>
      </div>
      <Popover
        overlayInnerStyle={{ backgroundColor: "#F5F9FF", borderRadius: 16 }}
        style={{ boxShadow: "6px 4px 4px rgba(0, 0, 0, 0.12)" }}
        placement="bottomRight"
        content={
          <div className="flex flex-col text-right p-1">
            <p
              className="cursor-pointer text-[#404040]"
              onClick={() => setOption("information", data.id)}
            >
              Chi tiết
            </p>
            <p
              className="border-b border-b-[#808080] pb-1 mb-1 mt-2 cursor-pointer text-[#404040]"
              onClick={() => setOption("edit", data.id)}
            >
              Chỉnh sửa
            </p>
            <p className="cursor-pointer text-[#404040]" onClick={showModal}>
              Xoá
            </p>
            <Modal
              centered
              open={isModalOpen}
              footer={false}
              closable={false}
              keyboard={false}
            >
              <div className="flex flex-col justify-center items-center p-7">
                <p className="text-2xl text-center mb-5 font-medium">
                  Bạn có chắc chắn muốn xoá tiến trình xử lý này không ?
                </p>
                <div className="flex justify-between w-full">
                  <Button
                    className="w-[45%] p-4"
                    size="middle"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Quay lại chỉnh sửa
                  </Button>
                  <Button
                    type="primary"
                    className="w-[45%] p-4"
                    size="middle"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Tiếp tục tìm kiếm
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </Popover>
    </div>
  );
};

const ProgressScreen: React.FC<ProgressScreenProps> = ({ dataList = [] }) => {
  const [option, setOption] = useState<string>("main");
  const [selectedData, setSelectedData] = useState<DataApiChange | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store the ID separately
  const [loading, setLoading] = useState(false); // Manage loading state locally

  const handleSetOption = async (option: string, id?: number) => {
    if (option === "information" && id) {
      console.log(selectedId);
      setLoading(true); // Start loading
      setSelectedId(id); // Store the ID for future use
      // Fetch the change details when the "information" option is clicked
      try {
        const response = await getDetailsChanges(id); // Fetch the change details from the API
        setSelectedData(response.data); // Set the selected data
        setOption("information"); // Set option to display InformationScreen
      } catch (error) {
        console.error("Failed to load change details", error);
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    } else {
      setOption(option);
    }
  };

  return (
    <>
      {option === "main" && (
        <div className="border-l-orange-300">
          <p className="mb-10 text-[#000000] font-bold text-3xl">
            Tiến trình xử lý
          </p>
          <div
            className="overflow-y-auto max-h-[700px] pr-2" // Add scroll for the list
          >
            {dataList.length > 0 ? (
              dataList.map((item, index) => (
                <WarpCard
                  key={index}
                  data={item}
                  setOption={(opt) => handleSetOption(opt, item.id)} // Use the `id` from the item here
                />
              ))
            ) : (
              <div>Chưa có tiến trình xử lý nào!</div>
            )}
          </div>
        </div>
      )}

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : null}

      {option === "information" && selectedData && !loading && (
        <InformationScreen data={selectedData} setOption={setOption} />
      )}

      {option === "edit" && selectedData && !loading && (
        <EditScreen data={selectedData} setOption={setOption} />
      )}
    </>
  );
};

export default ProgressScreen;
