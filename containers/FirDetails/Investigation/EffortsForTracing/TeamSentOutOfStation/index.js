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
import { getFileById } from "@containers/media-util";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { loadState } from "@lib/helpers/localStorage";
import { addUpdatePayload } from "./payloads";
import { teamsSentOutOfStationForm, personnelDeputedList } from "../const";
import SavedRecords from "./SavedRecords";
import SaveResetButton from "../SaveResetButton";
import AddAddress from "../AddAddress";
import { EffortForTracingModuleWrapper } from "../styles";

export default function TeamSentOutOfStation({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [teamSentOutForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [resultUploadReport, setResultUploadReport] = useState([]);
  const [personnelDeputed, setPersonnelDeputed] = useState([]);
  const [selectedResultUploadReport, setSelectedResultUploadReport] = useState(
    []
  );
  const [selectedAddress, setSelectedAddress] = useState("");
  const [nearestPoliceStation, setNearestPoliceStation] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [viewTeamSentOut, setViewTeamSentOut] = useState(false);
  const [editTeamSentOutObj, setEditTeamSentOutObj] = useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { unitList } = useSelector((state) => state.MasterData);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { staffList } = useSelector((state) => state.MasterData);
  const staffMembersList = staffList && getStaffsDetails(staffList);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const getPoliceStationNames = () => {
    let arr = [];
    !isEmpty(unitList) &&
      unitList.map((item) => {
        const result = {
          label: item?.ps_name || "",
          psCode: item?.ps_cd || "",
          distName: item?.dist_name || "",
          _id: item?._id || "",
        };
        arr.push(result);
      });
    return arr;
  };

  const checkFields = async () => {
    const values = await teamSentOutForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditTeamSentOut = (value) => {
    if (value) {
      setEditTeamSentOutObj(value);
      setNearestPoliceStation(value?.nearestPoliceStation);
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
      const placeVisited = value?.placeVisited;
      setSelectedAddress(placeVisited);
      teamSentOutForm.setFieldsValue({
        dateOfDeparture: moment(new Date(value?.dateOfDeparture)).isValid()
          ? moment(new Date(value?.dateOfDeparture))
          : "",
        dateOfArrivalToPlace: moment(
          new Date(value?.dateOfArrivalToPlace)
        ).isValid()
          ? moment(new Date(value?.dateOfArrivalToPlace))
          : "",
        personnelDeputed: value?.personnelDeputed,
        placeVisited:
          (placeVisited?.address1 ? placeVisited?.address1 : "") +
          " " +
          (placeVisited?.address2 ? placeVisited?.address2 : ""),
        nearestPoliceStation: value?.nearestPoliceStation,
        otherNearestPoliceStation: value?.otherNearestPoliceStation,
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

  const savedUploadDocURL = editTeamSentOutObj?.resultUploadReport?.url
    ? editTeamSentOutObj?.resultUploadReport?.url
    : "";

  const onSelect = (val) => {
    setPersonnelDeputed(val);
  };

  const selectPoliceStation = (value) => {
    setNearestPoliceStation(value);
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfDeparture":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewTeamSentOut || disableForm}
          />
        );
      case "personnelDeputed":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          onSelect,
          handleSearch,
          serchText,
          200,
          viewTeamSentOut || disableForm
        );
      case "dateOfArrivalToPlace":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewTeamSentOut || disableForm}
          />
        );
      case "nearestPoliceStation":
        return renderFieldsWithDropDown(
          getPoliceStationNames(),
          selectPoliceStation,
          handleSearch,
          serchText,
          200,
          viewTeamSentOut || disableForm
        );
      case "placeVisited":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewTeamSentOut || disableForm
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
              disabled={viewTeamSentOut || disableForm}
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
            disabled={viewTeamSentOut || disableForm}
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
    const values = await teamSentOutForm.validateFields();
    const resultUploadReportData = new FormData();
    resultUploadReport.forEach((file) => {
      resultUploadReportData.append("file", file.originFileObj);
    });
    resultUploadReportData.append("prefixFolder", crimeId);
    resultUploadReportData.append(
      "folderPath",
      `${crimeId}/${folderName.TEAM_SENT_OUT}/file`
    );

    if (!isEmpty(resultUploadReport)) {
      axios
        .post(`${config.fileUpload}/upload`, resultUploadReportData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(
              getMediaPayload(data, folderName.TEAM_SENT_OUT)
            );
            const addUpdateResult = {
              crimeId: crimeId,
              teamSentOutOfStation: getPayloadResult(values, media),
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
          [editTeamSentOutObj?.resultUploadReport],
          folderName.TEAM_SENT_OUT
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        teamSentOutOfStation: getPayloadResult(values, existingMedia),
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
    teamSentOutForm.setFieldsValue({
      placeVisited:
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
    teamSentOutForm.resetFields();
    setSelectedResultUploadReport([]);
    setSelectedIndex("");
    setEditTeamSentOutObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={teamSentOutForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          {displayState(teamsSentOutOfStationForm, displayFields)}
          {nearestPoliceStation === "Others" ? (
            <Col span={8} style={{ marginBottom: 20 }}>
              <Form.Item
                name="otherNearestPoliceStation"
                label="Other Nearest Police Station"
              >
                {displayFields("otherNearestPoliceStation")}
              </Form.Item>
            </Col>
          ) : null}
          {isModalVisible ? (
            <AddAddress
              title="Add Address Details"
              isModalVisible={isModalVisible}
              checkFields={checkFields}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              disabled={viewTeamSentOut || disableForm}
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
                editDetails={handleEditTeamSentOut}
                setViewDetails={setViewTeamSentOut}
                selectedRecord={editTeamSentOutObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewTeamSentOut || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
