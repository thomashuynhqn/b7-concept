import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { getDetailsChanges } from "../../../api/api";
import AdminInformationScreen from "./AdminInformationScreen";
import { AdminDataApi, DataApiChange } from "./typeDefinitions";

interface AdminProgressScreenProps {
  dataList: AdminDataApi[];
}

const EditorProgressScreen: React.FC<AdminProgressScreenProps> = ({
  dataList = [],
}) => {
  const [option, setOption] = useState<string>("main");
  const [selectedDataChange, setSelectedDataChange] =
    useState<DataApiChange | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSetOption = async (option: string, id: number) => {
    if (option === "Admininformation") {
      setLoading(true);
      try {
        const res = await getDetailsChanges(id);
        setSelectedDataChange(res.data);
        setSelectedId(id);
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
        return "#000000"; // Orange
      case "approved":
        return "#28a745"; // Green
      case "rejected":
        return "#FA425A"; // Red
      default:
        return "#000000"; // Default
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Được duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <>
      {option === "main" && (
        <div className="w-full h-full flex flex-col">
          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold text-black">Yêu cầu xử lý</h1>

          {/* Table Container with Scrolling */}
          <div className="w-full bg-white rounded-lg shadow-md p-4 overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full border-collapse">
                {/* Table Head (Fixed Position) */}
                <thead className="sticky top-0 bg-gray-100 shadow-md">
                  <tr className="text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Câu hỏi
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Người gửi
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {dataList.length > 0 ? (
                    dataList.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition duration-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          handleSetOption("Admininformation", item.id)
                        }
                      >
                        <td className="py-3 px-4 text-black text-sm">
                          {item.question}
                        </td>
                        <td className="py-3 px-4 text-black text-sm">
                          {item.submitted_by_username}
                        </td>
                        <td className="py-3 px-4 flex items-center space-x-2">
                          <FontAwesomeIcon
                            icon={faCircle}
                            className="text-xs"
                            style={{ color: getStatusColor(item.status) }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: getStatusColor(item.status) }}
                          >
                            {translateStatus(item.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(item.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        Chưa có yêu cầu xử lý nào!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admin Information Screen */}
      {option === "Admininformation" && selectedDataChange && selectedId && (
        <AdminInformationScreen
          data={selectedDataChange}
          setOption={setOption}
          id={selectedId}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="pt-4 text-center text-sm text-gray-500">
          Đang lấy thông tin thay đổi...
        </div>
      )}
    </>
  );
};

export default EditorProgressScreen;
