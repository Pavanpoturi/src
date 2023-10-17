/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Button, Input, DatePicker, Upload } from "antd";
import axios from "axios";
import { isEmpty, first } from "lodash";
import moment from "moment";
import { useState } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { CameraFilled } from "@ant-design/icons";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  dummyRequest,
  onFileChange,
  folderName,
  getMediaUploadError,
  getMediaPayload,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { getFileById } from "@containers/media-util";
import { addUpdatePayload } from "./payloads";
import {
  MOCriminalForm,
  personnelDeputedList,
  categoryOfChecking,
  moCrimanalList,
} from "../const";
import AddPerson from "../../CommonForms/AddPerson";
import SavedRecords from "./SavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

export default function MOCriminalConvictChecking({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [moForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [uploadInterrogationReport, setUploadInterrogationReport] = useState(
    []
  );
  const [
    selectedUploadInterrogationReport,
    setSelectedUploadInterrogationReport,
  ] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [viewMOCriminal, setViewMOCriminal] = useState(false);
  const [editMOCriminalObj, setEditMOCriminalObj] = useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const checkFields = async () => {
    const values = await moForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditMOCriminal = (value) => {
    if (value) {
      setEditMOCriminalObj(value);
      const uploadInterrogationReport = value?.uploadInterrogationReport;
      if (uploadInterrogationReport && uploadInterrogationReport?.url !== "") {
        setSelectedUploadInterrogationReport([
          {
            url: uploadInterrogationReport?.url,
            name: uploadInterrogationReport?.name,
            fileId: uploadInterrogationReport?.fileId,
          },
        ]);
      } else {
        setSelectedUploadInterrogationReport([]);
      }
      setSelectedPerson(value.personChecked);
      const personChecked = value?.personChecked?.personalDetails;
      moForm.setFieldsValue({
        dateOfEntrustment: moment(new Date(value?.dateOfEntrustment)).isValid()
          ? moment(new Date(value?.dateOfEntrustment))
          : "",
        personnelEntrusted: value?.personnelEntrusted,
        categoryOfChecking: value?.categoryOfChecking,
        moCriminalList: value?.moCriminalList,
        personChecked:
          (personChecked?.name ? personChecked?.name : "") +
          " " +
          (personChecked?.surname ? personChecked?.surname : ""),
        dateOfChecking: moment(new Date(value?.dateOfChecking)).isValid()
          ? moment(new Date(value?.dateOfChecking))
          : "",
      });
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
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
        })}
      </Row>
    );
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const savedUploadDocURL = editMOCriminalObj?.uploadInterrogationReport?.url
    ? editMOCriminalObj?.uploadInterrogationReport?.url
    : "";

  const displayFields = (name) => {
    switch (name) {
      case "dateOfEntrustment":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewMOCriminal || disableForm}
          />
        );
      case "personnelEntrusted":
        return renderFieldsWithDropDown(
          personnelDeputedList,
          null,
          handleSearch,
          serchText,
          200,
          viewMOCriminal || disableForm
        );
      case "categoryOfChecking":
        return renderFieldsWithDropDown(
          categoryOfChecking,
          null,
          handleSearch,
          serchText,
          200,
          viewMOCriminal || disableForm
        );
      case "moCriminalList":
        return renderFieldsWithDropDown(
          moCrimanalList,
          null,
          handleSearch,
          serchText,
          200,
          viewMOCriminal || disableForm
        );
      case "dateOfChecking":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewMOCriminal || disableForm}
          />
        );
      case "personChecked":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewMOCriminal || disableForm
        );
      case "uploadInterrogationReport":
        return (
          <Upload
            fileList={
              savedUploadDocURL !== ""
                ? selectedUploadInterrogationReport
                : uploadInterrogationReport
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) =>
              onFileChange(info, setUploadInterrogationReport)
            }
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 260, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewMOCriminal || disableForm}
            >
              Upload Interrogation Report
            </Button>
          </Upload>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewMOCriminal || disableForm}
          />
        );
    }
  };

  const getPayloadResult = (values, media) => {
    const updatedObj = !isEmpty(savedRecords) && {
      ...savedRecords[selectedIndex],
      ...addUpdatePayload(values, selectedPerson, media, inputList),
    };

    const updatedRecords = !isEmpty(savedRecords) && [
      ...savedRecords.slice(0, selectedIndex),
      updatedObj,
      ...savedRecords.slice(selectedIndex + 1),
    ];

    let result = [];
    if (isEmpty(savedRecords)) {
      const data = addUpdatePayload(values, selectedPerson, media, inputList);
      result = [data];
    } else if (!isEmpty(savedRecords) && selectedIndex !== "") {
      result = updatedRecords;
    } else if (!isEmpty(savedRecords) && selectedIndex === "") {
      result = savedRecords.concat([
        addUpdatePayload(values, selectedPerson, media, inputList),
      ]);
    }
    return result;
  };

  const submit = async () => {
    const values = await moForm.validateFields();
    const uploadInterrogationReportData = new FormData();
    uploadInterrogationReport.forEach((file) => {
      uploadInterrogationReportData.append("file", file.originFileObj);
    });
    uploadInterrogationReportData.append("prefixFolder", crimeId);
    uploadInterrogationReportData.append(
      "folderPath",
      `${crimeId}/${folderName.MO_CRIMINAL}/file`
    );

    if (!isEmpty(uploadInterrogationReport)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadInterrogationReportData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(getMediaPayload(data, folderName.MO_CRIMINAL));
            const addUpdateResult = {
              crimeId: crimeId,
              moCriminalConvictChecking: getPayloadResult(values, media),
            };

            dispatch(
              addEffortsForTracingDetails(
                config.addUpdateEffortsTracing,
                addUpdateResult
              )
            );
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadInterrogationReport)) {
      const existingMedia = first(
        getMediaPayload(
          [editMOCriminalObj?.uploadInterrogationReport],
          folderName.MO_CRIMINAL
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        moCriminalConvictChecking: getPayloadResult(values, existingMedia),
      };

      dispatch(
        addEffortsForTracingDetails(
          config.addUpdateEffortsTracing,
          addUpdateResult
        )
      );
    }
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    moForm.setFieldsValue({
      personChecked:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const resetForm = () => {
    moForm.resetFields();
    setSelectedUploadInterrogationReport([]);
    setSelectedIndex("");
    setEditMOCriminalObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={moForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          {displayState(MOCriminalForm, displayFields)}

          {isModalVisible ? (
            <AddPerson
              title="Add Person Details"
              isModalVisible={isModalVisible}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              checkFields={checkFields}
              setInputList={setInputList}
              disabled={viewMOCriminal}
              editObj={editMOCriminalObj}
              age={age}
              setAge={setAge}
            />
          ) : null}
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <SavedRecords
                dataSource={savedRecords}
                editDetails={handleEditMOCriminal}
                setViewDetails={setViewMOCriminal}
                selectedRecord={editMOCriminalObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewMOCriminal || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
