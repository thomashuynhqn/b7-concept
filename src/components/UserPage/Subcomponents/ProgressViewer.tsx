// @ts-ignore
import { faCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Spin } from "antd";
import React, { useState } from "react";
import { getDetailsChanges } from "../../../api/api";
import InformationScreen from "./InformationViewer";
import EditScreen from "./ProfileEditor";
import { DataApi, DataApiChange } from "./typeDefinitions";
// import { set } from "lodash";

interface ProgressScreenProps {
  dataList: DataApi[];
  handleSetOptionProcess: (option: string) => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({
  dataList = [],
  handleSetOptionProcess,
}) => {
  const [option, setOption] = useState<string>("main");
  const [selectedData, setSelectedData] = useState<DataApiChange | null>(null);
  const [loading, setLoading] = useState(false); // Keep track of API loading state

  const handleSetOption = async (option: string, id?: number) => {
    if (option === "information" && id) {
      setLoading(true);
      try {
        const response = await getDetailsChanges(id);
        setSelectedData(response.data);
        setOption("information");
      } catch (error) {
        console.error("Failed to load change details", error);
      } finally {
        setLoading(false);
      }
    } else {
      setOption(option);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#6B7280";
      case "approved":
        return "#28a745";
      case "rejected":
        return "#FA425A";
      default:
        return "#595959";
    }
  };

  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Được duyệt",
      rejected: "Từ chối",
    };
    return statusMap[status.toLowerCase()] || "Không xác định";
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
          <h1 className="mb-6 text-3xl font-bold text-black">
            Tiến trình xử lý
          </h1>

          {/* Table Container */}
          <div className="w-full bg-white rounded-lg shadow-md p-4 overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full border-collapse">
                {/* Table Head */}
                <thead className="sticky top-0 z-30 bg-gray-100 shadow-md">
                  <tr className="text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Câu hỏi
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Trạng thái
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {dataList.length > 0 ? (
                    [...dataList]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      ) // 🔹 Sort by latest date
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="border-b transition duration-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-black text-sm">
                            {item.question}
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
                          <td className="py-3 px-4 flex justify-center">
                            <Button
                              type="link"
                              onClick={() =>
                                handleSetOption("information", item.id)
                              }
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-blue-500"
                              />
                            </Button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 px-4 text-center text-gray-500"
                      >
                        Chưa có tiến trình xử lý nào!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      )}

      {/* Information Screen */}
      {option === "information" && selectedData && !loading && (
        <InformationScreen
          data={selectedData}
          setOption={(value) => {
            setOption(value);
          }}
        />
      )}

      {/* Edit Screen */}
      {option === "edit" && selectedData && !loading && (
        <EditScreen
          data={selectedData}
          setOption={(value) => {
            handleSetOptionProcess(value);
            setOption(value);
          }}
        />
      )}
    </>
  );
};

export default ProgressScreen;
