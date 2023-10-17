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
  dummyRequest,
  onFileChange,
  folderName,
  getMediaUploadError,
  getMediaPayload,
} from "@containers/FirDetails/fir-util";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import { getFileById } from "@containers/media-util";
import { addUpdatePayload } from "./payloads";
import { printAndElectronicMediaForm, modeOfMediaList } from "../const";
import PrintAndElectronicMediaSavedRecords from "./PrintAndElectronicMediaSavedRecords";
import SaveResetButton from "../SaveResetButton";
import { EffortForTracingModuleWrapper } from "../styles";

const { TextArea } = Input;

export default function PrintAndElectronicMedia({
  handleSearch,
  serchText,
  openNotificationWithIcon,
  savedRecords,
  selectedIndex,
  setSelectedIndex,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [printMediaForm] = Form.useForm();
  const [uploadClipping, setUploadClipping] = useState([]);
  const [selectedUploadClipping, setSelectedUploadClipping] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [viewPrintAndElectronicMedia, setViewPrintAndElectronicMedia] =
    useState(false);
  const [editPrintAndElectronicMediaObj, setEditPrintAndElectronicMediaObj] =
    useState(null);
  const { addEffortsForTracingDetails } = effortsForTracingActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const checkFields = async () => {
    const values = await printMediaForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditPrintAndElectronicMedia = (value) => {
    if (value) {
      setEditPrintAndElectronicMediaObj(value);
      const uploadClipping = value?.uploadClipping;
      if (uploadClipping && uploadClipping?.url !== "") {
        setSelectedUploadClipping([
          {
            url: uploadClipping?.url,
            name: uploadClipping?.name,
            fileId: uploadClipping?.fileId,
          },
        ]);
      } else {
        setSelectedUploadClipping([]);
      }
      printMediaForm.setFieldsValue({
        dateOfPublishing: moment(new Date(value?.dateOfPublishing)).isValid()
          ? moment(new Date(value?.dateOfPublishing))
          : "",
        modeOfMedia: value?.modeOfMedia,
        remarks: value?.remarks,
      });
    }
  };

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col
          span={s.name === "remarks" ? 15 : 8}
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

  const savedUploadClippingURL = editPrintAndElectronicMediaObj?.uploadClipping
    ?.url
    ? editPrintAndElectronicMediaObj?.uploadClipping?.url
    : "";

  const displayFields = (name) => {
    switch (name) {
      case "dateOfPublishing":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 250 }}
            onChange={checkFields}
            disabled={viewPrintAndElectronicMedia || disableForm}
          />
        );
      case "modeOfMedia":
        return renderFieldsWithDropDown(
          modeOfMediaList,
          null,
          handleSearch,
          serchText,
          250,
          viewPrintAndElectronicMedia || disableForm
        );
      case "uploadClipping":
        return (
          <Upload
            fileList={
              savedUploadClippingURL !== ""
                ? selectedUploadClipping
                : uploadClipping
            }
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setUploadClipping)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 215, marginTop: 15 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={viewPrintAndElectronicMedia || disableForm}
            >
              Upload Clipping
            </Button>
          </Upload>
        );
      case "remarks":
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
            style={{ width: 250 }}
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
    const values = await printMediaForm.validateFields();
    const uploadClippingData = new FormData();
    uploadClipping.forEach((file) => {
      uploadClippingData.append("file", file.originFileObj);
    });
    uploadClippingData.append("prefixFolder", crimeId);
    uploadClippingData.append(
      "folderPath",
      `${crimeId}/${folderName.PRINT_MEDIA}/file`
    );

    if (!isEmpty(uploadClipping)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadClippingData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const media = first(getMediaPayload(data, folderName.PRINT_MEDIA));
            const addUpdateResult = {
              crimeId: crimeId,
              printAndElectronicMedia: getPayloadResult(values, media),
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
    } else if (isEmpty(uploadClipping)) {
      const existingMedia = first(
        getMediaPayload(
          [editPrintAndElectronicMediaObj?.uploadClipping],
          folderName.PRINT_MEDIA
        )
      );
      const addUpdateResult = {
        crimeId: crimeId,
        printAndElectronicMedia: getPayloadResult(values, existingMedia),
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
    printMediaForm.resetFields();
    setSelectedUploadClipping([]);
    setSelectedIndex("");
    setEditPrintAndElectronicMediaObj(null);
  };

  return (
    <EffortForTracingModuleWrapper>
      <Form form={printMediaForm} layout="vertical">
        <Card
          style={{ width: "70%", minHeight: 300 }}
          className="cardLeftStyle"
        >
          <Row gutter={24}>
            {displayState(printAndElectronicMediaForm, displayFields)}
          </Row>
        </Card>
        <Card
          style={{ width: "30%", minHeight: 300 }}
          className="right-section cardRightStyle"
        >
          {!isEmpty(savedRecords) ? (
            <div style={{ maxHeight: 270, overflowY: "auto" }}>
              <PrintAndElectronicMediaSavedRecords
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
