import {
  faCircle,
  faEllipsis,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Image, Input, Popover } from "antd";
import React, { useState } from "react";
import InformationUserScreen from "./components/UserInformation";

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

interface WarpCardProps {
  data: Data;
  onClick: () => void;
  onDelete: () => void;
}

interface DataApi {
  data: Data[];
}

const WarpCard: React.FC<WarpCardProps> = ({ data, onClick, onDelete }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <div className="w-full h-auto flex flex-row justify-between items-center border-b pb-3 mb-3">
      <Image src={""} width={"5%"} height={"5%"} className="rounded-full" />
      <p className="w-1/5 ml-[-40px]">{data.full_name}</p>
      <p className="w-1/5">{data.email}</p>
      <p className="w-1/5">{""}</p>
      <p className="w-1/6 text-[#404040] font-bold">
        <FontAwesomeIcon icon={faCircle} className="text-sm mr-2" />
        {data.tier_display}
      </p>
      <Popover
        overlayInnerStyle={{ backgroundColor: "#F5F9FF", borderRadius: 16 }}
        style={{ boxShadow: "6px 4px 4px rgba(0, 0, 0, 0.12)" }}
        placement="bottomRight"
        content={
          <div className="flex flex-col text-right p-1">
            <p
              className="border-b border-b-[#808080] pb-1 mb-1 mt-2 cursor-pointer text-[#404040]"
              onClick={onClick}
            >
              Thông tin
            </p>
            <p className="cursor-pointer text-[#404040]" onClick={onDelete}>
              Xoá
            </p>
          </div>
        }
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </Popover>
    </div>
  );
};

const UserGroupScreen: React.FC<DataApi> = ({ data }) => {
  const [watchInfor, setWatchInfor] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Data | null>(null);
  const [users, setUsers] = useState<Data[]>(data); // State to manage the user list
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search term

  const handleOpenInforUser = (id: string) => {
    const userData = users.find((user) => user.id === id.toString());
    if (userData) {
      setSelectedUser(userData);
      setWatchInfor(true);
    }
  };

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id.toString());
    setUsers(updatedUsers);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {watchInfor === false ? (
        <div className="h-full flex flex-col mt-[-15px]">
          <div className="flex justify-between items-center mb-7">
            <p className="text-[#000000] font-bold text-3xl">Người dùng</p>
            <Input
              className="w-1/3 p-5 flex flex-row-reverse"
              size="large"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={
                <>
                  <FontAwesomeIcon
                    icon={faX}
                    className="border-r border-slate-800 pr-5"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="pr-2 pl-3 text-[#227EFF]"
                  />
                </>
              }
            />
          </div>
          <div className="w-full h-5/6 bg-white rounded-xl p-7">
            {filteredUsers.map((item) => (
              <WarpCard
                key={item.id}
                data={item}
                onClick={() => handleOpenInforUser(item.id)}
                onDelete={() => handleDeleteUser(item.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-7">
            <p className="text-[#000000] font-bold text-3xl">Người dùng</p>
            <Button onClick={() => setWatchInfor(false)}>Quay lại</Button>
          </div>
          <div className="w-full h-5/6 bg-white rounded-2xl p-7">
            <InformationUserScreen
              user={selectedUser}
              onUpdate={() => setWatchInfor(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserGroupScreen;
