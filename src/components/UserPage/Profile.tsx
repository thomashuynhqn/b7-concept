/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {
  faChartLine,
  faCircleMinus,
  faFlag,
  faFolderOpen,
  faShieldCat,
  faSpinner,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearLoading, openLoading } from "../../redux/slices/loadingSlice";
import {
  getAllUsers,
  getListPendingAdmin,
  getListPendingEditor,
  getListStatusUser,
  getSaveQuestions,
  getTopic,
} from "../../api/api";
import DashboardScreen from "./Subcomponents/AdminProfile/AdminDashboard";
import SystemScreen from "./Subcomponents/AdminProfile/SystemSettings";
import UsersScreen from "./Subcomponents/AdminProfile/UserGroups";
import WarehouseScreen from "./Subcomponents/AdminProfile/WarehouseOverview";
import EditorProgressScreen from "./Subcomponents/EditorProgressTracker";
import ProgressScreen from "./Subcomponents/ProgressViewer";
import QuestionScreen from "./Subcomponents/QuestionViewer";
import UserScreen from "./Subcomponents/UserOverviewScreen";

interface SaveQuestionData {
  saved_questions: {
    id: number;
    question: string;
    answer: string;
    keywords: string[];
    like_count: number;
    topic: number;
    images: string;
    videos: string;
  }[];
}

const normalType = { fontWeight: "normal", color: "black" };
const boldType = { fontWeight: "bold", color: "black" };
const normalIcon = { color: "#1C1E26" };
const selectIcon = { color: "#227EFF" };

const User: React.FC = () => {
  const tier = localStorage.getItem("tier") || "reader";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabs, setTabs] = useState("user");
  const [progressData, setProgressData] = useState([]);
  const [savedData, setSavedData] = useState<SaveQuestionData | null>(null);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [isProgressDataFetched, setIsProgressDataFetched] = useState(false);
  const [isSavedDataFetched, setIsSavedDataFetched] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const allowedTabs: Record<string, string[]> = {
    admin: [
      "dashboard",
      "user",
      "question",
      "progress",
      "editorprogress",
      "usergroup",
      "warehouse",
      "system",
    ],
    editor: ["user", "question", "editorprogress"],
    writer: ["user", "question", "progress"],
    reader: ["user", "question"],
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTabs = allowedTabs[tier] || [];
    setTabs(tab && validTabs.includes(tab) ? tab : "user");
  }, [location.search, tier]);

  const showModal = () => setIsModalOpen(true);

  const fetchData = (
    fetchFunction: () => Promise<any>,
    setData: React.Dispatch<any>,
    dataFetchedFlag?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dispatch(openLoading());
    fetchFunction()
      .then((res) => {
        setData(res.data);
        dataFetchedFlag && dataFetchedFlag(true);
      })
      .catch(console.error)
      .finally(() => dispatch(clearLoading()));
  };

  useEffect(() => {
    const fetchProgressData = () => {
      let apiCall: (() => Promise<any>) | null = null;

      switch (tier) {
        case "admin":
          apiCall = getListPendingAdmin;
          break;
        case "editor":
          apiCall = getListPendingEditor;
          break;
        case "writer":
        case "reader":
          const userId = localStorage.getItem("user_id");
          if (userId) {
            const numericUserId = Number(userId);
            if (!isNaN(numericUserId)) {
              apiCall = () => getListStatusUser(numericUserId);
            }
          }
          break;
      }

      if (apiCall) {
        fetchData(apiCall, setProgressData, setIsProgressDataFetched);
      }
    };

    if (
      (tabs === "progress" || tabs === "editorprogress") &&
      !isProgressDataFetched
    ) {
      fetchProgressData();
    }

    if (tabs === "warehouse") fetchData(getTopic, setTopics);
    if (tabs === "usergroup") fetchData(getAllUsers, setUsers);
    if (tabs === "question" && !isSavedDataFetched) {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        fetchData(
          () => getSaveQuestions(userId),
          setSavedData,
          setIsSavedDataFetched
        );
      }
    }
  }, [dispatch, isProgressDataFetched, isSavedDataFetched, tabs, tier]);

  const handleLogout = () => {
    ["full_name", "user_id", "tier", "email", "username", "sessionid"].forEach(
      (item) => localStorage.removeItem(item)
    );
    navigate("/login");
  };

  const handleNavigateWithQuery = (tab: string) => {
    navigate(`/user?tab=${tab}`);
    setTabs(tab);
  };

  const RenderTabContent = () => {
    switch (tabs) {
      case "user":
        return <UserScreen />;
      case "question":
        return savedData ? (
          <QuestionScreen data={savedData} />
        ) : (
          <div>Loading...</div>
        );
      case "progress":
        return <ProgressScreen dataList={progressData} />;
      case "editorprogress":
        return <EditorProgressScreen dataList={progressData} />;
      case "dashboard":
        return <DashboardScreen />;
      case "usergroup":
        return <UsersScreen data={users} />;
      case "warehouse":
        return <WarehouseScreen data={topics} />;
      case "system":
        return <SystemScreen />;
      default:
        return <div>Tab Not Found</div>;
    }
  };

  const RenderSidebar = () => {
    const tabsForTier = allowedTabs[tier] || [];
    return tabsForTier.map((tab) => (
      <a
        key={tab}
        className="flex flex-row items-center mb-7 cursor-pointer"
        onClick={() => handleNavigateWithQuery(tab)}
      >
        <FontAwesomeIcon
          icon={
            tab === "dashboard"
              ? faChartLine
              : tab === "usergroup"
              ? faUserGroup
              : tab === "warehouse"
              ? faFolderOpen
              : tab === "system"
              ? faShieldCat
              : tab === "editorprogress" || tab === "progress"
              ? faSpinner
              : tab === "question"
              ? faFlag
              : faUser
          }
          className="text-black mr-2"
          style={tabs === tab ? selectIcon : normalIcon}
        />
        <p className="text-black" style={tabs === tab ? boldType : normalType}>
          {tab === "user"
            ? "Thông tin tài khoản"
            : tab === "question"
            ? "Câu trả lời được lưu"
            : tab === "progress"
            ? "Tiến trình xử lý"
            : tab === "editorprogress"
            ? "Yêu cầu xử lý"
            : tab === "dashboard"
            ? "Thống kê"
            : tab === "usergroup"
            ? "Người dùng"
            : tab === "warehouse"
            ? "Kho dữ liệu"
            : "Hệ thống"}
        </p>
      </a>
    ));
  };

  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="h-full w-[15%] flex flex-col pt-12 pl-8 bg-[#F5F9FF] justify-between">
        <div>
          <p
            className="mb-12 text-3xl font-bold text-[#227EFF] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Logo
          </p>
          <div className="flex flex-col">
            <RenderSidebar />
          </div>
        </div>
        <a href="#" className="flex flex-row items-center mb-12">
          <FontAwesomeIcon
            icon={faCircleMinus}
            className="text-black mr-2"
            onClick={showModal}
          />
          <p className="text-black" onClick={showModal}>
            Đăng xuất
          </p>
          <Modal
            centered
            open={isModalOpen}
            footer={false}
            closable={false}
            keyboard={false}
          >
            <div className="flex flex-col justify-center items-center p-5 font-light">
              <p className="text-2xl my-5 text-center">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?
              </p>
              <div className="flex flex-row">
                <Button
                  size="middle"
                  className="p-4 text-base mr-4 cursor-pointer"
                  onClick={handleLogout}
                >
                  Có
                </Button>
                <Button
                  size="middle"
                  className="p-4 text-base cursor-pointer"
                  style={{ backgroundColor: "black", color: "white" }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Không
                </Button>
              </div>
            </div>
          </Modal>
        </a>
      </div>
      <div className="h-full w-[85%] flex flex-col items-center bg-[#F5F9FF]">
        <div className="h-full pt-12 w-[95%]">
          <RenderTabContent />
        </div>
      </div>
    </div>
  );
};

export default User;
