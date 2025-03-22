import { CloseOutlined } from "@ant-design/icons";
import { Col, Modal, Row } from "antd";
import React, { useState } from "react";

interface WarpCardProps {
  data: string;
}

interface WarpImageProps {
  data: string[];
}

const WarpCard: React.FC<WarpCardProps> = ({ data }) => {
  console.log("🚀 ~ data:", data);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(data);
  const [isError, setIsError] = useState(false); // Thêm trạng thái để kiểm tra lỗi
  const defaultImage = "path-to-gray-placeholder-image"; // URL ảnh báo lỗi màu xám

  const handlePreview = (link: string) => {
    if (!isError) {
      setCurrentImage(link);
      setIsPreviewVisible(true);
    }
  };

  const handleCancel = () => {
    setIsPreviewVisible(false);
    setCurrentImage(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultImage;
    e.currentTarget.style.objectFit = "contain";
    e.currentTarget.style.backgroundColor = "#e0e0e0"; // Màu nền xám
    setIsError(true); // Đánh dấu trạng thái là lỗi
  };

  return (
    <>
      <div
        className="rounded-3xl cursor-pointer"
        style={{
          width: "100%",
        }}
      >
        <img
          src={data}
          alt="Card"
          onError={handleImageError}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
          onClick={() => handlePreview(data)}
        />
        {isError && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              color: "#888", // Màu biểu tượng lỗi
              fontSize: "32px",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền mờ phía sau icon
              borderRadius: "50%",
              width: "60px",
              height: "60px",
            }}
          >
            <span style={{ color: "red", fontSize: "24px" }}>error</span>{" "}
          </div>
        )}
      </div>
      <Modal
        open={isPreviewVisible}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        width={"auto"}
        style={{ backgroundColor: "transparent" }}
        bodyStyle={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        {currentImage && (
          <div style={{ position: "relative" }}>
            <img
              src={currentImage}
              alt="Preview"
              onError={(e) => (e.currentTarget.src = defaultImage)}
              style={{
                maxWidth: "100vw", // Limit the width to viewport width
                maxHeight: "80vh", // Limit the height to 80% of viewport height
                objectFit: "contain", // Ensure the image fits within the boundaries
                borderRadius: "16px",
              }}
            />
            <CloseOutlined
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                fontSize: "18px",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                padding: "4px",
                cursor: "pointer",
              }}
              onClick={handleCancel}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

const WrapImageScreen: React.FC<WarpImageProps> = ({ data }) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <Row gutter={[16, 16]} align="top" className="flex-1">
        {data ? (
          data.map((item: string, index: React.Key | null | undefined) => (
            <Col
              key={index}
              span={12}
              className="flex justify-center items-start"
            >
              <WarpCard data={item} />
            </Col>
          ))
        ) : (
          <div className="w-full flex justify-center items-center font-bold text-white">
            No data
          </div>
        )}
      </Row>
    </div>
  );
};

export default WrapImageScreen;
