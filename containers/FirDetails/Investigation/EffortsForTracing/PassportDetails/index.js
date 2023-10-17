import { Row, Card, Col, Form, Input, DatePicker } from "antd";
import { isBoolean, isEmpty } from "lodash";
import moment from "moment";
import { useState } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  DATE_YY_MM_DD,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { disableFutureDates } from "@components/Common/helperMethods";
import { addUpdatePayload } from "./payloads";
import { passportDetailsForm } from "../const";
import AddAddress from "../AddAddress";
import PassportDetailsSavedRecords from "./PassportDetailsSavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

export default function PassportDetails({
  handleSearch,
  serchText,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [passportDetailForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [viewPassportDetail, setViewPassportDetail] = useState(false);
  const [editPassportDetailObj, setEditPassportDetailObj] = useState(null);
  const [selectedDateRequisition, setSelectedDateRequisition] = useState("");
  const [selectedDateOfReply, setSelectedDateOfReply] = useState("");
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const { addEffortsForTracingDetails } = effortsForTracingActions;

  const checkFields = async () => {
    const values = await passportDetailForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditPassportDetail = (value) => {
    if (value) {
      setEditPassportDetailObj(value);
      const addressFromPassport = value?.addressFromPassport;
      setSelectedAddress(addressFromPassport);
      passportDetailForm.setFieldsValue({
        dateOfRPORequisition: moment(
          new Date(value?.dateOfRPORequisition)
        ).isValid()
          ? moment(new Date(value?.dateOfRPORequisition))
          : "",
        dateOfReply: moment(new Date(value?.dateOfReply)).isValid()
          ? moment(new Date(value?.dateOfReply))
          : "",
        passportNo: value?.passportNo,
        dateOfIssue: moment(new Date(value?.dateOfIssue)).isValid()
          ? moment(new Date(value?.dateOfIssue))
          : "",
        dateOfValidity: moment(new Date(value?.dateOfValidity)).isValid()
          ? moment(new Date(value?.dateOfValidity))
          : "",
        addressFromPassport:
          (addressFromPassport?.address1 ? addressFromPassport?.address1 : "") +
          " " +
          (addressFromPassport?.address2 ? addressFromPassport?.address2 : ""),
      });
    }
  };

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col span={8} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
          {s.actionLink && (
            <span
              className="linkStyle"
              onClick={() => setIsModalVisible(disableForm ? false : true)}
            >
              {s.actionName}
            </span>
          )}
        </Col>
      );
    });
  };

  const dateOfRequisitionChange = (date, _dateString) => {
    setSelectedDateRequisition(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const dateOfReplyChange = (date, _dateString) => {
    setSelectedDateOfReply(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const isValidDateOfReply =
    selectedDateRequisition &&
    selectedDateOfReply &&
    moment(selectedDateOfReply).isAfter(selectedDateRequisition);

  const displayFields = (name) => {
    switch (name) {
      case "dateOfRPORequisition":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={dateOfRequisitionChange}
            disabled={viewPassportDetail || disableForm}
          />
        );
      case "dateOfReply":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={dateOfReplyChange}
            disabled={viewPassportDetail || disableForm}
          />
        );
      case "dateOfIssue":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewPassportDetail || disableForm}
          />
        );
      case "dateOfValidity":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewPassportDetail || disableForm}
          />
        );
      case "addressFromPassport":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewPassportDetail || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPassportDetail || disableForm}
          />
        );
    }
  };

  const getPayloadResult = (values) => {
    const updatedObj = !isEmpty(savedRecords) && {
      ...savedRecords[selectedIndex],
      ...addUpdatePayload(values, selectedAddress),
    };

    const updatedRecords = !isEmpty(savedRecords) && [
      ...savedRecords.slice(0, selectedIndex),
      updatedObj,
      ...savedRecords.slice(selectedIndex + 1),
    ];

    let result = [];
    if (isEmpty(savedRecords)) {
      const data = addUpdatePayload(values, selectedAddress);
      result = [data];
    } else if (!isEmpty(savedRecords) && selectedIndex !== "") {
      result = updatedRecords;
    } else if (!isEmpty(savedRecords) && selectedIndex === "") {
      result = savedRecords.concat([addUpdatePayload(values, selectedAddress)]);
    }
    return result;
  };

  const submit = async () => {
    const values = await passportDetailForm.validateFields();
    const addUpdateResult = {
      crimeId: crimeId,
      passportDetails: getPayloadResult(values),
    };

    dispatch(
      addEffortsForTracingDetails(
        config.addUpdateEffortsTracing,
        addUpdateResult
      )
    );
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedAddress(values);
    passportDetailForm.setFieldsValue({
      addressFromPassport:
        (values?.address1 ? values?.address1 : "") +
        " " +
        (values?.address2 ? values?.address2 : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const resetForm = () => {
    passportDetailForm.resetFields();
    setSelectedIndex("");
    setEditPassportDetailObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={passportDetailForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(passportDetailsForm, displayFields)}
          </Row>

          {isBoolean(isValidDateOfReply) && !isValidDateOfReply ? (
            <div
              className="ant-form-item-explain-error"
              style={{ marginLeft: 20 }}
            >
              Date of Reply should be later than Date of Requisition to RPO
            </div>
          ) : null}

          {isModalVisible ? (
            <AddAddress
              title="Add Passport Address"
              isModalVisible={isModalVisible}
              checkFields={checkFields}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              disabled={viewPassportDetail}
            />
          ) : null}
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <PassportDetailsSavedRecords
                dataSource={savedRecords}
                editDetails={handleEditPassportDetail}
                setViewDetails={setViewPassportDetail}
                selectedRecord={editPassportDetailObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={
            viewPassportDetail ||
            disableForm ||
            (isBoolean(isValidDateOfReply) && !isValidDateOfReply)
          }
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
