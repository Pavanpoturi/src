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
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  getDaysOfWeeks,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import { isEmpty } from "lodash";
import TextArea from "antd/lib/input/TextArea";
import { CameraOutlined } from "@ant-design/icons";
import { textAreaRules } from "@components/Common/formOptions";
import { useSelector } from "react-redux";
import { useState } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { getFileById } from "@containers/media-util";

const { RangePicker } = DatePicker;

export default function HighCourtDirections(props) {
  const {
    renderFieldsWithDropDown,
    disabled,
    checkFields,
    form,
    setCourtOrderDocumentURL,
    fileList,
  } = props;
  const { highCourtDirectionsList } = useSelector((state) => state.MasterData);
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);

  const onChangeIO = (val) => {
    checkFields();
    setToAppearBeforeIo(val);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const fileListResult = !isEmpty(fileList) ? fileList : [];

  return (
    <div className="widgetPageStyle">
      <Card style={{ marginTop: 20, width: "100%" }}>
        <Row glutter={24} style={{ marginBottom: 10 }}>
          <Col span={8}>
            <Form.Item name="receivedDateTime" label="Received On">
              <DatePicker
                showTime
                format={DATE_TIME_FORMAT}
                placeholder="Select Date & Time"
                disabled={disabled}
                style={{ width: 220 }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="dateTime"
              label="Date & Time of High Court Directions"
            >
              <DatePicker
                disabled={disabled}
                onChange={checkFields}
                showTime
                format={DATE_TIME_FORMAT}
                placeholder="Select Date & Time"
                style={{ width: 200 }}
                disabledDate={disableFutureDates}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row glutter={24}>
          <Col span={10} style={{ marginBottom: 10 }}>
            <Form.Item
              name="highCourtDirection"
              label="High Court Directions"
              style={{ marginBottom: 10 }}
            >
              {renderFieldsWithDropDown(
                highCourtDirectionsList,
                null,
                220,
                false,
                disabled
              )}
            </Form.Item>
            <Form.Item name="courtOrderDocumentURL">
              <Upload
                customRequest={dummyRequest}
                fileList={fileListResult}
                onChange={(info) =>
                  onFileChange(info, setCourtOrderDocumentURL)
                }
                onPreview={handleDownload}
                multiple={false}
              >
                <Button
                  className="saveButton"
                  style={{ width: 270 }}
                  size="large"
                  icon={<CameraOutlined className="saveButtonIcon" />}
                  disabled={disabled}
                >
                  Upload Court Order Document
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name="conditionsImposed"
              label="Conditions Imposed"
              rules={[textAreaRules.textAreaMaxLength]}
            >
              <TextArea
                style={{ height: "100px" }}
                maxLength={textAreaRules}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Form.Item name="toAppearBeforeIo" valuePropName="checked">
              <Checkbox
                disabled={disabled}
                onChange={(e) => onChangeIO(e.target.checked)}
              >
                To appear before IO?
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cooperateWithIo" valuePropName="checked">
              <Checkbox disabled={disabled} onChange={checkFields}>
              Co-operate with IO
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {toAppearBeforeIo || form.getFieldValue()?.toAppearBeforeIo ? (
          <Row gutter={24} style={{ marginTop: 20, marginLeft: 5 }}>
            <Col>
              <Form.Item name="selectDaysOfWeek" label="Select Days Of Week">
                {renderFieldsWithDropDown(
                  getDaysOfWeeks,
                  null,
                  220,
                  null,
                  false,
                  "multiple"
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="selectPeriod" label="Select Period">
                <RangePicker
                  format={DATE_FORMAT}
                  style={{ width: 220 }}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </Row>
        ) : null}
      </Card>
    </div>
  );
}
