import { useState } from "react";
import { Row, Col, Form, Input, Select, Radio } from "antd";
import {
  coinsDenomination,
  natureOFStolenCoins,
} from "../FirDetails/Investigation/StolenProperty/const";
import { isEmpty } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function CoinsAndCurrency({
  disable,
  vieiwClicked,
  changeValue,
}) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const renderDropdownFields = (data) => (
    <Select
      allowClear
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      onSearch={handleSearch}
      filterOption={(input, option) =>
        searchText &&
        option.props?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onSelect={changeValue}
      disabled={vieiwClicked || disable}
      placeholder="Select"
    >
      {!isEmpty(data) &&
        data.map((item, _index) => (
          <Select.Option key={item} value={item} label={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="countryOfOrigin" label="Country of Origin">
            {renderDropdownFields(natureOFStolenCoins)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="denomination"
            label="Denomination"
            rules={[
              {
                required: true,
              },
            ]}
          >
            {renderDropdownFields(coinsDenomination)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="series" label="Series">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="waterMark" label="Watermark?">
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={changeValue}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="securityThread" label="Security Thread?">
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={changeValue}
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
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="flouroscence" label="Fluorescence (Under UV light)?">
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={changeValue}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="cracklingSound" label="Crackling Sound?">
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={changeValue}
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
                required: true,
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="quality" label="Quality">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ padding: "12px" }}>
          <Form.Item
            name="coinsRemarks"
            label="Remarks"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
