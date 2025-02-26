import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "antd";
import React, { useState } from "react";
import { getDetailsChanges } from "../../../api/api"; // Import the second API call
import AdminInformationScreen from "./AdminInformationScreen";
import { AdminDataApi, DataApiChange } from "./typeDefinitions";

interface AdminProgressScreenProps {
  dataList: AdminDataApi[]; // List of data items
}

const EditorProgressScreen: React.FC<AdminProgressScreenProps> = ({
  dataList = [],
}) => {
  const [option, setOption] = useState<string>("main");
  const [selectedDataChange, setSelectedDataChange] =
    useState<DataApiChange | null>(null); // Fixed type to match API response
  const [selectedId, setSelectedId] = useState<number | null>(null); // State to store the selected ID
  const [loading, setLoading] = useState(false);

  const handleSetOption = async (
    option: string,
    id: number,
    event: React.MouseEvent
  ) => {
    // Prevent if the click is inside the user picture div or on the image itself
    if (
      (event.target as HTMLElement).closest(".user-picture-container") ||
      (event.target as HTMLElement).tagName === "IMG"
    ) {
      return;
    }

    if (option === "Admininformation") {
      setLoading(true);
      try {
        const res = await getDetailsChanges(id); // Call API to fetch the change details
        console.log("Selected ID:", id);
        setSelectedDataChange(res.data); // Ensure the API response matches the DataApiChange type
        setSelectedId(id); // Store the selected ID
        setLoading(false);
        setOption(option);
      } catch (err) {
        setLoading(false);
        console.error("Failed to load change details", err);
      }
    } else {
      setOption(option);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FF7600"; // Orange for Pending
      case "approved":
        return "#28a745"; // Green for Approved
      case "rejected":
        return "#FA425A"; // Red for Rejected
      default:
        return "#000000"; // Default to black if status is unknown
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Được duyệt";
      case "rejected":
        return "Từ chối duyệt";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {option === "main" && (
        <div>
          <p className="mb-10 text-[#000000] font-bold text-3xl">
            Yêu cầu xử lý
          </p>
          <div className="max-h-[700px] overflow-y-auto pr-2">
            {dataList.length > 0 ? (
              dataList.map((item) => (
                <div
                  key={item.id}
                  className="w-full h-full flex justify-between items-center border-b border-b-[#BFBFBF] py-3 cursor-pointer"
                  onClick={(e) =>
                    handleSetOption("Admininformation", item.id, e)
                  }
                >
                  <p className="text-black text-base w-1/3">{item.question}</p>
                  <div className="user-picture-container flex items-center w-1/5 border border-[#227EFF] rounded-full p-1.5">
                    <Image
                      src={`https://api.url/avatars/${item.submitted_by_userid}`}
                      width={"12%"}
                      height={"12%"}
                      className="rounded-full"
                    />
                    <div className="relative ml-5 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      <span
                        className="cursor-pointer"
                        title={item.submitted_by_username}
                      >
                        {item.submitted_by_username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center w-1/5">
                    <FontAwesomeIcon
                      icon={faCircle}
                      style={{
                        color: getStatusColor(item.status),
                      }}
                      className="text-[8px] mr-2"
                    />
                    <p style={{ color: getStatusColor(item.status) }}>
                      {translateStatus(item.status)}
                    </p>
                  </div>
                  <p className="font-medium">{formatDate(item.created_at)}</p>
                </div>
              ))
            ) : (
              <div>Chưa có yêu cầu xử lý nào!</div>
            )}
          </div>
        </div>
      )}

      {option === "Admininformation" && selectedDataChange && selectedId && (
        <>
          {console.log("Passing ID to AdminInformationScreen:", selectedId)}
          <AdminInformationScreen
            data={selectedDataChange}
            setOption={setOption}
            id={selectedId} // Pass the ID directly from the state
          />
        </>
      )}

      {loading && <div className="pt-2">Đang lấy thông tin thay đổi...</div>}
    </>
  );
};

export default EditorProgressScreen;
