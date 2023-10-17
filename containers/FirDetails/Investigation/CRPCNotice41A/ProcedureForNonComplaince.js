import { useState } from "react";
import {
  Col,
  Input,
  Form,
  Card,
  Row,
  Checkbox,
  DatePicker,
  Divider,
  Upload,
  Button,
} from "antd";
import { CameraFilled } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { isEmpty, isArray } from "lodash";
import { textAreaRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  getDaysOfWeeks,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
  dummyRequest,
  onFileChange,
} from "@containers/FirDetails/fir-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};
const { RangePicker } = DatePicker;

export default function ProcedureForNonComplaince({
  checkFields,
  disabled,
  form,
  handleSearch,
  searchText,
  fileList,
  setData,
  courtsFromPSList,
}) {
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [againCommittedOtherOffence, setAgainCommittedOtherOffence] =
    useState(false);

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  return (
    <>
      <Card style={{ marginTop: 20 }}>
        <div>Non-Complaince</div>
        <Divider />
        <Row gutter={24}>
          <Col span={16}>
            <Row>
              <Col className="custody-col" style={{ marginBottom: 15 }}>
                <Form.Item
                  name="falseAddressNotResiding"
                  valuePropName="checked"
                >
                  <Checkbox onChange={checkFields} disabled={disabled}>
                    Gave False Address where he is not residing
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={18} style={{ marginBottom: 15 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item
                    name="againCommittedOtherOffence"
                    valuePropName="checked"
                  >
                    <Checkbox
                      onChange={(e) =>
                        setAgainCommittedOtherOffence(e.target.checked)
                      }
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
                      Again Committed another offence
                    </span>
                  </div>
                </div>
                {againCommittedOtherOffence ||
                form.getFieldValue()?.againCommittedOtherOffence ? (
                  <>
                    <Row gutter={24} style={{ marginLeft: 15, marginTop: 5 }}>
                      <Col span={8}>
                        <Form.Item name="crNumber" label="">
                          <Input
                            placeholder="Enter Cr.No"
                            onChange={checkFields}
                            style={{ width: 150 }}
                            disabled={disabled}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="us" label="">
                          <Input
                            placeholder="u/s"
                            onChange={checkFields}
                            style={{ width: 150 }}
                            disabled={disabled}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col className="custody-col" style={{ marginBottom: 15 }}>
                <Form.Item name="againThreatened" valuePropName="checked">
                  <Checkbox disabled={disabled}>
                    Threatened Victim/Witness even after FIR
                  </Checkbox>
                </Form.Item>
                <Col className="file-upload" style={{ marginLeft: 30 }}>
                  <Form.Item name="uploadStatement">
                    <Upload
                      fileList={fileList}
                      customRequest={dummyRequest}
                      onChange={(info) => onFileChange(info, setData)}
                      multiple={false}
                    >
                      <Button
                        className="saveButton"
                        style={{ marginTop: 10, width: 200 }}
                        icon={<CameraFilled style={{ float: "left" }} />}
                        disabled={disabled}
                      >
                        Upload Statement
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="requistionFieldDate"
              label="Date of Requisition to court for arrest"
            >
              <DatePicker
                onChange={checkFields}
                placeholder="Select Date"
                style={{ width: 200 }}
                disabled={disabled}
                format={DATE_FORMAT}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="courtName"
              label="Court Name"
            >
              {renderFieldsWithDropDown(
                courtNames,
                null,
                handleSearch,
                searchText,
                200,
                disabled
              )}
            </Form.Item>
            <Form.Item
              name="courtOrderNo"
              label="Court order No."
              style={{ marginBottom: 15 }}
            >
              <Input
                placeholder="Court order No."
                onChange={checkFields}
                style={{ width: 200 }}
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item name="date" label="Court Order Date">
              <DatePicker
                onChange={checkFields}
                placeholder="Select Date"
                style={{ width: 200 }}
                disabled={disabled}
                format={DATE_FORMAT}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: 20 }}>
        <Row glutter={24} style={{ width: "100%" }}>
          <Col span={10}>
            <Form.Item
              name="conditionsImposedByCourt"
              label="Directions/Conditions imposed by Court"
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
                  {renderFieldsWithMultipleDropDown(
                    getDaysOfWeeks,
                    null,
                    handleSearch,
                    searchText,
                    230,
                    disabled
                  )}
                </Form.Item>
                <Form.Item
                  name="selectPeriod"
                  label="Select Period"
                  style={{ marginTop: 15 }}
                >
                  <RangePicker
                    onChange={checkFields}
                    format={DATE_FORMAT}
                    style={{ width: 230 }}
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
    </>
  );
}
