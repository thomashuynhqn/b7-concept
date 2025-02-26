import { Button, Col, Row, Spin } from "antd"; // Import Spin for loading indicator
import React, { useEffect, useState } from "react";
import { getKeywordsById } from "../../../../api/api";

interface Data {
  id: number;
  title: string;
}

interface WarpCardProps {
  data: Data;
  onDelete: (id: number) => void;
}

const WarpCard: React.FC<WarpCardProps> = ({ data, onDelete }) => {
  return (
    <div className="w-full h-auto bg-white">
      <Row gutter={16} className="mt-2 mb-2">
        <Col span={24}>
          <Row className="flex justify-between border-b pb-3">
            <p className="text-base font-medium">{data.title}</p>
            <Button size="large" onClick={() => onDelete(data.id)}>
              Xoá Keyword
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

interface WarpKeyWordProps {
  id: number; // Accept an ID for fetching keywords
}

const WarpKeyWord: React.FC<WarpKeyWordProps> = ({ id }) => {
  const [keywordList, setKeywordList] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true); // Start loading
      try {
        const response = await getKeywordsById(id); // Make the API call
        const data = response.data; // Access the `data` property

        const formattedData = data.map(
          (item: { label: string }, index: number) => ({
            id: index + 1,
            title: item.label, // Adjust the property name to match your API response
          })
        );

        setKeywordList(formattedData);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchKeywords();
  }, [id]);

  const handleDeleteKeyword = (keywordId: number) => {
    setKeywordList((prevKeywords) =>
      prevKeywords.filter((keyword) => keyword.id !== keywordId)
    );
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-[60vh] flex flex-col bg-white p-5 rounded-3xl">
        <p className="font-bold text-xl mb-5">
          Danh sách Keyword cho câu trả lời này
        </p>
        {loading ? (
          <div className="h-full flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : keywordList.length > 0 ? (
          <div className="h-full overflow-auto overflow-x-hidden pr-5">
            {keywordList.map((item) => (
              <WarpCard
                key={item.id}
                data={item}
                onDelete={handleDeleteKeyword}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <p className="text-gray-500 text-center">
              Câu hỏi này không có keyword
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarpKeyWord;
