// src/pages/ResultAI.tsx

import React from "react";
import AIResultCard from "../components/AIResultCard";
import { Col, Input, Row } from "antd";

interface ResultAIProps {
  aiData: string;
  answerId: number;
  onClose: () => void; // New prop to close the AI result screen
  onSaveAnswer: (id: number) => void;
}

const ResultAI: React.FC<ResultAIProps> = ({
  aiData,
  answerId,
  onClose,
  onSaveAnswer,
}) => {
  return (
    <Row className="mt-4 w-full overflow-auto ">
      <Col span={24}>
        {/* Invisible Input to maintain consistent spacing */}
        <div>
          <Input className="w-full h-16 px-6 border border-gray-300 rounded-md shadow-sm invisible" />
        </div>
        <div className="mt-6">
          <AIResultCard
            data={aiData}
            answerId={answerId}
            onClose={onClose}
            onSaveAnswer={() => onSaveAnswer(answerId)}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ResultAI;
