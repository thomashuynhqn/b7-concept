import React from "react";
import { Col, Input, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DataApi } from "../types/data";
import ResultCard from "../components/ResultCard";

const { TextArea } = Input;

interface ResultProps {
  results: DataApi[];
  likes: { [key: number]: boolean };
  saved: { [key: number]: boolean };
  onClickLike: (id: number) => void;
  onClickSave: (id: number) => void;
  loading: boolean;
  error: Error | null;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSearchNormal: () => void;
  onSearchAI: () => void;
  isSearchWithAI: boolean;
}

const Result: React.FC<ResultProps> = ({
  results,
  likes,
  saved,
  onClickLike,
  onClickSave,
  error,
  searchValue,
  onSearchValueChange,
  onKeyPress,
  onSearchNormal,
  onSearchAI,
  isSearchWithAI,
}) => {
  return (
    <Row className="mt-4 w-full">
      <Col span={24}>
        {/* Search Bar integrated into the result page */}
        <div className={`${isSearchWithAI ? "w-full" : "w-1/2"} mb-6`}>
          <div className="relative">
            <TextArea
              placeholder="Điều bạn muốn tìm kiếm là..."
              className="w-full pt-4 px-6 border border-gray-300 rounded-md shadow-sm resize-none pr-16"
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onKeyPress(e);
                }
              }}
              autoSize={{ minRows: 2, maxRows: 5 }}
            />

            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex space-x-4 items-center">
              <FontAwesomeIcon
                icon={faX}
                className={`cursor-pointer ${
                  searchValue ? "text-gray-700" : "text-gray-400"
                }`}
                onClick={() => searchValue && onSearchValueChange("")}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className={`cursor-pointer ${
                  searchValue ? "text-gray-700" : "text-gray-400"
                }`}
                onClick={onSearchNormal}
              />
              <img
                src="/Vector.svg"
                alt="AI Search"
                className={`w-5 h-5 ${
                  searchValue ? "cursor-pointer" : "opacity-50"
                }`}
                onClick={onSearchAI}
              />
            </div>
          </div>
        </div>

        {/* Result Cards */}
        <div>
          {error && <div>Error: {error.message}</div>}
          {results.length === 0 ? (
            <div className="text-center text-sm text-gray-600">
              Không có dữ liệu cho câu hỏi
            </div>
          ) : (
            results.map((item) => (
              <div key={item.id} className="mb-4">
                <ResultCard
                  id={item.id}
                  result={item}
                  handleClickLike={onClickLike}
                  handleClickSave={onClickSave}
                  isLiked={!!likes[item.id]}
                  isSaved={!!saved[item.id]}
                />
              </div>
            ))
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Result;
