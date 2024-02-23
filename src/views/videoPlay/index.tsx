import React, { useEffect } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

type Props = {};

import "./index.scss";
export default function Index({}: Props) {
  const vcs = useSelector((state: any) => state.vcs.vcsClient);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  console.log(id, "qieryParams");
  useEffect(() => {
    vcs.listFile({ path: `/mcu/${id}`, limit: 100 }).then((res: any) => {
      console.log(res, "res!!");
    });
  }, []);
  return (
    <div className="video-play-container">
      <HeaderComponent />
      <div className="play-content">
        <div className="play-top">
          <div className="text-top">个人会议室</div>
          <div className="text-bottom">会议ID：{id}</div>
        </div>
        <video className="play"></video>
      </div>
    </div>
  );
}