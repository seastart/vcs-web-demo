import React, { useState, useEffect } from "react";
import RoomHeaderComponent from "../../components/RoomHeaderComponent";
import ConfirmDialog from "../../components/ConfrimModal"; // 导入上面创建的组件

import topPng from "../../assets/meeting/top-png.png";
import smallGuanShiPin from "../../assets/meeting/guanshipin-small.png";
import smallGuanYuYin from "../../assets/meeting/guanyuyin-small.png";
import smallKaiYuYin from "../../assets/meeting/kaiyuyin-small.png";
import zhankaiIcon from "../../assets/meeting/zhankai.png";
import shouqiIcon from "../../assets/meeting/shouqi.png";
import shipinguan from "../../assets/meetStatus/shipinguan.png";
import yuyinguan from "../../assets/meetStatus/yuyinguan.png";
import shipinkai from "../../assets/meetStatus/shipinkai.png";
import yuyinkai from "../../assets/meetStatus/yuyinkai.png";
import gongxiangIcon from "../../assets/meetStatus/gongxiang.png";
import gongxiangguanIcon from "../../assets/meetStatus/gongxiangguan.png";
import smallyuyinguanIcon from "../../assets/meetStatus/small-yuyinguan.png";
import smallyuyinkaiIcon from "../../assets/meetStatus/small-yuyinkai.png";
import smallshexiangkaiIcon from "../../assets/meetStatus/small-shexiangkai.png";
import smallshexiangguanIcon from "../../assets/meetStatus/small-shexiangguan.png";
import chengyuanIcon from "../../assets/meetStatus/chengyuan.png";
import shezhiIcon from "../../assets/meetStatus/shezhi.png";
import shanchengyuan from "../../assets/meetStatus/shanchengyuan.png";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import type { RadioChangeEvent, MenuProps } from "antd";
import {
  Avatar,
  Button,
  Popover,
  Radio,
  Space,
  Divider,
  message,
  Dropdown,
} from "antd";
import "./index.scss";
type Props = {};

export default function Index({}: Props) {
  const [isClose, setIsClose] = useState(false);
  const [iszhankai, setIsZhanKai] = useState(false);
  const [isYuYin, setIsYuYin] = useState(false);
  const [isSheXiang, setIsSheXiang] = useState(false);
  const [isGongXiang, setIsGongXiang] = useState(true);
  const [isSmallYuYin, setIsSmallYuYin] = useState(false);
  const [isSmallSheXiang, setIsSmallSheXiang] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false); //弹窗的开关
  const [modalTitle, setModalTitle] = useState(""); //弹窗的开关
  const [checkboxLabel, setCheckboxLabel] = useState(""); //弹窗的内容
  const [hover, setHover] = useState(false); //共享屏幕的鼠标移入

  const [isCheck, setIsCheck] = useState(0); //弹窗类型 0全体静音 1解除全体静音 2结束会议 3离开会议 4云录制
  const closeRight = () => {
    const roomLeftBox = document.querySelector(".room-left-box");
    const video = document.querySelector(".video");
    const roomRightBox = document.querySelector(".room-right-box");
    if (!isClose) {
      // 注意这里直接使用了 !isClose
      roomLeftBox?.classList.add("room-left-box-close");
      roomRightBox?.classList.add("room-right-box-close");
      video?.classList.add("video-close");
    } else {
      roomLeftBox?.classList.remove("room-left-box-close");
      roomRightBox?.classList.remove("room-right-box-close");
      video?.classList.remove("video-close");
    }
    setIsClose(!isClose);
  };
  const zhankaiStatus = () => {
    const videoBox = document.querySelector(".video");
    const videoRightBox = document.querySelector(".video-right");
    if (!iszhankai) {
      videoBox?.classList.add("video-hide");
      videoRightBox?.classList.add("video-right-hide");
    } else {
      videoBox?.classList.remove("video-hide");
      videoRightBox?.classList.remove("video-right-hide");
    }
    setIsZhanKai(!iszhankai);
  };
  //底部弹窗值和事件
  const [value, setValue] = useState(1);
  const [valueTwo, setValueTwo] = useState(1);

  const sheXiangChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const sheXiangChangeTwo = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValueTwo(e.target.value);
  };
  //弹窗内容
  //全体静音
  const allMute = () => {
    setModalTitle("所有以及新加入的成员将被静音");
    setCheckboxLabel("允许成员自我解除静音");
    setIsCheck(0);
    setIsDialogVisible(true);
  };
  //全体解除静音
  const allUnMute = () => {
    setModalTitle("解除全体静音");
    setIsCheck(1);
    setCheckboxLabel("您确定解除全体静音吗");
    setIsDialogVisible(true);
  };
  //结束会议
  const overMute = () => {
    setModalTitle("结束会议");
    setIsCheck(2);
    setCheckboxLabel("您确定要结束会议吗");
    setIsDialogVisible(true);
  };
  //弹窗关闭 全体静音 全体解除静音 结束会议
  const handleDialogClose = () => {
    setIsDialogVisible(false); // 关闭弹窗
  };
  //是否允许自我解除静音
  const handleCheckboxChange = (e: boolean) => {
    console.log(e, "1");
  };
  //弹窗确认 全体静音 全体解除静音 结束会议
  const handleConfirm = () => {
    if (isCheck == 0) {
      console.log("执行确认操作");
      message.info({
        content: "已开启全体静音",
        style: {
          marginTop: "40vh",
        },
      });
    }
    // 在这里执行确认后的逻辑
  };
  //顶部气泡弹窗
  const titleContent = (
    <div>
      <p>会话ID: 123456789</p>
      <p>SDK版本: 1.0.32</p>
      <p>匹配版本: 1.0.32</p>
    </div>
  );
  //底部气泡弹窗内容
  const sheXiangContent = (
    <div>
      <div style={{ color: "#999", fontSize: "14px", paddingBottom: "4px" }}>
        选择摄像头
      </div>
      <Radio.Group
        onChange={sheXiangChange}
        value={value}
      >
        <Space direction="vertical">
          <Radio value={1}>摄像头 A</Radio>
          <Radio value={2}>摄像头 B</Radio>
          <Radio value={3}>摄像头 C</Radio>
        </Space>
      </Radio.Group>
      <Divider />
      <div style={{ color: "#999", fontSize: "14px", paddingBottom: "4px" }}>
        选择监控流（RTSP）
      </div>
      <Radio.Group
        onChange={sheXiangChangeTwo}
        value={valueTwo}
      >
        <Space direction="vertical">
          <Radio value={1}>监控流 A</Radio>
          <Radio value={2}>监控流 B</Radio>
          <Radio value={3}>监控流 C</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
  const yuYinContent = (
    <div>
      <div style={{ color: "#999", fontSize: "14px", paddingBottom: "4px" }}>
        选择摄像头
      </div>
      <Radio.Group
        onChange={sheXiangChange}
        value={value}
      >
        <Space direction="vertical">
          <Radio value={1}>摄像头 A</Radio>
          <Radio value={2}>摄像头 B</Radio>
          <Radio value={3}>摄像头 C</Radio>
        </Space>
      </Radio.Group>
      <Divider />
      <div style={{ color: "#999", fontSize: "14px", paddingBottom: "4px" }}>
        选择监控流（RTSP）
      </div>
      <Radio.Group
        onChange={sheXiangChangeTwo}
        value={valueTwo}
      >
        <Space direction="vertical">
          <Radio value={1}>监控流 A</Radio>
          <Radio value={2}>监控流 B</Radio>
          <Radio value={3}>监控流 C</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "14px" }}
          // onClick={openModle}
        >
          共享屏幕
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
          共享电子白板
        </a>
      ),
    },
  ];
  return (
    <div className="room-container">
      <RoomHeaderComponent />
      <div className="room-content">
        <div className="room-left-box">
          <div className="left-top">
            <Popover
              placement="bottomLeft"
              content={titleContent}
              trigger="hover"
              overlayClassName="top-pvpover"
            >
              <img
                src={topPng}
                alt=""
                className="top-left-img"
              />
            </Popover>
            <div className="left-top-text">会议ID：6666666666</div>
          </div>
          <div className="video-box">
            <div className="video">
              <div className="video-box-flex">
                <div className="video-avatar">
                  <Avatar
                    icon={<UserOutlined />}
                    size={100}
                  />
                </div>
                <div className="video-icon-box">
                  <img
                    src={smallGuanShiPin}
                    alt=""
                  />
                  <img
                    src={smallGuanYuYin}
                    alt=""
                  />
                  <span>赵大刀</span>
                </div>
              </div>
              <div
                className="video-shou"
                onClick={zhankaiStatus}
              >
                {!iszhankai ? (
                  <img
                    src={zhankaiIcon}
                    alt=""
                  />
                ) : (
                  <img
                    src={shouqiIcon}
                    alt=""
                  />
                )}
              </div>
            </div>
            {/* <video className="video"></video> */}
            <div className="video-right">
              <div className="video-right-box">
                <div className="video-right-time">
                  <div className="item-avatar">
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                    />
                  </div>
                  <div className="item-right-bottom">
                    <img
                      src={smallKaiYuYin}
                      alt=""
                    />
                    <span>健健</span>
                  </div>
                </div>
                <div className="video-right-time">
                  <div className="item-avatar">
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                    />
                  </div>
                  <div className="item-right-bottom">
                    <img
                      src={smallKaiYuYin}
                      alt=""
                    />
                    <span>健健</span>
                  </div>
                </div>
                <div className="video-right-time">
                  <div className="item-avatar">
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                    />
                  </div>
                  <div className="item-right-bottom">
                    <img
                      src={smallKaiYuYin}
                      alt=""
                    />
                    <span>健健</span>
                  </div>
                </div>
                <div className="video-right-time">
                  <div className="item-avatar">
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                    />
                  </div>
                  <div className="item-right-bottom">
                    <img
                      src={smallKaiYuYin}
                      alt=""
                    />
                    <span>健健</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="room-left-bottom">
            <div className="left-bottom-left">
              <div className="red-point"></div>
              <div className="left-point-text">01:12:29</div>
            </div>
            <div className="left-bottom-moddle">
              {isYuYin ? (
                <div className="img-box-bottom">
                  <img
                    src={yuyinkai}
                    alt=""
                  />
                  <div>静音</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={yuyinguan}
                    alt=""
                  />
                  <div>解除静音</div>
                </div>
              )}
              <Popover content={yuYinContent}>
                <DownOutlined
                  size={6}
                  style={{ marginTop: "-20px", marginLeft: "-10px" }}
                />
              </Popover>
              {isSheXiang ? (
                <div className="img-box-bottom">
                  <img
                    src={shipinkai}
                    alt=""
                  />
                  <div>关闭视频</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={shipinguan}
                    alt=""
                  />
                  <div>开启视频</div>
                </div>
              )}
              <Popover content={sheXiangContent}>
                <DownOutlined
                  size={6}
                  style={{ marginTop: "-20px", marginLeft: "-10px" }}
                />
              </Popover>
              {isGongXiang ? (
                <div className="img-box-bottom">
                  <img
                    src={gongxiangIcon}
                    alt=""
                  />
                  <div>屏幕共享</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={gongxiangguanIcon}
                    alt=""
                  />
                  <div>停止共享</div>
                </div>
              )}
              <Dropdown
                menu={{ items }}
                placement="top"
                arrow
                overlayClassName="room-dropdown"
              >
                <DownOutlined
                  size={6}
                  style={{ marginTop: "-20px", marginLeft: "-10px" }}
                />
              </Dropdown>
              <div className="img-box-bottom">
                <img
                  src={chengyuanIcon}
                  alt=""
                />
                <div>成员(3人)</div>
              </div>
              <div className="img-box-bottom">
                <img
                  src={shezhiIcon}
                  alt=""
                />
                <div>设置</div>
              </div>
            </div>

            <Button
              className="left-bottom-right"
              type="primary"
              onClick={overMute}
            >
              结束会议
            </Button>
          </div>
        </div>
        <div className="room-right-box">
          <div className="room-right-top">
            <div className="right-top-text">参会人员</div>
            <div
              className="right-top-close"
              onClick={closeRight}
            >
              x
            </div>
          </div>
          <div className="room-right-content">
            <div className="right-name-box">
              <Avatar
                icon={<UserOutlined />}
                size={40}
              />
              <div className="right-name">
                <div className="name-top">健健</div>
                {/* <div className="name-bottom">12</div> */}
              </div>
              <div className="right-icon">
                {isSmallYuYin ? (
                  <img
                    src={smallyuyinkaiIcon}
                    alt=""
                  />
                ) : (
                  <img
                    src={smallyuyinguanIcon}
                    alt=""
                  />
                )}
                {isSmallSheXiang ? (
                  <img
                    src={smallshexiangkaiIcon}
                    alt=""
                  />
                ) : (
                  <img
                    src={smallshexiangguanIcon}
                    alt=""
                  />
                )}
                {/* <img
                  src={shanchengyuan}
                  alt=""
                /> */}
              </div>
            </div>
          </div>
          {isAdmin && !isClose ? (
            <div className="room-right-bottom">
              <Button
                className="right-bottom-button"
                onClick={allMute}
              >
                全体静音
              </Button>
              <Button
                className="right-bottom-button"
                onClick={allUnMute}
              >
                解除全体静音
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        isVisible={isDialogVisible}
        onClose={handleDialogClose}
        onConfirm={handleConfirm}
        checkboxLabel={checkboxLabel}
        isCheck={isCheck}
        modalTitle={modalTitle}
        onCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
}
