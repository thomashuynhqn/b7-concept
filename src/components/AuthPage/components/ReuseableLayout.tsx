import React, { useState, useEffect, useRef } from "react";

type ReusableLayoutProps = {
  children: React.ReactNode;
};

const ReusableLayout: React.FC<ReusableLayoutProps> = ({ children }) => {
  const [boxHeight, setBoxHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const computedStyle = window.getComputedStyle(contentRef.current);
        const padding =
          parseInt(computedStyle.paddingTop || "0", 10) +
          parseInt(computedStyle.paddingBottom || "0", 10);

        // Add extra space to ensure no clipping
        const newHeight = contentRef.current.scrollHeight + padding + 60; // Extra height for smooth display
        setBoxHeight(newHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      if (contentRef.current) resizeObserver.unobserve(contentRef.current);
    };
  }, [children]);

  return (
    <div className="w-screen h-screen flex relative bg-[#1C1E26]">
      {/* Left Section: Dark Background */}
      <div className="w-2/3 h-full"></div>

      {/* Right Section: White Background */}
      <div className="w-1/3 h-full bg-white relative">
        {/* Logo Positioned in the Top-Right */}
        <p
          className="absolute top-5 right-5 text-[#227EFF] font-bold text-xl cursor-pointer"
          onClick={() => console.log("Logo clicked")}
        >
          Logo
        </p>
      </div>

      {/* Centered Form Box */}
      <div
        className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-lg transition-all duration-300"
        style={{
          width: "420px", // Balanced width for compact forms
          maxWidth: "90%",
          height: boxHeight ? `${boxHeight}px` : "auto", // Smooth height adjustment
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)", // Softer shadow
          padding: "32px",
          overflow: "hidden", // Prevent temporary clipping during height change
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};

export default ReusableLayout;
