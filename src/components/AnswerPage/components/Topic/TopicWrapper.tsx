/* eslint-disable @typescript-eslint/no-explicit-any */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Menu,
  MenuProps,
  message,
  Row,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useNavigate
import { postAddResultToTopic } from "../../../../api/api";
import {
  clearLoading,
  openLoading,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";

// Define types

type MenuItem = Required<MenuProps>["items"][number];

type TopicApi = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v1[];
};

type TopicChild_v1 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v2[];
};

type TopicChild_v2 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: [];
};

interface WarpCardProps {
  data: TopicApi[];
  topic: string;
  handleAddResultToTopic: (topic: string) => void;
}

interface WarpCardProps2 {
  data: TopicApi;
}

// Search Component
const WarpSearch: React.FC<{ onSearch: (searchText: string) => void }> = ({
  onSearch,
}) => {
  const [userText, setUserText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserText(value);
    onSearch(value); // Trigger search
  };

  return (
    <div className="h-full">
      <Input
        size="large"
        placeholder="Tìm kiếm topic..."
        className="w-full flex flex-row-reverse p-4"
        prefix={
          <FontAwesomeIcon
            icon={faArrowRight}
            className="cursor-pointer font-bold text-xl text-[#227EFF]"
          />
        }
        value={userText}
        onChange={handleInputChange}
      />
    </div>
  );
};

// Recursive Search Function
const recursiveSearch = (topic: TopicApi, searchText: string): boolean => {
  if (topic.name.toLowerCase().includes(searchText.toLowerCase())) {
    return true;
  }
  for (const child of topic.children) {
    if (child.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    for (const grandChild of child.children) {
      if (grandChild.name.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
};

// Card Component
const WarpCard: React.FC<
  WarpCardProps2 & {
    selectTopic: string;
    setSelectedTopic: (key: string) => void;
    topic: string | null;
  }
> = ({ data, selectTopic, setSelectedTopic, topic }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const handleCheckboxChange = (key: string) => {
    setSelectedTopic(key); // Nếu đã chọn thì bỏ chọn, nếu chưa thì chọn mới
  };

  const menuItems: MenuItem[] = [
    {
      key: `topic-${data.id}`,
      label: (
        <span className="font-bold text-base">
          {/* <Checkbox
            disabled={topicSelected !== null}
            className="pr-2"
            checked={selectedKey === `${data.id}`}
            onChange={(e) => {
              e.stopPropagation(); // Ngăn chặn sự kiện click của Menu
              handleCheckboxChange(`${data.id}`);
            }}
          /> */}
          {data.name}
        </span>
      ),
      children: data.children.map((subTopic) => ({
        key: `subTopic-${subTopic.id}`,
        label: (
          <span className="font-bold">
            <Checkbox
              disabled={topic !== ""}
              className="pr-2"
              checked={selectTopic.toString() === subTopic.id.toString()}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(`${subTopic.id}`);
              }}
            />
            {subTopic.name}
          </span>
        ),
        // children: subTopic.question_answer_pairs.map((question) => ({
        //   key: `question-${question.id}`,
        //   label: (
        //     <div>
        //       {/* <Checkbox
        //         disabled={topicSelected !== null}
        //         className="pr-2"
        //         checked={selectedKey === `${question.id}`}
        //         onChange={(e) => {
        //           e.stopPropagation();
        //           handleCheckboxChange(`${question.id}`);
        //         }}
        //       /> */}
        //       {question.question}
        //     </div>
        //   ),
        // })),
      })),
    },
  ];

  return (
    <div className="w-full h-auto bg-white">
      <Row gutter={16} className="mt-2 mb-2">
        <Col span={24} className="flex">
          <Menu
            style={{ width: "100%", border: "none" }}
            mode="inline"
            items={menuItems}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
          />
        </Col>
      </Row>
    </div>
  );
};

// Main Component
const WarpTopic: React.FC<WarpCardProps> = ({
  data,
  topic,
  handleAddResultToTopic,
}) => {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<TopicApi[]>(data);
  const [filteredTopics, setFilteredTopics] = useState<TopicApi[]>(data);
  const [selectTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTopics(data);
      setFilteredTopics(data);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [data]);

  const handleSearch = (searchText: string) => {
    if (searchText.trim() === "") {
      setFilteredTopics(topics);
    } else {
      const filtered = topics.filter((topic) =>
        recursiveSearch(topic, searchText)
      );
      setFilteredTopics(filtered);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  const handleGetTopicName = (topicId: string) => {
    for (const item of topics) {
      for (const subTopic of item.children) {
        if (subTopic.id.toString() === topicId.toString()) {
          return `${item.name} - ${subTopic.name}`;
        }
      }
    }
    return "";
  };

  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <WarpSearch onSearch={handleSearch} />
      </div>
      <div className="w-full h-[60vh] flex flex-col bg-white p-5 rounded-3xl">
        <div className="h-5/6 overflow-auto overflow-x-hidden py-3 pl-3 pr-6 rounded-3xl">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topicData) => (
              <WarpCard
                key={topicData.id}
                data={topicData}
                topic={topic}
                selectTopic={selectTopic}
                setSelectedTopic={setSelectedTopic}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center text-gray-500">
              Không có kết quả phù hợp
            </div>
          )}
        </div>
        {topic == "" ? (
          <div className="flex flex-row justify-between">
            <div></div>
            <Button
              type="primary"
              className="w-1/4 mt-7"
              onClick={() => handleAddResultToTopic(selectTopic)} // Navigate to "/topic"
            >
              Thêm vào topic
            </Button>
          </div>
        ) : (
          <div className="flex flex-row justify-center w-full">
            {"Đã thêm vào topic: " + handleGetTopicName(topic)}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarpTopic;
