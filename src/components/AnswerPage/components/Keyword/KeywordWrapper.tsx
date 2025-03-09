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
  // State for the list of keywords (as objects with id and title)
  const [questionKeywords, setQuestionKeywords] = useState<Data[]>([]);
  // State for search suggestions from the search API
  const [searchResults, setSearchResults] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userText, setUserText] = useState<string>("");

  // Fetch the initial keywords using GET /keywords/:resultId
  useEffect(() => {
    const fetchQuestionKeywords = async () => {
      setLoading(true);
      try {
        const response = await getKeywordsById(id);
        // The API returns an array like: [ { "label": "B7" }, { "label": "Science" }, ... ]
        // Generate a local id using the index and map "label" to "title"
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

  // Fetch search suggestions when user types at least 2 characters
  useEffect(() => {
    if (userText.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchSearchSuggestions = async () => {
      try {
        const response = await getKeywords(userText);
        // Expecting response.data.keywords to be an array of objects with id and label.
        // If the API returns an id, use it; otherwise generate one.
        const searchData: Data[] = response.data.keywords.map(
          (item: { id?: number; label: string }, index: number) => ({
            id: item.id || index + 1000, // Generate a temporary id if not provided
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

  // Delete a keyword from the list
  const handleDeleteKeyword = (keywordId: number) => {
    setQuestionKeywords((prev) =>
      prev.filter((keyword) => keyword.id !== keywordId)
    );
  };

  // Update the search input
  const handleInputChange = (value: string) => {
    setUserText(value);
  };

  // When a suggestion is selected, add it to the list (if not already added)
  const handleSelect = (value: string, option: any) => {
    if (questionKeywords.find((keyword) => keyword.title === value)) {
      message.warning("Keyword already added.");
      setUserText("");
      return;
    }
    const selectedKeyword: Data = {
      id: option.id, // Use the suggestion's id (or generated id)
      title: value,
    };
    setQuestionKeywords((prev) => [...prev, selectedKeyword]);
    setUserText("");
  };

  // Prepare options for the AutoComplete dropdown
  const autoCompleteOptions = searchResults.map((item) => ({
    value: item.title,
    id: item.id,
  }));

  // Save the keywords via PUT, sending an array of keyword labels
  const handleSaveKeywords = async () => {
    try {
      // Build payload: { keywords: [ "B7", "Science", "Buddhism" ] }
      const payload = questionKeywords.map((keyword) => keyword.id);
      await updateKeywords(id, payload);
      message.success("Keywords updated successfully!");
    } catch (error) {
      console.error("Error updating keywords:", error);
      message.error("Failed to update keywords.");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full bg-white p-5 rounded-3xl">
        <p className="font-bold text-xl mb-5">
          Danh sách Keyword cho câu trả lời này
        </p>
        {/* Search Bar with AutoComplete */}
        <div className="mb-4 pb-4">
          <AutoComplete
            options={autoCompleteOptions}
            value={userText}
            onSelect={handleSelect}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          >
            <Input
              size="large"
              className="w-full flex flex-row-reverse p-4"
              placeholder="Tìm kiếm keyword..."
              prefix={
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="cursor-pointer font-bold text-xl text-[#227EFF]"
                />
              }
            />
          </AutoComplete>
        </div>
        {/* Save Button */}
        <div className="mb-4">
          <Button type="primary" onClick={handleSaveKeywords}>
            Save Keywords
          </Button>
        </div>
        {/* Divider */}
        <div className="border-t mb-4" />
        {/* List of Keywords */}
        <div className="w-full h-[50vh] overflow-auto pr-5">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : questionKeywords.length > 0 ? (
            questionKeywords.map((item) => (
              <WarpCard
                key={item.id}
                data={item}
                onDelete={handleDeleteKeyword}
              />
            ))
          ) : (
            <div className="h-full flex justify-center items-center">
              <p className="text-gray-500 text-center">
                Câu hỏi này không có keyword
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarpKeyWord;
