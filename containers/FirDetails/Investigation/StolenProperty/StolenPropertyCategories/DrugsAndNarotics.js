import { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Upload, Button, Radio } from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import { drugsLocation, drugsWeight } from "../const";
import { useSelector } from "react-redux";
const { TextArea } = Input;

export default function DrugsAndNarotics({
  handleUpload,
  viewClicked,
  setUploadedLabAnalysisMedia,
  setUploadedDrugReportMedia,
  interrogationDoneSelected,
  setInterrogationDoneSelected,
  drugGangSelected,
  setDrugGangSelected,
  labAnalysisSelected,
  setlabAnalysisSelected,
  setIsAddressModalVisible,
  setNDPSSelected,
}) {
  const [serchText, setSerchText] = useState("");
  const [drugReportMedia, setDrugReportMedia] = useState([]);
  const [labAnalysisMedia, setLabAnalysisMedia] = useState([]);
  const { actionType, successMessage } = useSelector(
    (state) => state.stolenProperty
  );

  const { savedFir } = useSelector((state) => state.createFIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

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
        setDrugReportMedia([]);
        setLabAnalysisMedia([]);
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  return (
    <div>
      <Row>
        <Col span={8} style={{ padding: "12px" }}></Col>{" "}
        <Col span={8} style={{ padding: "12px" }}></Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="weightIn" label="Weight In">
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
              {drugsWeight.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="drugsQuantity" label="Quantity">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="drugslocationType" label="Location Type">
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
              {drugsLocation.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="drugsAdress" label="Address">
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
              {[].map((_item, _index) => (
                <Select.Option />
              ))}
            </Select>
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
                  await setLabAnalysisMedia(info.fileList);
                }}
                customRequest={(options) =>
                  handleUpload(
                    options,
                    labAnalysisMedia,
                    setLabAnalysisMedia,
                    setUploadedLabAnalysisMedia
                  )
                }
                multiple={false}
                maxCount={1}
              >
                <Button
                  className="saveButton"
                  disabled={labAnalysisMedia.length === 1 || viewClicked}
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
            ) : null}
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="drugSyndicate"
            label="Is it Drug Syndicate/Cartel/Gang?"
          >
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
              onChange={(e) => setDrugGangSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="nameOfGang" label="Name of Gang?">
            <Input placeholder="Enter here" disabled={!drugGangSelected} />
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
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="cultivationType" label="Cultivation Type">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
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
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="wheatherCarrier" label="Any Carrier?">
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
          <Form.Item name="whetherTrafficker" label="Trafficker">
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
          <Form.Item name="whetherPeddler" label="Drug Peddler">
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
          <Form.Item name="whetherAddict" label="Drug Addict">
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
            name="whetherInterrogation"
            label="Whether any input shared during joint interrogation"
          >
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={false}
              onChange={(e) => setInterrogationDoneSelected(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {interrogationDoneSelected ? (
          <Col span={8} style={{ padding: "12px" }}>
            <Form.Item name="agencyName" label="Agency Name">
              <Input
                placeholder="Enter here"
                disabled={viewClicked || disableForm}
              />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setDrugReportMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  drugReportMedia,
                  setDrugReportMedia,
                  setUploadedDrugReportMedia
                )
              }
              multiple={false}
              maxCount={1}
            >
              <Button
                className="saveButton"
                disabled={
                  drugReportMedia.length === 1 || viewClicked || disableForm
                }
                style={{ width: "100%" }}
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
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
