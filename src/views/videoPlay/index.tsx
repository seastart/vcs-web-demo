import React from "react";
import HeaderComponent from "../../components/HeaderComponent";

type Props = {};

import "./index.scss";
export default function Index({}: Props) {
  return (
    <div className="video-play-container">
      <HeaderComponent />
      <div className="play-content">
        <div className="play-top">
          <div className="text-top">某某某的个人会议室</div>
          <div className="text-bottom">会议ID：666666</div>
        </div>
        <div className="play"></div>
      </div>
    </div>
  );
}
