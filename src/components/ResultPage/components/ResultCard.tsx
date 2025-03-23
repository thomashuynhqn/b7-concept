// src/components/ResultCard.tsx

import React from "react";
import { Button, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser"; // Import html-react-parser
import DOMPurify from "dompurify"; // Import DOMPurify
import { ResultCardProps } from "../types/data";

const ResultCard: React.FC<ResultCardProps> = ({
  id,
  result,
  handleClickLike,
  handleClickSave,
  isLiked,
  isSaved,
}) => {
  const navigate = useNavigate();

  // Function to sanitize and parse HTML content
  const renderHtmlContent = (html: string) => {
    // Sanitize the HTML to ensure safety
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "ul", "ol", "li"],
      ALLOWED_ATTR: [],
    });
    // Parse the sanitized HTML into React components
    return parse(sanitizedHtml);
  };

  return (
    <div className="w-full bg-white mb-4">
      <div className="border border-[#BFBFBF] p-5 rounded-xl">
        <Row gutter={16}>
          <Col span={12}>
            <div className="text-[#227EFF] font-bold">{result.question}</div>
          </Col>
          <Col span={12}>
            <Button
              className="border-[#227EFF] bg-white text-[#227EFF] w-32 float-right"
              size="large"
              type="primary"
              onClick={() => navigate(`/results/answer?id=${result.id}`)}
            >
              Xem thêm
            </Button>
          </Col>
        </Row>

        <Row gutter={16} className="mt-5 mb-5">
          <Col span={24}>
            <div className="text-black">
              {typeof result.answer === "string" ? (
                /<\/?[a-z][\s\S]*>/i.test(result.answer) ? (
                  <div className="line-clamp-5 overflow-hidden text-sm answer-content">
                    {renderHtmlContent(result.answer)}
                  </div>
                ) : (
                  <p className="line-clamp-5 overflow-hidden text-sm">
                    {result.answer}
                  </p>
                )
              ) : (
                <p className="text-sm">Không có dữ liệu hợp lệ</p>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col>
            <div>
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faHeart}
                onClick={() => handleClickLike(id)}
                style={{ color: isLiked ? "#FF7600" : "#595959" }}
              />
              <span
                className="pl-2"
                style={{ color: isLiked ? "#FF7600" : "#595959" }}
              >
                {result.like_count}
              </span>
            </div>
          </Col>
          <Col span={10}>
            <div
              className="cursor-pointer"
              style={{ color: isSaved ? "#227EFF" : "#595959" }}
              onClick={() => handleClickSave(id)}
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span className="pl-2">
                {isSaved ? "Đã lưu câu trả lời" : "Lưu câu trả lời"}
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResultCard;
