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
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { disableFutureDates } from "@components/Common/helperMethods";
import { getFileById } from "@containers/media-util";
import { addUpdatePayload } from "./payloads";
import {
  relativesVerifiedForm,
  personnelDeputedList,
  getDropdownValues,
} from "../const";
import FriendsAndRelativesSavedRecords from "./FriendsAndRelativesSavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

export default function FriendsAndRelatives({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [friendRelativeForm] = Form.useForm();
  const [uploadVersion, setUploadVersion] = useState([]);
  const [personnelDeputed, setPersonnelDeputed] = useState([]);
  const [selectedUploadVersion, setSelectedUploadVersion] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [viewFriendAndRelatives, setViewFriendAndRelatives] = useState(false);
  const [editFriendAndRelativesObj, setEditFriendAndRelativesObj] =
    useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { effortsForTracingList } = useSelector((state) => state.MasterData);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { staffList } = useSelector((state) => state.MasterData);
  const staffMembersList = staffList && getStaffsDetails(staffList);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const relationToPerson =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "relationToPerson");

  const checkFields = async () => {
    const values = await friendRelativeForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditFriendAndRelatives = (value) => {
    if (value) {
      setEditFriendAndRelativesObj(value);
      const uploadVersion = value?.uploadVersion;
      if (uploadVersion && uploadVersion?.url !== "") {
        setSelectedUploadVersion([
          {
            url: uploadVersion?.url,
            name: uploadVersion?.name,
            fileId: uploadVersion?.fileId,
          },
        ]);
      } else {
        setSelectedUploadVersion([]);
      }
      friendRelativeForm.setFieldsValue({
        date: moment(new Date(value?.date)).isValid()
          ? moment(new Date(value?.date))
          : "",
        personnelDeputed: value?.personnelDeputed,
        relationToPerson: value?.relationToPerson,
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const savedUploadVersionURL = editFriendAndRelativesObj?.uploadVersion?.url
    ? editFriendAndRelativesObj?.uploadVersion?.url
    : "";

  const onSelect = (val) => {
    setPersonnelDeputed(val);
  };

  const displayFields = (name) => {
    switch (name) {
      case "date":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewFriendAndRelatives || disableForm}
          />
        );
      case "personnelDeputed":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          onSelect,
          handleSearch,
          serchText,
          200,
          viewFriendAndRelatives || disableForm
        );
      case "relationToPerson":
        return renderFieldsWithDropDown(
          getDropdownValues(relationToPerson),
          null,
          handleSearch,
          serchText,
          200,
          viewFriendAndRelatives || disableForm
        );
      case "uploadVersion":
        return (
          <Upload
            fileList={
              savedUploadVersionURL !== ""
                ? selectedUploadVersion
                : uploadVersion
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setUploadVersion)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 215, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewFriendAndRelatives || disableForm}
            >
              Upload Version
            </Button>
          </Upload>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewFriendAndRelatives || disableForm}
          />
        );
    }
  };

  const getPayloadResult = (values, media) => {
    const updatedObj = !isEmpty(savedRecords) && {
      ...savedRecords[selectedIndex],
      ...addUpdatePayload(values, media),
    };

    const updatedRecords = !isEmpty(savedRecords) && [
      ...savedRecords.slice(0, selectedIndex),
      updatedObj,
      ...savedRecords.slice(selectedIndex + 1),
    ];

    let result = [];
    if (isEmpty(savedRecords)) {
      const data = addUpdatePayload(values, media);
      result = [data];
    } else if (!isEmpty(savedRecords) && selectedIndex !== "") {
      result = updatedRecords;
    } else if (!isEmpty(savedRecords) && selectedIndex === "") {
      result = savedRecords.concat([addUpdatePayload(values, media)]);
    }
    return result;
  };

  const submit = async () => {
    const values = await friendRelativeForm.validateFields();
    const uploadVersionData = new FormData();
    uploadVersion.forEach((file) => {
      uploadVersionData.append("file", file.originFileObj);
    });
    uploadVersionData.append("prefixFolder", crimeId);
    uploadVersionData.append(
      "folderPath",
      `${crimeId}/${folderName.FRIENDS_AND_RELATIVES}/file`
    );

    if (!isEmpty(uploadVersion)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadVersionData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(
              getMediaPayload(data, folderName.FRIENDS_AND_RELATIVES)
            );
            const addUpdateResult = {
              crimeId: crimeId,
              friendsAndRelatives: getPayloadResult(values, media),
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
    } else if (isEmpty(uploadVersion)) {
      const existingMedia = first(
        getMediaPayload(
          [editFriendAndRelativesObj?.uploadVersion],
          folderName.FRIENDS_AND_RELATIVES
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        friendsAndRelatives: getPayloadResult(values, existingMedia),
      };

      dispatch(
        addEffortsForTracingDetails(
          config.addUpdateEffortsTracing,
          addUpdateResult
        )
      );
    }
  };

  const resetForm = () => {
    friendRelativeForm.resetFields();
    setSelectedUploadVersion([]);
    setSelectedIndex("");
    setEditFriendAndRelativesObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={friendRelativeForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(relativesVerifiedForm, displayFields)}
          </Row>
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <FriendsAndRelativesSavedRecords
                dataSource={savedRecords}
                editDetails={handleEditFriendAndRelatives}
                setViewDetails={setViewFriendAndRelatives}
                selectedRecord={editFriendAndRelativesObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewFriendAndRelatives || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
