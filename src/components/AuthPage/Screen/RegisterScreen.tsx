import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { postSignUp } from "../../../api/api";
import { clearLoading, openLoading } from "../../../redux/slices/loadingSlice";
import { showMessage } from "../../../redux/slices/messageSlice";

type RegisterScreenProps = {
  switchScreen: (screen: "login" | "register" | "forgot") => void;
};

type FieldType = {
  full_name?: string;
  username?: string;
  email?: string;
  password?: string;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ switchScreen }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);

  const handleSubmit = (values: FieldType) => {
    values.username = values.email; // Use email as username
    dispatch(openLoading());
    postSignUp(values)
      .then(() => {
        dispatch(clearLoading());
        dispatch(
          showMessage({
            type: "success",
            content: "Đăng ký thành công!",
          })
        );
        setStep(2); // Proceed to the success step
      })
      .catch(() => {
        dispatch(clearLoading());
        dispatch(
          showMessage({
            type: "error",
            content: "Đăng ký không thành công!",
          })
        );
      });
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      className="flex flex-col items-center fade-in-container"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {/* Step 1: Registration Form */}
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold mb-5 text-center text-[#1C1E26] fade-in-item">
            Đăng Ký
          </h1>
          <Form.Item
            name="full_name"
            label={
              <span className="text-sm font-medium text-gray-600 fade-in-item">
                Họ và Tên
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập Họ và Tên!" }]}
            className="w-full fade-in-item"
          >
            <Input
              placeholder="Nhập họ và tên"
              className="h-10 px-4 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={
              <span className="text-sm font-medium text-gray-600 fade-in-item">
                Email
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
            className="w-full fade-in-item"
          >
            <Input
              placeholder="Nhập email của bạn..."
              className="h-10 px-4 rounded-md"
            />
          </Form.Item>
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
          <Form.Item
            name="confirm_password"
            label={
              <span className="text-sm font-medium text-gray-600 fade-in-item">
                Xác nhận mật khẩu
              </span>
            }
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
            className="w-full fade-in-item"
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu của bạn..."
              className="h-10 px-4 rounded-md"
            />
          </Form.Item>
          <div className="fade-in-item">
            <Button
              type="primary"
              htmlType="submit"
              className="px-8 h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] font-medium text-sm"
            >
              Đăng ký
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 fade-in-item">
            <p>
              Bạn đã có tài khoản?{" "}
              <a
                className="text-[#227EFF] cursor-pointer hover:underline"
                onClick={() => switchScreen("login")}
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </>
      )}

      {/* Step 2: Success Message */}
      {step === 2 && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-5 text-[#1C1E26]">Thành Công</h1>
          <p className="text-gray-600 mb-5">
            Đăng ký thành công! Bạn có thể đăng nhập để bắt đầu sử dụng.
          </p>
          <Button
            type="primary"
            className="px-8 h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] font-medium text-sm"
            onClick={() => switchScreen("login")}
          >
            Đăng nhập ngay
          </Button>
        </div>
      )}

      {/* CSS for fade-in effect */}
      <style>
        {`
          .fade-in-container {
            display: flex;
            flex-direction: column;
            opacity: 0;
            animation: fadeInContainer 0.3s ease-in forwards; /* Faster fade-in */
          }

          .fade-in-item {
            opacity: 0;
            transform: translateY(10px); /* Reduced vertical offset */
            animation: fadeInItem 0.5s ease-out forwards; /* Faster and smoother */
          }

          .fade-in-item:nth-child(1) {
            animation-delay: 0.05s;
          }

          .fade-in-item:nth-child(2) {
            animation-delay: 0.15s;
          }

          .fade-in-item:nth-child(3) {
            animation-delay: 0.25s;
          }

          .fade-in-item:nth-child(4) {
            animation-delay: 0.35s;
          }

          .fade-in-item:nth-child(5) {
            animation-delay: 0.45s;
          }

          @keyframes fadeInContainer {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInItem {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Form>
  );
};

export default RegisterScreen;
