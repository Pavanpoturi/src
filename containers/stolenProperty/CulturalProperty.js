import { useState } from "react";
import { Row, Col, Form, Input, Select, Upload, Button } from "antd";
import { culturalMaterial } from "../FirDetails/Investigation/StolenProperty/const";
import { isEmpty } from "lodash";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
const { TextArea } = Input;

export default function CulturalProperty({
  disable,
  vieiwClicked,
  changeValue,
  handleUpload,
  setculInsuranceCertificateMedia,
  culInsuranceCertificateMedia,
  setuploadedculInsuranceCertificateMedia,
  setasiCertificateMedia,
  asiCertificateMedia,
  setuploadedasiCertificateMedia,
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
          <Form.Item name="materialUsed" label="Material Used">
            {renderDropdownFields(culturalMaterial)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="height"
            label="Height (cm)"
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
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="breadth"
            label="Breadth (cm)"
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
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>

        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="depth"
            label="Depth (cm)"
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
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="weight"
            label="Weight (Kg)"
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
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="culasiCertificateNo" label="ASI Certificate No">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="culinsuranceCertificateNO"
            label="Insurance Certificate NO"
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
            name="culnameOfInsurance"
            label="Name of Insurance Company"
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="ageADBC" label="Age AD/BC">
            <Input
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
                await setculInsuranceCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  culInsuranceCertificateMedia,
                  setculInsuranceCertificateMedia,
                  setuploadedculInsuranceCertificateMedia
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
                  culInsuranceCertificateMedia.length === 1 ||
                  disable ||
                  vieiwClicked
                }
                style={{ width: "100%", marginTop: 30 }}
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
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setasiCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  asiCertificateMedia,
                  setasiCertificateMedia,
                  setuploadedasiCertificateMedia
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
                  asiCertificateMedia.length === 1 || vieiwClicked || disable
                }
                style={{ width: "100%", marginTop: 30 }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CameraFilled />
                  </div>
                  <div style={{ marginLeft: "12px" }}>
                    Upload ASI Certificate
                  </div>
                </div>
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item
            name="culSpecialDetails"
            label="Special Identification Details"
          >
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item name="culRemarks" label="Remarks">
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
