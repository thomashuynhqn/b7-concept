import { ConfigProvider, message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Answer,
  Edit,
  ErrorScreen,
  Results,
  Search,
  Loading,
  AddTopic,
  EditTopic,
  TopicManage,
  User,
} from "./components/index";
import AuthModule from "./components/AuthPage/AuthModule"; // AuthModule handles Login, Register, ForgotPassword
import UserDashboard from "./components/Navigator"; // UserDashboard acts as the header layout
import { RootState } from "./redux/store";

export interface Data {
  id: number;
  title: string;
  content: string;
  link: string;
}

function App() {
  const isLoading = useSelector((state: RootState) => state.loading.status);
  const messageData = useSelector((state: RootState) => state.message);
  const [messageApi, contextHolder] = message.useMessage();

  type NoticeType = "success" | "info" | "warning" | "error";

  useEffect(() => {
    if (messageData.content) {
      messageApi.open({
        type: (messageData.type as NoticeType) ?? "warning",
        content: messageData.content,
        duration: 3,
      });
    }
  }, [messageData, messageApi]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#227EFF",
          fontFamily: "Inter",
        },
      }}
    >
      {contextHolder}
      {isLoading && <Loading />}
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<AuthModule screen="login" />} />
          <Route path="/register" element={<AuthModule screen="register" />} />
          <Route path="/forgot" element={<AuthModule screen="forgot" />} />

          {/* Routes with UserDashboard as the Header */}
          <Route
            path="/"
            element={
              <UserDashboard>
                <Search />
              </UserDashboard>
            }
          />
          <Route
            path="/results"
            element={
              <UserDashboard>
                <Results />
              </UserDashboard>
            }
          />
          <Route
            path="/results/answer"
            element={
              <UserDashboard>
                <Answer />
              </UserDashboard>
            }
          />
          <Route
            path="/results/answer/edit"
            element={
              <UserDashboard>
                <Edit />
              </UserDashboard>
            }
          />
          <Route
            path="/topic"
            element={
              <UserDashboard>
                <TopicManage />
              </UserDashboard>
            }
          />
          <Route
            path="/topic/addtopic"
            element={
              <UserDashboard>
                <AddTopic />
              </UserDashboard>
            }
          />
          <Route
            path="/topic/edittopic"
            element={
              <UserDashboard>
                <EditTopic />
              </UserDashboard>
            }
          />
          <Route path="/user" element={<User />} />

          {/* Fallback for Undefined Routes */}
          <Route path="*" element={<ErrorScreen />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
