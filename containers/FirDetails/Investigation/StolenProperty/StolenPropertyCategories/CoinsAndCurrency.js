import { useState } from "react";
import { Row, Col, Form, Input, Select, Radio } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { natureOFStolenCoins, coinsDenomination } from "../const";

const { TextArea } = Input;

export default function CoinsAndCurrency({ viewClicked }) {
  const [serchText, setSerchText] = useState("");

  const { savedFir } = useSelector((state) => state.createFIR);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="countryOfOrigin" label="Country of Origin">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {natureOFStolenCoins.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="denomination" label="Denomination">
            <Select
              allowClear
              placeholder="Select"
              mode="multiple"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {coinsDenomination.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="series" label="Series">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="waterMark" label="Watermark?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="securityThread" label="Security Thread?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="serialNumber" label="Serial Number">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="flouroscence" label="Fluorescence (Under UV light)?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="cracklingSound" label="Crackling Sound?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="numberOfPiecesOfCurrency"
            label="No. of Pieces in Currency"
            rules={[
              {
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="quality" label="Quality">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="CoinsQuantity" label="Quantity">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {["High", "Low", "Others"].map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={20} style={{ padding: "12px" }}>
          <Form.Item name="coinsRemarks" label="Remarks">
            <TextArea
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
