import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Form,
  Typography,
  Divider,
  UploadFile,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import VideoAdder from "./VideoAdder";

const { Title } = Typography;

// A simple markdown-to-HTML converter (supports "### " headings and **bold**)
const markdownToHtml = (markdown: string): string => {
  return markdown
    .split("\n")
    .map((line) => {
      // Convert markdown headings (only "### " is supported here)
      if (line.startsWith("### ")) {
        return `<h3>${line.slice(4)}</h3>`;
      }
      // Convert bold text wrapped in **
      return line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    })
    .join("<br/>");
};

interface SaveModalProps {
  visible: boolean;
  question: string;
  answer: string;
  onCancel: () => void;
  onSave: (
    updatedQuestion: string,
    updatedAnswer: string,
    uploadedImageFiles?: UploadFile[],
    uploadedVideoFiles?: UploadFile[]
  ) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({
  visible,
  question,
  answer,
  onCancel,
  onSave,
}) => {
  const [editedQuestion, setEditedQuestion] = useState(question);
  // Convert markdown answer from AI to HTML for ReactQuill editor.
  const [editedAnswer, setEditedAnswer] = useState(markdownToHtml(answer));
  const [uploadedImageFiles, setUploadedImageFiles] = useState<UploadFile[]>(
    []
  );
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<UploadFile[]>(
    []
  );

  // Reset state whenever modal opens or the AI data changes.
  useEffect(() => {
    if (visible) {
      setEditedQuestion(question);
      setEditedAnswer(markdownToHtml(answer));
      setUploadedImageFiles([]);
      setUploadedVideoFiles([]);
    }
  }, [visible, question, answer]);

  const handleSave = () => {
    onSave(
      editedQuestion,
      editedAnswer,
      uploadedImageFiles,
      uploadedVideoFiles
    );
  };

  const handleFileUploadChange = (
    images: UploadFile[],
    videos: UploadFile[]
  ) => {
    setUploadedImageFiles(images);
    setUploadedVideoFiles(videos);
  };

  // Base container style for content areas
  const baseContainerStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 16,
    minHeight: 250,
    maxHeight: 400,
    overflowY: "auto",
  };

  // Sticky container style for ReactQuill editor.
  // Note: While this makes the container sticky, we also need to override the Quill toolbar.
  const stickyEditorStyle: React.CSSProperties = {
    ...baseContainerStyle,
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 2,
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={1000}
      bodyStyle={{ padding: 24 }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Lưu thành câu hỏi mới
      </Title>
      <Form layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="Câu hỏi">
              <Input
                size="large"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                placeholder="Nhập câu hỏi của bạn"
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="Câu trả lời (mới từ AI)">
              <div style={stickyEditorStyle} className="sticky-editor">
                <ReactQuill
                  theme="snow"
                  value={editedAnswer}
                  onChange={setEditedAnswer}
                />
              </div>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Hình ảnh, video liên quan">
              <div style={baseContainerStyle}>
                <VideoAdder onChange={handleFileUploadChange} />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row justify="center" gutter={16}>
          <Col>
            <Button size="large" onClick={onCancel}>
              Huỷ chỉnh sửa
            </Button>
          </Col>
          <Col>
            <Button size="large" type="primary" onClick={handleSave}>
              Lưu chỉnh sửa
            </Button>
          </Col>
        </Row>
      </Form>
      {/* Custom CSS to make the ReactQuill toolbar sticky */}
      <style>
        {`
          .sticky-editor .ql-toolbar.ql-snow {
            position: sticky;
            top: 0;
            background: #fff;
            z-index: 3;
          }
        `}
      </style>
    </Modal>
  );
};

export default SaveModal;
