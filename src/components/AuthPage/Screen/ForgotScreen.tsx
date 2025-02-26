import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import {
  postToGetOtp,
  postToVerifyOtp,
  postToResetPassword,
} from "../../../api/api";
import { clearLoading, openLoading } from "../../../redux/slices/loadingSlice";
import { showMessage } from "../../../redux/slices/messageSlice";

type ForgotScreenProps = {
  switchScreen: (screen: "login" | "register" | "forgot") => void;
};

type FieldType = {
  email?: string;
  otp?: number;
  password?: string;
  confirm_password?: string;
};

const ForgotScreen: React.FC<ForgotScreenProps> = ({ switchScreen }) => {
  const [currentStep, setCurrentStep] = useState(1); // Step tracker
  const [fadeInClass, setFadeInClass] = useState("fade-in-container");
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [otp, setOtp] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();

  const handleSubmit = (values: FieldType) => {
    if (currentStep === 1) {
      dispatch(openLoading());
      postToGetOtp({ email: values.email })
        .then(() => {
          setEmail(values.email);
          setCurrentStep(2); // Move to OTP verification step
          setFadeInClass("fade-in-container"); // Trigger animation
          dispatch(clearLoading());
        })
        .catch(() => {
          dispatch(
            showMessage({ type: "error", content: "Email không tồn tại!" })
          );
          dispatch(clearLoading());
        });
    } else if (currentStep === 2) {
      dispatch(openLoading());
      postToVerifyOtp({ email, otp: values.otp })
        .then(() => {
          setOtp(values.otp);
          setCurrentStep(3); // Move to password reset step
          setFadeInClass("fade-in-container"); // Trigger animation
          dispatch(clearLoading());
        })
        .catch(() => {
          dispatch(
            showMessage({ type: "error", content: "Mã OTP không hợp lệ!" })
          );
          dispatch(clearLoading());
        });
    } else if (currentStep === 3) {
      dispatch(openLoading());
      postToResetPassword({
        email,
        otp,
        new_password: values.password,
      })
        .then(() => {
          setCurrentStep(4); // Move to success step
          setFadeInClass("fade-in-container"); // Trigger animation
          dispatch(clearLoading());
        })
        .catch(() => {
          dispatch(
            showMessage({
              type: "error",
              content: "Cập nhật mật khẩu thất bại!",
            })
          );
          dispatch(clearLoading());
        });
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      switchScreen("login");
    } else {
      setCurrentStep(currentStep - 1);
      setFadeInClass("fade-in-container"); // Trigger animation
    }
  };

  return (
    <Form
      onFinish={handleSubmit}
      layout="vertical"
      className={`flex flex-col items-center ${fadeInClass}`}
      style={{ maxWidth: "420px", margin: "0 auto" }}
    >
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center text-[#1C1E26] fade-in-item">
        {currentStep === 1
          ? "Quên Mật Khẩu"
          : currentStep === 2
          ? "Xác Nhận Mã OTP"
          : currentStep === 3
          ? "Đặt Lại Mật Khẩu"
          : "Mật Khẩu Đã Được Cập Nhật"}
      </h1>

      {/* Step 1: Email Input */}
      {currentStep === 1 && (
        <>
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
              className="h-10 px-4 rounded-md w-full"
            />
          </Form.Item>
          <div className="flex w-full mt-4 gap-5">
            <Button
              onClick={handleBack}
              className="h-10 rounded-md border border-gray-400 text-gray-600 w-[30%] fade-in-item"
            >
              Quay lại
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] w-[70%] fade-in-item"
            >
              Lấy mã xác thực
            </Button>
          </div>
        </>
      )}

      {/* Step 2: OTP Verification */}
      {currentStep === 2 && (
        <>
          <Form.Item
            name="otp"
            label={
              <span className="text-sm font-medium text-gray-600 fade-in-item">
                Mã OTP
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            className="w-full fade-in-item"
          >
            <Input
              placeholder="Nhập mã OTP"
              className="h-10 px-4 rounded-md w-full"
            />
          </Form.Item>
          <div className="flex w-full mt-4 gap-5">
            <Button
              onClick={handleBack}
              className="h-10 rounded-md border border-gray-400 text-gray-600 w-[30%] fade-in-item"
            >
              Quay lại
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] w-[70%] fade-in-item"
            >
              Xác nhận OTP
            </Button>
          </div>
        </>
      )}

      {/* Step 3: Password Reset */}
      {currentStep === 3 && (
        <>
          <Form.Item
            name="password"
            label={
              <span className="text-sm font-medium text-gray-600 fade-in-item">
                Mật khẩu mới
              </span>
            }
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
            className="w-full fade-in-item"
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới..."
              className="h-10 px-4 rounded-md w-full"
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
              placeholder="Xác nhận mật khẩu..."
              className="h-10 px-4 rounded-md w-full"
            />
          </Form.Item>
          <div className="flex w-full mt-4 gap-5">
            <Button
              onClick={handleBack}
              className="h-10 rounded-md border border-gray-400 text-gray-600 w-[30%] fade-in-item"
            >
              Quay lại
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              className="h-10 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] w-[70%] fade-in-item"
            >
              Cập nhật mật khẩu
            </Button>
          </div>
        </>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <div className="text-center fade-in-item">
          <p className="text-green-500 text-xl font-bold mb-4">
            Mật khẩu đã được cập nhật!
          </p>
          <Button
            type="primary"
            className="h-10 px-6 rounded-md bg-[#227EFF] hover:bg-[#1a65d6] font-medium w-[70%]"
            onClick={() => switchScreen("login")}
          >
            Đăng nhập
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

export default ForgotScreen;
