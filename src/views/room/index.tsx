import React, { useState, useEffect, useCallback } from "react";
import RoomHeaderComponent from "../../components/RoomHeaderComponent";
import ConfirmDialog from "../../components/ConfrimModal"; // 导入上面创建的组件
import { useHistory, useLocation } from "react-router-dom";

import topPng from "../../assets/meeting/top-png.png";
import smallGuanShiPin from "../../assets/meeting/guanshipin-small.png";
import smallGuanYuYin from "../../assets/meeting/guanyuyin-small.png";
import smallKaiYuYin from "../../assets/meeting/kaiyuyin-small.png";
import zhankaiIcon from "../../assets/meeting/zhankai.png";
import shouqiIcon from "../../assets/meeting/shouqi.png";
import topIcon from "../../assets/meeting/top.png";
import bottomIcon from "../../assets/meeting/bottom.png";
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
import { useSelector } from "react-redux";
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
  //全局
  const history = useHistory();
  const vcs = useSelector((state: any) => state.vcs.vcsClient); //传入的vcs
  const isYuyin = useSelector((state: any) => state.yuyin.yuyin); //传入的麦克风状态
  const isSheXiangStatus = useSelector((state: any) => state.shexiang.shexiang); //传入的摄像头状态
  console.log(isYuyin, "麦克风是否开启");
  console.log(isSheXiangStatus, "摄像头是否开启");
  // const room = useSelector((state: any) => state.room.room); //传入的房间信息，在homePage页面进入会议时传入
  //state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const nickname = queryParams.get("name");
  const [isClose, setIsClose] = useState(false);
  const [rooms, setRooms] = useState<any>(null);
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
  const [data, setData] = useState<any>([]); //维护成员列表以及各种信息
  // const [val, setVal] = useState<any>([]); //维护成员触发
  // const [overId, setOverId] = useState<any>([]); //维护成员触发
  //成员小窗口的部分逻辑
  const [displayIndex, setDisplayIndex] = useState(0); // 从第0位开始显示，因为第一位始终显示
  const [displayedMembers, setDisplayedMembers] = useState<any>([]); // 从第0位开始显示，因为第一位始终显示
  const MAX_DISPLAY = 4; // 最多展示的成员数
  const MAX_DISPLAY_EXCEPT_FIRST = 3; // 定义最大显示数量，减去始终显示的第一个成员
  const [selectedId, setSelectedId] = useState<any>(null); //选中小窗口的唯一标识
  const [selectedData, setSelectedData] = useState<any>([]); //选中小窗口的数组，大窗口的展示
  const [audioinput, setAudioinput] = useState<any>([]); //枚举音频
  const [videoinput, setVideoinput] = useState<any>([]); //枚举视频
  //视频播放
  const [isVideoVisible, setIsVideoVisible] = useState<any>(true); // 控制Video视频盒子是否可见
  const [ss, setss] = useState<any>({}); // 存储摄像头s对象

  useEffect(() => {
    // console.log(room, "room!!");
    // vcs.loginByToken({});
    //初始化自己的麦克风摄像头状态
    setIsYuYin(isYuyin);
    setIsSheXiang(isSheXiangStatus);

    //初始化加载一遍麦克风设备
    vcs.enumDevices().then((res: any) => {
      console.log(res, "枚举设备");
      let audioOutputDevices = res.filter(
        (res: any) => res.kind === "audiooutput"
      );
      audioOutputDevices;

      setAudioinput(audioOutputDevices);
      console.log(audioOutputDevices);
    });
    //初始化加载一遍摄像头设备
    vcs.enumDevices().then((res: any) => {
      console.log(res, "枚举设备");
      let audioOutputDevices = res.filter(
        (res: any) => res.kind === "videoinput"
      );
      setValueTwo(audioOutputDevices[0].id);
      setVideoinput(audioOutputDevices);
      console.log(audioOutputDevices);
    });
    console.log(nickname);
    if (sessionStorage.getItem("token")) {
      vcs
        .loginByToken(sessionStorage.getItem("token"))
        .then((res: any) => {
          console.log(res);
          let option = sessionStorage.getItem("options");
          if (option) {
            resumeRoom(JSON.parse(option));
          } else {
            onEnterRoom();
          }
        })
        .catch((err: any) => {
          console.log(err);
          let option = sessionStorage.getItem("options");
          console.log(option, "11111111122222222222222");
          if (option) {
            resumeRoom(JSON.parse(option));
          } else {
            onEnterRoom();
          }
        });
    }
  }, []);
  //新增成员维护列表
  // 初始化时设置当前用户
  useEffect(() => {
    let ids = JSON.parse(sessionStorage.getItem("options") || "{}");
    let mine = {
      nickname: nickname,
      avatar: sessionStorage.getItem("avatar") || null,
      id: ids.account?.id || null,
    };

    // 将当前用户添加到成员列表
    setData([mine]);
    setSelectedId(mine.id); // 设置选中成员的 ID
    setSelectedData(mine);
  }, [nickname]); // 依赖项是nickname
  // 当 displayIndex 改变时，更新 displayedMembers 状态

  const resumeRoom = (option: any) => {
    vcs
      .resumeRoom(option)
      .then((room: any) => {
        console.log(room, "room");
        // store.dispatch(setRoom(room));
        //修改昵称
        setRooms(room);
        onAfterEnterRoom(room);
      })
      .catch((err: any) => {
        console.log(err, "err");
        message.error(err.message);
      });
  };
  const onEnterRoom = () => {
    vcs
      .enterRoom({ room_no: id })
      .then((room: any) => {
        console.log(room, "room");
        // store.dispatch(setRoom(room));
        //修改昵称
        room.updateAccount({ nickname }, true);
        if (isSheXiangStatus) {
          room.openVideo({}).then((s: any) => {
            //开始推流
            setss(s);
            rooms.updateAccount({ video_state: 1 }, true);
            s.connect().then(() => {
              setIsVideoVisible(false);
              s.play("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
            });
          });
        }
        setRooms(room);
        onAfterEnterRoom(room);
        sessionStorage.setItem("options", JSON.stringify(room.options));
      })
      .catch((err: any) => {
        console.log(err, "err");
        message.error(err.message);
      });
  };
  //去除空对象
  const isEmptyObject = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  const onAfterEnterRoom = (room: any) => {
    console.log(room, "11111");
    room.on("account-in", onMemberIn);
    room.on("account-update", onMemberUpdate);
    room.on("account-out", onMemberOut);
    room.on("share", onShare);
    room.on("closed", onRoomClosed);
    room.on("room-end", onRoomEnd);
  };
  //监听事件
  // 成员进入
  const onMemberIn = (vcsMember: any) => {
    let newMember = {
      nickname: vcsMember.options.account.nickname,
      id: vcsMember.options.account.id,
      avatar: vcsMember.options.account.avatar
        ? vcsMember.options.account.avatar
        : null,
    };

    // 更新成员列表，添加新成员
    setData((prevMembers: any) => {
      // 首先确保prevMembers是一个数组
      const array = Array.isArray(prevMembers) ? prevMembers : [];
      return array.concat(newMember);
    });
  };
  const onMemberUpdate = (vcsMember: any) => {};
  const onMemberOut = (vcsMember: any) => {
    console.log(vcsMember, "成员离开");
    // console.log(data, "data");
    // let newDataArr = data.filter(
    //   (item: any) => item.id !== vcsMember.options.account.id
    // );
    // console.log(newDataArr, "newDataArr");
    // const memberId = vcsMember.options.account.id;
    // setOverId((prevMembers: any) =>
    //   prevMembers.filter((member: any) => member.id !== memberId)
    // );

    // setOverId(vcsMember.options.account.id);
    let memberId = vcsMember.options.account.id;

    // 更新成员列表，移除离开的成员
    setData((prevMembers: any) => {
      // 首先确保prevMembers是一个数组
      const array = Array.isArray(prevMembers) ? prevMembers : [];
      return array.filter((member) => member.id !== memberId);
    });
  };
  const onShare = (vcsMember: any) => {};
  const onRoomClosed = (r: any) => {};
  const onRoomEnd = (r: any) => {};
  //这里是小窗口的展示及页码切换逻辑
  // 这个函数根据 startIndex 获取要展示的成员列表
  // 获取当前应该显示的成员
  const getDisplayedMembers = useCallback(() => {
    // 第一个成员始终显示
    const firstMember = data[0];

    // 根据 displayIndex 获取除第一个成员外的其他成员
    const otherMembers = data.slice(
      displayIndex + 1, // 从 displayIndex + 1 开始
      displayIndex + MAX_DISPLAY_EXCEPT_FIRST + 1 // 选取最多 MAX_DISPLAY_EXCEPT_FIRST 个成员
    );

    // 组合成员列表
    return [firstMember, ...otherMembers];
  }, [data, displayIndex]);

  useEffect(() => {
    setDisplayedMembers(getDisplayedMembers());
  }, [displayIndex, getDisplayedMembers]);
  // 点击下箭头的处理函数
  const handleNext = () => {
    // 确保不会超出数据范围，并且留下至少一个成员来显示
    if (displayIndex + MAX_DISPLAY_EXCEPT_FIRST < data.length - 1) {
      setDisplayIndex(displayIndex + MAX_DISPLAY_EXCEPT_FIRST);
    }
  };

  const handlePrev = () => {
    // 确保索引不会小于0
    if (displayIndex > 0) {
      setDisplayIndex(Math.max(displayIndex - MAX_DISPLAY_EXCEPT_FIRST, 0));
    }
  };
  //点击小窗口
  const rightBoxClick = (item: any) => {
    console.log(item, "点我！");
    setSelectedId(item.id); // 更新选中的盒子 id
    setSelectedData(item);
  };
  //当前展示的成员
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
  const [value, setValue] = useState("default");
  const [valueTwo, setValueTwo] = useState("");

  const sheXiangChange = (e: RadioChangeEvent) => {
    ss.close();
    rooms.updateAccount({ video_state: 1 }, true);

    rooms.openVideo({ deviceId: e.target.value }).then((s: any) => {
      //开始推流
      setss(s);
      rooms.updateAccount({ video_state: 0 }, true);
      s.connect().then(() => {
        setIsVideoVisible(false);

        s.play("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
      });
    });
    console.log("radio checked", e.target.value);

    setValueTwo(e.target.value);
  };
  const yuyinChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  //点击麦克风的状态
  const yuyinStatus = () => {
    setIsYuYin(!isYuYin);
  };
  //点击摄像头的状态
  const shipinStatus = () => {
    if (isSheXiang) {
      ss.close();
      rooms.updateAccount({ video_state: 1 }, true);
      setIsVideoVisible(true);
    } else {
      rooms.openVideo({ deviceId: valueTwo }).then((s: any) => {
        //开始推流
        setss(s);
        rooms.updateAccount({ video_state: 0 }, true);
        s.connect().then(() => {
          setIsVideoVisible(false);
          s.play("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
        });
      });
    }
    setIsSheXiang(!isSheXiang);
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
  const overMutes = () => {
    setModalTitle("退出会议");
    setIsCheck(3);
    setCheckboxLabel("您确定要退出会议吗");
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
    } else if (isCheck == 2) {
      if (rooms && rooms.getOptions().conf) {
        vcs
          .stopConference({ conf_id: rooms.getOptions().conf.id })
          .then((res: any) => {
            message.success("结束会议成功");
            history.push("/");
            rooms.close().finally(() => {
              setRooms(null);
            });
          })
          .catch((err: any) => {
            console.log(err);
          });
      }

      // room.client.room.no 会议号
    } else if (isCheck == 3) {
      rooms.close().finally(() => {
        setRooms(null);
        message.success("退出会议成功！");
        history.push("/");
      });
    }
    // 在这里执行确认后的逻辑
  };
  //顶部气泡弹窗
  const titleContent = (
    <div>
      <p>会话ID: {id}</p>
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
        value={valueTwo}
      >
        <Space direction="vertical">
          {videoinput &&
            videoinput.length &&
            videoinput.map((item: any, index: number) => {
              return <Radio value={item.id}>{item.name}</Radio>;
            })}
        </Space>
      </Radio.Group>
    </div>
  );
  const yuYinContent = (
    <div>
      <div style={{ color: "#999", fontSize: "14px", paddingBottom: "4px" }}>
        选择麦克风
      </div>
      <Radio.Group
        onChange={yuyinChange}
        value={value}
      >
        <Space direction="vertical">
          {audioinput &&
            audioinput.length &&
            audioinput.map((item: any, index: number) => {
              return <Radio value={item.id}>{item.name}</Radio>;
            })}
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
  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      let res = await vcs.enumDevices();
      console.log(res, "枚举设备");
      let audioOutputDevices = res.filter(
        (res: any) => res.kind === "audiooutput"
      );
      setAudioinput(audioOutputDevices);
      console.log(audioOutputDevices);
    }
  };
  const handleOpenChanges = async (newOpen: boolean) => {
    if (newOpen) {
      let res = await vcs.enumDevices();
      console.log(res, "枚举设备");
      let audioOutputDevices = res.filter(
        (res: any) => res.kind === "videoinput"
      );
      setVideoinput(audioOutputDevices);
      console.log(audioOutputDevices);
    }
  };
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
            <div className="left-top-text">会议ID：{id}</div>
          </div>
          <div className="video-box">
            <div
              className="video"
              id="videoDom"
            >
              <div
                className="video-box-flex"
                style={{ display: isVideoVisible ? "block" : "none" }}
              >
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
                  <span>{selectedData.nickname}</span>
                </div>
              </div>
              {/* <div
                className="video-shou"
                onClick={zhankaiStatus}
                style={{ display: isVideoVisible ? "block" : "none" }}
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
              </div> */}
            </div>
            {iszhankai ? (
              <div
                className="video-shou"
                onClick={zhankaiStatus}
              >
                <img
                  src={shouqiIcon}
                  alt=""
                />
              </div>
            ) : (
              ""
            )}
            {/* <video className="video"></video> */}
            <div className="video-right">
              {!iszhankai ? (
                <div
                  className="video-shou"
                  onClick={zhankaiStatus}
                >
                  <img
                    src={zhankaiIcon}
                    alt=""
                  />
                </div>
              ) : (
                ""
              )}

              <div>
                <img
                  src={topIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={handlePrev}
                />
              </div>
              <div className="video-right-box">
                {displayedMembers &&
                  displayedMembers.length &&
                  displayedMembers.map(
                    (data: any) =>
                      data && (
                        <div
                          // className="video-right-time"
                          className={`video-right-time ${
                            selectedId === data.id ? "highlight" : ""
                          }`}
                          key={data.id}
                          onClick={() => rightBoxClick(data)}
                        >
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
                            <span>{data.nickname}</span>
                          </div>
                        </div>
                      )
                  )}
              </div>
              <div>
                <img
                  src={bottomIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={handleNext}
                />
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
                    onClick={yuyinStatus}
                    style={{ marginRight: "3px" }}
                  />
                  <div>开启静音</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={yuyinguan}
                    alt=""
                    onClick={yuyinStatus}
                  />
                  <div>解除静音</div>
                </div>
              )}
              <Popover
                content={yuYinContent}
                trigger="click"
                onOpenChange={handleOpenChange}
              >
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
                    onClick={shipinStatus}
                  />
                  <div>关闭视频</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={shipinguan}
                    alt=""
                    onClick={shipinStatus}
                  />
                  <div>开启视频</div>
                </div>
              )}
              <Popover
                content={sheXiangContent}
                trigger="click"
                onOpenChange={handleOpenChanges}
              >
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
                <div>成员({data.length}人)</div>
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
            <Button
              className="left-bottom-right"
              type="primary"
              onClick={overMutes}
            >
              退出会议
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
            {data &&
              data.length &&
              data.map((item: any, index: any) => {
                return (
                  <div className="right-name-box">
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                    />
                    <div className="right-name">
                      <div className="name-top">{item.nickname}</div>
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
                );
              })}
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
