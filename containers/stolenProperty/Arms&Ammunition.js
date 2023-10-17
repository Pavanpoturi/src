import { useState } from "react";
import { Row, Col, Form, Input, Select, Radio, Upload, Button } from "antd";
import {
  armsCategory,
  armsMake,
  armsCountry,
  armsBoreValues,
} from "../FirDetails/Investigation/StolenProperty/const";
import { isEmpty } from "lodash";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
const { TextArea } = Input;

export default function ArmsAndAmmunition({
  disable,
  vieiwClicked,
  changeValue,
  handleUpload,
  armsInsuranceCertificateMedia,
  setarmsInsuranceCertificateMedia,
  setuploadedarmsInsuranceCertificateMedia,
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
          <Form.Item name="armspropertytCategory" label="Property Category">
            {renderDropdownFields(armsCategory)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsManufacturer" label="Make (Manufacturer)">
            {renderDropdownFields(armsMake)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsMade" label="Made">
            {renderDropdownFields(armsMake)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsBore" label="Bore">
            {renderDropdownFields(armsBoreValues)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsModel" label="Model">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="armsQuantity"
            label="Quantity"
            rules={[
              {
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="armsLicensed" label="Licensed?">
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
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="armsisManufacturingUnit"
            label="Is it Manufacturing Unit?"
            onChange={changeValue}
          >
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="sourceOfArm" label="Source Of Arm">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="countryOfDesign" label="Country Of Design">
            {renderDropdownFields(armsCountry)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="weaponNumber" label="Weapon Number">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsInsuranceCerNo" label="Insurance Certificate NO">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="armsspecialMarksOfIdentification"
            label="Special Marks Of Identification"
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="armsNameOfInsurance"
            label="Name of Insurance Company"
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item name="armsRemarks" label="Remarks">
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>

        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setarmsInsuranceCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  armsInsuranceCertificateMedia,
                  setarmsInsuranceCertificateMedia,
                  setuploadedarmsInsuranceCertificateMedia
                )
              }
              multiple={false}
              maxCount={1}
              className="centerAlignBtn"
            >
              <Button
                type="primary"
                className="saveButton"
                disabled={
                  armsInsuranceCertificateMedia.length === 1 ||
                  vieiwClicked ||
                  disable
                }
                style={{ width: "100%" }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CameraFilled />
                  </div>
                  <div style={{ marginLeft: "12px" }}>
                    Upload Insurance Certificate
                  </div>
                </div>
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
