import React, { useEffect, useState, useContext } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import { useHistory } from "react-router-dom";
import loginImg from "../../assets/common/login-img.png";
import passwordIcon from "../../assets/common/passwrod-rule.png";
import userIcon from "../../assets/common/user-rule.png";
import ruleIcon from "../../assets/common/rule-icon.png";
import noCheckedIcon from "../../assets/common/no-checked.png";
import isCheckedIcon from "../../assets/common/is-checked.png";
import { Form, Input, Button, message } from "antd";
import "./index.scss";
import { VCSContext } from "../../VCSContext";
import { useSelector } from "react-redux";

type Props = {};

export default function Index({}: Props) {
  const history = useHistory();
  const vcs = useSelector((state: any) => state.vcsClient);
  console.log(vcs, "1111");
  const [isChecked, setIsChekced] = useState<Boolean>(false);
  const [vcss, setVcss] = useState(vcs);
  useEffect(() => {
    setVcss(vcs);
  }, []);
  //提交
  const onFinish = (values: any) => {
    console.log("Success:", values);
    if (!isChecked) {
      message.info("请阅读并同意协议");
      return;
    }
    vcss
      .login({
        loginname: values.username,
        password: values.password,
        vscode: "8888",
      })
      .then((r: any) => {
        console.log(r);
        if (r.code === 200) {
          sessionStorage.setItem("token", r.data.token);
          sessionStorage.setItem("nickname", r.data.account.nickname);
          console.log(r);
          message.success("登录成功");
          history.push("/");
        }
        //这里的r 就是登录后返回的帐号信息
        //r.cod  200表示成功
        //r.msg  错误描述
        //r.data 登录数据
        //r.data.token    登录token
        //r.data.account   登录帐号信息
        //r.data.corp    登录的企业
        //r.data.corp_role   在企业里的角色
        //r.org         在企业里的组织
      })
      .catch((err: any) => {
        console.log(err, "1");
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const appect = () => {
    setIsChekced(!isChecked);
  };
  const goRegister = () => {
    history.push("/register");
  };
  const goForget = () => {
    history.push("/forget");
  };

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
              className="left-image"
            />
          </div>
        </div>
        <div className="login-box-right">
          <div className="right-top-login">登录</div>
          <div className="right-top-register">
            <div className="no-register">未注册</div>
            <div
              className="go-register"
              onClick={goRegister}
            >
              去注册账号
            </div>
          </div>
          <div className="right-from">
            <Form
              name="basic"
              wrapperCol={{ span: 21 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ position: "relative" }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入您的账号" }]}
              >
                <Input
                  style={{ height: "40px", paddingLeft: "25px" }}
                  placeholder="请输入您的账号"
                />
              </Form.Item>
              <img
                src={userIcon}
                alt=""
                className="user-icon"
              />
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                  {
                    pattern: new RegExp(
                      /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/
                    ),
                    message: "格式错误，密码由8-16位大/小写英文字母和数字组成",
                  },
                ]}
              >
                <Input.Password
                  style={{ height: "40px", paddingLeft: "25px" }}
                  placeholder="请输入密码"
                />
              </Form.Item>
              <img
                src={passwordIcon}
                alt=""
                className="pass-icon"
              />
              {/* <Form.Item
                name="rule"
                rules={[
                  {
                    required: true,
                    message: "请输入验证码",
                  },
                ]}
              >
                <Input
                  style={{ height: "40px", paddingLeft: "25px" }}
                  placeholder="请输入验证码"
                />
              </Form.Item>
              <img
                src={ruleIcon}
                alt=""
                className="rule-icon"
              /> */}
              <div
                className="right-forget"
                // onClick={goForget}
              >
                忘记密码?
              </div>
              <div className="right-accect-box">
                <div className="right-icon-box">
                  {!isChecked ? (
                    <img
                      src={noCheckedIcon}
                      alt=""
                      className="right-icons"
                      onClick={appect}
                    />
                  ) : (
                    <img
                      src={isCheckedIcon}
                      alt=""
                      className="right-icons"
                      onClick={appect}
                    />
                  )}
                </div>
                <div className="right-xieyi">
                  我已阅读并同意<span>《服务协议》</span>和
                  <span>《隐私政策》</span>
                </div>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
                  style={{
                    background: "#0039B3",
                    width: "100%",
                    height: "40px",
                    marginTop: "24px",
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
            {/* <Button
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
