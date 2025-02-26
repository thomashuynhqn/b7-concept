import { Button, Form, FormProps, Input, Modal, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { postChangePassword, postEditUser } from "../../../api/api";

type FieldType = {
  fullname?: string;
  username?: string;
  password?: string;
  phonenumber?: string;
  email?: string;
};

type FieldTypeChangePassword = {
  oldPassword?: string;
  newPassword?: string;
  reNewPassword?: string;
};

const UserScreen = () => {
  const [changePassword, setChangePassword] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const username = localStorage.getItem("username");
  const fullName = localStorage.getItem("full_name");
  //   const user_id = localStorage.getItem("user_id");
  const tier = localStorage.getItem("tier");
  const email = localStorage.getItem("email");

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      fullname: fullName,
      username: username,
      email: email,
    });
  }, [form, fullName, username, email]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    postEditUser(values.username ?? "", values.fullname ?? "")
      .then((res) => {
        console.log(res);
        showModal();
        localStorage.setItem("full_name", values.fullname ?? "");
        localStorage.setItem("username", values.username ?? "");
      })
      .catch((err) => console.log(err));
  };

  const onFinishChangePassword: FormProps<FieldTypeChangePassword>["onFinish"] =
    (values) => {
      console.log("Success:", values);
      if (values.newPassword === values.reNewPassword) {
        postChangePassword(
          username ?? "",
          values.oldPassword ?? "",
          values.newPassword ?? ""
        )
          .then((res) => {
            console.log(res);
            showModal();
          })
          .catch((err) => console.log(err));
      } else {
        console.log("Password not match");
      }
    };

  return (
    <div>
      <p className="mb-12 text-[#000000] font-bold text-3xl">
        Thông tin tài khoản
      </p>

      <div className="flex">
        {/* Avata */}
        <div className="flex flex-col mr-10 w-1/5 items-center">
          <Upload
            action="/upload.do"
            listType="picture-circle"
            className="mb-5"
            disabled
          >
            <div>
              {/* <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button> */}
              <UserOutlined className="text-4xl" />
            </div>
          </Upload>
          <b>{fullName}</b>
          <p>
            {tier === "writer"
              ? "Người viết"
              : tier === "reader"
              ? "Người đọc"
              : tier === "editor"
              ? "Người kiểm duyệt"
              : tier === "admin"
              ? "Admin"
              : "Vai trò không xác định"}
          </p>
        </div>
        <Modal
          centered
          open={isModalOpen}
          footer={false}
          closable={false}
          keyboard={false}
          width="auto"
        >
          <div className="flex flex-col justify-center items-center p-5 font-light">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-5xl text-[#227EFF]"
            />
            <p className="text-2xl my-5">Cập nhật thành công !</p>
            <Button
              type="primary"
              size="middle"
              className="p-4 text-base"
              onClick={() => setIsModalOpen(false)}
            >
              Tiếp tục
            </Button>
          </div>
        </Modal>
        {/* Infor user */}
        {changePassword === false ? (
          <div>
            <Form
              layout="vertical"
              name="profile"
              autoComplete="off"
              onFinish={onFinish}
            >
              <div className="flex">
                <Form.Item<FieldType>
                  name="fullname"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                  className="mr-4"
                  initialValue={fullName || ""}
                  label={<p className="font-bold">Họ và Tên</p>}
                >
                  <Input className="mt-3 p-4" />
                </Form.Item>
                <Form.Item<FieldType>
                  rules={[
                    { required: true, message: "Please input your nickname!" },
                  ]}
                  initialValue={username || ""}
                  name="username"
                  label={<p className="font-bold">Biệt danh</p>}
                >
                  <Input className="mt-3 p-4" />
                </Form.Item>
              </div>
              <Form.Item<FieldType>
                initialValue={email || ""}
                name="email"
                label={<p className="font-bold">Email</p>}
              >
                <Input disabled className="mt-3 p-4" />
              </Form.Item>
              <Form.Item<FieldType>
                name="password"
                label={<p className="font-bold">Mật khẩu</p>}
              >
                <Input
                  defaultValue={"**********"}
                  value={"**********"}
                  disabled
                  name="password"
                  className="mt-3 p-4 "
                />
              </Form.Item>
              <div className="flex justify-between">
                <p
                  className="text-[#227EFF] cursor-pointer underline"
                  onClick={() => setChangePassword(true)}
                >
                  Đổi mật khẩu
                </p>
              </div>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  htmlType="submit"
                  className="float-right mt-5"
                  style={{ color: "#227EFF", borderColor: "#227EFF" }}
                  size="middle"
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div>
            <Form
              layout="vertical"
              name="changePassword"
              autoComplete="off"
              onFinish={onFinishChangePassword}
            >
              <div className="flex">
                <Form.Item
                  name="fullname"
                  initialValue={fullName}
                  className="mr-4"
                  label={<p className="font-bold">Họ và Tên</p>}
                >
                  <Input disabled className="mt-3 p-4" />
                </Form.Item>

                <Form.Item
                  name={"username"}
                  initialValue={username}
                  label={<p className="font-bold">Biệt danh</p>}
                >
                  <Input disabled className="mt-3 p-4" />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                className="border-b border-b-[#808080] pb-10 mb-12"
                label={<p className="font-bold">Email</p>}
              >
                <Input disabled className="mt-3 p-4" />
              </Form.Item>
              <Form.Item<FieldTypeChangePassword>
                name="oldPassword"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
                label={<p className="font-bold">Mật khẩu cũ</p>}
              >
                <Input.Password className="mt-3 p-4 " />
              </Form.Item>
              <Form.Item<FieldTypeChangePassword>
                name="newPassword"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
                label={<p className="font-bold">Mật khẩu mới</p>}
              >
                <Input.Password className="mt-3 p-4 " />
              </Form.Item>
              <Form.Item<FieldTypeChangePassword>
                name="reNewPassword"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
                label={<p className="font-bold">Xác nhận mật khẩu mới</p>}
              >
                <Input.Password className="mt-3 p-4 " />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  className="float-right mt-5 ml-5"
                  style={{ backgroundColor: "black", color: "white" }}
                  size="middle"
                  htmlType="submit"
                >
                  Lưu chỉnh sửa
                </Button>
                <Button
                  className="float-right mt-5"
                  size="middle"
                  onClick={() => setChangePassword(false)}
                >
                  Huỷ chỉnh sửa
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserScreen;
