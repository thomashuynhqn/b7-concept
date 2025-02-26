import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Image, Input, Modal, Popover } from "antd";
import React from "react";

type FieldType = {
  username?: string;
  password?: string;
  nickname?: string;
  email?: string;
  telephone?: string;
  repassword?: string;
};

interface Data {
  id: string;
  full_name: string;
  username: string;
  email: string;
  tier: string;
  tier_display: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

interface InformationUserScreenProps {
  user: Data | null;
  onUpdate: () => void;
}

const InformationUserScreen: React.FC<InformationUserScreenProps> = ({
  user,
  onUpdate,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [userLevel, setUserLevel] = React.useState<string>(
    user?.tier_display || "Người xem"
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);

  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  const handleLevelChange = (newLevel: string) => {
    setUserLevel(newLevel);
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className="h-full flex">
      {/* User Avatar Section */}
      <div className="w-1/6 h-full flex flex-col items-center pr-5">
        <Image src={""} width="auto" className="rounded-full mb-3" />
        <p>{user.username}</p>
        {/* User Level Popover */}
        <Popover
          overlayInnerStyle={{ backgroundColor: "#F5F9FF", borderRadius: 16 }}
          style={{ boxShadow: "6px 4px 4px rgba(0, 0, 0, 0.12)" }}
          placement="bottomRight"
          content={
            <div className="flex flex-col pl-[25%]">
              <p
                className="mb-2 cursor-pointer"
                onClick={() => handleLevelChange("Người kiểm duyệt")}
              >
                Người kiểm duyệt
              </p>
              <p
                className="cursor-pointer"
                onClick={() => handleLevelChange("Người xem")}
              >
                Người xem
              </p>
            </div>
          }
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          overlayStyle={{ width: "12%" }}
        >
          <div className="flex justify-between w-full mt-1 border-b pb-1 px-3">
            <p>{userLevel}</p>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </Popover>
      </div>

      {/* User Information Form */}
      <div className="w-5/6 h-full">
        <Form
          form={form}
          name="basic"
          initialValues={{
            username: user.full_name,
            nickname: user.username,
            email: user.email,
            telephone: "",
          }}
          autoComplete="off"
          onFinish={showModal}
        >
          {/* Full Name and Nickname Fields */}
          <div className="flex w-full">
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              className="mr-4 w-1/2"
            >
              <b>Họ và Tên</b>
              <Input className="mt-3 p-4" defaultValue={user.full_name} />
            </Form.Item>
            <Form.Item<FieldType>
              className="w-1/2"
              name="nickname"
              rules={[
                { required: true, message: "Please input your nickname!" },
              ]}
            >
              <b>Biệt danh</b>
              <Input className="mt-3 p-4" defaultValue={user.username} />
            </Form.Item>
          </div>

          {/* Phone Number and Email Fields */}
          <Form.Item<FieldType>
            name="telephone"
            rules={[
              { required: true, message: "Please input your telephone!" },
            ]}
          >
            <b>Số điện thoại</b>
            <Input className="mt-3 p-4" />
          </Form.Item>
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <b>Email</b>
            <Input className="mt-3 p-4" defaultValue={user.email} />
          </Form.Item>

          {/* Password Fields */}
          <div className="w-full flex">
            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="w-1/2 mr-4"
            >
              <b>Mật khẩu mới</b>
              <Input.Password
                className="mt-3 p-4"
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
            <Form.Item<FieldType>
              name="repassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
              className="w-1/2"
            >
              <div className="flex">
                <b>Xác nhận mật khẩu</b>
                <p>(chỉ nhập khi muốn đổi mật khẩu mới)</p>
              </div>
              <Input.Password
                className="mt-3 p-4"
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>
          </div>

          {/* Update Button */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              htmlType="submit"
              className="float-right mt-5"
              style={{ color: "#227EFF", borderColor: "#227EFF" }}
              size="middle"
            >
              Cập nhật
            </Button>
            <Modal
              centered
              open={isModalOpen}
              footer={false}
              closable={false}
              keyboard={false}
              width="auto"
            >
              <div className="flex flex-col justify-center items-center py-5 px-10 font-light">
                <FontAwesomeIcon icon={faCheck} className="text-5xl" />
                <p className="text-2xl my-5">Cập nhật thành công !</p>
                <Button
                  style={{ backgroundColor: "black", color: "white" }}
                  type="text"
                  size="middle"
                  className="p-4 text-base"
                  onClick={() => {
                    setIsModalOpen(false);
                    onUpdate();
                  }}
                >
                  Tiếp tục
                </Button>
              </div>
            </Modal>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default InformationUserScreen;
