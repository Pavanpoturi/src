/* eslint-disable array-callback-return */
import {
  Row,
  Card,
  Col,
  Form,
  Divider,
  Button,
  Input,
  Checkbox,
  DatePicker,
} from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { disableFutureDates } from "@components/Common/helperMethods";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: 150,
  },
};

export default function PresentWhereAbouts({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [presentWhereAboutForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [isInJail, setIsInJail] = useState(false);
  const [isOnBail, setIsOnBail] = useState(false);
  const [isAbsconding, setIsAbsconding] = useState(false);
  const [isNormalLife, setIsNormalLife] = useState(false);
  const [isRehabilitated, setIsRehabilitated] = useState(false);
  const [isFacingTrial, setIsFacingTrial] = useState(false);

  const checkFields = async () => {
    const values = await presentWhereAboutForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const getFormFields = (values) => {
    const isInJail = values?.isInJail;
    const isOnBail = values?.isOnBail;
    const isAbsconding = values?.isAbsconding;
    const result = {
      inJail: {
        isInJail: isInJail,
        fromWhereSentInJail: isInJail ? values?.fromWhereSentInJail : "",
        crimeNum: isInJail ? values?.jailCrimeNum : "",
        distUnit: isInJail ? values?.jailDistUnit : "",
      },
      onBail: {
        isOnBail: isOnBail,
        fromWhereSentOnBail: isOnBail ? values?.fromWhereSentOnBail : "",
        crimeNum: isOnBail ? values?.bailCrimeNum : "",
        dateOfBail: isOnBail ? values?.dateOfBail : "",
      },
      absconding: {
        isAbsconding: isAbsconding,
        wantedInPoliceStation: isAbsconding
          ? values?.wantedInPoliceStation
          : "",
        crimeNum: isAbsconding ? values?.abscondingCrimeNum : "",
      },
      normalLife: {
        isNormalLife: values?.isNormalLife,
        ekingLivelihoodByLaborWork: values?.isNormalLife
          ? values?.ekingLivelihoodByLaborWork
          : "",
      },
      rehabilitated: {
        isRehabilitated: values?.isRehabilitated,
        rehabilitationDetails: values?.isRehabilitated
          ? values?.rehabilitationDetails
          : "",
      },
      facingTrial: {
        isFacingTrial: values?.isFacingTrial,
        psName: values?.isFacingTrial ? values?.psName : "",
        crimeNum: values?.isFacingTrial ? values?.facingCrimeNum : "",
      },
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      setIsInJail(selectedRecord?.inJail?.isInJail);
      setIsOnBail(selectedRecord?.onBail?.isOnBail);
      setIsAbsconding(selectedRecord?.absconding?.isAbsconding);
      setIsNormalLife(selectedRecord?.normalLife?.isNormalLife);
      setIsRehabilitated(selectedRecord?.rehabilitated?.isRehabilitated);
      setIsFacingTrial(selectedRecord?.facingTrial?.isFacingTrial);
      presentWhereAboutForm.setFieldsValue({
        abscondingCrimeNum: selectedRecord?.absconding?.crimeNum,
        bailCrimeNum: selectedRecord?.onBail?.crimeNum,
        dateOfBail: moment(
          new Date(selectedRecord?.onBail?.dateOfBail)
        ).isValid()
          ? moment(new Date(selectedRecord?.onBail?.dateOfBail))
          : "",
        ekingLivelihoodByLaborWork:
          selectedRecord?.normalLife?.ekingLivelihoodByLaborWork,
        facingCrimeNum: selectedRecord?.facingTrial?.crimeNum,
        fromWhereSentInJail: selectedRecord?.inJail?.fromWhereSentInJail,
        fromWhereSentOnBail: selectedRecord?.onBail?.fromWhereSentOnBail,
        isAbsconding: selectedRecord?.absconding?.isAbsconding,
        isFacingTrial: selectedRecord?.facingTrial?.isFacingTrial,
        isInJail: selectedRecord?.inJail?.isInJail,
        isNormalLife: selectedRecord?.normalLife?.isNormalLife,
        isOnBail: selectedRecord?.onBail?.isOnBail,
        isRehabilitated: selectedRecord?.rehabilitated?.isRehabilitated,
        jailCrimeNum: selectedRecord?.inJail?.crimeNum,
        jailDistUnit: selectedRecord?.inJail?.distUnit,
        psName: selectedRecord?.facingTrial?.psName,
        rehabilitationDetails:
          selectedRecord?.rehabilitated?.rehabilitationDetails,
        wantedInPoliceStation:
          selectedRecord?.absconding?.wantedInPoliceStation,
      });
    } else {
      presentWhereAboutForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await presentWhereAboutForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      presentWhereAbouts: getFormFields(values),
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      presentWhereAbouts: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  const renderInJailDetails = (disabled) => {
    return (
      <>
        <Col>
          <Form.Item name="fromWhereSentInJail" label="Sent From">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="jailCrimeNum" label="Crime No">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="jailDistUnit" label="UT No">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderFacingTrialDetails = (disabled) => {
    return (
      <>
        <Col>
          <Form.Item name="psName" label="Police Station">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="facingCrimeNum" label="Crime No">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderOnBailDetails = (disabled) => {
    return (
      <>
        <Col>
          <Form.Item name="fromWhereSentOnBail" label="Sent From">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="bailCrimeNum" label="Crime No">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="dateOfBail" label="Bail Date">
            <DatePicker
              disabledDate={disableFutureDates}
              format={DATE_FORMAT}
              style={{ width: 250 }}
              onChange={checkFields}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderAbscondingDetails = (disabled) => {
    return (
      <>
        <Col>
          <Form.Item
            name="wantedInPoliceStation"
            label="Wanted in Police stations"
          >
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="abscondingCrimeNum" label="Crime No">
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderNormalLifeDetails = (disabled) => {
    return (
      <>
        <Col>
          <Form.Item
            name="ekingLivelihoodByLaborWork"
            label="Eking livelihood by doing labor work"
          >
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderRehabilitatedDetails = (disabled) => {
    return (
      <Col>
        <Form.Item name="rehabilitationDetails" label="Rehabilitation Details">
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
          />
        </Form.Item>
      </Col>
    );
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={presentWhereAboutForm} layout="vertical">
        <Row gutter={24}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isInJail" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsInJail(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">In Jail</span>
              </div>
            </div>
          </Col>
          {renderInJailDetails(!isInJail || disableForm)}
        </Row>

        <Row gutter={24} style={{ marginTop: 15 }}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isOnBail" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsOnBail(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">On bail</span>
              </div>
            </div>
          </Col>
          {renderOnBailDetails(!isOnBail || disableForm)}
        </Row>

        <Row gutter={24} style={{ marginTop: 15 }}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isAbsconding" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsAbsconding(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">Absconding</span>
              </div>
            </div>
          </Col>
          {renderAbscondingDetails(!isAbsconding || disableForm)}
        </Row>

        <Row gutter={24} style={{ marginTop: 15 }}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isNormalLife" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsNormalLife(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">Normal Life</span>
              </div>
            </div>
          </Col>
          {renderNormalLifeDetails(!isNormalLife || disableForm)}
        </Row>

        <Row gutter={24} style={{ marginTop: 15 }}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isFacingTrial" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsFacingTrial(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">Facing Trial</span>
              </div>
            </div>
          </Col>
          {renderFacingTrialDetails(!isFacingTrial || disableForm)}
        </Row>

        <Row gutter={24} style={{ marginTop: 15 }}>
          <Col className="presentConditionText">
            <div style={styles.widgetPageStyle}>
              <Form.Item name="isRehabilitated" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsRehabilitated(e.target.checked)}
                  disabled={disableForm}
                />
              </Form.Item>
              <div style={{ paddingTop: 5 }}>
                <span className="presentConditions">Rehabilitated</span>
              </div>
            </div>
          </Col>
          {renderRehabilitatedDetails(!isRehabilitated || disableForm)}
        </Row>

        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submit}
            disabled={disabled}
          >
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
