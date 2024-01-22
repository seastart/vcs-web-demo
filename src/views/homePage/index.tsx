import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import { useHistory } from "react-router-dom";
import "./index.scss";
import jishiIcon from "../../assets/common/home-page-jishi.png";
import jiaruIcon from "../../assets/common/home-page-jiaru.png";
import shexiangguan from "../../assets/meeting/shexiangguan.png";
import shengyinguan from "../../assets/meeting/shengyinguan.png";
import yuyinguan from "../../assets/meeting/yuyinguan.png";
import shexiangkai from "../../assets/meeting/shexiangkai.png";
import shengyinkai from "../../assets/meeting/shengyinkai.png";
import yuyinkai from "../../assets/meeting/yuyinkai.png";
import { Button, Input, Modal } from "antd";
type Props = {};

export default function Index({}: Props) {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheXiang, setIsSheXiang] = useState(false);
  const [isYuYin, setIsyuyin] = useState(false);
  const [isShengYin, setIsShengYin] = useState(false);
  const [isMeetingStatus, setIsMeetingStatus] = useState(0);
  const handleOk = () => {
    setIsModalOpen(false);
    history.push("/room");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const oepnModals = () => {
    setIsMeetingStatus(0);
    setIsModalOpen(true);
  };
  const JoinModals = () => {
    setIsMeetingStatus(1);
    setIsModalOpen(true);
  };
  const yuyinStatus = () => {
    setIsyuyin(!isYuYin);
  };
  const shengyinStatus = () => {
    setIsShengYin(!isShengYin);
  };
  const shexiangStatus = () => {
    setIsSheXiang(!isSheXiang);
  };
  return (
    <div className="home-page-container">
      <HeaderComponent />
      <div className="home-page-content">
        {/* 盒子 */}
        <div
          className="home-page-box"
          onClick={oepnModals}
        >
          <div className="home-page-img">
            <img src={jishiIcon} />
          </div>
          <div className="home-page-name">即时会议</div>
        </div>
        <div
          className="home-page-box"
          onClick={JoinModals}
        >
          <div className="home-page-img">
            <img src={jiaruIcon} />
          </div>
          <div className="home-page-name">加入会议</div>
        </div>
      </div>
      {/* 会议的弹窗 */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered={true}
        className="open-modal-style"
        style={{ borderRadius: "16px 16px 16px 16px" }}
      >
        <div className="modal-content">
          <div className="modal-title">
            {isMeetingStatus == 0 ? "即时会议" : "加入会议"}
          </div>
          <div className="modal-input-title">会议ID</div>
          <Input
            placeholder="请输入会议ID"
            className="modal-input"
          />
          <div className="modal-input-title">您的姓名</div>
          <Input
            placeholder="请输入您的姓名"
            className="modal-input"
            allowClear
          />
          <div className="modal-icon-box">
            <div className="modal-icon-name-box">
              {!isYuYin ? (
                <>
                  <img
                    src={yuyinguan}
                    alt=""
                    className="modal-icons"
                    onClick={yuyinStatus}
                  />
                  <div className="modal-icon-title">关闭麦克风</div>
                </>
              ) : (
                <>
                  <img
                    src={yuyinkai}
                    alt=""
                    className="modal-icons"
                    onClick={yuyinStatus}
                  />
                  <div className="modal-icon-title">开启麦克风</div>
                </>
              )}
            </div>
            <div className="modal-icon-name-box">
              {!isSheXiang ? (
                <>
                  <img
                    src={shexiangguan}
                    alt=""
                    className="modal-icons"
                    onClick={shexiangStatus}
                  />
                  <div className="modal-icon-title">关闭摄像头</div>
                </>
              ) : (
                <>
                  <img
                    src={shexiangkai}
                    alt=""
                    className="modal-icons"
                    onClick={shexiangStatus}
                  />
                  <div className="modal-icon-title">开启摄像头</div>
                </>
              )}
            </div>
            <div className="modal-icon-name-box">
              {!isShengYin ? (
                <>
                  <img
                    src={shengyinguan}
                    alt=""
                    className="modal-icons"
                    onClick={shengyinStatus}
                  />
                  <div className="modal-icon-title">关闭扬声器</div>
                </>
              ) : (
                <>
                  <img
                    src={shengyinkai}
                    alt=""
                    className="modal-icons"
                    onClick={shengyinStatus}
                  />
                  <div className="modal-icon-title">开启扬声器</div>
                </>
              )}
            </div>
          </div>
          <div className="modal-btn-box">
            <Button
              className="modal-btn-left"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="modal-btn-right"
              type="primary"
              onClick={handleOk}
            >
              确定
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
