import { Button, Col, Input, Modal, Row, UploadFile, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearLoading,
  openLoading,
} from "../../../../redux/slices/loadingSlice";
import {
  getResultsByID,
  postSubmitChange,
  postUpLoadImage,
  postUploadVideo,
} from "../../../../api/api";
import TextEditor from "../../../../utils/RichTextEditor/Editor";
import FileUpload from "../../../../utils/SharedComponents/FileUpload";
import MediaPreview from "./MediaPreview";
import DOMPurify from "dompurify";

// Define interfaces for better type safety
interface Topic {
  id: number;
  name: string;
  description: string;
}

interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  like_count: number;
  topic: Topic | string;
  images: string[];
  videos: string[];
}

const Edit = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize state for data editing
  const [dataEdit, setDataEdit] = useState<DataApi>({
    id: 1,
    question: "",
    answer: "",
    keywords: [],
    like_count: 1,
    topic: "",
    images: [],
    videos: [],
  });

  const [editedContent, setEditedContent] = useState<string>("");
  const [newImages, setNewImages] = useState<UploadFile[]>([]);
  const [newVideos, setNewVideos] = useState<UploadFile[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [deletedVideos, setDeletedVideos] = useState<string[]>([]);

  const _id = searchParams.get("id");

  // Fetch data on component mount
  useEffect(() => {
    if (!_id) {
      message.error("No ID provided.");
      return;
    }

    const fetchData = async () => {
      dispatch(openLoading());
      try {
        const res = await getResultsByID(Number(_id));
        const fetchedData: DataApi = res.data;
        setDataEdit(fetchedData);
        setEditedContent(fetchedData.answer);
      } catch (err) {
        console.error("Error fetching data:", err);
        message.error("Failed to fetch data.");
      } finally {
        dispatch(clearLoading());
      }
    };

    fetchData();
  }, [_id, dispatch]);

  // Sanitize HTML content for rendering
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["p", "br", "strong", "ul", "ol", "li"],
      ALLOWED_ATTR: [],
    });
  };

  // Handle editor content change
  const handleEditorChange = useCallback((content: string) => {
    setEditedContent(content);
  }, []);

  // Handle file upload changes
  const handleFileUploadChange = useCallback(
    (images: UploadFile[], videos: UploadFile[]) => {
      setNewImages(images);
      setNewVideos(videos);
    },
    []
  );

  const handleToggleDeleteImage = useCallback((url: string) => {
    setDeletedImages((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  }, []);

  const handleToggleDeleteVideo = useCallback((url: string) => {
    setDeletedVideos((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  }, []);

  // Upload images and return URLs
  const uploadImages = useCallback(
    async (id: string): Promise<string[]> => {
      const maxSize = 15 * 1024 * 1024; // 15MB
      for (const file of newImages) {
        if ((file.originFileObj as File).size > maxSize) {
          message.error(`Image ${file.name} exceeds 15MB limit.`);
          throw new Error("Image size exceeds limit.");
        }
      }

      const uploadedUrls = await Promise.all(
        newImages.map(async (file) => {
          const imageUrl = await postUpLoadImage(
            id,
            file.originFileObj as File
          );
          if (!imageUrl) throw new Error("Image upload failed.");
          return imageUrl;
        })
      );
      message.success("All images uploaded successfully!");
      return uploadedUrls;
    },
    [newImages]
  );

  // Upload videos and return URLs
  const uploadVideos = useCallback(
    async (id: string): Promise<string[]> => {
      const maxSize = 15 * 1024 * 1024; // 15MB
      for (const file of newVideos) {
        if ((file.originFileObj as File).size > maxSize) {
          message.error(`Video ${file.name} exceeds 15MB limit.`);
          throw new Error("Video size exceeds limit.");
        }
      }

      const uploadedUrls = await Promise.all(
        newVideos.map(async (file) => {
          const videoUrl = await postUploadVideo(
            id,
            file.originFileObj as File
          );
          if (!videoUrl) throw new Error("Video upload failed.");
          return videoUrl;
        })
      );
      message.success("All videos uploaded successfully!");
      return uploadedUrls;
    },
    [newVideos]
  );

  // Handle form submission
  const handleSubmitChange = useCallback(async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    dispatch(openLoading());
    try {
      let newUploadedImages: string[] = [];
      let newUploadedVideos: string[] = [];

      if (newImages.length > 0) {
        newUploadedImages = await uploadImages(dataEdit.id.toString());
      }
      if (newVideos.length > 0) {
        newUploadedVideos = await uploadVideos(dataEdit.id.toString());
      }

      const remainingImages = (dataEdit.images || []).filter(
        (url) => !deletedImages.includes(url)
      );
      const remainingVideos = (dataEdit.videos || []).filter(
        (url) => !deletedVideos.includes(url)
      );

      const imagesPayload = [...remainingImages, ...newUploadedImages];
      const videosPayload = [...remainingVideos, ...newUploadedVideos];

      const requestBody: any = {
        ...dataEdit,
        answer: editedContent,
        userid: user_id,
        ...(imagesPayload.length > 0 && { images: imagesPayload }),
        ...(videosPayload.length > 0 && { videos: videosPayload }),
      };

      const res = await postSubmitChange(dataEdit.id, requestBody);
      message.success(res.data.message);
      navigate(`/results/answer?id=${dataEdit.id}`);
    } catch (err) {
      message.error(`Failed to process request: ${err}`);
    } finally {
      dispatch(clearLoading());
    }
  }, [
    dataEdit,
    editedContent,
    newImages,
    newVideos,
    deletedImages,
    deletedVideos,
    dispatch,
    navigate,
    uploadImages,
    uploadVideos,
  ]);

  return (
    <Row
      gutter={16}
      className="h-[80vh] w-full flex flex-col justify-between items-center"
      style={{ padding: "16px" }}
    >
      {/* Search Bar */}
      <Row
        gutter={16}
        className="w-full flex justify-between items-center"
        style={{ height: "10%" }}
      >
        <Col span={12}>
          <Input
            size="large"
            readOnly
            value={dataEdit.question}
            className="w-full p-4 bg-[#F2F2F2] rounded-3xl border-0"
            disabled
          />
        </Col>
        <Col span={12} className="flex justify-end">
          <Button
            size="middle"
            type="primary"
            className="mr-2"
            onClick={handleSubmitChange}
          >
            Lưu chỉnh sửa
          </Button>
          <Button size="middle" onClick={() => setIsModalOpen(true)}>
            Huỷ chỉnh sửa
          </Button>
        </Col>
      </Row>

      {/* Main Content */}
      <Row
        gutter={16}
        className="w-full flex justify-between"
        style={{ height: "60%" }}
      >
        {/* Current Answer Section */}
        <Col span={12} className="p-4">
          <div className="p-4 bg-[#F2F2F2] rounded-3xl h-full">
            <p className="text-black font-semibold text-base">
              Câu trả lời hiện tại
            </p>
            <div
              className="mt-2 overflow-y-auto answer-content"
              style={{ maxHeight: "300px" }}
            >
              {dataEdit?.answer ? (
                <div
                  className="text-black text-sm"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(dataEdit.answer),
                  }}
                />
              ) : (
                <p className="text-black text-sm">Không có dữ liệu hợp lệ</p>
              )}
            </div>
          </div>
        </Col>

        {/* New Answer Section */}
        <Col span={12} className="p-4">
          <div className="p-4 border-2 border-[#BFBFBF] rounded-3xl h-full">
            <p className="text-black font-semibold text-base">
              Câu trả lời mới
            </p>
            <div
              className="mt-2 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              <TextEditor
                toolbarWidth="100%"
                editorHeight="100%"
                defaultValue={dataEdit.answer}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Media Section */}
      <Row
        gutter={16}
        className="w-full flex justify-between"
        style={{ height: "30%" }}
      >
        {/* Current Media Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Hình ảnh, video hiện tại
            </p>
            <MediaPreview
              dataEdit={dataEdit}
              deletedImages={deletedImages}
              deletedVideos={deletedVideos}
              onDeleteImage={handleToggleDeleteImage}
              onDeleteVideo={handleToggleDeleteVideo}
            />
          </div>
        </Col>

        {/* New Media Section */}
        <Col span={12} className="p-4">
          <div className="h-full p-4 bg-[#F5F9FF] rounded-3xl">
            <p className="text-black font-semibold text-base">
              Hình ảnh, video mới
            </p>
            <div className="h-full mt-2">
              <FileUpload onChange={handleFileUploadChange} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Cancel Confirmation Modal */}
      <Modal
        centered
        open={isModalOpen}
        closable={false}
        footer={
          <div className="w-full flex justify-center mt-5">
            <Button
              className="mr-5"
              type="default"
              size="large"
              onClick={() => setIsModalOpen(false)}
            >
              Quay lại chỉnh sửa
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate(`/results/answer?id=${_id}`)}
            >
              Tiếp tục tìm kiếm
            </Button>
          </div>
        }
      >
        <div className="w-full flex justify-center items-center flex-col">
          <p className="text-lg text-black text-center">
            Bạn có chắc chắn muốn huỷ các thay đổi cho câu trả lời này không?
          </p>
        </div>
      </Modal>
    </Row>
  );
};

export default Edit;
