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

interface SaveModalProps {
  visible: boolean;
  question: string;
  answer: string;
  onCancel: () => void;
  onSave: (
    updatedQuestion: string,
    updatedAnswer: string,
    uploadedImageFiles?: any[],
    uploadedVideoFiles?: any[]
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
  const [editedAnswer, setEditedAnswer] = useState(answer);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<any[]>([]);
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<any[]>([]);

  // Reset state whenever modal opens or props change.
  useEffect(() => {
    if (visible) {
      setEditedQuestion(question);
      setEditedAnswer(answer);
      setUploadedVideoFiles([]);
      setUploadedImageFiles([]);
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
              <div>
                <Input
                  size="large"
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn"
                />
              </div>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="Câu trả lời (mới từ AI)">
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  minHeight: 250,
                }}
              >
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
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  minHeight: 250,
                }}
              >
                <VideoAdder
                  onChange={(images: UploadFile[], videos: UploadFile[]) => {
                    handleFileUploadChange(images, videos);
                  }}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row justify="center" gutter={16}>
          <Col>
            <Button size="large" type="default" onClick={onCancel}>
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
    </Modal>
  );
};

export default SaveModal;
