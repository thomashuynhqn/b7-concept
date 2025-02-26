import {
  faBook,
  faChartLine,
  faCircleMinus,
  faClipboardList,
  faFolderOpen,
  faShieldCat,
  faSpinner,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Popover } from "antd";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UserDashboardProps {
  children?: React.ReactNode;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ children }) => {
  const userTier = localStorage.getItem("tier") || "reader";
  const userName = localStorage.getItem("full_name") || "Guest";
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Logout handler
  const handleLogout = useCallback(() => {
    ["full_name", "user_id", "tier", "email", "username"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/login");
  }, [navigate]);

  // Navigation helper
  const handleNavigation = useCallback(
    (path: string) => navigate(path),
    [navigate]
  );

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-8 py-4">
          <p
            className="text-2xl font-bold text-[#227EFF] cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            Logo
          </p>
          <div className="flex items-center space-x-6">
            {/* Navigation to Topics */}
            <FontAwesomeIcon
              className="text-xl cursor-pointer hover:text-[#1D4ED8] transition"
              icon={faBook}
              onClick={() => handleNavigation("/topic")}
            />
            {/* User Menu */}
            <Popover
              content={
                <UserMenu
                  userName={userName}
                  userTier={userTier}
                  onNavigate={handleNavigation}
                  onLogout={handleLogout}
                />
              }
              placement="bottomRight"
              trigger="click"
              open={isUserMenuOpen}
              onOpenChange={setIsUserMenuOpen}
            >
              <FontAwesomeIcon
                className="text-xl cursor-pointer hover:text-gray-700 transition"
                icon={faUser}
              />
            </Popover>
          </div>
        </div>
        {window.location.pathname !== "/" && (
          <Divider className="bg-gray-300 m-0" />
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col px-6">{children}</main>
    </div>
  );
};

/**
 * User menu component with tier-based navigation items.
 */
const UserMenu = ({
  userName,
  userTier,
  onNavigate,
  onLogout,
}: {
  userName: string;
  userTier: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) => {
  const getMenuItems = useCallback(() => {
    const items: React.ReactNode[] = [];

    if (userTier === "admin") {
      items.push(
        <MenuItem
          key="dashboard"
          onClick={() => onNavigate("/user?tab=dashboard")}
          icon={faChartLine}
          label="Thống kê"
        />,
        <MenuItem
          key="usergroup"
          onClick={() => onNavigate("/user?tab=usergroup")}
          icon={faUserGroup}
          label="Tất cả người dùng"
        />,
        <MenuItem
          key="warehouse"
          onClick={() => onNavigate("/user?tab=warehouse")}
          icon={faFolderOpen}
          label="Kho dữ liệu"
        />,
        <MenuItem
          key="system"
          onClick={() => onNavigate("/user?tab=system")}
          icon={faShieldCat}
          label="Hệ thống"
        />
      );
    }

    if (["admin", "editor"].includes(userTier)) {
      items.push(
        <MenuItem
          key="editorprogress"
          onClick={() => onNavigate("/user?tab=editorprogress")}
          icon={faClipboardList}
          label="Yêu cầu xử lý"
        />
      );
    }

    if (["admin", "writer"].includes(userTier)) {
      items.push(
        <MenuItem
          key="progress"
          onClick={() => onNavigate("/user?tab=progress")}
          icon={faSpinner}
          label="Tiến trình xử lý"
        />
      );
    }

    return items;
  }, [userTier, onNavigate]);

  return (
    <div className="w-56 p-4">
      <div className="font-semibold text-lg text-center mb-3">
        Xin chào, {userName}
      </div>
      <Divider className="bg-gray-200 m-2" />

      <div className="flex flex-col space-y-2">
        <MenuItem
          onClick={() => onNavigate("/user?tab=user")}
          icon={faUser}
          label="Thông tin tài khoản"
        />
        <MenuItem
          onClick={() => onNavigate("/user?tab=question")}
          icon={faBook}
          label="Câu trả lời"
        />
        {getMenuItems()}
      </div>

      <Divider className="bg-gray-200 my-2" />

      <MenuItem
        onClick={onLogout}
        icon={faCircleMinus}
        label="Đăng xuất"
        className="w-full text-red-600 hover:bg-red-100"
        iconClassName="text-red-600" // ✅ Ensures the icon is also red
      />
    </div>
  );
};

/**
 * Reusable menu item component.
 */
const MenuItem = ({
  onClick,
  icon,
  label,
  className = "",
  iconClassName = "", // ✅ Added an extra class for the icon
}: {
  onClick: () => void;
  icon: any;
  label: string;
  className?: string;
  iconClassName?: string; // ✅ Optional extra class for custom icon color
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 text-left p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all ${className}`}
  >
    <FontAwesomeIcon icon={icon} className={`text-base ${iconClassName}`} />{" "}
    {/* ✅ Apply iconClassName */}
    <span>{label}</span>
  </button>
);

export default UserDashboard;
