import React, { useState } from "react";
import { Modal, Checkbox, Button } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import "./index.scss";
type ConfirmDialogProps = {
  isVisible: boolean;
  isCheck: number;
  onClose: () => void;
  onConfirm: () => void;
  checkboxLabel: string; // checkedbox的文字内容
  modalTitle: string; //弹窗的文字内容
  onCheckboxChange: (checked: boolean) => void; // 这里是处理checkbox更改的函数
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isVisible,
  isCheck,
  onClose,
  onConfirm,
  checkboxLabel, // checkedbox的文字内容
  modalTitle, //弹窗的文字内容
  onCheckboxChange, // 使用这个函数
}) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleOk = () => {
    onConfirm();
    onClose(); // 关闭弹窗
  };

  const handleCancel = () => {
    onClose(); // 关闭弹窗
  };

  const handleChange = (e: CheckboxChangeEvent) => {
    console.log(e.target.checked);
    onCheckboxChange(e.target.checked);
    setIsChecked(e.target.checked);
  };

  return (
    <Modal
      title={modalTitle}
      open={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="全部禁言"
      cancelText="取消"
      centered
      className="room-custom-modal"
      footer={null}
      width={460}
    >
      {isCheck === 0 ? (
        <>
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
            className="modal-checked"
          >
            {checkboxLabel}
          </Checkbox>
          <div className="custom-button">
            <Button
              className="modal-button-btn-default"
              type="primary"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="modal-button-btn"
              type="primary"
              onClick={handleOk}
            >
              全体静音
            </Button>
          </div>
        </>
      ) : isCheck === 1 ? (
        <div>
          {checkboxLabel}
          <div className="custom-button">
            <Button
              className="modal-button-btn-default"
              type="primary"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="modal-button-btn"
              type="primary"
              onClick={handleOk}
            >
              确定
            </Button>
          </div>
        </div>
      ) : isCheck === 2 ? (
        <div style={{ textAlign: "center" }}>
          {checkboxLabel}
          <div className="custom-button">
            <Button
              className="modal-button-btn-over-default"
              type="primary"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="modal-button-btn-over"
              type="primary"
              onClick={handleOk}
            >
              确定
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          {checkboxLabel}
          <div className="custom-button">
            <Button
              className="modal-button-btn-default"
              type="primary"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="modal-button-btn"
              type="primary"
              onClick={handleOk}
            >
              确定
            </Button>
          </div>
        </div>
      )}
      {/* <>
        <Checkbox
          checked={isChecked}
          onChange={handleChange}
          className="modal-checked"
        ></Checkbox>
        <div className="custom-button">
          <Button
            className="modal-button-btn-default"
            type="primary"
            onClick={handleCancel}
          >
            取消
          </Button>
          <Button
            className="modal-button-btn"
            type="primary"
            onClick={handleOk}
          >
            全体静音
          </Button>
        </div>
      </> */}
    </Modal>
  );
};

export default ConfirmDialog;
