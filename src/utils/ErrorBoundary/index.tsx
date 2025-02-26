import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-1/4 flex flex-col text-center">
        <p className="text-[190px] text-[#BFBFBF] font-black">404</p>
        <p className="mb-2 mt-[-40px] text-black text-xl font-bold">
          Không tìm thấy trang :(
        </p>
        <p className="mb-20 text-[#808080] text-sm font-thin">
          Đừng lo lắng ! Một số thay đổi từ chúng tôi có thể dẫn đến hiển thị
          này. Chúng tôi sẽ sớm khắc phục, mong điều này sẽ không ảnh hưởng đến
          việc tìm kiếm thông tin của bạn.
        </p>
      </div>
      <Button type="primary" onClick={() => navigate("/")}>
        Tiếp tục tìm kiếm
      </Button>
    </div>
  );
};

export default ErrorScreen;
