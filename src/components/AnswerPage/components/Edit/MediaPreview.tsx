import React, { useState } from "react";
import { Image, Modal, Tooltip } from "antd";

interface MediaPreviewProps {
  dataEdit: {
    images: string[];
    videos: string[];
  };
  deletedImages: string[];
  deletedVideos: string[];
  // These functions toggle the deletion state.
  onDeleteImage: (url: string) => void;
  onDeleteVideo: (url: string) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  dataEdit,
  deletedImages,
  deletedVideos,
  onDeleteImage,
  onDeleteVideo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const handleVideoClick = (video: string) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setCurrentVideo(null);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
      <div
        className="mt-2 flex gap-2 flex-wrap overflow-y-auto"
        style={{ justifyContent: "flex-start" }}
      >
        {/* Images */}
        {dataEdit?.images?.map((image, index) => {
          const isDeleted = deletedImages.includes(image);
          return (
            <div
              key={index}
              className="relative w-40 h-40 rounded-lg flex-shrink-0 border border-gray-300 overflow-hidden"
              style={{ aspectRatio: "1/1" }}
            >
              <Image
                src={image}
                alt={`Image ${index}`}
                className="w-full h-full object-cover"
                preview={false}
                style={{ opacity: isDeleted ? 0.5 : 1 }}
              />
              <div
                className="absolute top-0 right-0 m-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteImage(image); // toggle deletion state
                }}
              >
                <Tooltip
                  title={
                    isDeleted
                      ? "Nhấn để khôi phục"
                      : "Sẽ bị loại trừ khi lưu chỉnh sửa"
                  }
                >
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    {isDeleted ? "Xóa" : "X"}
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        })}

        {/* Videos */}
        {dataEdit?.videos?.map((video, index) => {
          const isDeleted = deletedVideos.includes(video);
          return (
            <div
              key={index}
              className="relative w-40 h-40 rounded-lg flex-shrink-0 border border-gray-300 overflow-hidden cursor-pointer bg-gray-200 flex items-center justify-center"
              style={{ aspectRatio: "1/1" }}
              onClick={() => {
                if (!isDeleted) {
                  handleVideoClick(video);
                }
              }}
            >
              <video
                src={video}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                style={{ opacity: isDeleted ? 0.5 : 1, display: "block" }}
              />
              <div
                className="absolute top-0 right-0 m-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteVideo(video); // toggle deletion state
                }}
              >
                <Tooltip
                  title={
                    isDeleted
                      ? "Nhấn để khôi phục"
                      : "Sẽ bị loại trừ khi lưu chỉnh sửa"
                  }
                >
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    {isDeleted ? "Xóa" : "X"}
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
        centered
      >
        {currentVideo && (
          <video src={currentVideo} className="w-full" controls autoPlay />
        )}
      </Modal>
    </div>
  );
};

export default MediaPreview;
