import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Modal, message } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import logoIcon from "../../assets/common/logo.png";
import dayuIcon from "../../assets/common/dayu.png";
import "./index.scss";
import { VCSContext } from "../../VCSContext";
import { useSelector } from "react-redux";

type Props = {};
interface DropdownItem {
  key: string;
  label: JSX.Element;
}
export default function Index({}: Props) {
  const vcs = useSelector((state: any) => state.vcsClient);
  console.log(vcs, "111");
  const location = useLocation();
  const history = useHistory();
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
  const loginOut = () => {
    console.log(vcs);
    vcs
      .logout()
      .then((res: any) => {
        console.log(res, "退出登录");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("nickname");
        message.success("退出登录成功");
        history.replace("/login");
      })
      .catch((err: any) => {
        console.log(err, "退出登录报错");
      });
  };
  useEffect(() => {
    console.log(111);
    //初始化调用，拿到下拉菜单
    //avatar
    console.log(sessionStorage.getItem("token"));
    if (sessionStorage.getItem("token")) {
      vcs
        .loginByToken(sessionStorage.getItem("token"))
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
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
            onClick={loginOut}
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
            <div className="avatar-name">
              {sessionStorage.getItem("nickname")
                ? sessionStorage.getItem("nickname")
                : ""}
            </div>

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
