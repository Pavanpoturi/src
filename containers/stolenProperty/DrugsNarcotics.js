import { useState } from "react";
import { Row, Col, Form, Input, Select, Radio, Upload, Button } from "antd";
import {
  drugsWeight,
  drugsLocation,
} from "../FirDetails/Investigation/StolenProperty/const";
import { isEmpty } from "lodash";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
const { TextArea } = Input;

export default function DrugsNarcotics({
  disable,
  vieiwClicked,
  changeValue,
  handleUpload,
  setIsAddressModalVisible,
  setNDPSSelected,
  setlabAnalysisSelected,
  labAnalysisSelected,
  setlabAnalysisMedia,
  labAnalysisMedia,
  setuploadedlabAnalysisMedia,
  setdrugGangSelected,
  drugGangSelected,
  setinterrogationDoneSelected,
  interrogationDoneSelected,
  setdrugReportMedia,
  drugReportMedia,
  setuploadeddrugReportMedia,
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
        <Col span={8} style={{ padding: "12px" }}></Col>{" "}
        <Col span={8} style={{ padding: "12px" }}></Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="weightIn" label="Weight In">
            {renderDropdownFields(drugsWeight)}
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="drugsQuantity"
            label="Quantity"
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
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="drugslocationType" label="Location Type">
            {renderDropdownFields(drugsLocation)}
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="drugsAdress" label="Address">
            {renderDropdownFields([])}
          </Form.Item>
          <div
            className="link linkWithPointer"
            onClick={() => setIsAddressModalVisible(true)}
          >
            Add Address
          </div>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="noticeNDPSACt"
            label="Whether notice U/s 50 NDPS act was issued?"
          >
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={(e) => setNDPSSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}></Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="labAnalysis" label="Is Lab Analysis form filled?">
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={(e) => setlabAnalysisSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item>
            {labAnalysisSelected ? (
              <Upload
                onChange={async (info) => {
                  await setlabAnalysisMedia(info.fileList);
                }}
                customRequest={(options) =>
                  handleUpload(
                    options,
                    labAnalysisMedia,
                    setlabAnalysisMedia,
                    setuploadedlabAnalysisMedia
                  )
                }
                multiple={false}
                maxCount={1}
                className="centerAlignBtn"
              >
                <Button
                  type="primary"
                  className="saveButton"
                  disabled={labAnalysisMedia.length === 1 || vieiwClicked}
                  style={{ width: "100%" }}
                >
                  <div style={{ display: "flex" }}>
                    <div>
                      <CameraFilled />
                    </div>
                    <div style={{ marginLeft: "12px" }}>
                      Upload Lab Analysis Form
                    </div>
                  </div>
                </Button>
              </Upload>
            ) : (
              ""
            )}
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="drugSyndicate"
            label="Is it Drug Syndicate/Cartel/Gang?"
          >
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={(e) => setdrugGangSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="nameOfGang" label="Name of Gang?">
            <Input
              placeholder="Enter here"
              disabled={!drugGangSelected}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="noOfPackets"
            label="Number of Packets?"
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
          <Form.Item name="cultivationType" label="Cultivation Type">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="areaAcres"
            label="Area in Acres"
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
            name="potentialYields"
            label="Potential Yields (Kgs)"
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
            name="optimiumArea"
            label="Optimum Operation Area"
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
            name="plantsNumber"
            label="Plants Number"
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
          <Form.Item name="wheatherCarrier" label="Any Carrier?">
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
          <Form.Item name="whetherTrafficker" label="Trafficker">
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
          <Form.Item name="whetherPeddler" label="Drug Peddler">
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
          <Form.Item name="whetherAddict" label="Drug Addict">
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
            name="whetherInterrogation"
            label="Whether any input shared during joint interrogation"
          >
            <Radio.Group
              disabled={vieiwClicked || disable}
              defaultValue={false}
              onChange={(e) => setinterrogationDoneSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="agencyName" label="Agency Name">
            {interrogationDoneSelected ? (
              <Input
                placeholder="Enter here"
                disabled={vieiwClicked || disable}
                onChange={changeValue}
              />
            ) : null}
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setdrugReportMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  drugReportMedia,
                  setdrugReportMedia,
                  setuploadeddrugReportMedia
                )
              }
              multiple={false}
              maxCount={1}
              className="centerAlignBtn"
            >
              <Button
                type="primary"
                className="saveButton"
                disabled={drugReportMedia.length === 1 || vieiwClicked}
                style={{ width: "100%", marginTop: 30 }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CameraFilled />
                  </div>
                  <div style={{ marginLeft: "12px" }}>Upload Report</div>
                </div>
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item name="drugsRemarks" label="Remarks">
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
