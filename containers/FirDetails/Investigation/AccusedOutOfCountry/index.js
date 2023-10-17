import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Checkbox,
  DatePicker,
  Upload,
} from "antd";
import {
  dummyRequest,
  requestStatus,
  cricularRequestStatus,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import { CameraOutlined } from "@ant-design/icons";
import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { disableFutureDates } from "@components/Common/helperMethods";
import { getFileById } from "@containers/media-util";

const styles = {
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    marginTop: 20,
  },
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function AccusedOutOfCountry(props) {
  const {
    renderFieldsWithDropDown,
    checkFields,
    disabled,
    selectedRecord,
    selectednbwStatus,
    selectedcircularStatus,
    setselectednbwStatus,
    setSelectedcircularStatus,
    setNbwURL,
    fileList,
  } = props;
  const isRecordsAvailable = !isUndefined(selectedRecord);

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const fileListResult = !isEmpty(fileList) ? fileList : [];

  const {
    nbwReceivedDateTime = "",
    nbwStatus = "",
    requestedOn = "",
  } = isRecordsAvailable && selectedRecord?.requestCourtNBW;
  const { circularApprovedDate = "", circularStatus = "" } =
    !isUndefined(nbwReceivedDateTime) &&
    !isUndefined(selectedRecord?.requestToCircular) &&
    selectedRecord?.requestToCircular;

  const displayRequestStatus = (title, value) => {
    return (
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <span style={{ color: "#707070" }}>{title}</span>
        </Col>
        <Col span={12}>
          <span
            style={{
              marginLeft: "15%",
              color: value === "Rejected" ? "red" : "#258C0B",
            }}
          >
            {value}
          </span>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <div className="widgetPageStyle">
        <Card style={{ marginTop: 20, width: "100%" }}>
          <Row glutter={24}>
            <Col span={10}>
              <Form.Item
                name="requestForNBW"
                valuePropName="checked"
                className="requestForNBW"
                style={{ marginBottom: 15 }}
              >
                <Checkbox disabled={disabled} onChange={checkFields}>
                  Request to Court to issue NBW
                </Checkbox>
              </Form.Item>
              <Form.Item
                name="nbwRequestedDate"
                label="NBW Request Date"
                style={{ marginBottom: 15 }}
                rules={[
                  {
                    required: true,
                    message: "NBW Request Date!",
                  },
                ]}
              >
                <DatePicker
                  disabled={disabled}
                  onChange={checkFields}
                  format={DATE_FORMAT}
                  style={{ width: 240 }}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
              <Form.Item
                name="dateTime"
                label="Accused Out Of Country On"
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  disabled={disabled}
                  onChange={checkFields}
                  showTime
                  format={DATE_TIME_FORMAT}
                  placeholder="Select Date & Time"
                  style={{ width: 240 }}
                  disabledDate={disableFutureDates}
                />
              </Form.Item>
            </Col>
            {!requestedOn ? (
              <Col span={8}>
                <Form.Item
                  name="nbwStatus"
                  label="NBW Request Status"
                  style={{ marginBottom: 15 }}
                >
                  {renderFieldsWithDropDown(
                    requestStatus,
                    setselectednbwStatus,
                    240
                  )}
                </Form.Item>
                <Form.Item
                  name="nbwReceivedDateTime"
                  label="NBW Received Date & Time"
                  style={{ marginBottom: 15 }}
                  rules={[
                    {
                      required: selectednbwStatus !== "Rejected" ? true : false,
                      message: "NBW Received Date & Time!",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    format={DATE_TIME_FORMAT}
                    placeholder="Select Date & Time"
                    disabled={disabled}
                    onChange={checkFields}
                    style={{ width: 240 }}
                  />
                </Form.Item>
                <Form.Item name="nbwURL">
                  <Upload
                    fileList={fileListResult}
                    customRequest={dummyRequest}
                    onChange={(info) => onFileChange(info, setNbwURL)}
                    onPreview={handleDownload}
                    multiple={false}
                  >
                    <Button
                      className="saveButton"
                      style={{ width: 240 }}
                      size="large"
                      icon={<CameraOutlined className="saveButtonIcon" />}
                      disabled={disabled}
                    >
                      Upload NBW from Court
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            ) : null}

            {isRecordsAvailable && selectedRecord?.requestCourtNBW ? (
              <Col span={8} style={{ marginTop: 20 }}>
                {requestedOn &&
                  displayRequestStatus(
                    "Requested On",
                    moment(requestedOn).format(DATE_FORMAT)
                  )}
                {nbwStatus &&
                  displayRequestStatus("NBW Request Status", nbwStatus)}
                {nbwReceivedDateTime &&
                  displayRequestStatus(
                    "NBW Received On",
                    moment(nbwReceivedDateTime).format(DATE_TIME_FORMAT)
                  )}
              </Col>
            ) : null}
          </Row>
        </Card>
      </div>
      {nbwReceivedDateTime && nbwStatus !== "Rejected" ? (
        <Card style={{ marginTop: 20, width: "100%" }}>
          <Row glutter={24}>
            <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
              <div style={styles.widgetPageStyle}>
                <div>
                  <Form.Item
                    valuePropName="checked"
                    name="requestForCircular"
                    style={{ marginBottom: 10 }}
                  >
                    <Checkbox disabled={disabled} onChange={checkFields} />
                  </Form.Item>
                </div>
                <div style={{ marginTop: 5 }}>
                  <span
                    style={{
                      paddingLeft: 8,
                      verticalAlign: "text-bottom",
                    }}
                  >
                    Request to Lookout Circular (Additional DGP, CID)
                  </span>
                </div>
              </div>
              <Form.Item
                name="circularRequestedDate"
                label="Lookout Circular Request Date"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Lookout Circular Request Date!",
                  },
                ]}
              >
                <DatePicker
                  format={DATE_FORMAT}
                  disabled={disabled}
                  onChange={checkFields}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Col>
            {selectedRecord?.requestToCircular?.requestedOn ? (
              <Col span={8}>
                <Form.Item
                  name="circularStatus"
                  label="Lookout Circular Request Status"
                  style={{ marginBottom: 10 }}
                >
                  {renderFieldsWithDropDown(
                    cricularRequestStatus,
                    setSelectedcircularStatus,
                    200
                  )}
                </Form.Item>
                <Form.Item
                  name="circularApprovedDate"
                  label="Lookout Approved Date & Time"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required:
                        selectedcircularStatus !== "Rejected" ? true : false,
                      message: "Lookout Approved Date & Time!",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    format={DATE_TIME_FORMAT}
                    placeholder="Select Date & Time"
                    disabled={disabled}
                    onChange={checkFields}
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            ) : null}

            {isRecordsAvailable && selectedRecord?.requestToCircular ? (
              <Col span={8} style={{ marginTop: 20 }}>
                {selectedRecord?.requestToCircular?.requestedOn &&
                  displayRequestStatus(
                    "Requested On",
                    moment(
                      selectedRecord?.requestToCircular?.requestedOn
                    ).format(DATE_FORMAT)
                  )}
                {circularStatus &&
                  displayRequestStatus(
                    "Lookout Circular Status",
                    circularStatus
                  )}
                {circularApprovedDate &&
                  displayRequestStatus(
                    "Approved On",
                    moment(circularApprovedDate).format(DATE_TIME_FORMAT)
                  )}
              </Col>
            ) : null}
          </Row>
        </Card>
      ) : null}
    </>
  );
}
