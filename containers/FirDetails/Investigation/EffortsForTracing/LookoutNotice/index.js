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
  renderFieldsWithMultipleDropDown,
  dummyRequest,
  onFileChange,
  folderName,
  getMediaUploadError,
  getMediaPayload,
  getStaffsDetails,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { getFileById } from "@containers/media-util";
import { addUpdatePayload } from "./payloads";
import {
  lookOutNoticesPosterPastedForm,
  personnelDeputedList,
  getDropdownValues,
  lookOutDataList,
} from "../const";
import AddAddress from "../AddAddress";
import LookoutSavedRecords from "./LookoutSavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

export default function LookoutNotice({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [lookoutForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [uploadEvidence, setUploadEvidence] = useState([]);
  const [personnelDeputed, setPersonnelDeputed] = useState([]);
  const [selectedUploadEvidence, setSelectedUploadEvidence] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [viewLookoutNotice, setViewLookoutNotice] = useState(false);
  const [editLookoutNoticeObj, setEditLookoutNoticeObj] = useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { effortsForTracingList, staffList } = useSelector(
    (state) => state.MasterData
  );
  const { savedFir } = useSelector((state) => state.createFIR);
  const staffMembersList = staffList && getStaffsDetails(staffList);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const placeOfPasting =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "placeOfPasting");
  // Use this in dropdown once API fixed
  console.log(getDropdownValues(placeOfPasting));

  const checkFields = async () => {
    const values = await lookoutForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditLookoutNotice = (value) => {
    if (value) {
      setEditLookoutNoticeObj(value);
      const uploadEvidence = value?.uploadEvidence;
      if (uploadEvidence && uploadEvidence?.url !== "") {
        setSelectedUploadEvidence([
          {
            url: uploadEvidence?.url,
            name: uploadEvidence?.name,
            fileId: uploadEvidence?.fileId,
          },
        ]);
      } else {
        setSelectedUploadEvidence([]);
      }
      const placeOfPasting = value?.placeOfPasting;
      setSelectedAddress(placeOfPasting);
      lookoutForm.setFieldsValue({
        dateOfPoster: moment(new Date(value?.dateOfPoster)).isValid()
          ? moment(new Date(value?.dateOfPoster))
          : "",
        personnelDeputed: value?.personnelDeputed,
        placeOfPasting:
          (placeOfPasting?.address1 ? placeOfPasting?.address1 : "") +
          " " +
          (placeOfPasting?.address2 ? placeOfPasting?.address2 : ""),
        lookoutNotice: value?.lookoutNotice,
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const savedUploadDocURL = editLookoutNoticeObj?.uploadEvidence?.url
    ? editLookoutNoticeObj?.uploadEvidence?.url
    : "";

  const onSelect = (val) => {
    setPersonnelDeputed(val);
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfPoster":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 250 }}
            onChange={checkFields}
            disabled={viewLookoutNotice || disableForm}
          />
        );
      case "personnelDeputed":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          onSelect,
          handleSearch,
          serchText,
          250,
          viewLookoutNotice || disableForm
        );
      case "placeOfPasting":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          250,
          viewLookoutNotice || disableForm
        );
      case "lookoutNotice":
        return renderFieldsWithDropDown(
          lookOutDataList,
          null,
          handleSearch,
          serchText,
          250,
          viewLookoutNotice || disableForm
        );
      case "uploadEvidence":
        return (
          <Upload
            fileList={
              savedUploadDocURL !== "" ? selectedUploadEvidence : uploadEvidence
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setUploadEvidence)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 215, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewLookoutNotice || disableForm}
            >
              Upload Evidence
            </Button>
          </Upload>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewLookoutNotice || disableForm}
          />
        );
    }
  };

  const getPayloadResult = (values, media) => {
    const updatedObj = !isEmpty(savedRecords) && {
      ...savedRecords[selectedIndex],
      ...addUpdatePayload(values, selectedAddress, media),
    };

    const updatedRecords = !isEmpty(savedRecords) && [
      ...savedRecords.slice(0, selectedIndex),
      updatedObj,
      ...savedRecords.slice(selectedIndex + 1),
    ];

    let result = [];
    if (isEmpty(savedRecords)) {
      const data = addUpdatePayload(values, selectedAddress, media);
      result = [data];
    } else if (!isEmpty(savedRecords) && selectedIndex !== "") {
      result = updatedRecords;
    } else if (!isEmpty(savedRecords) && selectedIndex === "") {
      result = savedRecords.concat([
        addUpdatePayload(values, selectedAddress, media),
      ]);
    }
    return result;
  };

  const submit = async () => {
    const values = await lookoutForm.validateFields();
    const uploadEvidenceData = new FormData();
    uploadEvidence.forEach((file) => {
      uploadEvidenceData.append("file", file.originFileObj);
    });
    uploadEvidenceData.append("prefixFolder", crimeId);
    uploadEvidenceData.append(
      "folderPath",
      `${crimeId}/${folderName.LOOKOUT_NOTICE}/file`
    );

    if (!isEmpty(uploadEvidence)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadEvidenceData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(
              getMediaPayload(data, folderName.LOOKOUT_NOTICE)
            );
            const addUpdateResult = {
              crimeId: crimeId,
              lookoutNotices: getPayloadResult(values, media),
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
    } else if (isEmpty(uploadEvidence)) {
      const existingMedia = first(
        getMediaPayload(
          [editLookoutNoticeObj?.uploadEvidence],
          folderName.LOOKOUT_NOTICE
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        lookoutNotices: getPayloadResult(values, existingMedia),
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
    setSelectedAddress(values);
    lookoutForm.setFieldsValue({
      placeOfPasting:
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
    lookoutForm.resetFields();
    setSelectedUploadEvidence([]);
    setEditLookoutNoticeObj(null);
    setSelectedIndex("");
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={lookoutForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(lookOutNoticesPosterPastedForm, displayFields)}
          </Row>
          {isModalVisible ? (
            <AddAddress
              title="Add Place of sticking"
              isModalVisible={isModalVisible}
              checkFields={checkFields}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              disabled={viewLookoutNotice || disableForm}
            />
          ) : null}
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              <LookoutSavedRecords
                dataSource={savedRecords}
                editDetails={handleEditLookoutNotice}
                setViewDetails={setViewLookoutNotice}
                selectedRecord={editLookoutNoticeObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewLookoutNotice || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
