import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Modal } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import logoIcon from "../../assets/common/logo.png";
import dayuIcon from "../../assets/common/dayu.png";
import "./index.scss";

type Props = {};
interface DropdownItem {
  key: string;
  label: JSX.Element;
}
export default function Index({}: Props) {
  const location = useLocation();
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModle = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    //初始化调用，拿到下拉菜单
    console.log(location.pathname);
    let dropDwonArr = [
      {
        key: "1",
        label: (
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px" }}
            onClick={openModle}
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
    <div className="room-header-container">
      <div className="header-content">
        <div className="header-icon-box">
          <img
            src={logoIcon}
            alt=""
          />
        </div>
        {location.pathname == "/login" ||
        location.pathname == "/register" ||
        location.pathname == "/forget" ? (
          <div className="header-avatar-box"></div>
        ) : (
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
        )}
      </div>
      <Modal
        title="我的云录刻"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="headers-modal"
        footer={null}
      >
        <div className="headers-modal-content">
          <div className="headers-modal-box">
            <div className="headers-box-left">
              <div className="headers-left-top">某某某的个人会议室</div>
              <div className="headers-left-bottom">
                <span>会议ID:89653682</span>
                <span>|</span>
                <span>会议ID:89653682</span>
              </div>
            </div>
            <div className="headers-box-right">
              <img
                src={dayuIcon}
                alt=""
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
