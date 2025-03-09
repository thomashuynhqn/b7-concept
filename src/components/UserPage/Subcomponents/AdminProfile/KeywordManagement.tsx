import React, { useEffect, useState } from "react";
import { Button, Input, Modal, message } from "antd";
import {
  getListKeywords,
  createKeyword,
  deleteKeyword,
} from "../../../../api/api";

interface Keyword {
  id: number;
  label: string;
}

const KeywordManagement: React.FC = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newKeyword, setNewKeyword] = useState<string>("");

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        // The API returns the array of keywords directly
        const res = await getListKeywords();
        const data: Keyword[] = res.data ? res.data : res;
        setKeywords(data);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      }
    };

    fetchKeywords();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteKeyword(id);
      setKeywords(keywords.filter((keyword) => keyword.id !== id));
      message.success("Keyword deleted successfully");
    } catch (error) {
      message.error("Failed to delete keyword");
      console.error(error);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!newKeyword.trim()) {
      message.error("Keyword label cannot be empty");
      return;
    }
    try {
      const res = await createKeyword(newKeyword);
      // Assume API returns the created keyword object
      const createdKeyword: Keyword = res.data ? res.data : res;
      setKeywords([...keywords, createdKeyword]);
      message.success("Keyword created successfully");
      setIsModalVisible(false);
      setNewKeyword("");
    } catch (error) {
      message.error("Failed to create keyword");
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNewKeyword("");
  };

  return (
    <div className="h-full flex flex-col mt-[-15px]">
      {/* Header with title, search input, and create button */}
      <div className="flex justify-between items-center mb-7">
        <p className="text-[#000000] font-bold text-3xl">Keyword Management</p>
        <div className="flex items-center space-x-4">
          <Input
            className="w-64 p-5"
            size="large"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button type="primary" onClick={openModal}>
            Create New Keyword
          </Button>
        </div>
      </div>
      {/* Outer container for rounded corners and background */}
      <div className="w-full h-5/6 bg-white rounded-xl overflow-hidden">
        {/* Inner scrollable container with padding */}
        <div className="p-7 overflow-y-auto h-full">
          {filteredKeywords.length === 0 ? (
            <p>No keywords available.</p>
          ) : (
            filteredKeywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex justify-between items-center mb-3 border-b pb-3"
              >
                <p>{keyword.label}</p>
                <Button danger onClick={() => handleDelete(keyword.id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modal for creating new keyword */}
      <Modal
        title="Create New Keyword"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Create"
      >
        <Input
          placeholder="Enter keyword label"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default KeywordManagement;
