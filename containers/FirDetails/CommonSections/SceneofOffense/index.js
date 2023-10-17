import { useEffect } from "react";
import { Form, Row, Col, Input, Button, Divider, DatePicker } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import StandardSceneOfOffenceForm from "@components/Common/standardSceneOfOffenceForm";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { disableFuturePastDates } from "@components/Common/helperMethods";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";

const { TextArea } = Input;

export default function CrimeLocation({
  currentData,
  crimeSceneDate,
  handleSubmit,
  viewSceneofOffense,
  sceneofoffenseForm,
  showButton,
  setformValidFlag,
  isInvestigation,
}) {
  function omitKeys(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

      target[i] = obj[i];
    }
    return target;
  }
  const checkFields = async () => {
    const values = await sceneofoffenseForm.validateFields();

    if (isInvestigation && values && !values.userDate) {
      setformValidFlag(false);
    } else {
      if (setformValidFlag) {
        var objExcludeUserDate = omitKeys(values, ["userDate"]);
        setformValidFlag(
          !Object.values(objExcludeUserDate).every(
            (v) => v == null || (typeof v === "string" && v.trim() === "")
          )
        );
      }
    }
  };

  useEffect(() => {
    sceneofoffenseForm.setFieldsValue({
      address1: currentData?.address?.address1,
      latitude: currentData?.address?.latitude,
      longitude: currentData?.address?.longitude,
      address2: currentData?.address?.address2,
      city: currentData?.address?.city,
      state: currentData?.address?.state,
      landmark: currentData?.address?.landmark,
      district: currentData?.address?.district,
      pincode: currentData?.address?.pincode,
      description: currentData?.address?.description,
    });
  }, [currentData]);

  const submit = async () => {
    const values = await sceneofoffenseForm.validateFields();
    handleSubmit(values);
    sceneofoffenseForm.resetFields();
  };

  return (
    <>
      <div className="widgetPageStyle">
        <Col span={16}>
          <StandardSceneOfOffenceForm
            colWidth={8}
            currentData={currentData}
            disabled={viewSceneofOffense}
            changeValue={checkFields}
            validationFields={[
              "Address Line 1",
              "City",
              "State/UT",
              "District",
              "Pincode",
            ]}
            sceneofoffenseForm={sceneofoffenseForm}
          />
          <Form.Item
            name="description"
            label="Brief Description Of Scene Of Offence"
            rules={[textAreaRules.textAreaMaxLength, { required: true }]}
          >
            <TextArea
              rows={4}
              columns={3}
              maxLength={textAreaRules.maxLength}
              disabled={viewSceneofOffense}
            />
          </Form.Item>
          {isInvestigation && (
            <Form.Item
              style={{ paddingTop: 20 }}
              name="userDate"
              label="Date & Time of Visit"
              rules={[
                {
                  required: true,
                  message: "Please enter Date & Time of Visit!",
                },
              ]}
            >
              <DatePicker
                showTime
                format={DATE_TIME_FORMAT}
                placeholder="Select Date & Time"
                disabledDate={disableFuturePastDates}
                onChange={checkFields}
              />
            </Form.Item>
          )}
        </Col>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={18} style={{ zIndex: 1 }}>
              <Form.Item
                style={{ marginLeft: 20 }}
                name="latitude"
                label="Latitude"
                rules={[textFieldRules.textFieldMaxLength, { required: true }]}
              >
                <Input
                  disabled={viewSceneofOffense}
                  style={{ width: 200 }}
                  maxLength={textFieldRules.maxLength}
                />
              </Form.Item>
              <Form.Item
                style={{ marginLeft: 20 }}
                name="longitude"
                label="Longitude"
                rules={[textFieldRules.textFieldMaxLength, { required: true }]}
              >
                <Input
                  disabled={viewSceneofOffense}
                  style={{ width: 200 }}
                  maxLength={textFieldRules.maxLength}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </div>
      {showButton && (
        <>
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              className="saveButton"
              size="large"
              icon={<SaveOutlined className="saveButtonIcon" />}
              disabled={!crimeSceneDate || viewSceneofOffense}
              onClick={submit}
            >
              SAVE
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );
}
