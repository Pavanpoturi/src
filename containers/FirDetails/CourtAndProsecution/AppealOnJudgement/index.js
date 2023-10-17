/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Button,
  Input,
  Upload,
  notification,
} from "antd";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  dummyRequest,
  onFileChange,
  getMediaPayloadWithoutCategory,
  getMediaUploadError,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { CameraFilled } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import AppealOnJudgementAction from "@redux/CourtAndProsecution/AppealOnJudgement/actions.js";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { getFileById } from "@containers/media-util";
import axios from "axios";
import { textAreaRules } from "@components/Common/formOptions";
import {
  addAppealOnJudgementPayload,
  updateAppealOnJudgementPayload,
} from "./payload";
import { CourtAndProsecutionWrapper } from "../styles";

export default function AppealOnJudgement({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const [uploadPPOpnion, setUploadPPOpnion] = useState([]);
  const [serchText, setSerchText] = useState("");
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const [editAppealOnJudgementForm, setEditAppealOnJudgementForm] =
    useState(null);
  const {
    actionType,
    errorMessage,
    successMessage,
    appealOnJudgementList,
    isFetching,
  } = useSelector((state) => state.AppealOnJudgement);
  const {
    addAppealOnJudgement,
    updateAppealOnJudgement,
    getAppealOnJudgementList,
    resetActionType,
  } = AppealOnJudgementAction;

  const isSuccess =
    actionType === "ADD_APPEAL_ON_JUDGEMENT_SUCCESS" ||
    actionType === "UPDATE_APPEAL_ON_JUDGEMENT_SUCCESS";

  const isError =
    actionType === "ADD_APPEAL_ON_JUDGEMENT_ERROR" ||
    actionType === "UPDATE_APPEAL_ON_JUDGEMENT_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  useEffect(() => {
    getAppealOnJudgementApi();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage) {
        getAppealOnJudgementApi();
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getAppealOnJudgementApi = () => {
    dispatch(
      getAppealOnJudgementList(
        `${config.appealOnJudgement}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  };

  useEffect(() => {
    const appealDoc = appealOnJudgementList?.[0];
    setEditAppealOnJudgementForm(appealDoc);
    if (appealDoc?.media?.length !== 0 && !!appealDoc?.media) {
      setUploadPPOpnion(appealDoc?.media);
    } else {
      setUploadPPOpnion([]);
    }
    if (appealDoc) {
      form.setFieldsValue({
        judgementDate: moment(new Date(appealDoc?.dateOfJudgement)).isValid()
          ? moment(new Date(appealDoc?.dateOfJudgement))
          : "",
        dateOfFiling: moment(
          new Date(appealDoc?.dateOfFilingForCertifiedCopies)
        ).isValid()
          ? moment(new Date(appealDoc?.dateOfFilingForCertifiedCopies))
          : "",
        dateOfReceiving: moment(
          new Date(appealDoc?.dateOfReceivingCertifiedCopies)
        ).isValid()
          ? moment(new Date(appealDoc?.dateOfReceivingCertifiedCopies))
          : "",
        dateOfSubmittingPP: moment(
          new Date(appealDoc?.dateOfSubmittingToPPForOpinion)
        ).isValid()
          ? moment(new Date(appealDoc?.dateOfSubmittingToPPForOpinion))
          : "",
        natureOfOpinionPP: appealDoc?.natureOfOpinionOfPP,
        dateOfForwordingJudgmentCopy: moment(
          new Date(appealDoc?.dateOfForwardingPPOpinionToUnitOffice)
        ).isValid()
          ? moment(new Date(appealDoc?.dateOfForwardingPPOpinionToUnitOffice))
          : "",
        petitionFiledAppeal: appealDoc?.petitionFiledForAppeal,
        appealCourtNo: appealDoc?.appealCourtNo,
        appealCourtName: appealDoc?.nameOfTheAppealCourt,
        appealOrders: appealDoc?.appealOrders,
        media: appealDoc?.media,
      });
    }
  }, [appealOnJudgementList]);

  const submit = async () => {
    const values = await form.validateFields();
    let data1 = uploadPPOpnion || [];
    Object.assign(values);
    if (!!editAppealOnJudgementForm?._id === true) {
      values["appealId"] = editAppealOnJudgementForm?._id;
    }
    if (
      !!values?.uploadPPOpnion?.fileList &&
      values?.uploadPPOpnion?.fileList?.length !== 0
    ) {
      const uploadPPOpnionMedia = new FormData();
      values?.uploadPPOpnion?.fileList.forEach((file) => {
        uploadPPOpnionMedia.append("file", file.originFileObj);
      });
      uploadPPOpnionMedia.append("prefixFolder", crimeId);
      uploadPPOpnionMedia.append(
        "folderPath",
        `${crimeId}/${"courtCommittal"}/file`
      );
      await axios
        .post(`${config.fileUpload}/upload`, uploadPPOpnionMedia)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            data1 = getMediaPayloadWithoutCategory(data);
          }
        })
        .catch((err) => getMediaUploadError(err, openNotificationWithIcon));
    }

    const addPayloadData = addAppealOnJudgementPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      data1
    );
    const updatePayloadData = updateAppealOnJudgementPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      editAppealOnJudgementForm?._id,
      data1
    );

    if (editAppealOnJudgementForm?._id) {
      dispatch(
        updateAppealOnJudgement(
          `${config.appealOnJudgement}?crimeId=${crimeId}`,
          updatePayloadData
        )
      );
    } else {
      dispatch(
        addAppealOnJudgement(
          `${config.appealOnJudgement}?crimeId=${crimeId}`,
          addPayloadData
        )
      );
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <CourtAndProsecutionWrapper>
      <ContentHeader
        headerTitle="Appeal/Revision On Judgement"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("courtandprosecution")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Card style={{ width: "100%", height: 580, minHeight: 580 }}>
          <Form form={form} colon={false} layout="vertical">
            <Row gutter={24}>
              <Col span={10} style={{ marginBottom: 20 }}>
                <Form.Item
                  name="judgementDate"
                  label="Date of Judgement"
                  rules={[
                    {
                      required: true,
                      message: "Date of Judgement is required!",
                    },
                  ]}
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="dateOfFiling"
                  label="Date of filing requisition for certified copies"
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="dateOfReceiving"
                  label="Date of receiving certified copies"
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="dateOfSubmittingPP"
                  label="Date of Submitting Judgement to PP for opinion"
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={4} style={{ marginTop: 50 }}>
                <Form.Item name="uploadPPOpnion">
                  <Upload
                    fileList={uploadPPOpnion}
                    customRequest={dummyRequest}
                    onChange={(info) => onFileChange(info, setUploadPPOpnion)}
                    multiple={false}
                    onPreview={handleDownload}
                  >
                    <Button
                      className="saveButton"
                      style={{ width: 190 }}
                      icon={<CameraFilled style={{ float: "left" }} />}
                      disabled={disableForm}
                    >
                      Upload PP Opinion
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item
                  name="natureOfOpinionPP"
                  label="Nature of opinion of PP"
                >
                  {renderFieldsWithDropDown(
                    [
                      { label: "Fit case for appeal / revision" },
                      { label: "No grounds for appeal / revision" },
                    ],
                    null,
                    handleSearch,
                    serchText,
                    250,
                    disableForm,
                    "",
                    "Fit case for appeal / revision"
                  )}
                </Form.Item>
              </Col>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item
                  name="dateOfForwordingJudgmentCopy"
                  label="Date of Forwarding Judgement copy with PP opinion to Unit Office"
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item
                  name="petitionFiledAppeal"
                  label="Petition filed for Appeal"
                >
                  {renderFieldsWithDropDown(
                    [{ label: "Accused" }, { label: "Prosecution" }],
                    null,
                    handleSearch,
                    serchText,
                    250,
                    disableForm,
                    "",
                    "Accused/Prosecution"
                  )}
                </Form.Item>
              </Col>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item name="appealCourtNo" label="Appeal Court No">
                  <Input
                    onChange={checkFields}
                    disabled={disableForm}
                    style={{ width: 250 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginTop: 20 }}>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item
                  name="appealCourtName"
                  label="Name of the Appeal Court"
                >
                  <Input
                    onChange={checkFields}
                    disabled={disableForm}
                    style={{ width: 250 }}
                  />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  name="appealOrders"
                  label="Appeal Orders"
                  rules={[textAreaRules.textAreaMaxLength]}
                >
                  <TextArea
                    style={{ height: 100, width: "100%" }}
                    maxLength={textAreaRules.maxLength}
                    disabled={disableForm}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}
    </CourtAndProsecutionWrapper>
  );
}
