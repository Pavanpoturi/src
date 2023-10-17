import { Row, Card, Col, Form, Input, DatePicker } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import { useState } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { addUpdatePayload } from "./payloads";
import { outOfCountryTravelDetailsForm } from "../const";
import countryList from "../../../countries.json";
import OutOfCountryTravelSavedRecords from "./OutOfCountryTravelSavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

export default function OutOfCountryTravel({
  handleSearch,
  serchText,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [outOfCountryForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [viewOutOfCountryDetails, setViewOutOfCountryDetails] = useState(false);
  const [editOutOfCountryDetailsObj, setEditOutOfCountryDetailsObj] =
    useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const checkFields = async () => {
    const values = await outOfCountryForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditOutOfCountryDetails = (value) => {
    if (value) {
      setEditOutOfCountryDetailsObj(value);
      outOfCountryForm.setFieldsValue({
        dateOfImmigrationRequisition: moment(
          new Date(value?.dateOfImmigrationRequisition)
        ).isValid()
          ? moment(new Date(value?.dateOfImmigrationRequisition))
          : "",
        dateOfReply: moment(new Date(value?.dateOfReply)).isValid()
          ? moment(new Date(value?.dateOfReply))
          : "",
        dateOfDeparture: moment(new Date(value?.dateOfDeparture)).isValid()
          ? moment(new Date(value?.dateOfDeparture))
          : "",
        placeOfCountry: value?.placeOfCountry,
        dateOfReaching: moment(new Date(value?.dateOfReaching)).isValid()
          ? moment(new Date(value?.dateOfReaching))
          : "",
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
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfImmigrationRequisition":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 220 }}
            onChange={checkFields}
            disabled={viewOutOfCountryDetails || disableForm}
          />
        );
      case "dateOfReply":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 220 }}
            onChange={checkFields}
            disabled={viewOutOfCountryDetails || disableForm}
          />
        );
      case "dateOfDeparture":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 220 }}
            onChange={checkFields}
            disabled={viewOutOfCountryDetails || disableForm}
          />
        );
      case "dateOfReaching":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 220 }}
            onChange={checkFields}
            disabled={viewOutOfCountryDetails || disableForm}
          />
        );
      case "placeOfCountry":
        return renderFieldsWithDropDown(
          countryList,
          null,
          handleSearch,
          serchText,
          220,
          viewOutOfCountryDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewOutOfCountryDetails || disableForm}
          />
        );
    }
  };

  const getPayloadResult = (values) => {
    const updatedObj = !isEmpty(savedRecords) && {
      ...savedRecords[selectedIndex],
      ...addUpdatePayload(values),
    };

    const updatedRecords = !isEmpty(savedRecords) && [
      ...savedRecords.slice(0, selectedIndex),
      updatedObj,
      ...savedRecords.slice(selectedIndex + 1),
    ];

    let result = [];
    if (isEmpty(savedRecords)) {
      const data = addUpdatePayload(values);
      result = [data];
    } else if (!isEmpty(savedRecords) && selectedIndex !== "") {
      result = updatedRecords;
    } else if (!isEmpty(savedRecords) && selectedIndex === "") {
      result = savedRecords.concat([addUpdatePayload(values)]);
    }
    return result;
  };

  const submit = async () => {
    const values = await outOfCountryForm.validateFields();
    const addUpdateResult = {
      crimeId: crimeId,
      outOfCountryTravel: getPayloadResult(values),
    };

    dispatch(
      addEffortsForTracingDetails(
        config.addUpdateEffortsTracing,
        addUpdateResult
      )
    );
  };

  const resetForm = () => {
    outOfCountryForm.resetFields();
    setSelectedIndex("");
    setEditOutOfCountryDetailsObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={outOfCountryForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(outOfCountryTravelDetailsForm, displayFields)}
          </Row>
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <OutOfCountryTravelSavedRecords
                dataSource={savedRecords}
                editDetails={handleEditOutOfCountryDetails}
                setViewDetails={setViewOutOfCountryDetails}
                selectedRecord={editOutOfCountryDetailsObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewOutOfCountryDetails || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
