import { Col, Form, Radio, Row, Upload, Button } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import HospitalDetailsForm from "./HospitalDetailsForm";
import { textAreaRules } from "@components/Common/formOptions";
import { dummyRequest, onFileChange } from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";

export default function MedicalExamination({
  checkFields,
  disabled,
  isInjured,
  setIsInjured,
  form,
  selectedRecord,
  fileList,
  actionName,
  disableUpload = false,
}) {
  const onChange = (value) => {
    setIsInjured(value);
    checkFields();
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <>
      <h3>
        <b>Medical Examination</b>
      </h3>
      <br />
      <Row gutter={24}>
        <HospitalDetailsForm
          form={form}
          checkFields={checkFields}
          disabled={disabled}
          selectedRecord={selectedRecord}
        />
      </Row>
      <div className="widgetPageStyle" style={{ marginTop: 20 }}>
        <Col span={5} style={{ marginBottom: 10 }}>
          <Form.Item name="isInjured" label="Is Injured?">
            <Radio.Group
              buttonStyle="solid"
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {isInjured && (
          <Col span={10}>
            <Form.Item
              name="descriptionOfInjuries"
              label="Description of Injuries"
              rules={[textAreaRules.textAreaMaxLength]}
            >
              <TextArea
                style={{ height: "100px" }}
                maxLength={textAreaRules.maxLength}
                disabled={disabled}
                onChange={checkFields}
              />
            </Form.Item>
          </Col>
        )}
        <Col span={10} style={{ marginBottom: 10, paddingLeft: 10 }}>
          <Form.Item name="uploadMedicalCertificate">
            <Upload
              fileList={fileList}
              customRequest={dummyRequest}
              onChange={(info) =>
                actionName ? onFileChange(info, actionName) : console.log(info)
              }
              onPreview={handleDownload}
              multiple={false}
            >
              <Button
                className="saveButton"
                size="large"
                style={{ width: 260, marginTop: 25 }}
                icon={<CameraOutlined className="saveButtonIcon" />}
                disabled={disableUpload || disabled}
              >
                Upload Medical Certificate
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </div>
    </>
  );
}
