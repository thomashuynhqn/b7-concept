import React, { useState } from "react";
import { Table, Input, Button, Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCircle } from "@fortawesome/free-solid-svg-icons";
import { updateUserInfo, postDeleteUser } from "../../../../api/api"; // Import PATCH & DELETE API functions

interface Data {
  id: string;
  full_name: string;
  username: string;
  email: string;
  tier: string;
  tier_display: string;
}

interface DataApi {
  data: Data[];
}

const UserGroupScreen: React.FC<DataApi> = ({ data }) => {
  const [users, setUsers] = useState<Data[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Data | null>(null);
  const [editFullName, setEditFullName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editTier, setEditTier] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: Data) => {
    setSelectedUser(user);
    setEditFullName(user.full_name);
    setEditEmail(user.email);
    setEditTier(user.tier);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await postDeleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserInfo(selectedUser.id, {
        full_name: editFullName,
        email: editEmail,
        tier: editTier,
      });

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                full_name: editFullName,
                email: editEmail,
                tier: editTier,
              }
            : user
        )
      );

      message.success("User updated successfully!");
      setIsEditModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Failed to update user.");
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Tier",
      dataIndex: "tier_display",
      key: "tier_display",
      render: (text: string) => (
        <span>
          <FontAwesomeIcon icon={faCircle} className="text-sm mr-2" />
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Data) => (
        <div className="flex space-x-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
          </Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            <FontAwesomeIcon icon={faTrash} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="p-6 flex flex-row justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Người dùng</h1>
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {/* Table container */}
      <div className="flex-grow w-full px-6">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "100%", y: "calc(100vh - 150px)" }}
        />
      </div>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onOk={handleUpdateUser}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tier
            </label>
            <Input
              value={editTier}
              onChange={(e) => setEditTier(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserGroupScreen;
