import { Row, Col, Form, Input, Select, Radio } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { explosiveChemicals } from "../const";

const { TextArea } = Input;

export default function Explosives({ viewClicked }) {
  const [serchText, setSerchText] = useState("");
  const { savedFir } = useSelector((state) => state.createFIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="explosiveChemicals" label="Explosive Chemicals">
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
              {explosiveChemicals.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="explosiveQuantity" label="Quantity">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="exploISManufac" label="Is it Manufacturing Unit?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="sourceOfExplosives" label="Source Of Explosives">
            <TextArea
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="exploParticulars" label="Particulars">
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
