import React from "react";
import { Form, Input, Button } from "antd";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postLogin } from "../../../api/api";
import { clearLoading, openLoading } from "../../../redux/slices/loadingSlice";
import { showMessage } from "../../../redux/slices/messageSlice";

type LoginScreenProps = {
  switchScreen: (screen: "login" | "register" | "forgot") => void;
};

type FieldType = {
  username?: string;
  password?: string;
};

interface LoginData {
  username: string;
  full_name: string;
  email: string;
  tier: string;
  user_id: string;
  sessionId: string; // Correct casing for sessionId
}

const LoginScreen: React.FC<LoginScreenProps> = ({ switchScreen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values: FieldType) => {
    dispatch(openLoading());
    postLogin(values)
      .then((res: AxiosResponse<LoginData>) => {
        const { sessionId, full_name, user_id, tier, email, username } =
          res.data;

        // Store session and user info in localStorage
        localStorage.setItem("sessionId", sessionId); // Correctly store sessionId
        localStorage.setItem("full_name", full_name);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("tier", tier);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);

        // Show success message
        dispatch(
          showMessage({
            type: "success",
            content: "Đăng nhập thành công!",
          })
        );

        // Redirect to the home page
        navigate("/");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        // Show error message
        dispatch(
          showMessage({
            type: "error",
            content: "Đăng nhập không thành công!",
          })
        );
      })
      .finally(() => {
        dispatch(clearLoading());
      });
  };

  const validateUsername = (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|84)(\d{9}|\d{9})$/;

    if (!value) {
      return Promise.reject("Vui lòng nhập Email!");
    }
    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Vui lòng nhập đúng định dạng Email!");
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      className="flex flex-col items-center fade-in-container"
      style={{ maxWidth: "360px", margin: "0 auto" }} // Centered and responsive
    >
      {/* Title */}
      <h1 className="text-2xl font-bold mb-5 text-center text-[#1C1E26] fade-in-item">
        Đăng Nhập
      </h1>

      {/* Email Input */}
      <Form.Item
        name="username"
        label={
          <span className="text-sm font-medium text-gray-600 fade-in-item">
            Email
          </span>
        }
        rules={[{ required: true, validator: validateUsername }]}
        className="w-full fade-in-item"
      >
        <Input
          placeholder="Nhập email của bạn..."
          className="h-10 px-4 rounded-md"
        />
      </Form.Item>

      {/* Password Input */}
      <Form.Item
        name="password"
        label={
          <span className="text-sm font-medium text-gray-600 fade-in-item">
            Mật khẩu
          </span>
        }
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        className="w-full fade-in-item"
      >
        <Input.Password
          placeholder="Nhập mật khẩu của bạn..."
          className="h-10 px-4 rounded-md"
        />
      </Form.Item>

      {/* Forgot Password Link */}
      <div className="flex justify-end w-full mb-3 fade-in-item">
        <a
          className="text-[#227EFF] text-sm cursor-pointer hover:underline"
          onClick={() => switchScreen("forgot")}
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Login Button */}
      <div className="flex justify-center mt-4 fade-in-item">
        <Button
          type="primary"
          htmlType="submit"
          className="px-8 h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] font-medium text-sm"
        >
          Đăng nhập
        </Button>
      </div>

      {/* Register Link */}
      <div className="mt-4 text-center text-sm text-gray-500 fade-in-item">
        <p>
          Bạn chưa có tài khoản?{" "}
          <a
            className="text-[#227EFF] cursor-pointer hover:underline"
            onClick={() => switchScreen("register")}
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </Form>
  );
};

export default LoginScreen;
