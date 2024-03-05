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
import { Button, Input, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setRoom } from "../../actions/roomActions";
import { setYuYin } from "../../actions/yuyinActions";
import { setSheXiang } from "../../actions/shexiangActions";
import { store } from "../../store/store";

type Props = {};

export default function Index({}: Props) {
  const dispatch = useDispatch();

  const history = useHistory();
  const vcs = useSelector((state: any) => state.vcs.vcsClient);
  console.log(vcs, "vcs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheXiang, setIsSheXiang] = useState(false);
  const [isYuYin, setIsyuyin] = useState(true);
  const [isShengYin, setIsShengYin] = useState(true);
  const [isMeetingStatus, setIsMeetingStatus] = useState(0);
  const [meetId, setMeetId] = useState("");
  const [meetName, setMeetName] = useState<any>("");
  const [pasName, setPasName] = useState<any>("");
  let meetingStatus = "1";
  useEffect(() => {
    //初始值记住加入会议状态
    if (!sessionStorage.getItem("joinYuyin")) {
      sessionStorage.setItem("joinYuyin", "1");
    }
    if (!sessionStorage.getItem("openYuyin")) {
      sessionStorage.setItem("openYuyin", "1");
    }

    if (!sessionStorage.getItem("joinShexiang")) {
      sessionStorage.setItem("joinShexiang", "0");
    }
    if (!sessionStorage.getItem("openShexiang")) {
      sessionStorage.setItem("openShexiang", "0");
    }

    if (sessionStorage.getItem("token")) {
    } else {
      history.replace("/login");
    }
    //密码默认值
    sessionStorage.setItem("password", "");
    //姓名传入
    let nickname = sessionStorage.getItem("nickname");
    setMeetName(nickname);
    console.log(sessionStorage.getItem("nickname"));
  }, []);
  const handleOk = () => {
    // setIsModalOpen(false);
    sessionStorage.removeItem("options");
    sessionStorage.removeItem("isSheXiang");
    sessionStorage.removeItem("isYuYin");
    sessionStorage.removeItem("isYuYinStatus");
    store.dispatch(setYuYin(isYuYin));
    store.dispatch(setSheXiang(isSheXiang));

    if (meetId == "") {
      message.info("会议ID不能为空");
      return;
    }
    if (meetName == "") {
      message.info("用户名称不能为空");
      return;
    }
    if (isMeetingStatus !== 0) {
      // vcs
      //   .enterRoom({ room_no: meetId })
      //   .then((room: any) => {
      //     console.log(room, "room");
      //     //修改昵称
      //     room.updateAccount({ nickname: meetName });
      //   })
      //   .catch((err: any) => {
      //     console.log(err, "err");
      //   });
      history.push(`/room?id=${meetId}&name=${meetName}`);
    } else {
      vcs
        .createConference({
          type: 1,
          duration: 1800,
          title: meetId,
        })
        .then((res: any) => {
          console.log(res, "即时会议res");
          history.push(`/room?id=${res.data.room.no}&name=${meetName}`);
        })
        .catch((err: any) => {
          message.info(err.message);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMeetId("");
    setPasName("");
    // setMeetName("");
  };
  const oepnModals = () => {
    setIsMeetingStatus(0);
    meetingStatus = "0";
    if (sessionStorage.getItem("openYuyin") === "1") {
      setIsyuyin(true);
    } else {
      setIsyuyin(false);
    }
    if (sessionStorage.getItem("openShexiang") === "1") {
      setIsSheXiang(true);
    } else {
      setIsSheXiang(false);
    }

    let nickname = sessionStorage.getItem("nickname");
    setMeetName(nickname);

    setMeetId(nickname! + "的会议");
    setIsModalOpen(true);
  };
  const JoinModals = () => {
    setIsMeetingStatus(1);
    meetingStatus = "1";
    if (sessionStorage.getItem("joinYuyin") === "1") {
      setIsyuyin(true);
    } else {
      setIsyuyin(false);
    }
    if (sessionStorage.getItem("joinShexiang") === "1") {
      setIsSheXiang(true);
    } else {
      setIsSheXiang(false);
    }
    // if (sessionStorage.getItem("isSheXiangs")) {
    //   let shexiang = sessionStorage.getItem("isSheXiangs");
    //   if (shexiang == "0") {
    //     console.log(111);
    //     setIsSheXiang(false);
    //   } else {
    //     setIsSheXiang(true);
    //   }
    // }
    // if (sessionStorage.getItem("isYuYinStatus")) {
    //   let yuyin = sessionStorage.getItem("isYuYinStatus");
    //   if (yuyin == "0") {
    //     console.log(111);
    //     setIsyuyin(false);
    //   } else {
    //     setIsyuyin(true);
    //   }
    // }
    if (sessionStorage.getItem("ids")) {
      setMeetId(sessionStorage.getItem("ids") as any);
    }
    let nickname = sessionStorage.getItem("nickname");
    setMeetName(nickname);
    setIsModalOpen(true);
  };
  const yuyinStatus = () => {
    setIsyuyin(!isYuYin);
    console.log(isYuYin, "isYuYin");

    // setState异步,所以这个拿到的值是上一次的，所以反着判断 1是开启 0是关闭
    //判断是即时会议还是加入会议
    if (isMeetingStatus == 1) {
      if (!isYuYin) {
        sessionStorage.setItem("joinYuyin", "1");
      } else {
        sessionStorage.setItem("joinYuyin", "0");
      }
    } else {
      //此处是即时会议
      if (!isYuYin) {
        sessionStorage.setItem("openYuyin", "1");
      } else {
        sessionStorage.setItem("openYuyin", "0");
      }
    }
  };
  const shexiangStatus = () => {
    setIsSheXiang(!isSheXiang);
    if (isMeetingStatus == 1) {
      if (!isSheXiang) {
        sessionStorage.setItem("joinShexiang", "1");
      } else {
        sessionStorage.setItem("joinShexiang", "0");
      }
    } else {
      //此处是即时会议
      if (!isSheXiang) {
        sessionStorage.setItem("openShexiang", "1");
      } else {
        sessionStorage.setItem("openShexiang", "0");
      }
    }
  };
  const idChange = (e: any) => {
    setMeetId(e.target.value);
  };
  const nameChange = (e: any) => {
    setMeetName(e.target.value);
  };
  const pasChange = (e: any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPasName(e.target.value);
      sessionStorage.setItem("password", value);
    } else {
      // message.info("请输入4位数字");
    }
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
          <div className="modal-input-title">
            {isMeetingStatus == 0 ? "会议名称" : "会议ID"}
          </div>
          <Input
            placeholder="请输入会议ID"
            className="modal-input"
            onChange={idChange}
            value={meetId}
          />
          <div className="modal-input-title">您的姓名</div>
          <Input
            placeholder="请输入您的姓名"
            className="modal-input"
            allowClear
            onChange={nameChange}
            value={meetName}
          />
          {isMeetingStatus == 0 ? null : (
            <div>
              <div className="modal-input-title">密码</div>
              <Input.Password
                placeholder="请输入4位数字(非必填)"
                className="modal-input"
                allowClear
                onChange={pasChange}
                value={pasName}
              />
            </div>
          )}
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
