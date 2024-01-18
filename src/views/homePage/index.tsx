import React from "react";
import HeaderComponent from "../../components/HeaderComponent";
import "./index.scss";
import jishiIcon from "../../assets/common/home-page-jishi.png";
import jiaruIcon from "../../assets/common/home-page-jiaru.png";
type Props = {};

export default function index({}: Props) {
  return (
    <div className="home-page-container">
      <HeaderComponent />
      <div className="home-page-content">
        {/* 盒子 */}
        <div className="home-page-box">
          <div className="home-page-img">
            <img src={jishiIcon} />
          </div>
          <div className="home-page-name">即时会议</div>
        </div>
        <div className="home-page-box">
          <div className="home-page-img">
            <img src={jiaruIcon} />
          </div>
          <div className="home-page-name">加入会议</div>
        </div>
      </div>
    </div>
  );
}
