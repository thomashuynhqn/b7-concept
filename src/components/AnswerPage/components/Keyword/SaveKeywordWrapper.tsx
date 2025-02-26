import { Button, Col, Row } from "antd";
import React from "react";

const fakeData = [
  {
    id: 1,
    title: "Google là gì ?",
  },
  {
    id: 2,
    title: "Làm thế nào để chơi vui hơn ?",
  },
  {
    id: 3,
    title: "Đi đây đi đó có gì hay ?",
  },
  {
    id: 4,
    title: "Nhậu nhẹt có tốt không ?",
  },
  {
    id: 5,
    title: "Thú cưng nên chọn nuôi loài nào ?",
  },
  {
    id: 6,
    title: "Xe hơi được nhiều người dùng nhất ?",
  },
  {
    id: 7,
    title: "Công nghệ có gì đổi mới ?",
  },
];

interface Data {
  id: number;
  title: string;
}

interface WarpCardProps {
  data: Data;
}

const WarpCard: React.FC<WarpCardProps> = ({ data }) => {
  return (
    <Row className="h-auto w-full mt-3">
      <Col span={24}>
        <div className="w-full flex flex-row justify-between items-center border-b border-b-[#BFBFBF] pb-3">
          <p className="text-base font-medium text-[#000000]">{data.title}</p>
          <div>
            <Button size="middle" type="default" className="text-base">
              Xoá
            </Button>
            <Button size="middle" type="primary" className="ml-3 text-base">
              Xem
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

const WarpSaveKeywordScreen: React.FC = () => {
  return (
    <div className="w-full h-[90%] flex flex-col mb-20">
      <div className="h-full overflow-auto">
        {fakeData.map((item, index) => (
          <WarpCard key={index} data={item} />
        ))}
      </div>
    </div>
  );
};

export default WarpSaveKeywordScreen;
