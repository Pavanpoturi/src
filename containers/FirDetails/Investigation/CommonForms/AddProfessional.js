import { useState } from "react";
import { Modal, Form, Col, Row, Input } from "antd";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { setRules } from "@components/Common/helperMethods";
import { designationList } from "../../../const";

const addProfessionalForms = [
  {
    name: "name",
    label: "Name",
    type: "text",
  },
  {
    name: "surname",
    label: "Surname",
    type: "text",
  },
  { name: "designation", label: "Designation", type: "dropdown" },
  {
    name: "placeOfWork",
    label: "Place of Work",
    type: "dropdown",
  },
];

export default function AddProfessional({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  checkFields,
  disabled,
}) {
  const [serchText, setSerchText] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "designation":
        return renderFieldsWithDropDown(
          designationList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      default:
        return (
          <Input
            onChange={checkFields}
            maxLength={150}
            style={{ width: 300 }}
            disabled={disabled}
            rules={setRules("text")}
          />
        );
    }
  };

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      okText="Add"
      okButtonProps={{ disabled: disabled }}
    >
      <Form form={formName} layout="vertical">
        <Row gutter={24} style={{ paddingLeft: 10 }}>
          {addProfessionalForms.map((s, i) => {
            return (
              <Col span={10} key={i} style={{ margin: 10 }}>
                <Form.Item
                  name={s.name}
                  label={s.label}
                  rules={setRules(s.type)}
                >
                  {displayFormItems(s.name)}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
}
