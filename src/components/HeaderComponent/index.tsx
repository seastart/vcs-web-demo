import React, { useState, useEffect } from "react";
import "./index.scss";
import type { MenuProps } from "antd";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
type Props = {};
interface DropdownItem {
  key: string;
  label: JSX.Element;
}
export default function Index({}: Props) {
  const [items, setItems] = useState<MenuProps["items"]>([]);
  useEffect(() => {
    //初始化调用，拿到下拉菜单
    let dropDwonArr = [
      {
        key: "1",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px" }}
          >
            我的云录刻
          </a>
        ),
      },
      {
        key: "2",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px", textAlign: "center" }}
          >
            退出登录
          </a>
        ),
      },
    ];
    setItems(dropDwonArr);
  }, []);
  return (
    <div className="header-container">
      <div className="header-content">
        <div className="header-icon-box">1</div>
        <div className="header-avatar-box">
          <div className="avatar">
            <Avatar icon={<UserOutlined />} />
          </div>
          <div className="avatar-name">用户123456</div>

          <div className="avatar-dropdown">
            <Dropdown
              menu={{ items }}
              className="drop-class"
            >
              <DownOutlined style={{ width: "9px", height: "6px" }} />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
