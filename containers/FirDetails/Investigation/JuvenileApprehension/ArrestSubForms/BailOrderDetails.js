import { useState } from "react";
import {
  Col,
  Input,
  Form,
  Card,
  Row,
  Checkbox,
  DatePicker,
  Upload,
  Button,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useSelector } from "react-redux";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { CameraOutlined } from "@ant-design/icons";
import {
  dummyRequest,
  DATE_FORMAT,
  getDaysOfWeeks,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import { isEmpty, isArray } from "lodash";
import { getFileById } from "@containers/media-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

const { RangePicker } = DatePicker;

export default function BailOrderDetails(props) {
  const {
    renderFieldsWithDropDown,
    checkFields,
    disabled,
    form,
    setUploadCourtConditionsUrl,
    bailOrderFileList,
  } = props;
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const { courtsFromPSList } = useSelector((state) => state.MasterData);

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const fileList = !isEmpty(bailOrderFileList) ? bailOrderFileList : [];

  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      <Row glutter={24}>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Form.Item
            name="bailOrderNumber"
            label="Bail Order Number"
            rules={[textFieldRules.textFieldMaxLength]}
          >
            <Input
              onChange={checkFields}
              style={{ width: 200 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Form.Item name="bailOrderDate" label="Bail Order Date">
            <DatePicker
              format={DATE_FORMAT}
              style={{ width: 200 }}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Form.Item name="courtName" label="Court Name">
            {renderFieldsWithDropDown(courtNames, null, 200, false, disabled)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item name="uploadCourtConditions">
            <Upload
              fileList={fileList}
              customRequest={dummyRequest}
              onChange={(info) =>
                onFileChange(info, setUploadCourtConditionsUrl)
              }
              onPreview={handleDownload}
              multiple={false}
            >
              <Button
                className="saveButton"
                size="large"
                style={{ width: 240, marginTop: 20 }}
                icon={<CameraOutlined className="saveButtonIcon" />}
                disabled={disabled}
              >
                Upload Court Conditions
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="conditionsImposed"
            label="Conditions Imposed"
            rules={[textAreaRules.textAreaMaxLength]}
          >
            <TextArea
              rows={7}
              maxLength={textAreaRules.maxLength}
              placeholder="Enter Conditions Imposed"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={6} style={{ marginLeft: 25, marginTop: 20 }}>
          <div style={styles.widgetPageStyle}>
            <Form.Item name="toAppearBeforeIo" valuePropName="checked">
              <Checkbox
                onChange={(e) => setToAppearBeforeIo(e.target.checked)}
                disabled={disabled}
              />
            </Form.Item>
            <div style={{ paddingTop: 5 }}>
              <span
                style={{
                  paddingLeft: 5,
                  verticalAlign: "text-bottom",
                }}
              >
                To appear before IO?
              </span>
            </div>
          </div>
          {toAppearBeforeIo || form.getFieldValue()?.toAppearBeforeIo ? (
            <>
              <Form.Item name="selectDaysOfWeek" label="Select Days Of Week">
                {renderFieldsWithDropDown(
                  getDaysOfWeeks,
                  null,
                  200,
                  null,
                  false,
                  "multiple"
                )}
              </Form.Item>
              <Form.Item name="selectPeriod" label="Select Period">
                <RangePicker
                  format={DATE_FORMAT}
                  style={{ width: 200 }}
                  disabled={disabled}
                />
              </Form.Item>
            </>
          ) : null}
        </Col>
        <Col span={6} style={{ marginLeft: 25, marginTop: 20 }}>
          <div style={styles.widgetPageStyle}>
            <Form.Item name="cooperateWithIo" valuePropName="checked">
              <Checkbox onChange={checkFields} disabled={disabled} />
            </Form.Item>
            <div style={{ paddingTop: 5 }}>
              <span
                style={{
                  paddingLeft: 5,
                  verticalAlign: "text-bottom",
                }}
              >
                Co-operate with IO
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
