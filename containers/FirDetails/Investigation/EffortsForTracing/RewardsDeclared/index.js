/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Button, Input, DatePicker, Upload } from "antd";
import axios from "axios";
import { isEmpty, first } from "lodash";
import moment from "moment";
import { useState } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
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
  rewardsDeclaredFormData,
  personnelDeputedList,
  getDropdownValues,
} from "../const";
import SavedRecords from "./SavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

const { TextArea } = Input;

export default function RewardsDeclared({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [rewardsDeclaredForm] = Form.useForm();
  const [uploadPaperClipping, setUploadPaperClipping] = useState([]);
  const [selectedUploadPaperClipping, setSelectedUploadPaperClipping] =
    useState([]);
  const [personnelDeputed, setPersonnelDeputed] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [viewPrintAndElectronicMedia, setViewPrintAndElectronicMedia] =
    useState(false);
  const [editPrintAndElectronicMediaObj, setEditPrintAndElectronicMediaObj] =
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

  const rewardsDeclaredBy =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "rewardsDeclaredBy");

  const whetherGivenIn =
    !isEmpty(effortsForTracingList) &&
    effortsForTracingList.filter((s) => s.entity === "whetherGivenIn");

  const checkFields = async () => {
    const values = await rewardsDeclaredForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditPrintAndElectronicMedia = (value) => {
    if (value) {
      setEditPrintAndElectronicMediaObj(value);
      const uploadPaperClipping = value?.uploadPaperClipping;
      if (uploadPaperClipping && uploadPaperClipping?.url !== "") {
        setSelectedUploadPaperClipping([
          {
            url: uploadPaperClipping?.url,
            name: uploadPaperClipping?.name,
            fileId: uploadPaperClipping?.fileId,
          },
        ]);
      } else {
        setSelectedUploadPaperClipping([]);
      }
      rewardsDeclaredForm.setFieldsValue({
        dateOfDeclaration: moment(new Date(value?.dateOfDeclaration)).isValid()
          ? moment(new Date(value?.dateOfDeclaration))
          : "",
        personnelDeputed: value?.personnelDeputed,
        amountOfReward: value?.amountOfReward,
        declaredBy: value?.declaredBy,
        whetherGiven: value?.whetherGiven,
        result: value?.result,
      });
    }
  };

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col
          span={s.name === "result" ? 14 : 8}
          key={i}
          style={{ marginBottom: 10 }}
        >
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

  const savedUploadPaperClippingURL = editPrintAndElectronicMediaObj
    ?.uploadPaperClipping?.url
    ? editPrintAndElectronicMediaObj?.uploadPaperClipping?.url
    : "";

  const onSelect = (val) => {
    setPersonnelDeputed(val);
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfDeclaration":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={viewPrintAndElectronicMedia || disableForm}
          />
        );
      case "personnelDeputed":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          onSelect,
          handleSearch,
          serchText,
          200,
          viewPrintAndElectronicMedia || disableForm
        );
      case "declaredBy":
        return renderFieldsWithDropDown(
          getDropdownValues(rewardsDeclaredBy),
          null,
          handleSearch,
          serchText,
          200,
          viewPrintAndElectronicMedia || disableForm
        );
      case "whetherGiven":
        return renderFieldsWithDropDown(
          getDropdownValues(whetherGivenIn),
          null,
          handleSearch,
          serchText,
          200,
          viewPrintAndElectronicMedia || disableForm
        );
      case "uploadPaperClipping":
        return (
          <Upload
            fileList={
              savedUploadPaperClippingURL !== ""
                ? selectedUploadPaperClipping
                : uploadPaperClipping
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setUploadPaperClipping)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 215, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewPrintAndElectronicMedia || disableForm}
            >
              Upload Paper Clipping
            </Button>
          </Upload>
        );
      case "result":
        return (
          <TextArea
            rows={4}
            columns={3}
            style={{ height: "100px" }}
            maxLength={textAreaRules.maxLength}
            disabled={viewPrintAndElectronicMedia || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPrintAndElectronicMedia || disableForm}
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
    const values = await rewardsDeclaredForm.validateFields();
    const uploadPaperClippingData = new FormData();
    uploadPaperClipping.forEach((file) => {
      uploadPaperClippingData.append("file", file.originFileObj);
    });
    uploadPaperClippingData.append("prefixFolder", crimeId);
    uploadPaperClippingData.append(
      "folderPath",
      `${crimeId}/${folderName.REWARDS_DECLARED}/file`
    );

    if (!isEmpty(uploadPaperClipping)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadPaperClippingData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(
              getMediaPayload(data, folderName.REWARDS_DECLARED)
            );
            const addUpdateResult = {
              crimeId: crimeId,
              rewardsDeclared: getPayloadResult(values, media),
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
    } else if (isEmpty(uploadPaperClipping)) {
      const existingMedia = first(
        getMediaPayload(
          [editPrintAndElectronicMediaObj?.uploadPaperClipping],
          folderName.REWARDS_DECLARED
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        rewardsDeclared: getPayloadResult(values, existingMedia),
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
    rewardsDeclaredForm.resetFields();
    setSelectedUploadPaperClipping([]);
    setSelectedIndex("");
    setEditPrintAndElectronicMediaObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={rewardsDeclaredForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 400 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(rewardsDeclaredFormData, displayFields)}
          </Row>
        </Card>
        <Card
          style={{ width: "30%", minHeight: 400 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              <SavedRecords
                dataSource={savedRecords}
                editDetails={handleEditPrintAndElectronicMedia}
                setViewDetails={setViewPrintAndElectronicMedia}
                selectedRecord={editPrintAndElectronicMediaObj}
                setSelectedIndex={setSelectedIndex}
              />
            </div>
          ) : null}
        </Card>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewPrintAndElectronicMedia || disableForm}
          onReset={resetForm}
        />
      </Form>
    </EffortForTracingModuleWrapper>
  );
}
