import { Row, Card, Col, Form, Input, DatePicker } from "antd";
import { isEmpty } from "lodash";
import { EffortForTracingModuleWrapper } from "../styles";
import moment from "moment";
import { useState } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getStaffsDetails,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { addUpdatePayload } from "./payloads";
import { facialRecognitionFields, getDropdownValues } from "../const";
import AddAddress from "../AddAddress";
import FacialRecognitionSavedRecords from "./FacialRecognitionSavedRecords";
import SaveResetButton from "../SaveResetButton";

const { TextArea } = Input;

export default function FacialRecognition({
  handleSearch,
  serchText,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [facialRecognitionForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [viewFacialRecognition, setViewFacialRecognition] = useState(false);
  const [editFacialRecognitionObj, setEditFacialRecognitionObj] =
    useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { effortsForTracingList } = useSelector((state) => state.MasterData);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { staffList } = useSelector((state) => state.MasterData);
  const staffMembersList = staffList && getStaffsDetails(staffList);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const modeOfChecking =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "modeOfChecking");

  const checkFields = async () => {
    const values = await facialRecognitionForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditFacialRecognition = (value) => {
    if (value) {
      setEditFacialRecognitionObj(value);
      const placeOfChecking = value?.placeOfChecking;
      setSelectedAddress(placeOfChecking);
      facialRecognitionForm.setFieldsValue({
        dateOfChecking: moment(new Date(value?.dateOfChecking)).isValid()
          ? moment(new Date(value?.dateOfChecking))
          : "",
        modeOfChecking: value?.modeOfChecking,
        placeOfChecking:
          (placeOfChecking?.address1 ? placeOfChecking?.address1 : "") +
          " " +
          (placeOfChecking?.address2 ? placeOfChecking?.address2 : ""),
        checkedBy: value?.checkedBy,
        result: value?.result,
      });
    }
  };

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col
          span={s.name === "result" ? 24 : 8}
          key={i}
          style={{ marginBottom: 10 }}
        >
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

  const displayFields = (name) => {
    switch (name) {
      case "dateOfChecking":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewFacialRecognition || disableForm}
          />
        );
      case "modeOfChecking":
        return renderFieldsWithDropDown(
          getDropdownValues(modeOfChecking),
          null,
          handleSearch,
          serchText,
          200,
          viewFacialRecognition || disableForm
        );
      case "checkedBy":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          handleSearch,
          serchText,
          200,
          viewFacialRecognition || disableForm
        );
      case "result":
        return (
          <TextArea
            rows={4}
            columns={3}
            style={{ height: "100px" }}
            maxLength={textAreaRules.maxLength}
            disabled={viewFacialRecognition || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewFacialRecognition || disableForm}
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
    const values = await facialRecognitionForm.validateFields();
    const addUpdateResult = {
      crimeId: crimeId,
      facialRecognition: getPayloadResult(values),
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
    facialRecognitionForm.setFieldsValue({
      placeOfChecking:
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
    facialRecognitionForm.resetFields();
    setSelectedIndex("");
    setEditFacialRecognitionObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={facialRecognitionForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 350 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(facialRecognitionFields, displayFields)}
          </Row>
          {isModalVisible ? (
            <AddAddress
              title="Add Place Of Checking"
              isModalVisible={isModalVisible}
              checkFields={checkFields}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              disabled={viewFacialRecognition}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedPermanentState={selectedPermanentState}
              setSelectedPermanentState={setSelectedPermanentState}
            />
          ) : null}
        </Card>
        <Card
          style={{ width: "30%", minHeight: 350 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <FacialRecognitionSavedRecords
                dataSource={savedRecords}
                editDetails={handleEditFacialRecognition}
                setViewDetails={setViewFacialRecognition}
                selectedRecord={editFacialRecognitionObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewFacialRecognition || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
