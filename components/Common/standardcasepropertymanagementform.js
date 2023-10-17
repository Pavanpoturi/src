import { useState } from "react";
import { Form, Input, Row, Col, Select, DatePicker, Radio } from "antd";
import { isArray } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  sendToCourtForm,
  transferToOtherPoliceStation,
  returnToVictimForm,
  disposalForm,
  safeCustodyToPolice,
  sendToFSLGovtExaminer,
} from "./formOptions";

const Option = Select.Option;

const optionType = {
  VILLAGE: "VILLAGE",
  RESIDENCY_TYPE: "RESIDENCY_TYPE",
};

export default function StandardCasePropertyManagementForm({
  sendTo,
  changeValue,
}) {
  const [serchText, setSerchText] = useState("");
  const [directionbycourt, setDirectionbycourt] = useState(
    "Diffused/Destruction"
  );

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const renderFieldsWithDropDown = (menuOptions, name) => {
    return name === "directionbycourt" ? (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        value={directionbycourt}
        onSelect={(value) => setDirectionbycourt(value)}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    ) : (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={changeValue}
      >
        {menuOptions.map((item, index) => (
          <Option key={index} value={item.label} label={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "directionbycourt":
        return renderFieldsWithDropDown(
          [
            { name: "Diffused/Destruction", label: "Diffused/Destruction" },
            { name: "ReturnToVictim", label: "Return To Victim" },
            { name: "SafeCustodyToPolice", label: "Safe Custody To Police" },
            { name: "ReturnToAccused", label: "Return To Accused" },
            {
              name: "TransferToOtherPoliceStation",
              label: "Transfer to Other Police Station",
            },
          ],
          name
        );
      case "assigntocustodian":
        return renderFieldsWithDropDown([], name);
      case "districtorunit":
        return renderFieldsWithDropDown([], name);
      case "policestationname":
        return renderFieldsWithDropDown([], name);
      case "courtname":
        return renderFieldsWithDropDown([], name);
      case "datetimeofdisposal":
        return <DatePicker showTime />;
      case "datetimeofrelease":
        return <DatePicker showTime />;
      case "datetime":
        return <DatePicker showTime />;
      case "fslacknowledgementdate":
        return <DatePicker showTime />;
      case "releaseorderdate":
        return <DatePicker />;
      case "datetimeoftransfer":
        return <DatePicker />;
      case "reportrecieved":
        return (
          <Radio.Group>
            {" "}
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        );
      case "propertyrecievedback":
        return (
          <Radio.Group>
            {" "}
            <Radio value={true}>Yes</Radio> <Radio value={false}>No</Radio>
          </Radio.Group>
        );
      default:
        return <Input onChange={changeValue} />;
    }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <Row gutter={24}>
        {sendTo === "Send To Court" &&
          sendToCourtForm.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}
        {sendTo === "Send To Court" &&
          directionbycourt === "Diffused/Destruction" &&
          disposalForm.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}

        {sendTo === "Send To Court" &&
          (directionbycourt === "Return To Victim" ||
            directionbycourt === "Return To Accused") &&
          returnToVictimForm.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}

        {sendTo === "Send To Court" &&
          directionbycourt === "Safe Custody To Police" &&
          safeCustodyToPolice.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}

        {sendTo === "Send To Court" &&
          directionbycourt === "Transfer to Other Police Station" &&
          transferToOtherPoliceStation.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}

        {sendTo === "Send To FSL/Govt Examiner" &&
          sendToFSLGovtExaminer.map((s, i) => {
            return (
              <Col span={20} key={i} style={{ marginBottom: 10 }}>
                <div>
                  <Form.Item name={s.name} label={s.label}>
                    {displayFormItems(s.name)}
                  </Form.Item>
                </div>
              </Col>
            );
          })}
      </Row>
    </div>
  );
}
