import { Spin } from "antd";
import React from "react";

const Loading: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default Loading;
