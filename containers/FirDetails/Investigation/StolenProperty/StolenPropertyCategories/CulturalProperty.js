import { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Upload, Button } from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import { culturalMaterial } from "../const";
import { useSelector } from "react-redux";
const { TextArea } = Input;

export default function CulturalProperty({
  handleUpload,
  viewClicked,
  setUploadedCulInsuranceCertificateMedia,
  setUploadedAsiCertificateMedia,
}) {
  const [serchText, setSerchText] = useState("");
  const [culInsuranceCertificateMedia, setCulInsuranceCertificateMedia] =
    useState([]);
  const [asiCertificateMedia, setAsiCertificateMedia] = useState([]);
  const { actionType, successMessage } = useSelector(
    (state) => state.stolenProperty
  );

  const { savedFir } = useSelector((state) => state.createFIR);

  const isSuccess =
    actionType === "ADD_STOLEN_PROPERTY_SUCCESS" ||
    actionType === "UPDATE_STOLEN_PROPERTY_SUCCESS";

  const isError =
    actionType === "ADD_STOLEN_PROPERTY_ERROR" ||
    actionType === "UPDATE_STOLEN_PROPERTY_ERROR";

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Stolen Property Successfully Added" ||
        successMessage === "Stolen Property Successfully Updated"
      ) {
        setAsiCertificateMedia([]);
        setCulInsuranceCertificateMedia([]);
      }
    }
  }, [actionType]);

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
          <Form.Item name="materialUsed" label="Material Used">
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
              {culturalMaterial.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="culasiCertificateNo" label="ASI Certificate No">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="ageADBC" label="Age AD/BC">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setCulInsuranceCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  culInsuranceCertificateMedia,
                  setCulInsuranceCertificateMedia,
                  setUploadedCulInsuranceCertificateMedia
                )
              }
              multiple={false}
              maxCount={1}
            >
              <Button
                className="saveButton"
                disabled={
                  culInsuranceCertificateMedia.length === 1 ||
                  viewClicked ||
                  disableForm
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
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setAsiCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  asiCertificateMedia,
                  setAsiCertificateMedia,
                  setUploadedAsiCertificateMedia
                )
              }
              multiple={false}
              maxCount={1}
            >
              <Button
                className="saveButton"
                disabled={
                  asiCertificateMedia.length === 1 || viewClicked || disableForm
                }
                style={{ width: "100%" }}
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
        <Col span={20}>
          <Form.Item
            name="culSpecialDetails"
            label="Special Identification Details"
          >
            <TextArea
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="culRemarks" label="Remarks">
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
