import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, message, Upload, UploadProps } from "antd";
import TextEditor from "../../../../../utils/RichTextEditor/Editor";

interface AddTopicProps {
  setAddTopic: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  style: { backgroundColor: "#F5F9FF" },
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const AddTopic: React.FC<AddTopicProps> = ({ setAddTopic }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col mb-8">
        <p className="mb-2 font-bold text-base">Tên chủ đề</p>
        <Input
          size="large"
          className="p-5"
          style={{ borderRadius: 24 }}
          placeholder="Tên topic là..."
        />
      </div>

      <div className="flex flex-row w-full h-3/4">
        <div className="w-[63%] mr-[2%]">
          <p className="text-base font-bold mb-4">Nội dung chủ đề</p>
          <div className="bg-white h-4/5 rounded-3xl px-5 pt-5">
            <TextEditor
              toolbarWidth="45%"
              editorHeight="40dvh"
              defaultValue={""}
            />
          </div>
        </div>
        <div className="w-[35%]">
          <p className="text-base font-bold mb-4">Hình ảnh, video liên quan</p>
          <div className="h-4/5 rounded-3xl">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <FontAwesomeIcon
                  icon={faArrowUpFromBracket}
                  size="3x"
                  color="#BFBFBF"
                />
              </p>
              <p className="ant-upload-hint">
                Kéo thả hoặc <b className="text-[#227EFF]">Chọn file</b> để tải
                hình ảnh, video
              </p>
              <p className="ant-upload-hint">
                (Lưu ý: dung lượng ảnh không quá 5MB, video không quá 300MB)
              </p>
            </Dragger>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end mt-[-17px]">
        <Button
          type="default"
          style={{ color: "#227EFF", borderColor: "#227EFF" }}
          onClick={() => setAddTopic(false)}
        >
          Huỷ chỉnh sửa
        </Button>
        <Button className="ml-10" type="primary">
          Lưu chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default AddTopic;
