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
  verificationOfHotSpotsByTeamsForm,
  personnelDeputedList,
  getDropdownValues,
} from "../const";
import SavedRecords from "./SavedRecords";
import SaveResetButton from "../SaveResetButton";
import AddAddress from "../AddAddress";
import { EffortForTracingModuleWrapper } from "../styles";

export default function VerificationOfHotspots({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [verificationOfHotSpotsForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [resultUploadReport, setResultUploadReport] = useState([]);
  const [personnelDeputed, setPersonnelDeputed] = useState([]);
  const [selectedResultUploadReport, setSelectedResultUploadReport] = useState(
    []
  );
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [viewVerificationOfHotSpots, setViewVerificationOfHotSpots] =
    useState(false);
  const [editVerificationOfHotSpotsObj, setEditVerificationOfHotSpotsObj] =
    useState(null);
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

  const natureOfHotSpot =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "natureOfHotSpot");

  const checkFields = async () => {
    const values = await verificationOfHotSpotsForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditVerificationOfHotSpots = (value) => {
    if (value) {
      setEditVerificationOfHotSpotsObj(value);
      const resultUploadReport = value?.resultUploadReport;
      if (resultUploadReport && resultUploadReport?.url !== "") {
        setSelectedResultUploadReport([
          {
            url: resultUploadReport?.url,
            name: resultUploadReport?.name,
            fileId: resultUploadReport?.fileId,
          },
        ]);
      } else {
        setSelectedResultUploadReport([]);
      }
      const placeOfHotspot = value?.placeOfHotspot;
      setSelectedAddress(placeOfHotspot);
      verificationOfHotSpotsForm.setFieldsValue({
        dateOfVerification: moment(
          new Date(value?.dateOfVerification)
        ).isValid()
          ? moment(new Date(value?.dateOfVerification))
          : "",
        personnelDeputed: value?.personnelDeputed,
        placeOfHotspot:
          (placeOfHotspot?.address1 ? placeOfHotspot?.address1 : "") +
          " " +
          (placeOfHotspot?.address2 ? placeOfHotspot?.address2 : ""),
        natureOfHotspot: value?.natureOfHotspot,
      });
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={10} key={i} style={{ marginBottom: 10 }}>
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

  const savedUploadDocURL = editVerificationOfHotSpotsObj?.resultUploadReport
    ?.url
    ? editVerificationOfHotSpotsObj?.resultUploadReport?.url
    : "";

  const onSelect = (val) => {
    setPersonnelDeputed(val);
  };

  const displayFields = (name) => {
    switch (name) {
      case "personnelDeputed":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          onSelect,
          handleSearch,
          serchText,
          200,
          viewVerificationOfHotSpots || disableForm
        );
      case "dateOfVerification":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewVerificationOfHotSpots || disableForm}
          />
        );
      case "natureOfHotspot":
        return renderFieldsWithDropDown(
          getDropdownValues(natureOfHotSpot),
          null,
          handleSearch,
          serchText,
          200,
          viewVerificationOfHotSpots || disableForm
        );
      case "placeOfHotspot":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewVerificationOfHotSpots || disableForm
        );
      case "resultUploadReport":
        return (
          <Upload
            fileList={
              savedUploadDocURL !== ""
                ? selectedResultUploadReport
                : resultUploadReport
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setResultUploadReport)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 275, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewVerificationOfHotSpots || disableForm}
            >
              Upload Report
            </Button>
          </Upload>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewVerificationOfHotSpots || disableForm}
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
    const values = await verificationOfHotSpotsForm.validateFields();
    const resultUploadReportData = new FormData();
    resultUploadReport.forEach((file) => {
      resultUploadReportData.append("file", file.originFileObj);
    });
    resultUploadReportData.append("prefixFolder", crimeId);
    resultUploadReportData.append(
      "folderPath",
      `${crimeId}/${folderName.HOT_SPOT_VERIFICATION}/file`
    );

    if (!isEmpty(resultUploadReport)) {
      axios
        .post(`${config.fileUpload}/upload`, resultUploadReportData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(
              getMediaPayload(data, folderName.HOT_SPOT_VERIFICATION)
            );
            const addUpdateResult = {
              crimeId: crimeId,
              verificationOfHotspots: getPayloadResult(values, media),
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
    } else if (isEmpty(resultUploadReport)) {
      const existingMedia = first(
        getMediaPayload(
          [editVerificationOfHotSpotsObj?.resultUploadReport],
          folderName.HOT_SPOT_VERIFICATION
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        verificationOfHotspots: getPayloadResult(values, existingMedia),
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
    verificationOfHotSpotsForm.setFieldsValue({
      placeOfHotspot:
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
    verificationOfHotSpotsForm.resetFields();
    setSelectedResultUploadReport([]);
    setSelectedIndex("");
    setEditVerificationOfHotSpotsObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={verificationOfHotSpotsForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          {displayState(verificationOfHotSpotsByTeamsForm, displayFields)}
          {isModalVisible ? (
            <AddAddress
              title="Add Address Details"
              isModalVisible={isModalVisible}
              checkFields={checkFields}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              disabled={viewVerificationOfHotSpots || disableForm}
            />
          ) : null}
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              <SavedRecords
                dataSource={savedRecords}
                editDetails={handleEditVerificationOfHotSpots}
                setViewDetails={setViewVerificationOfHotSpots}
                selectedRecord={editVerificationOfHotSpotsObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewVerificationOfHotSpots || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
