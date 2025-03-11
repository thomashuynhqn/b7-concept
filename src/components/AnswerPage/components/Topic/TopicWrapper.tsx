/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { postAddResultToTopic } from "../../../../api/api";
import {
  openLoading,
  clearLoading,
} from "../../../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";

// Define types
type MenuItem = Required<MenuProps>["items"][number];

export type TopicApi = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v1[];
};

export type TopicChild_v1 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: TopicChild_v2[];
};

export type TopicChild_v2 = {
  id: number;
  name: string;
  question_answer_pairs: any[];
  children: [];
};

interface WarpCardProps {
  data: TopicApi;
  selectedKey: string | null;
  setSelectedKey: (key: string | null) => void;
  topicSelected: string | null;
}

// Recursive search function
const recursiveSearch = (topic: TopicApi, searchText: string): boolean => {
  if (topic.name.toLowerCase().includes(searchText.toLowerCase())) return true;
  for (const child of topic.children) {
    if (child.name.toLowerCase().includes(searchText.toLowerCase()))
      return true;
    for (const grandChild of child.children) {
      if (grandChild.name.toLowerCase().includes(searchText.toLowerCase()))
        return true;
    }
  }
  return false;
};

// Search Component
const WarpSearch: React.FC<{ onSearch: (searchText: string) => void }> = ({
  onSearch,
}) => {
  const [userText, setUserText] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserText(value);
    onSearch(value);
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

// Card Component: displays a topic and its children
const WarpCard: React.FC<WarpCardProps> = ({
  data,
  selectedKey,
  setSelectedKey,
  topicSelected,
}) => {
  const handleCheckboxChange = (key: string) => {
    setSelectedKey(key);
  };

  const menuItems: MenuItem[] = [
    {
      key: `topic-${data.id}`,
      label: <span className="font-bold text-base">{data.name}</span>,
      children: data.children.map((subTopic) => ({
        key: `subTopic-${subTopic.id}`,
        label: (
          <span className="font-bold">
            <Checkbox
              disabled={topicSelected !== null}
              className="pr-2"
              checked={selectedKey === `${subTopic.id}`}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(`${subTopic.id}`);
              }}
            />
            {subTopic.name}
          </span>
        ),
      })),
    },
  ];

  return (
    <div className="w-full bg-white">
      <Row gutter={16} className="mt-2 mb-2">
        <Col span={24}>
          <Menu
            style={{ width: "100%", border: "none" }}
            mode="inline"
            items={menuItems}
          />
        </Col>
      </Row>
    </div>
  );
};

interface WarpTopicProps {
  data: TopicApi[];
  topicSelected: string | null;
}

const WarpTopic: React.FC<WarpTopicProps> = ({ data, topicSelected }) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<TopicApi[]>(data);
  const [filteredTopics, setFilteredTopics] = useState<TopicApi[]>(data);
  const [selectedKey, setSelectedKey] = useState<string | null>(topicSelected);
  // Local flag to track if the result has already been added.
  const [added, setAdded] = useState<boolean>(!!topicSelected);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setSelectedKey(topicSelected);
    if (topicSelected) {
      setAdded(true);
    }
  }, [topicSelected]);

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

  const handleAddResultToTopic = () => {
    if (selectedKey) {
      const requestBody = {
        question_answer_pair_id: id,
      };
      dispatch(openLoading());
      postAddResultToTopic(requestBody, selectedKey)
        .then(() => {
          dispatch(clearLoading());
          setAdded(true);
          message.success("The result has been added to the topic.");
          // Optionally, navigate or refresh data here.
        })
        .catch((error: any) => {
          dispatch(clearLoading());
          console.error("Error adding result to topic:", error);
        });
    } else {
      message.error("Vui lòng chọn một topic!");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <WarpSearch onSearch={handleSearch} />
      </div>
      <div className="w-full h-[60vh] flex flex-col bg-white p-5 rounded-3xl">
        <div className="h-5/6 overflow-auto overflow-x-hidden py-3 pl-3 pr-6 rounded-3xl">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <WarpCard
                key={topic.id}
                data={topic}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
                topicSelected={topicSelected}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center text-gray-500">
              Không có kết quả phù hợp
            </div>
          )}
        </div>
        {/* Show the button only if the result hasn't been added */}
        {!added && (
          <div className="flex justify-end mt-7">
            <Button
              type="primary"
              className="w-1/4"
              onClick={handleAddResultToTopic}
            >
              Thêm vào topic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarpTopic;
