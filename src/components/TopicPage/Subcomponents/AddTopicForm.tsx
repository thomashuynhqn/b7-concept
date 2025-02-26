import { faArrowUpFromBracket, faCheck, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Input, message, Modal, Row, Upload, UploadProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../../utils/RichTextEditor/Editor";

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const AddTopic: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/topic')
  }

  return (
    <div className="w-full h-full flex flex-col bg-white mt-10">
        <Row gutter={16} className="mb-10">
            <Col span={12}>
                <p className="text-3xl font-bold">Tạo chủ đề mới</p>
            </Col>
            <Col span={12} className="flex flex-row justify-end">
                <Col>
                    <Button style={{color:'#227EFF', borderColor:'#227EFF'}} size="middle" onClick={handleClick}>Huỷ chỉnh sửa</Button>
                </Col>
                <Col>
                    <Button type="primary" size="middle" onClick={() => setOpen(true)}>Lưu chỉnh sửa</Button>
                      <Modal
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        footer={false}
                        closable={false}
                        keyboard={false}
                       >
                         <div className="h-full w-full flex flex-col justify-center items-center">
                          <FontAwesomeIcon icon={faCheck} className="text-6xl mb-5 text-[#227EFF]"/>
                           <p className="text-3xl font-medium">Lưu thành công !</p>
                           <p className="text-center mb-5">Thay đổi của bạn đang được chúng tôi xử lý,  theo dõi tiến trình xử lý câu trả lời tại "Tài khoản {'>'} Tiến trình xử lý</p>
                           <Button type="primary" size="large" onClick={handleClick}>Tiếp tục tìm kiếm</Button>
                          </div>
                       </Modal>  
                </Col>
            </Col>
        </Row>
        <Row>
            <p className="text-lg font-medium mb-2">Tên chủ đề</p>
            <Col span={24}>
                <Input 
                    placeholder="Tên topic là..."
                    size="large"
                    className="rounded-3xl p-4 border-[#BFBFBF] border-1 mb-7"
                />
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={16}>
                <p className="text-lg font-medium mb-2">Nội dung chủ đề</p>
                <div className="border h-full px-5 pt-5 rounded-3xl">
                  <TextEditor toolbarWidth={'30%'} editorHeight='45dvh' defaultValue={""} />
                  <FontAwesomeIcon icon={faFlag} className="absolute top-[68px] right-10 text-xl text-[#595959]"/>
                </div>
            </Col>
            <Col span={8}>
                <p className="text-lg font-medium mb-2">Hình ảnh, video liên quan</p>
                <div className="w-full h-full border-dashed border-0 border-[#BFBFBF] rounded-3xl">
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                    <FontAwesomeIcon icon={faArrowUpFromBracket} size="3x" color='#BFBFBF' />
                    </p>
                    <p className="ant-upload-hint">Kéo thả hoặc <b className="text-[#227EFF]">Chọn file</b> để tải hình ảnh, video</p>
                    <p className="ant-upload-hint">
                        (Lưu ý: dung lượng ảnh không quá 5MB, video không quá 300MB)
                    </p>
                </Dragger>
                </div>
            </Col>
        </Row>
    </div>
  );
};

export default AddTopic;
