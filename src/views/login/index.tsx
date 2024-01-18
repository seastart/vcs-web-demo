import React from "react";
import HeaderComponent from "../../components/HeaderComponent";
import loginImg from "../../assets/common/login-img.png";
import "./index.scss";
type Props = {};

export default function index({}: Props) {
  return (
    <div className="login-container">
      <HeaderComponent />
      <div className="login-content">
        <div className="login-box-left">
          <div className="left-font">Hello!</div>
          <div className="left-font">欢迎使用Anyconf</div>
          <div className="left-img">
            <img
              src={loginImg}
              alt=""
            />
          </div>
        </div>
        <div className="login-box-right">
          <div className="right-top-login">登录</div>
          <div className="right-top-register">
            <div className="no-register">未注册</div>
            <div className="go-register">去注册账号</div>
          </div>
        </div>
      </div>
    </div>
  );
}
