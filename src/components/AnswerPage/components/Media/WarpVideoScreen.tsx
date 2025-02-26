import { Col, Row } from "antd";
import React from "react";

const fakeData = [
  {
    id: 1,
    link: "https://youtu.be/FVVdcLqxEZY",
  },
  {
    id: 2,
    link: "https://youtu.be/DUwx3IdXupU",
  },
  {
    id: 3,
    link: "https://youtu.be/ZIgDYEZl1VE",
  },
  {
    id: 4,
    link: "https://youtu.be/8Fy_3TEh5_0",
  },
  {
    id: 5,
    link: "https://youtu.be/GQ-toR8F7rc",
  },
  {
    id: 6,
    link: "https://youtu.be/7q9tcbB7ocg?t=1",
  },
];

interface Data {
  id: number;
  link: string;
}

interface WarpCardProps {
  data: Data;
}

const WarpCard: React.FC<WarpCardProps> = ({ data }) => {
  return (
    <Row gutter={16} className="mb-5 w-full">
      <Col span={24}>
        <video
          className="rounded-3xl"
          controls
          preload="auto"
          width="100%"
          autoPlay
        >
          <source src={data.link} type="video/mp4" />
        </video>
      </Col>
    </Row>
  );
};

const WrapVideoScreen: React.FC = () => {
  return (
    <div className="h-[70vh] w-full overflow-y-auto overflow-x-hidden">
      <Row gutter={16}>
        {fakeData.map((item, index) => (
          <Col span={24} key={index}>
            <WarpCard data={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default WrapVideoScreen;
