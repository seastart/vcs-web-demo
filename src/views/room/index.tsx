import React, { useState, useEffect, useCallback, useRef } from "react";
import RoomHeaderComponent from "../../components/RoomHeaderComponent";
import ConfirmDialog from "../../components/ConfrimModal"; // 导入上面创建的组件
import { useHistory, useLocation } from "react-router-dom";
import { store } from "../../store/store";

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
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { setRoom } from "../../actions/roomActions";

import {
  Avatar,
  Button,
  Popover,
  Radio,
  Space,
  Divider,
  message,
  Dropdown,
  Modal,
  Checkbox,
} from "antd";
import "./index.scss";
import { debug } from "console";
type Props = {};

export default function Index({}: Props) {
  //全局
  const history = useHistory();
  const vcs = useSelector((state: any) => state.vcs.vcsClient); //传入的vcs
  const isYuyin = useSelector((state: any) => state.yuyin.yuyin); //传入的麦克风状态
  const isSheXiangStatus = useSelector((state: any) => state.shexiang.shexiang); //传入的摄像头状态
  const version = useSelector((state: any) => state.version.version);
  // const room = useSelector((state: any) => state.room.room); //传入的房间信息，在homePage页面进入会议时传入
  //state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const nickname = queryParams.get("name");
  const [isClose, setIsClose] = useState(false);
  const [rooms, setRooms] = useState<any>(null);
  const roomsRef = useRef(rooms);
  const [iszhankai, setIsZhanKai] = useState(false);
  const [isYuYin, setIsYuYin] = useState(false);
  const [isSheXiang, setIsSheXiang] = useState<any>(false);
  const [isGongXiang, setIsGongXiang] = useState(true);
  const [isMine, setIsMine] = useState(false);
  const [mine, setMine] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false); //弹窗的开关
  const [modalTitle, setModalTitle] = useState(""); //弹窗的开关
  const [checkboxLabel, setCheckboxLabel] = useState(""); //弹窗的内容
  const [hover, setHover] = useState(false); //共享屏幕的鼠标移入
  const [resolutionRadio, setResolutionRadio] = useState(2); //共享屏幕的鼠标移入
  const [webURL, setWebURL] = useState<any>("");
  const [isCheck, setIsCheck] = useState(0); //弹窗类型 0全体静音 1解除全体静音 2结束会议 3离开会议 4云录制
  const [data, setData] = useState<any>([]); //维护成员列表以及各种信息
  const [checked, setChecked] = useState<any>(true);
  const [lu, setLu] = useState<any>(false);
  const [mirror, setMirror] = useState<any>(false);
  const [next, setNext] = useState<any>(false);
  const [prev, setPrev] = useState<any>(false);
  const [afterShex, setAfterShex] = useState<any>(false); //进入房间推流前防止摄像头点击

  // constal, setVal] = useState<any>([]); //维护成员触发
  // const  [v[overId, setOverId] = useState<any>([]); //维护成员触发
  //成员小窗口的部分逻辑
  const [displayIndex, setDisplayIndex] = useState(0); // 从第0位开始显示，因为第一位始终显示
  const [displayedMembers, setDisplayedMembers] = useState<any>([]); // 从第0位开始显示，因为第一位始终显示
  const displayedMembersRef = useRef(displayedMembers);
  const MAX_DISPLAY = 4; // 最多展示的成员数
  const MAX_DISPLAY_EXCEPT_FIRST = 3; // 定义最大显示数量，减去始终显示的第一个成员
  const [selectedId, setSelectedId] = useState<any>(null); //选中小窗口的唯一标识
  const [selectedData, setSelectedData] = useState<any>([]); //选中小窗口的数组，大窗口的展示
  const selectedIdRef = useRef<any>(selectedId);
  const selectedDataRef = useRef<any>(selectedId);

  const [audioinput, setAudioinput] = useState<any>([]); //枚举音频
  const [videoinput, setVideoinput] = useState<any>([]); //枚举视频
  const [thrStatus, setThrStatus] = useState<any>(false); //小窗口点击节流

  //视频播放
  const [isVideoVisible, setIsVideoVisible] = useState<any>(true); // 控制Video视频盒子是否可见
  const [ss, setss] = useState<any>({}); // 存储摄像头s对象
  const ssRef = useRef<any>();

  const [aa, setaa] = useState<any>({}); // 存储语音a对象
  const aaRef = useRef<any>();

  const [rr, setrr] = useState<any>(); // 存储混音流
  const [sa, setsa] = useState<any>(); // 存储小流
  const [gx, setGx] = useState<any>(); // 共享桌面流
  const [canvasStreams, setCanvasStreams] = useState<any>();
  const gxRef = useRef<any>();
  const canvasRef = useRef<any>();
  const gxsRef = useRef<any>();
  const [videoVis, setVideoVis] = useState<any>(false); // 切换摄像头防止过快点击
  const [audioVis, setAudioVis] = useState<any>(false); // 切换麦克风防止过快点击
  const [white, setWhite] = useState<any>(false); // 共享电子白板
  const [isOptions, setIsOptions] = useState<any>(true);
  const [videoSmallStatus, setVideoSmallStatus] = useState<any>(0); // 小窗口选中别人后的状态 0小窗口选择的就是我自己，1小窗口选择的不是我但是没开摄像头 2小窗口选择的不是我，开启了摄像头

  const [activeStreams, setActiveStreams] = useState<any>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false); //设置弹窗开启
  const [streams, setStreams] = useState(new Map());
  const [chabaShexiangStatus, setChabaShexiangStatus] = useState(false); //插拔摄像头后禁止点击别人小窗口
  const iframeRef = useRef(null); //获取canvas
  let ids = JSON.parse(sessionStorage.getItem("options") || "{}");
  let userId = sessionStorage.getItem("accid");
  let changeDev = false;
  useEffect(() => {
    setIsYuYin(isYuyin);

    if (isYuyin) {
      sessionStorage.setItem("isYuYinStatus", "1");
    } else {
      sessionStorage.setItem("isYuYinStatus", "0");
    }
    setIsSheXiang(isSheXiangStatus);
  }, [isYuyin, isSheXiangStatus]);
  useEffect(() => {
    // console.log(room, "room!!");
    // vcs.loginByToken({});
    //初始化自己的麦克风摄像头状态
    setIsYuYin(isYuyin);
    setIsSheXiang(isSheXiangStatus);

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
    // let ids = JSON.parse(sessionStorage.getItem("options") || "{}");
    if (!rooms) {
      return;
    }
    console.log(isYuYin, "isYuYin");
    let mine = {
      nickname: nickname,
      avatar: sessionStorage.getItem("avatar") || null,
      id: rooms.options.account.id,
      video_state: isSheXiang ? 0 : 1,
      audio_state: isYuYin ? 0 : 1,
      members: null,
      isVideo: null,
      stream: null,
      shouldBeVisible: null,
      role: null,
    };
    setData((prevMembers: any) => {
      // 如果已经包含了当前用户，则不添加
      const updatedMembers = prevMembers.map((member: any) =>
        member.id === mine.id ? mine : member
      );
      console.log(mine, "mine");
      // 检查当前用户是否已存在于数组中
      const mineExists = updatedMembers.some(
        (member: any) => member.id === mine.id
      );

      // 如果当前用户不存在，则添加
      if (!mineExists) {
        return [mine, ...prevMembers];
      }

      // 如果存在，则返回更新后的数组
      return updatedMembers;
    });
    // 将当前用户添加到成员列表
    // setData([mine]);
    setSelectedId(mine.id); // 设置选中成员的 ID
    setSelectedData(mine);
    selectedIdRef.current = mine.id;
    selectedDataRef.current = mine;
  }, [nickname, rooms]); // 依赖项是nickname
  //组件的销毁
  useEffect(() => {
    const closeResources = async () => {
      if (rr) {
        console.log(rr, "Closing rr");
        await rr.close();
      }
    };

    return () => {
      closeResources();
      activeStreams.forEach((stream: any, id: any) => {
        stream.removePlay("video-right-time-" + id, true); // 假设流对象有一个close方法来停止流传输
      });
      // displayedMembers &&
      //   displayedMembers.length &&
      //   displayedMembers.map((item: any, index: any) => {
      //     console.log(item, "111aaa");
      //     if (item.stream) {
      //       item.stream.removePlay("video-right-time-" + item.id, true);
      //     }
      //   });
    };
  }, [rr]);
  //浏览器回退后退出登录
  useEffect(() => {
    // 监听历史对象的变化
    console.log("我回退了");
    let roomsa = rooms;
    console.log(roomsa, "rooms,退出");
    const unlisten = history.listen((location: any, action) => {
      let roomsas = roomsa;
      console.log(location, "rooms,退出1");
      if (action === "POP") {
        // 执行你想要的操作，例如退出会议
        console.log(rooms);
        if (rooms) {
          // 如果 rooms 对象存在，则调用退出会议的方法
          if (id) {
            sessionStorage.setItem("ids", id);
          }
          rooms.close().finally(() => {
            setRooms(null);
            sessionStorage.removeItem("valueTwo");
            sessionStorage.removeItem("valueAudio");
            roomsRef.current = null;
            clearTimer();
            message.success("退出会议成功！");
          });
        }
      }
    });

    // 组件卸载时取消监听
    return () => {
      unlisten();
    };
  }, [history, rooms]);
  //设备的插拔返回事件
  useEffect(() => {
    navigator.mediaDevices.ondevicechange = (event) => {
      if (changeDev) {
        return;
      }
      changeDev = true;
      console.log(sessionStorage.getItem("valueTwo"), "eventhahah");

      // vcs.enumDevices().then((res: any) => {
      //   console.log(res, "枚举设备");
      //   let audioOutputDevices = res.filter(
      //     (res: any) => res.kind === "audioinput"
      //   );

      //   setAudioinput(audioOutputDevices);
      //   sessionStorage.setItem("valueAudio", audioOutputDevices[0].id); //存储枚举视频设备id
      //   console.log(audioOutputDevices);
      // });
      setChabaShexiangStatus(true);
      setTimeout(() => {
        vcs.enumDevices().then(async (res: any) => {
          console.log(res, "枚举设备");
          let videoOutputDevices = res.filter(
            (res: any) => res.kind === "videoinput"
          );
          let audioOutputDevices = res.filter(
            (res: any) => res.kind === "audioinput"
          );
          let isIdContained = videoOutputDevices.some((device: any) =>
            device.id.includes(sessionStorage.getItem("valueTwo"))
          );
          let isAudioContained = audioOutputDevices.some((device: any) =>
            device.id.includes(sessionStorage.getItem("valueAudio"))
          );
          if (!isIdContained) {
            setValueTwo(videoOutputDevices[0].id);
            sessionStorage.setItem("valueTwo", videoOutputDevices[0].id); //存储枚举视频设备id
            //如果此时摄像头状态为打开，则更换设备并推流
            if (sessionStorage.getItem("isSheXiang") === "1") {
              roomsRef.current.updateAccount({ video_state: 1 }, true);
              await ssRef.current.removePlay("videoDom", true);
              console.log(displayedMembersRef.current[0], "1111111");
              await ssRef.current.removePlay(
                `video-right-time-${sessionStorage.getItem("accid")}`,
                true
              );
              console.log(videoOutputDevices[0], "我改变了");
              //存储selectedData为自己

              setSelectedId(displayedMembersRef.current[0].id); // 更新选中的盒子 id

              setSelectedData(displayedMembersRef.current[0]);
              roomsRef.current
                .openVideo({ deviceId: videoOutputDevices[0].id })
                .then((s: any) => {
                  setss(s);
                  ssRef.current = s;

                  //开始推流
                  s.connect().then(() => {
                    s.setMcuRecord();
                    //  setIsVideoVisible(false);
                    //  setSelectedId(displayedMembers[0].id); // 更新选中的盒子 id
                    //  setSelectedData(displayedMembers[0]);

                    // s.removePlay("videoDom", true);
                    roomsRef.current.updateAccount({ video_state: 0 }, true);

                    s.addPlay("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
                    s.addPlay(
                      `video-right-time-${sessionStorage.getItem("accid")}`
                    ); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签

                    if (mirror) {
                      s.setMirror(true);
                    }
                    setChabaShexiangStatus(false); //推流成功后允许点击小窗口
                  });
                })
                .catch((err: any) => {
                  message.error("该设备正在占用，请重新打开摄像头或更换设备");
                });
            }
          } else {
            setChabaShexiangStatus(false); //推流成功后允许点击小窗口
          }
          if (!isAudioContained) {
            setValue(audioOutputDevices[0].id);
            sessionStorage.setItem("valueAudio", audioOutputDevices[0].id); //存储枚举视频设备id
            //如果此时麦克风状态为打开，则更换设备并推流
            if (sessionStorage.getItem("isYuYin") === "1") {
              roomsRef.current.updateAccount({ audio_state: 1 }, true);
              aaRef.current.close();

              roomsRef.current
                .openAudio({ deviceId: audioOutputDevices[0].id })
                .then((a: any) => {
                  //开始推流
                  aaRef.current = a;

                  a.connect().then(() => {
                    roomsRef.current.updateAccount({ audio_state: 0 }, true);
                    // a.play();
                    setChabaShexiangStatus(false); //推流成功后允许点击小窗口
                  });
                })
                .catch((err: any) => {
                  message.error("该设备正在占用，请重新打开麦克风或更换设备");
                });
            }
          } else {
            setChabaShexiangStatus(false); //推流成功后允许点击小窗口
          }
          // console.log(isIdContained, "isIdContained");

          //每次进入房间加载第一个默认设备
          // setValueTwo(audioOutputDevices[0].id);
          // sessionStorage.setItem("valueTwo", audioOutputDevices[0].id); //存储枚举视频设备id
          // setVideoinput(audioOutputDevices);
          changeDev = false;
        });
        message.info("设备已改变");
      }, 2000);
    };
  }, []);
  //无状态刷新
  const resumeRoom = (option: any) => {
    setValueTwo(sessionStorage.getItem("valueTwo")!);
    setValue(sessionStorage.getItem("valueAudio")!);
    vcs
      .resumeRoom(option)
      .then((room: any) => {
        store.dispatch(setRoom(room));
        setWebURL(room.options.wbPrefix); //存储共享白板链接
        //修改昵称
        setRooms(room);
        roomsRef.current = room;
        onAfterEnterRoom(room);
        let isSheXiangs = sessionStorage.getItem("isSheXiang");
        let isYuYins = sessionStorage.getItem("isYuYin");
        console.log(isYuYins, "isYuYins");
        if (isSheXiangs == "1") {
          setIsSheXiang(true);
          room
            .openVideo({ deviceId: sessionStorage.getItem("valueTwo") })
            .then((s: any) => {
              //开始推流
              setss(s);
              ssRef.current = s;

              s.connect().then(() => {
                room.updateAccount({ video_state: 0 }, true);
                setIsVideoVisible(false);
                s.addPlay("videoDom");
                s.setMcuRecord();
                if (mirror) {
                  s.setMirror(true);
                }
                s.addPlay(`video-right-time-${ids?.account.id}`);
              });
            });
        } else {
          //摄像头状态改变
          setIsSheXiang(false);

          //刷新页面存储s

          // room.openVideo({}).then((s: any) => {
          //   //开始推流
          //   setss(s);
          // });
        }
        if (isYuYins == "1") {
          if (room.getRoom().relieve_astate == 1) {
            // message.info("主持人设置了全体静音");
            return;
          }
          setIsYuYin(true);
          room
            .openAudio({ deviceId: sessionStorage.getItem("valueAudio") })
            .then((a: any) => {
              //开始推流
              setaa(a);
              aaRef.current = a;

              a.connect().then(() => {
                room.updateAccount({ audio_state: 0 }, true);
                // a.play(); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
              });
            });
        } else {
          console.log("关闭！");
          setIsYuYin(false);
          // room.openAudio({}).then((a: any) => {
          //   setaa(a);
          // });
        }
        activeStreams.forEach((stream: any, id: any) => {
          stream.removePlay("video-right-time-" + id, true); // 假设流对象有一个close方法来停止流传输
        });
        console.log(activeStreams, "111aaa");
        // displayedMembers &&
        //   displayedMembers.length &&
        //   displayedMembers.map((item: any, index: any) => {
        //     console.log(item, "111aaa");
        //     if (item.stream) {
        //       item.stream.removePlay("video-right-time-" + item.id, true);
        //     }
        //   });
      })
      .catch((err: any) => {
        console.log(err, "err");
        let errConfrim = confirm(err.message);
        if (errConfrim) {
          history.replace("/");
        } else {
          history.replace("/");
        }
      });
  };
  //进入房间
  const onEnterRoom = async () => {
    console.log("进入！！！！");
    let videoDevice: any;
    //初始化加载一遍麦克风设备
    let res = await vcs.enumDevices();
    let audioOutputDevices = res.filter(
      (res: any) => res.kind === "audioinput"
    );
    if (audioOutputDevices.length) {
      setAudioinput(audioOutputDevices);
      sessionStorage.setItem("valueAudio", audioOutputDevices[0].id); //存储枚举视频设备id
      setValue(audioOutputDevices[0].id);

      console.log(audioOutputDevices);
    }

    //每次进入房间后初始化加载一遍摄像头设备
    let videodevices = await vcs.enumDevices();
    console.log(videodevices, "枚举设备");
    let videoOutputDevices = videodevices.filter(
      (videodevices: any) => videodevices.kind === "videoinput"
    );
    if (videoOutputDevices.length) {
      setValueTwo(videoOutputDevices[0].id);
      sessionStorage.setItem("valueTwo", videoOutputDevices[0].id); //存储枚举视频设备id
      setVideoinput(videoOutputDevices);
      videoDevice = videoOutputDevices[0].id;
    }
    //每次进入房间加载第一个默认设备

    // console.log("进入！！！！");
    // let videoDevice: any;

    // //初始化加载一遍麦克风设备
    // let audiodevices = await vcs.enumDevices();
    // setAudioinput(audioOutputDevices);
    // setValue(audioOutputDevices[0].id);
    // sessionStorage.setItem("valueAudio", audioOutputDevices[0].id); //存储枚举视频设备id
    // //每次进入房间后初始化加载一遍摄像头设备
    // vcs.enumDevices().then((res: any) => {
    //   console.log(res, "枚举设备");
    //   let audioOutputDevices = res.filter(
    //     (res: any) => res.kind === "videoinput"
    //   );
    //   //每次进入房间加载第一个默认设备
    //   setValueTwo(audioOutputDevices[0].id);
    //   sessionStorage.setItem("valueTwo", audioOutputDevices[0].id); //存储枚举视频设备id
    //   setVideoinput(audioOutputDevices);
    //   videoDevice = audioOutputDevices[0].id;
    // });
    vcs
      .enterRoom({
        room_no: id,
        audioMixer: true,
        password: sessionStorage.getItem("password"),
      })
      .then((room: any) => {
        console.log(room, "room");
        setRooms(room);
        setWebURL(room.options.wbPrefix); //存储共享白板链接
        store.dispatch(setRoom(room));
        //修改昵称
        room.updateAccount({ nickname }, true);
        console.log(isYuYin, room.getRoom().relieve_astate, "哈哈哈");
        if (
          (isYuyin && room.getRoom().relieve_astate !== 1) ||
          room.getRoom().relieve_astate !== 0
        ) {
          if (audioOutputDevices.length) {
            sessionStorage.setItem("isYuYin", "1");

            room.openAudio({}).then((a: any) => {
              //开始推流
              setaa(a);
              aaRef.current = a;

              a.connect().then(() => {
                room.updateAccount({ audio_state: 0 }, true);
                // a.play();
              });
            });
          } else {
            setIsYuYin(false);
          }
        } else {
          // message.info("主持人设置了全体静音");
          setIsYuYin(false);
          sessionStorage.setItem("isYuYin", "1");
        }
        roomsRef.current = room;

        onAfterEnterRoom(room);
        sessionStorage.setItem("options", JSON.stringify(room.options));
        if (isSheXiangStatus) {
          if (videoOutputDevices.length) {
            setAfterShex(true);
            sessionStorage.setItem("isSheXiang", "1");
            console.log(videoDevice, "videoDevice!");
            room.openVideo({ deviceId: videoDevice }).then((s: any) => {
              //开始推流
              setss(s);
              ssRef.current = s;

              s.connect().then(() => {
                room.updateAccount({ video_state: 0 }, true);
                setIsVideoVisible(false);
                s.addPlay("videoDom");
                console.log(room.options.account.id, "rooms");
                console.log("我有值了！");
                // setTimeout(() => {
                s.addPlay(`video-right-time-${room.options.account.id}`);
                if (mirror) {
                  s.setMirror(true);
                }
                s.setMcuRecord();
                setAfterShex(false);
              });
            });
          } else {
            setIsSheXiang(false);
          }
        } else {
          sessionStorage.setItem("isSheXiang", "0");
        }
      })
      .catch((err: any) => {
        console.log(err, "err");
        // message.error(err.message);
        let errConfrim = confirm(err.message);
        if (errConfrim) {
          history.replace("/");
        } else {
          history.replace("/");
        }
      });
  };
  const onAfterEnterRoom = (room: any) => {
    console.log(room, "11111");
    room.pullMixAudio().then(async (r: any) => {
      setrr(r);
      try {
        await r.play();
        console.log("rrrrr");
      } catch (error) {
        console.log(error, "errrrr");
      }
    });
    room.on("account-in", onMemberIn);
    room.on("account-update", onMemberUpdate);
    room.on("account-out", onMemberOut);
    room.on("share", onShare);
    room.on("closed", onRoomClosed);
    room.on("room-end", onRoomEnd);
    room.on("my-account", onMyAccount);
    room.on("room", onRoomUpdate);
    room.on("kickout", onRoomKickout);
  };

  //监听事件
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  // 成员进入
  const onMemberIn = (vcsMember: any) => {
    console.log(roomsRef.current, "成员进入");
    if (vcsMember.options.account.id === userId) {
      setData((prevData: any) => {
        // 确保prevData是一个数组且至少有一个元素
        if (Array.isArray(prevData) && prevData.length > 0) {
          // 创建一个新的数组
          const newData = [...prevData];

          // 更新数组的第一个元素，修改它的role属性
          newData[0] = {
            ...newData[0],
            role: vcsMember.options.account.role, // 假设您想更新的属性是role
          };
          console.log(newData, "newData");
          // 返回更新后的数组
          return newData;
        }

        // 如果prevData不是数组或为空，则直接返回原状态
        return prevData;
      });
      return;
    }
    let newMember = {
      nickname: vcsMember.options.account.nickname,
      id: vcsMember.options.account.id,
      avatar: vcsMember.options.account.avatar
        ? vcsMember.options.account.avatar
        : null,
      audio_state: vcsMember.options.account.audio_state,
      video_state: vcsMember.options.account.video_state,
      members: vcsMember,
      role: vcsMember.options.account.role,
    };
    // 更新成员列表，添加新成员
    setData((prevMembers: any) => {
      // 首先确保prevMembers是一个数组
      const array = Array.isArray(prevMembers) ? prevMembers : [];
      console.log(array.concat(newMember), "hahahahahhaha");
      return array.concat(newMember);
    });
  };
  const onMemberUpdate = (vcsMember: any) => {
    if (vcsMember.options.account.id === userId) {
      return;
    }
    console.log(vcsMember, "变化了");

    setData((prevMembers: any) =>
      prevMembers.map((member: any) =>
        member.id === vcsMember.options.account.id
          ? {
              ...member,
              audio_state: vcsMember.options.account.audio_state,
              video_state: vcsMember.options.account.video_state,
              members: vcsMember,
              isVideo: null,
              stream: null,
              shouldBeVisible: null,
              role: vcsMember.options.account.role,
            }
          : member
      )
    );
  };
  const onMemberOut = (vcsMember: any) => {
    console.log(vcsMember, "成员离开");
    console.log(activeStreams, "activeStreams");
    activeStreams.delete(vcsMember.options.account.id);
    setActiveStreams(activeStreams);
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
    console.log(data, "data");

    // 更新成员列表，移除离开的成员
    setData((prevMembers: any) => {
      // 首先确保prevMembers是一个数组
      const array = Array.isArray(prevMembers) ? prevMembers : [];
      return array.filter((member) => member.id !== memberId);
    });
    if (vcsMember.options.account.id === selectedIdRef.current) {
      // rightBoxClick(displayedMembersRef.current[0]);
      setSelectedId(displayedMembersRef.current[0].id); // 更新选中的盒子 id
      setSelectedData(displayedMembersRef.current[0]);
      if (sessionStorage.getItem("isSheXiangs") === "1") {
        ssRef.current.addPlay("videoDom");
        setIsVideoVisible(false);
      } else {
        setIsVideoVisible(true);
      }
      // selectedIdRef.current = displayedMembersRef.current[0].id;
      // selectedDataRef.current = displayedMembersRef.current[0];
    }
  };
  const onRoomUpdate = (room: any) => {
    console.log(room, "11111qqqrrr");
    if (room.mcu_mode === 0) {
      //没开启
      setLu(false);
    } else {
      console.log(room, "122211");
      setLu(true);
      // if (room.sharing_type === 1) {
      //   // setWhite(true);
      // }
      //开启了，
      //如果正在共享电子白板，开启白板推流
    }
  };
  const onRoomClosed = (r: any) => {};
  const onRoomEnd = (r: any) => {
    console.log(r, "rrr");
    roomsRef.current.close().finally(() => {
      if (id) {
        sessionStorage.setItem("ids", id);
      }
      setRooms(null);
      roomsRef.current = null;
      clearTimer();
      message.info("会议已结束！");
      history.push("/");
    });
  };
  const onRoomKickout = (r: any) => {
    console.log(r, "rrr");
    roomsRef.current.close().finally(() => {
      if (id) {
        sessionStorage.setItem("ids", id);
      }
      setRooms(null);
      roomsRef.current = null;
      clearTimer();
      message.info("您已被踢出会议");
      history.push("/");
    });
  };
  //这里是小窗口的展示及页码切换逻辑
  // 这个函数根据 startIndex 获取要展示的成员列表
  // 获取当前应该显示的成员
  const getDisplayedMembers = useCallback(() => {
    // 第一个成员始终显示
    const datas = data;
    const firstMember = datas[0];
    if (!firstMember) {
      return;
    }
    // 根据 displayIndex 获取除第一个成员外的其他成员
    console.log(firstMember, "firstMember");
    let a = isSheXiangStatus;
    if (a) {
      sessionStorage.setItem("a", "1");
    } else {
      sessionStorage.setItem("a", "0");
    }
    // if (sessionStorage.getItem("a") == "1") {
    //   sessionStorage.setItem("a", "1");
    //   console.log(ssRef.current, "ssRef");

    //   if (ssRef.current && sessionStorage.getItem("a") == "1") {
    //     sessionStorage.setItem("a", "0");
    //     ssRef.current.addPlay(`video-right-time-${rooms.options.account.id}`);
    //   }
    // }
    if (firstMember !== undefined) {
      if (isYuYin) {
        firstMember.audio_state = 0;
        console.log(firstMember, "1");
      } else {
        firstMember.audio_state = 1;
        console.log(firstMember, "0");
      }
      if (isSheXiang) {
        firstMember.video_state = 0;
        console.log(firstMember, "firstMember");
      } else {
        firstMember.video_state = 1;
        console.log(firstMember, "firstMember");
      }
    }
    // console.log(firstMember, "我自己");

    const otherMembers = datas.slice(
      displayIndex + 1, // 从 displayIndex + 1 开始
      displayIndex + MAX_DISPLAY_EXCEPT_FIRST + 1 // 选取最多 MAX_DISPLAY_EXCEPT_FIRST 个成员
    );
    console.log(displayIndex, otherMembers, "displayIndex");

    otherMembers.map(async (member: any, index: number) => {
      if (member.id === firstMember.id) {
        return;
      }
      const streamContainerId = `video-right-time-${member.id}`;
      const existingStream = activeStreams.get(member.id);
      const shouldHaveStream = member.members.options.account.video_state === 0;
      console.log(existingStream, shouldHaveStream, "existingStream");
      if (existingStream === undefined && shouldHaveStream) {
        activeStreams.set(member.id, null);
        try {
          if (!member.stream || member.stream.domItems.length == 0) {
            const s = await member.members.pullVideo({
              streamType: 1,
              adaptMainSub: true,
            });
            member.stream = s;
            activeStreams.set(member.id, s);
            setActiveStreams(new Map(activeStreams));
            //这里我们得到了关于视频的VCSStream对象，同样也不需要调用connect，s对象需要自己保存
            s.addPlay(streamContainerId);
            if (selectedId === member.id && !selectedData.stream) {
              setIsVideoVisible(false);
              s.addPlay("videoDom");
              setSelectedData(member);
              selectedDataRef.current = member;
            }
            s.setMcuRecord();
          } else {
            // activeStreams.set(member.id, member.stream);
            // setActiveStreams(new Map(activeStreams));
            //这里我们得到了关于视频的VCSStream对象，同样也不需要调用connect，s对象需要自己保存
            setTimeout(() => {
              member.stream.addPlay(streamContainerId);
            }, 200);
          }

          console.log(streamContainerId, "streamContainerId");
        } catch (err) {
          console.log(err);
          activeStreams.delete(member.id);
        }
      } else if (existingStream && !shouldHaveStream) {
        activeStreams.delete(member.id);
        // await existingStream.close();

        await existingStream.removePlay("video-right-time-" + member.id, true);
        console.log(selectedData, member, "member");
        if (selectedData.id == member.id) {
          await selectedData.stream?.removePlay("videoDom", true);
          member.stream = null;
          selectedData.stream = null;
          setIsVideoVisible(true);
        }

        console.log(member.id, "member.id");
      }
    });
    // 组合成员列表
    //更新data数据

    return [firstMember, ...otherMembers];
  }, [data, displayIndex, isYuYin, isSheXiang]);

  useEffect(() => {
    console.log("HHHHHHHH");
    const displayedMembers = getDisplayedMembers();
    setDisplayedMembers(displayedMembers);
    displayedMembersRef.current = displayedMembers;
  }, [displayIndex, data, isSheXiang, isYuYin, getDisplayedMembers]);
  const onShare = async (args: any) => {
    console.log(args, "onShare");
    //因为闭包的原因 数据拿不到，存到ref中
    const currentRooms = roomsRef.current;
    const currentGx = gxRef.current; // 从 ref 中获取 gx
    const currentss = ssRef.current; // 从 ref 中获取 ss
    const currentGxs = gxsRef.current; // 从 ref 中获取 别人的共享
    const currentVs = canvasRef.current; // 从 ref 中获取 别人的共享
    const displayedMembersCurrent = displayedMembersRef.current; // 从 ref 中获取 displayedMembers
    console.log(currentGx, "currentGx");
    console.log(currentRooms, "currentRooms");
    if (currentss) {
      console.log(currentss, "currentss");
      currentRooms.updateAccount({ video_state: 1 }, true);
      await currentss.removePlay("videoDom", true);
      console.log(displayedMembersCurrent, "displayedMembersCurrent");
      await currentss.removePlay(
        "video-right-time-" + currentRooms.options.account.id,
        true
      );
    }
    displayedMembersCurrent &&
      displayedMembersCurrent.length > 0 &&
      displayedMembersCurrent.map((item: any) => {
        if (displayedMembersCurrent.id !== currentRooms.options.account.id) {
          if (displayedMembersCurrent.video_state == 0) {
            console.log(displayedMembersCurrent.stream, "stream");
            displayedMembersCurrent.stream.removePlay(
              "video-right-time-" + displayedMembersCurrent.id,
              true
            );
          }
        }
      });
    if (args.type == 3) {
      setWhite(false);
      console.log(displayedMembersCurrent, "displayedMembersCurrent");
      //关闭小窗口成员的流
      if (args.accId == currentRooms.options.account.id) {
        //开启自己共享
        currentGx.connect().then((s: any) => {
          setMine(true);
          console.log(s, "ss");
          currentGx.addPlay("videoDom");
          currentGx.setMcuRecord();
        });
        setIsVideoVisible(false);
        setIsClose(true); // 更新状态以关闭面板
        setIsZhanKai(true); // 更新状态以折叠视频面板
        console.log(currentGx, "currentGx");
        setIsSheXiang(false);
        setIsGongXiang(false);

        //此时证明是自己的权限，可以进行推流操作
        //此时需要使用gx
      } else {
        setIsClose(true); // 更新状态以关闭面板
        setIsZhanKai(true); // 更新状态以折叠视频面板
        setIsSheXiang(false);
        setMine(false);
        currentGx?.removePlay("videoDom", true);
        console.log(args, "args");
        let member = currentRooms.getMember(args.accId);
        if (member) {
          member
            .pullVideo({
              trackMask: args.streamId,
              // channelType:
            })
            .then((s: any) => {
              s.addPlay("videoDom");
              gxsRef.current = s;
              setIsVideoVisible(false);
            });
        }
      }
    } else if (args.type == 1) {
      console.log(currentRooms.getRoom().sharing_type, "sharing_type");
      setIsVideoVisible(false);
      setIsClose(true); // 更新状态以关闭面板
      setIsZhanKai(true); // 更新状态以折叠视频面板
      setIsSheXiang(false);
      setWhite(true);
      setIsOptions(false);

      if (args.accId === currentRooms.options.account.id) {
        setIsGongXiang(false);
        setMine(true);
      } else {
        setIsMine(false);
        setMine(false);
      }
    } else {
      setMine(false);
      currentGxs?.removePlay("videoDom", true);
      currentGx?.removePlay("videoDom", true);
      currentVs?.close();
      setIsVideoVisible(true);
      setIsClose(false); // 更新状态以关闭面板
      setIsZhanKai(false); // 更新状态以折叠视频面板
      setWhite(false);
      setIsOptions(true);
      setIsGongXiang(true);
    }
  };
  const onMyAccount = (acc: any) => {
    console.log(acc, "初始值！");
    setData((prevData: any) => {
      // 确保prevData是一个数组且至少有一个元素
      if (Array.isArray(prevData) && prevData.length > 0) {
        // 创建一个新的数组
        const newData = [...prevData];

        // 更新数组的第一个元素，修改它的role属性
        newData[0] = {
          ...newData[0],
          role: acc.account.role, // 假设您想更新的属性是role
        };
        console.log(newData, "newData");
        // 返回更新后的数组
        return newData;
      }

      // 如果prevData不是数组或为空，则直接返回原状态
      return prevData;
    });
    if (acc.account.hasOwnProperty("audio_state")) {
      // isYuYinStatus session里面1是开启 0是关闭
      if (
        acc.account.audio_state == 0 &&
        sessionStorage.getItem("isYuYinStatus") == "0"
      ) {
        //主持人请求打开我的麦克风
        allUnMutes();
      } else if (
        acc.account.audio_state == 1 &&
        sessionStorage.getItem("isYuYinStatus") == "1"
      ) {
        message.info("主持人开启了全体静音");
        sessionStorage.setItem("isYuYinStatus", "0");
        sessionStorage.setItem("isYuYin", "0");
        aaRef.current.close();
        roomsRef.current.updateAccount({ audio_state: 1 }, true);
        setAudioVis(false);
        setIsYuYin(false);
      } else if (
        acc.account.audio_state == 1 &&
        sessionStorage.getItem("isYuYinStatus") == "0"
      ) {
        message.info("主持人开启了全体静音");
      }
    }
    if (acc.account.hasOwnProperty("role")) {
      console.log(acc.account.hasOwnProperty("role"), "主持人");
      if (acc.account.role === 4) {
        message.info("您已被设置为联席主持人");
      }
      if (acc.account.role === 2) {
        message.info("您已被设置为主持人");
      }
      if (acc.account.role === 0) {
        message.info("您已被设置为普通成员");
      }
      setData((prevData: any) => {
        // 确保prevData是一个数组且至少有一个元素
        if (Array.isArray(prevData) && prevData.length > 0) {
          // 创建一个新的数组
          const newData = [...prevData];

          // 更新数组的第一个元素，修改它的role属性
          newData[0] = {
            ...newData[0],
            role: acc.account.role, // 假设您想更新的属性是role
          };
          console.log(newData, "newData");
          // 返回更新后的数组
          return newData;
        }

        // 如果prevData不是数组或为空，则直接返回原状态
        return prevData;
      });
      //角色变成了普通成员
    } else {
      console.log("普通成员");
      //角色变成了主持人
      setData((prevData: any) => {
        // 确保prevData是一个数组且至少有一个元素
        if (Array.isArray(prevData) && prevData.length > 0) {
          // 创建一个新的数组
          const newData = [...prevData];

          // 更新数组的第一个元素，修改它的role属性
          newData[0] = {
            ...newData[0],
            role: acc.account.role, // 假设您想更新的属性是role
          };
          console.log(newData, "newData");
          // 返回更新后的数组
          return newData;
        }

        // 如果prevData不是数组或为空，则直接返回原状态
        return prevData;
      });
    }
    rooms.updateAccount(acc, true);
  };
  // 点击下箭头的处理函数
  const handleNext = () => {
    if (thrStatus) {
      return;
    }
    if (next) {
      return;
    }
    // 确保不会超出数据范围，并且留下至少一个成员来显示
    setNext(true);
    console.log(displayIndex + MAX_DISPLAY_EXCEPT_FIRST);
    console.log(data, "datas");
    if (displayIndex + MAX_DISPLAY_EXCEPT_FIRST < data.length - 1) {
      closeAllActiveStreams(displayedMembers);
      setDisplayIndex(displayIndex + MAX_DISPLAY_EXCEPT_FIRST);
      setTimeout(() => {
        setNext(false);
      }, 500);
    }
  };
  const handlePrev = () => {
    if (thrStatus) {
      return;
    }
    if (prev) {
      return;
    }
    setPrev(true);
    // 确保索引不会小于0
    console.log(Math.max(displayIndex - MAX_DISPLAY_EXCEPT_FIRST, 0));
    if (displayIndex > 0) {
      closeAllActiveStreams(displayedMembers);
      setDisplayIndex(Math.max(displayIndex - MAX_DISPLAY_EXCEPT_FIRST, 0));
      setTimeout(() => {
        setPrev(false);
      }, 500);
    }
  };
  //点击小窗口
  const rightBoxClick = (item: any) => {
    if (chabaShexiangStatus) {
      return;
    }
    setThrStatus(true);
    if (thrStatus) {
      message.info("请不要频繁切换小窗口");
      return;
    }
    //防止重复点击
    if (selectedId == item.id) {
      setThrStatus(false);
      return;
    }

    console.log(item, "点我！");
    console.log(item.id, data, ss, "ahahahhahahahwwwaaa666");

    setSelectedId(item.id); // 更新选中的盒子 id

    setSelectedData(item);
    selectedIdRef.current = item.id;
    selectedDataRef.current = item;
    setIsVideoVisible(false);
    // console.log(selectedData, "selectedData");
    // console.log(data, "data[0]");
    // console.log(ss, "data-ss");
    if (
      item.id === data[0]?.id &&
      ss &&
      Object.keys(ss).length !== 0 &&
      item.video_state == 0
    ) {
      ss.removePlay("videoDom", true);
      ss.addPlay("videoDom");
      setIsVideoVisible(false);
      setVideoSmallStatus(0);
    } else {
      console.log(isSheXiang, "item-shexiang");
      console.log(ss, "item-ss");
      selectedData.stream?.removePlay("videoDom", true);
      if (isSheXiang && Object.keys(ss).length !== 0) {
        console.log("hahaha");
        // ssRef.current.removePlay("videoDom", true);
        ss.removePlay("videoDom", true);

        console.log(selectedData, "isSheXiang");
      }
    }

    //移除小窗口的画面
    if (selectedId == item.id && item.video_state == 0) {
    } else {
      if (selectedData.stream) {
        selectedData.stream.removePlay("videoDom", true);
      }
    }
    // if (selectedData.members && selectedData.video_state == 0) {
    //   console.log(selectedData, "selected");
    //   selectedData.members
    //     .pullVideo({
    //       streamType: 1,
    //       adaptMainSub: true,
    //     })
    //     .then((s: any) => {
    //       console.log(s);
    //       setsa(s);

    //       //这里我们得到了关于视频的VCSStream对象，同样也不需要调用connect，s对象需要自己保存
    //       selectedData.stream = s;
    //       // s.addPlay("videoDom");
    //       // s.addPlay("video-right-time-" + selectedId);
    //     });
    // }
    if (item.id !== data[0].id && item.video_state !== 0) {
      console.log("不是我自己，别人也没开摄像头");
      setThrStatus(false);
      // if (item.stream) {
      //   selectedData.stream.removePlay("videoDom", true);
      // }
      if (
        selectedData.stream &&
        selectedData.members.options.account.video_state == 0
      ) {
        selectedData.stream.removePlay("videoDom", true);
      }
      setVideoSmallStatus(1);
      setIsVideoVisible(true);
    } else if (item.id !== data[0].id && item.video_state == 0) {
      // ss?.removePlay("videoDom", true);
      console.log("我是其他人,且开启了摄像头！");
      setVideoSmallStatus(2);
      setIsVideoVisible(false);
      console.log(item, "item");
      item.members
        .pullVideo({
          streamType: 0,
          adaptMainSub: true,
        })
        .then((s: any) => {
          console.log(s);
          setsa(s);

          //这里我们得到了关于视频的VCSStream对象，同样也不需要调用connect，s对象需要自己保存
          item.stream = s;
          s.addPlay("videoDom");
          setThrStatus(false);
        });
    } else if (item.id == data[0].id && item.video_state !== 0) {
      setThrStatus(false);
      if (
        selectedData.stream &&
        selectedData.members.options.account.video_state == 0
      ) {
        selectedData.stream.removePlay("videoDom", true);
      }
      setIsVideoVisible(true);
      setVideoSmallStatus(3);
    } else {
      setThrStatus(false);
    }
  };
  //清除流
  const closeAllActiveStreams = (displayedMembers: any) => {
    resetActiveStreams();
    displayedMembers.map((item: any) => {
      // console.log(item, "111121212111");
      if (item.stream) {
        if (item.id === selectedData.id) {
          console.log("这种情况");
          item.stream?.removePlay("video-right-time-" + item.id, true);
        } else {
          console.log("清除了窗口");
          item.stream?.removePlay("videoDom", true);
          item.stream?.removePlay("video-right-time-" + item.id, true);
        }
      }
    });
    // activeStreams.forEach((stream: any, memberId: any) => {
    //   console.log(stream, "stream");
    //   stream.close().catch(console.error); // 关闭流并捕获任何错误
    //   activeStreams.delete(memberId); // 从activeStreams中移除
    // });
    // setActiveStreams(new Map()); // 重置activeStreams状态
  };
  const resetActiveStreams = () => {
    activeStreams.forEach((stream: any, memberId: any) => {
      stream?.removePlay("video-right-time-" + memberId, true);
      activeStreams.delete(memberId); // 从activeStreams中移除
    });
    setActiveStreams(new Map()); // 重置activeStreams状态
  };
  //当前展示的成员
  const closeRight = () => {
    setIsClose(!isClose);
  };
  useEffect(() => {
    const roomLeftBox = document.querySelector(".room-left-box");
    const video = document.querySelector(".video");
    const roomRightBox = document.querySelector(".room-right-box");
    if (isClose) {
      // 注意这里直接使用了 !isClose
      roomLeftBox?.classList.add("room-left-box-close");
      roomRightBox?.classList.add("room-right-box-close");
      video?.classList.add("video-close");
    } else {
      roomLeftBox?.classList.remove("room-left-box-close");
      roomRightBox?.classList.remove("room-right-box-close");
      video?.classList.remove("video-close");
    }
  }, [isClose]);
  const zhankaiStatus = () => {
    setIsZhanKai(!iszhankai);
  };
  useEffect(() => {
    const videoBox = document.querySelector(".video");
    const videoRightBox = document.querySelector(".video-right");
    if (iszhankai) {
      videoBox?.classList.add("video-hide");
      videoRightBox?.classList.add("video-right-hide");
    } else {
      videoBox?.classList.remove("video-hide");
      videoRightBox?.classList.remove("video-right-hide");
    }
  }, [iszhankai]);

  //底部弹窗值和事件
  const [value, setValue] = useState("default");
  const [valueTwo, setValueTwo] = useState("");
  const [changeSheXiang, setChangeSheXiang] = useState(false);
  const sheXiangChange = async (e: RadioChangeEvent) => {
    if (isSheXiang) {
      if (changeSheXiang) {
        return;
      }
      setChangeSheXiang(true);
      setSelectedId(displayedMembers[0].id); // 更新选中的盒子 id
      setSelectedData(displayedMembers[0]);
      selectedIdRef.current = displayedMembers[0].id;
      selectedDataRef.current = displayedMembers[0];
      if (ss) {
        await ss.removePlay("videoDom", true);
        await ss.removePlay(`video-right-time-${data[0].id}`, true);
        rooms.updateAccount({ video_state: 1 }, true);
        if (!mirror) {
          ss.setMirror(false);
        }
      }
      if (selectedData && selectedData.stream) {
        selectedData.stream.removePlay("videoDom", true);
      }

      rooms.openVideo({ deviceId: e.target.value }).then((s: any) => {
        //开始推流
        setss(s);
        ssRef.current = s;

        s.connect().then(() => {
          rooms.updateAccount({ video_state: 0 }, true);
          setIsVideoVisible(false);

          s.addPlay("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
          console.log(s.getTrack(), "track");
          s.addPlay(`video-right-time-${data[0].id}`);
          s.setMcuRecord();

          setChangeSheXiang(false);
          if (mirror) {
            s.setMirror(true);
          }
        });
      });
      console.log("radio checked", e.target.value);
    }
    console.log(e.target.value, "hha");
    setValueTwo(e.target.value);
    // sessionStorage.setItem('valueTwoDevice',)
    sessionStorage.setItem("valueTwo", e.target.value);
  };
  const yuyinChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    console.log(
      rooms.getRoom().relieve_astate,
      "rooms.getRoom().relieve_astate"
    );
    if (data[0].role == 0 && rooms.getRoom().relieve_astate == 1) {
      message.info("主持人设置了全体静音，您暂无权限打开麦克风");
      return;
    }
    console.log(aa, "aa");
    if (Object.keys(aa).length !== 0 && aa) {
      aa.close();
    }
    if (isYuYin) {
      rooms.updateAccount({ audio_state: 1 }, true);
      rooms.openAudio({ deviceId: e.target.value }).then((a: any) => {
        //开始推流
        setaa(a);
        aaRef.current = a;

        a.connect().then(() => {
          rooms.updateAccount({ audio_state: 0 }, true);
          // a.play();
        });
      });
    }
    setValue(e.target.value);
    sessionStorage.setItem("valueAudio", e.target.value);
  };
  //点击麦克风的状态
  const yuyinStatus = () => {
    if (audioVis) {
      // message.info("请不要过快切换麦克风");
      return;
    }
    if (data[0].role === 0 && rooms.getRoom().relieve_astate === 1) {
      message.info("主持人设置了全体静音，您暂无权限打开麦克风");
      return;
    }
    setAudioVis(true);
    if (isYuYin) {
      sessionStorage.setItem("isYuYin", "0");
      sessionStorage.setItem("isYuYinStatus", "0");

      aa.close();
      rooms.updateAccount({ audio_state: 1 }, true);
      setAudioVis(false);
    } else {
      sessionStorage.setItem("isYuYin", "1");
      sessionStorage.setItem("isYuYinStatus", "1");

      rooms.openAudio({}).then((a: any) => {
        //开始推流
        setaa(a);
        aaRef.current = a;

        a.connect().then(() => {
          rooms.updateAccount({ audio_state: 0 }, true);
          // a.play();
          setAudioVis(false);
        });
      });
    }
    setIsYuYin(!isYuYin);
  };
  //点击摄像头的状态
  const shipinStatus = () => {
    if (chabaShexiangStatus) {
      //插拔摄像头后没有推流成功时禁止开启或者关闭摄像头
      return;
    }
    //在切换摄像头推流的过程中禁止关闭摄像头
    if (data.length == 0) {
      return;
    }
    if (changeSheXiang) {
      return;
    }
    if (!isGongXiang) {
      message.info("正在共享中，暂停使用视频");
      return;
    }
    if (afterShex) {
      return;
    }
    if (videoVis) {
      message.info("请不要频繁切换摄像头");
      return;
    }

    setVideoVis(true);
    if (isSheXiang) {
      sessionStorage.setItem("isSheXiang", "0");
      sessionStorage.setItem("isSheXiangs", "0");
      ss.removePlay("videoDom", true);
      ss.removePlay(`video-right-time-${data[0].id}`, true);
      ss.removePlay(`video-right-time-null`, true);
      if (!mirror) {
        ss.setMirror(false);
      }
      rooms.updateAccount({ video_state: 1 }, true);
      // if (videoSmallStatus == 2) {
      //   setIsVideoVisible(false);
      // } else {
      //   setIsVideoVisible(true);
      // }
      //判断如果当前选中的窗口不是自己的时候则在关闭视频的时候隐藏
      if (selectedId !== displayedMembers[0].id) {
        setIsVideoVisible(false);
      } else {
        setIsVideoVisible(true);
      }

      setVideoVis(false);
    } else {
      sessionStorage.setItem("isSheXiang", "1");
      sessionStorage.setItem("isSheXiangs", "1");
      if (selectedData && selectedData.stream) {
        selectedData.stream.removePlay("videoDom", true);
      }

      rooms.openVideo({ deviceId: valueTwo }).then((s: any) => {
        //开始推流
        setss(s);
        ssRef.current = s;

        s.connect().then(() => {
          rooms.updateAccount({ video_state: 0 }, true);
          // if (sa) {
          //   sa.stop();
          //   console.log(sa);
          // }
          s.setMcuRecord();
          setIsVideoVisible(false);
          setSelectedId(displayedMembers[0].id); // 更新选中的盒子 id
          setSelectedData(displayedMembers[0]);
          selectedIdRef.current = displayedMembers[0].id;
          selectedDataRef.current = displayedMembers[0];
          console.log(displayedMembers, "displayedMembers");

          // s.removePlay("videoDom", true);
          s.addPlay("videoDom"); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
          s.addPlay(`video-right-time-${data[0].id}`); //调用 play开始播放，dom为一个div元素或者元素的id，sdk内部会在div里创建并管理video标签
          if (mirror) {
            s.setMirror(true);
          }
          setVideoVis(false);
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
  //请求打开你的麦克风
  const allUnMutes = () => {
    setModalTitle("提示");
    setIsCheck(4);
    setCheckboxLabel("主持人请求解除您的静音");
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
    setChecked(e);
    console.log(e, "1");
  };
  //弹窗确认 全体静音 全体解除静音 结束会议
  const handleConfirm = () => {
    if (isCheck == 0 && data[0].role !== 0) {
      console.log("执行确认操作");
      let datas = data;
      let arr: any = [];
      datas.map((item: any) => {
        arr.push(item.id);
      });
      console.log(arr, "arr");
      console.log(datas, "datas");
      console.log(rooms.setMemberState, "setMemberState");
      rooms.setMemberState(undefined, 1);
      console.log(checked, "checked");
      if (checked) {
        rooms.setRoomRelieveAstate(0);
      } else {
        rooms.setRoomRelieveAstate(1);
      }
      // setIsYuYin(false);
      // setChecked(true);
      message.info({
        content: "已开启全体静音",
      });
    } else if (isCheck == 2) {
      if (sessionStorage.getItem("ids")) {
        sessionStorage.setItem("ids", "");
      }
      if (rooms && rooms.getOptions().conf) {
        vcs
          .stopConference({ conf_id: rooms.getOptions().conf.id })
          .then((res: any) => {
            // message.success("结束会议成功");
            clearTimer();
            rooms.close().finally(() => {
              setRooms(null);
              roomsRef.current = null;
            });
            sessionStorage.removeItem("valueTwo");
            sessionStorage.removeItem("valueAudio");

            history.push("/");
          })
          .catch((err: any) => {
            console.log(err);
          });
      }

      // room.client.room.no 会议号
    } else if (isCheck == 3) {
      rooms.close().finally(() => {
        if (id) {
          sessionStorage.setItem("ids", id);
        }
        sessionStorage.removeItem("valueTwo");
        sessionStorage.removeItem("valueAudio");
        setRooms(null);
        roomsRef.current = null;
        clearTimer();
        message.success("退出会议成功！");
        history.push("/");
      });
    } else if (isCheck == 1 && data[0].role !== 0) {
      let datas = data;
      let arr: any = [];
      datas.map((item: any) => {
        arr.push(item.id);
      });
      rooms.setMemberState(undefined, 0);
      rooms.setRoomRelieveAstate(0);

      setIsYuYin(false);
      message.info({
        content: "已解除全体静音",
      });
      setChecked(true);
    } else if (isCheck == 4) {
      setIsYuYin(true);
      sessionStorage.setItem("isYuYin", "1");
      sessionStorage.setItem("isYuYinStatus", "1");
      rooms.openAudio({}).then((a: any) => {
        //开始推流
        setaa(a);
        aaRef.current = a;

        a.connect().then(() => {
          rooms.updateAccount({ audio_state: 0 }, true);
          // a.play();
          setAudioVis(false);
        });
      });
    }
    // 在这里执行确认后的逻辑
  };
  // 设置的弹窗
  // *
  // *
  // *
  // *
  const optionsModal = () => {
    if (!isOptions) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //开启云录制
  const optionTalk = (e: any) => {
    if (e.target.checked) {
      setLu(true);
      console.log(rooms.client.room.id, "rooms");

      vcs
        .startMcu({ room_id: rooms.client.room.id, tasks: "record|mcu" })
        .catch((err: any) => {
          setLu(false);
        });
    } else {
      vcs.stopMcu({ room_id: rooms.client.room.id });
      setLu(false);
    }
    console.log(e.target.checked);
  };
  //开启镜像
  const optionTalks = (e: any) => {
    setMirror(e.target.checked);
    if (e.target.checked) {
      console.log(ss, "ss");
      //判断ss是否为空对象,不为空开启镜像
      if (Object.keys(ss).length !== 0) {
        ss.setMirror(true);
      }
    } else {
      if (Object.keys(ss).length !== 0) {
        ss.setMirror(false);
      }
    }
    console.log(e.target.checked);
  };
  //分辨率
  const optionResolution = (e: any) => {
    setResolutionRadio(e.target.value);
  };
  //共享桌面
  const openModle = () => {
    rooms
      .openScreen({
        withDesktopAudio: false,
        width: resolutionRadio == 2 ? 1920 : 1280,
        height: resolutionRadio == 2 ? 1080 : 720,
        onended: () => {
          //手动停止共享
          console.log("共享推流被停止");
          setIsOptions(true);
          // closeRight();
          // zhankaiStatus();
          setIsClose(false); // 更新状态以关闭面板
          setIsZhanKai(false); // 更新状态以折叠视频面板
          // setIsVideoVisible(true);
          rooms.requestForStopingSharing();
          setIsGongXiang(true);
          setMine(false);
        },
      })
      .then((g: any) => {
        //电子白板1 桌面3 结束0 轨道号不变
        setIsOptions(false);
        console.log(g, "g");
        console.log(mine, "mine");
        setIsGongXiang(false);
        setMine(true);
        rooms.requestForSharing({
          st: 3,
          trackMask: g.options.track.id,
        });
        setGx(g);
        gxRef.current = g; // 存储 gx 到 ref
      });
  };
  //共享电子白板
  const openModleWhite = () => {
    console.log("共享电子白板");
    rooms.requestForSharing({
      st: 1,
    });
    setIsMine(true);
    setIsGongXiang(false);
  };

  useEffect(() => {
    console.log(isMine, "isMine");

    const handleLoad = () => {
      if (!isMine) {
        return;
      }

      const iframeDocument = (iframeRef.current as any)?.contentWindow
        ?.document;
      console.log((iframeRef.current as any)?.contentWindow, "aaaaaa");
      setTimeout(() => {
        (iframeRef.current as any)?.contentWindow.clearAll();
      }, 500);
      if (!lu) {
        return;
      }
      const canvas = iframeDocument?.querySelector("canvas");

      console.log(canvas, "canvas");
      if (canvas) {
        // 逻辑处理
        console.log(canvas, "canvas!!");
        rooms
          .openCustomStream({
            ms: canvas.captureStream(25),
            treamChannel: 1,
            streamType: 0,
          })
          .then((s: any) => {
            // this.canvasStreams = s;
            //播放并开始推流
            s.connect().then(() => {
              s.setMcuRecord();
            }); //开始推流
            canvasRef.current = s;
            setCanvasStreams(s);
          });
      }
    };

    // 添加事件监听
    (iframeRef.current as any)?.addEventListener("load", handleLoad);
    // 清理
    return () => {
      (iframeRef.current as any)?.removeEventListener("load", handleLoad);
    };
  }, [white]);
  const stopShare = () => {
    console.log("共享推流被停止");
    setIsClose(false); // 更新状态以关闭面板
    setIsZhanKai(false); // 更新状态以折叠视频面板
    rooms.requestForStopingSharing();
    setIsGongXiang(true);
    const currentGxs = gxsRef.current;
    const currentGx = gxRef.current; // 从 ref 中获取 gx
    const currentVs = canvasRef.current; // 从 ref 中获取 别人的共享

    currentVs?.close();
    currentGxs?.removePlay("videoDom", true);
    currentGx?.removePlay("videoDom", true);
    setIsVideoVisible(true);
    setWhite(false);
  };
  //顶部气泡弹窗
  const titleContent = (
    <div>
      <p>会话ID: {id}</p>
      <p>SDK版本: {version}</p>
      <p>匹配版本: {version}</p>
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
        key={valueTwo}
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
  const gongxiangContent = (
    <div>
      <div
        style={{
          color: "#333",
          fontSize: "14px",
          paddingBottom: "4px",
          cursor: "pointer",
        }}
        onClick={openModle}
      >
        共享桌面
      </div>
      <div
        style={{
          color: "#333",
          fontSize: "14px",
          paddingBottom: "4px",
          cursor: "pointer",
        }}
        onClick={openModleWhite}
      >
        共享电子白板
      </div>
    </div>
  );

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      let res = await vcs.enumDevices();
      console.log(res, "枚举设备");
      let audioOutputDevices = res.filter(
        (res: any) => res.kind === "audioinput"
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
  //计时器
  // 从sessionStorage获取保存的时间，如果没有，则初始化为 { hours: 0, minutes: 0, seconds: 0 }
  const getInitialTime = () => {
    const savedTime = sessionStorage.getItem("timer");
    return savedTime
      ? JSON.parse(savedTime)
      : { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timer, setTimer] = useState(getInitialTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer: any) => {
        const newSeconds = prevTimer.seconds === 59 ? 0 : prevTimer.seconds + 1;
        const newMinutes =
          prevTimer.seconds === 59
            ? prevTimer.minutes === 59
              ? 0
              : prevTimer.minutes + 1
            : prevTimer.minutes;
        const newHours =
          prevTimer.minutes === 59 && prevTimer.seconds === 59
            ? prevTimer.hours + 1
            : prevTimer.hours;

        const newTimer = {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
        sessionStorage.setItem("timer", JSON.stringify(newTimer));
        return newTimer;
      });
    }, 1000);

    return () => {
      clearTimer();
      clearInterval(intervalId);
    };
  }, []);

  const clearTimer = () => {
    sessionStorage.removeItem("timer");
    setTimer({ hours: 0, minutes: 0, seconds: 0 });
  };

  // 格式化时间为 HH:MM:SS
  const formattedTime = `${String(timer.hours).padStart(2, "0")}:${String(
    timer.minutes
  ).padStart(2, "0")}:${String(timer.seconds).padStart(2, "0")}`;
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
            {!white ? (
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
                    {isYuYin ? (
                      <img
                        src={smallKaiYuYin}
                        alt=""
                      />
                    ) : (
                      <img
                        src={smallGuanYuYin}
                        alt=""
                      />
                    )}

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
            ) : (
              <iframe
                className="video"
                src={`/www/wb/?roomId=${id}&userId=${userId}`}
                style={{ border: "none" }} // 移除iframe的边框
                allowFullScreen // 允许全屏
                ref={iframeRef}
              ></iframe>
            )}

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
            <div
              className="video-right"
              style={{
                minWidth: !isClose ? "20%" : "auto",
                width: !isClose ? "auto" : "20%",
              }}
            >
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
                {displayIndex > 0 ? (
                  <img
                    src={topIcon}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={handlePrev}
                  />
                ) : null}
              </div>
              <div className="video-right-box">
                {displayedMembers &&
                  displayedMembers.length &&
                  displayedMembers.map(
                    (data: any) =>
                      data && (
                        <div
                          // className="video-right-time"
                          id={"video-right-time-" + data.id}
                          className={`video-right-time ${
                            selectedId === data.id ? "highlight" : ""
                          }`}
                          onClick={() => rightBoxClick(data)}
                          key={data.id}
                        >
                          {data.video_state && data.video_state !== 0 ? (
                            <div className="item-avatar">
                              <Avatar
                                icon={<UserOutlined />}
                                size={40}
                              />
                            </div>
                          ) : null}

                          <div className="item-right-bottom">
                            {data.audio_state && data.audio_state == "1" ? (
                              <img
                                src={smallGuanYuYin}
                                alt=""
                              />
                            ) : (
                              <img
                                src={smallKaiYuYin}
                                alt=""
                              />
                            )}

                            <span>{data.nickname}</span>
                          </div>
                        </div>
                      )
                  )}
              </div>
              <div>
                {data.length > 4 &&
                displayIndex + MAX_DISPLAY_EXCEPT_FIRST < data.length - 1 ? (
                  <img
                    src={bottomIcon}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={handleNext}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="room-left-bottom">
            <div className="left-bottom-left">
              <div className="red-point"></div>
              <div className="left-point-text">{formattedTime}</div>
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
              {!isGongXiang && !mine ? (
                <div className="img-box-bottom">
                  <img
                    src={gongxiangIcon}
                    alt=""
                  />
                  <div>共享中</div>
                </div>
              ) : !isGongXiang && mine ? (
                <div
                  className="img-box-bottom"
                  onClick={stopShare}
                >
                  <img
                    src={gongxiangguanIcon}
                    alt=""
                  />
                  <div>停止共享</div>
                </div>
              ) : (
                <div className="img-box-bottom">
                  <img
                    src={gongxiangIcon}
                    alt=""
                  />
                  <div>屏幕共享</div>
                </div>
              )}
              <Popover
                content={gongxiangContent}
                trigger="click"
                onOpenChange={handleOpenChange}
              >
                <DownOutlined
                  size={6}
                  style={{ marginTop: "-20px", marginLeft: "-10px" }}
                />
              </Popover>
              {/* <Dropdown
                menu={{ items }}
                placement="top"
                overlayClassName="room-dropdown"
                trigger={["click"]}
              >
                <DownOutlined
                  size={6}
                  style={{ marginTop: "-20px", marginLeft: "-10px" }}
                />
              </Dropdown> */}
              <div className="img-box-bottom">
                <img
                  src={chengyuanIcon}
                  alt=""
                  onClick={closeRight}
                />
                <div>成员({data.length}人)</div>
              </div>
              <div className="img-box-bottom">
                <img
                  src={shezhiIcon}
                  alt=""
                  onClick={optionsModal}
                />
                <div>设置</div>
              </div>
            </div>
            {data && data.length && data[0].role !== 0 ? (
              <Button
                className="left-bottom-right"
                type="primary"
                onClick={overMute}
              >
                结束会议
              </Button>
            ) : null}

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
                if (typeof item === "object" && item !== null) {
                  return (
                    <div
                      className="right-name-box"
                      key={index}
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        size={40}
                      />
                      <div className="right-name">
                        <div className="name-top">
                          <div>
                            {item.nickname}
                            {index == 0 ? " (我自己)" : ""}
                          </div>
                          <div style={{ textAlign: "left" }}>
                            {item.role && item.role == 4
                              ? "(联席主持人)"
                              : item.role && item.role !== 0
                              ? "(主持人)"
                              : ""}
                          </div>
                        </div>
                        {/* <div className="name-bottom">12</div> */}
                      </div>
                      <div className="right-icon">
                        {item.audio_state == 0 ? (
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
                        {item.video_state == 0 ? (
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
                }
              })}
          </div>
          {isAdmin && !isClose && data && data.length && data[0].role !== 0 ? (
            <div className="room-right-bottom">
              <Button
                className="right-bottom-button"
                onClick={allMute}
                disabled={
                  data && data.length && data[0].role !== 0 ? false : true
                }
              >
                全体静音
              </Button>
              <Button
                className="right-bottom-button"
                onClick={allUnMute}
                disabled={
                  data && data.length && data[0].role !== 0 ? false : true
                }
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
      <Modal
        title="设置"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="room-option-modal"
        footer={null}
      >
        <div className="option-box">
          <div className="option-left">
            <div className="option-left-item">通用设置</div>
          </div>
          <div className="option-right">
            <div className="option-right-item-box">
              {/* <div className="option-right-item">
                <Checkbox onChange={optionTalk}>视频镜像效果</Checkbox>
              </div> */}
              <div
                className="option-right-item"
                style={{ fontSize: "16px" }}
              >
                共享屏幕分辨率
              </div>
              <div className="option-right-item">
                <Radio.Group
                  onChange={optionResolution}
                  value={resolutionRadio}
                >
                  <Radio value={1}>720P</Radio>
                  <Radio value={2}>1080P(默认)</Radio>
                </Radio.Group>
              </div>
              <div className="option-right-item">
                <Checkbox
                  onChange={optionTalk}
                  checked={lu}
                >
                  开启云录制
                </Checkbox>
              </div>
              <div className="option-right-item">
                <Checkbox
                  onChange={optionTalks}
                  checked={mirror}
                >
                  开启镜像
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
