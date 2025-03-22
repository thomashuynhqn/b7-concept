import { Button, Col, Row, Spin, Input, AutoComplete, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  getKeywordsById,
  getKeywords,
  updateKeywords,
} from "../../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Our keyword interface
export interface Data {
  id: number; // Local identifier (generated if not provided by the API)
  title: string; // The keyword label
}

interface WarpKeyWordProps {
  id: number; // The result/question id
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

const WarpKeyWord: React.FC<WarpKeyWordProps> = ({ id }) => {
  const [questionKeywords, setQuestionKeywords] = useState<Data[]>([]);
  const [searchResults, setSearchResults] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userText, setUserText] = useState<string>("");
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false); // ✅ Track save button state

  useEffect(() => {
    const fetchQuestionKeywords = async () => {
      setLoading(true);
      try {
        const response = await getKeywordsById(id);
        const formattedData: Data[] = response.data.map(
          (item: { label: string }, index: number) => ({
            id: index + 1,
            title: item.label,
          })
        );
        setQuestionKeywords(formattedData);
      } catch (error) {
        console.error("Error fetching question keywords:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionKeywords();
  }, [id]);

  useEffect(() => {
    if (userText.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchSearchSuggestions = async () => {
      try {
        const response = await getKeywords(userText);
        const searchData: Data[] = response.data.keywords.map(
          (item: { id?: number; label: string }, index: number) => ({
            id: item.id || index + 1000,
            title: item.label,
          })
        );
        setSearchResults(searchData);
      } catch (error) {
        console.error("Error fetching search keywords:", error);
      }
    };
    fetchSearchSuggestions();
  }, [userText]);

  const handleDeleteKeyword = (keywordId: number) => {
    const updatedKeywords = questionKeywords.filter(
      (keyword) => keyword.id !== keywordId
    );
    setQuestionKeywords(updatedKeywords);
    setIsSaveEnabled(updatedKeywords.length > 0); // ✅ Disable save if no keywords
  };

  const handleInputChange = (value: string) => {
    setUserText(value);
  };

  const handleSelect = (value: string, option: any) => {
    if (questionKeywords.find((keyword) => keyword.title === value)) {
      message.warning("Keyword already added.");
      setUserText("");
      return;
    }
    const selectedKeyword: Data = { id: option.id, title: value };
    const updatedKeywords = [...questionKeywords, selectedKeyword];
    setQuestionKeywords(updatedKeywords);
    setUserText("");
    setIsSaveEnabled(true); // ✅ Enable save when a keyword is added
  };

  const autoCompleteOptions = searchResults.map((item) => ({
    value: item.title,
    id: item.id,
  }));

  const handleSaveKeywords = async () => {
    try {
      const payload = questionKeywords.map((keyword) => keyword.id);
      await updateKeywords(id, payload);
      message.success("Keywords updated successfully!");
      setIsSaveEnabled(false); // ✅ Disable button after saving
    } catch (error) {
      console.error("Error updating keywords:", error);
      message.error("Failed to update keywords.");
    }
  };

  return (
    <div className="w-full h-[78vh] flex flex-col">
      <div className="w-full h-full bg-white p-6 rounded-3xl shadow-md flex flex-col">
        <div className="mb-6">
          <AutoComplete
            options={autoCompleteOptions}
            value={userText}
            onSelect={handleSelect}
            onChange={handleInputChange}
            className="w-full"
          >
            <Input
              size="large"
              placeholder="Tìm kiếm keyword..."
              className="w-full p-4 rounded-lg border-gray-300 focus:border-[#227EFF] focus:ring-[#227EFF]"
              prefix={
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[#227EFF] text-lg mr-2"
                />
              }
            />
          </AutoComplete>
        </div>

        <div className="w-full flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : questionKeywords.length > 0 ? (
            <div className="space-y-3">
              {questionKeywords.map((item) => (
                <WarpCard
                  key={item.id}
                  data={item}
                  onDelete={handleDeleteKeyword}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex justify-center items-center">
              <p className="text-gray-500 text-center text-sm">
                Câu hỏi này không có keyword
              </p>
            </div>
          )}
        </div>

        {/* Save Button (Disabled until keywords are added) */}
        <div className="mt-auto pt-4 flex justify-end">
          <Button
            type="primary"
            onClick={handleSaveKeywords}
            disabled={!isSaveEnabled} // ✅ Disable when empty
            className={`px-6 py-2 rounded-lg ${
              isSaveEnabled
                ? "bg-[#227EFF] hover:bg-[#1a66cc] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Lưu Keywords
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarpKeyWord;
