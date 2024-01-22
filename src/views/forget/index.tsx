import React, { useState } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import { useHistory } from "react-router-dom";
import loginImg from "../../assets/common/login-img.png";
import passwordIcon from "../../assets/common/passwrod-rule.png";
import userIcon from "../../assets/common/user-rule.png";
import ruleIcon from "../../assets/common/rule-icon.png";
import noCheckedIcon from "../../assets/common/no-checked.png";
import isCheckedIcon from "../../assets/common/is-checked.png";
import { Form, Input, Button } from "antd";
import "./index.scss";
type Props = {};

export default function Index({}: Props) {
  const history = useHistory();

  const [isChecked, setIsChekced] = useState<Boolean>(false);
  //提交
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const appect = () => {
    setIsChekced(!isChecked);
  };
  const goLogin = () => {
    history.push("/login");
  };
  return (
    <div className="forget-container">
      <HeaderComponent />
      <div className="login-content">
        <div className="login-box-right">
          <div className="right-top-login">忘记密码</div>

          <div className="right-from">
            <Form
              name="basic"
              wrapperCol={{ span: 21 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ position: "relative" }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "请输入您的手机号" }]}
              >
                <Input
                  style={{ height: "40px", paddingLeft: "25px" }}
                  placeholder="请输入您的手机号"
                />
              </Form.Item>
              <img
                src={userIcon}
                alt=""
                className="user-icon"
              />
              <Form.Item
                name="rule"
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <Input
                  style={{
                    height: "40px",
                    width: "256px",
                    marginLeft: "-138px",
                  }}
                  placeholder="请输入验证码"
                />
              </Form.Item>
              <Button className="btn-send">发送验证码</Button>
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
                  placeholder="密码由8-16位大/小写英文字母和数字组成"
                />
              </Form.Item>
              <img
                src={passwordIcon}
                alt=""
                className="pass-icon"
              />
              <Form.Item
                name="passwordAgain"
                rules={[
                  {
                    required: true,
                    message: "请再次输入密码",
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
                  placeholder="请再次输入密码"
                />
              </Form.Item>
              <img
                src={passwordIcon}
                alt=""
                className="rule-icon"
              />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-buttons"
                  style={{
                    background: "#0039B3",
                    width: "100%",
                    height: "40px",
                    marginTop: "10px",
                  }}
                >
                  确定
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
