/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Button,
  Radio,
  Input,
  Upload,
  notification,
  Divider,
  Space,
} from "antd";
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
import { getFileById } from "@containers/media-util";
import moment from "moment";
import Loader from "@components/utility/loader";
import { isEmpty, isArray, isUndefined, first } from "lodash";
import { textAreaRules } from "@components/Common/formOptions";
import TextArea from "antd/lib/input/TextArea";
import { CameraFilled } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import ChargeSheetDataActions from "@redux/CourtAndProsecution/ChargeSheetData/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import CourtCommittalAction from "@redux/CourtAndProsecution/CourtCommittal/action";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import {
  addCourtCommittalPayload,
  updateCourtCommittalPayload,
} from "./payload";
import { CourtAndProsecutionWrapper } from "../styles";

export default function CourtCommittal({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const [dates, setDates] = useState({
    sessionsCourtCommittalDate: "",
    scNoIssueDate: "",
    committalNextDatePosting: "",
  });
  const [selectedUploadOrder, setSelectedUploadOrder] = useState([]);
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const crimeId = loadState("selectedFirId");
  const {
    createcourtcommittal,
    updatecourtcommittal,
    resetActionType,
    getcourtcommittalData,
  } = CourtCommittalAction;
  const [uploadOpinion, setUploadOpinion] = useState([]);
  const [depositProperty, setDepositProperty] = useState();
  const [radioValue, setRadioValue] = useState();
  const [sessionsCourtTypeData, setSessionsCourtTypeData] = useState("");
  const [sessionsCourtName, setSessionsCourtName] = useState("");
  const [sessionsSCNumber, setSessionsSCNumber] = useState("");
  const [editCourtCommittalObj, setEditCourtCommittalObj] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [disableCourt, setDisableCourt] = useState(true);
  const currentUser = loadState("currentUser");
  const dispatch = useDispatch();
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { setChargeSheetData } = ChargeSheetDataActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const { actionType, errorMessage, isFetching, successMessage, savedData } =
    useSelector((state) => state.CourtCommittal);
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)
  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal ||
    (savedData[0]?.sessionsCourtType === "SC" &&
      !!savedData[0]?.sessionsCourtType) ||
    (savedData[0]?.sessionsCourtType === "Spl.SC" &&
      !!savedData[0]?.sessionsCourtType);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const isSuccess =
    actionType === "ADD_COURT_COMMITTAl_SUCCESS" ||
    actionType === "UPDATE_COURT_COMMITTAl_SUCCESS";

  const isError =
    actionType === "ADD_COURT_COMMITTAl_ERROR" ||
    actionType === "UPDATE_COURT_COMMITTAl_ERROR";

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getcourtcommittalData(
        `${config.courtCommittal}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (!!successMessage) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        const obj = Object.assign(selectedCourtAndProsecution, {
          caseType: !!sessionsCourtTypeData
            ? sessionsCourtTypeData
            : selectedCourtAndProsecution?.caseType,
          courtName: !!sessionsCourtName
            ? sessionsCourtName
            : selectedCourtAndProsecution?.courtName,
          courtCaseNo: !!sessionsSCNumber
            ? sessionsSCNumber
            : selectedCourtAndProsecution?.courtCaseNo,
        });
        setSelectedSiderMenu("courtandprosecution");
        dispatch(
          setChargeSheetData({
            courtName: obj?.courtName,
            courtCaseNo: obj?.courtCaseNo,
            caseType: obj?.caseType,
          })
        );
        dispatch(resetActionType());
      } else if (!!errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const submit = async () => {
    const values = await form.validateFields();
    Object.assign(values, dates);
    if (!!editCourtCommittalObj?._id === true) {
      values["courtCommittalId"] = editCourtCommittalObj?._id;
    }
    if (
      !!values?.upload_order?.fileList &&
      values?.upload_order?.fileList?.length !== 0
    ) {
      const uploadCourtOrder = new FormData();
      values?.upload_order?.fileList.forEach((file) => {
        uploadCourtOrder.append("file", file.originFileObj);
      });
      uploadCourtOrder.append("prefixFolder", crimeId);
      uploadCourtOrder.append(
        "folderPath",
        `${crimeId}/${"courtCommittal"}/file`
      );
      axios
        .post(`${config.fileUpload}/upload`, uploadCourtOrder)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const addCommittalPayload = addCourtCommittalPayload(
              values,
              crimeId,
              selectedCourtAndProsecution?.updateChargesheetId,
              selectedCourtAndProsecution?._id,
              getMediaPayloadWithoutCategory(data)
            );
            const updateCommittalPayload = updateCourtCommittalPayload(
              values,
              crimeId,
              selectedCourtAndProsecution?.updateChargesheetId,
              selectedCourtAndProsecution?._id,
              getMediaPayloadWithoutCategory(data)
            );
            if (!!editCourtCommittalObj?._id === true) {
              dispatch(
                updatecourtcommittal(
                  `${config.courtCommittal}?crimeId=${crimeId}`,
                  updateCommittalPayload
                )
              );
            } else {
              dispatch(
                createcourtcommittal(
                  `${config.courtCommittal}?crimeId=${crimeId}`,
                  addCommittalPayload
                )
              );
            }
          } else {
            getMediaUploadError(res?.message, openNotificationWithIcon);
          }
        })
        .catch((err) => getMediaUploadError(err, openNotificationWithIcon));
    } else {
      const addCommittalPayload = addCourtCommittalPayload(
        values,
        crimeId,
        selectedCourtAndProsecution?.updateChargesheetId,
        selectedCourtAndProsecution?._id,
        []
      );
      const updateCommittalPayload = updateCourtCommittalPayload(
        values,
        crimeId,
        selectedCourtAndProsecution?.updateChargesheetId,
        selectedCourtAndProsecution?._id,
        []
      );
      if (!!editCourtCommittalObj?._id === true) {
        dispatch(
          updatecourtcommittal(
            `${config.courtCommittal}?crimeId=${crimeId}`,
            updateCommittalPayload
          )
        );
      } else {
        dispatch(
          createcourtcommittal(
            `${config.courtCommittal}?crimeId=${crimeId}`,
            addCommittalPayload
          )
        );
      }
    }
  };

  useEffect(() => {
    if (!isUndefined(savedData) || !isEmpty(savedData)) {
      const values = first(savedData);
      setEditCourtCommittalObj(values);
      setDepositProperty(values?.isPropertyDeposited);
      setRadioValue(values?.isSessionsCourtCommitted);
      if (
        values?.sessionsCourtOrder.length !== 0 &&
        !!values?.sessionsCourtOrder
      ) {
        setSelectedUploadOrder(values?.sessionsCourtOrder);
      } else {
        setSelectedUploadOrder([]);
      }
      form.setFieldsValue({
        isAllAccusedPresent: values?.isAllAccusedPresent,
        isAllDocumentsVerified: values?.isAllDocumentsVerified,
        isPropertyDeposited: values?.isPropertyDeposited,
        propertyDeposited: values?.propertyDeposited,
        reasonPropertyNotDeposited: values?.reasonPropertyNotDeposited,
        isSessionsCourtCommitted: values?.isSessionsCourtCommitted,
        sessionsCourtName: values?.sessionsCourtName,
        reasonNonCommittal: values?.reasonNonCommittal,
        noncommittalNextDatePosting: values?.noncommittalNextDatePosting,
        courtCommittalId: values?.courtCommittalId,
        sessionsCourtType: values?.sessionsCourtType,
        scNo: values?.scNo,
        remarksCommittal: values?.remarksCommittal,
      });
      setDates({
        committalNextDatePosting: !!values?.committalNextDatePosting
          ? moment(new Date(values?.committalNextDatePosting))
          : "",
        scNoIssueDate: !!values?.scNoIssueDate
          ? moment(new Date(values?.scNoIssueDate))
          : "",
        sessionsCourtCommittalDate: !!values?.sessionsCourtCommittalDate
          ? moment(new Date(values?.sessionsCourtCommittalDate))
          : "",
      });
      if (!!values?.sessionsCourtName) {
        setDisableCourt(false);
      } else {
        setDisableCourt(true);
      }
    }
  }, [savedData]);

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const handleSelect = (data) => {
    if (!!data) {
      setDisableCourt(false);
      checkFields();
    } else {
      setDisableCourt(true);
      form.setFieldsValue({
        sessionsCourtCommittalDate: null,
        sessionsCourtOrder: [],
      });
      setSelectedUploadOrder([]);
      checkFields();
    }
  };

  const displayUploadReports = (name, title) => {
    return (
      <Form.Item name={name}>
        <Upload
          fileList={
            editCourtCommittalObj?._id ? selectedUploadOrder : uploadOpinion
          }
          customRequest={dummyRequest}
          onChange={(info) => {
            onFileChange(
              info,
              editCourtCommittalObj?._id
                ? setSelectedUploadOrder
                : setUploadOpinion
            );
            setFormValid(true);
          }}
          multiple={false}
          onPreview={handleDownload}
        >
          <Button
            className="saveButton"
            style={{ width: 185, marginLeft: 10 }}
            icon={<CameraFilled style={{ marginRight: 150 }} />}
            disabled={
              disableForm ||
              selectedCourtAndProsecution?.caseType !== "PRC" ||
              disableCourt
            }
          >
            {title}
          </Button>
        </Upload>
      </Form.Item>
    );
  };

  return (
    <CourtAndProsecutionWrapper>
      <ContentHeader
        headerTitle="Court Committal"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("courtandprosecution")}
        disableButton={
          disableForm ||
          selectedCourtAndProsecution?.caseType !== "PRC" ||
          !formValid
        }
      />
      <Card style={{ minHeight: 420 }}>
        {isFetching ? (
          <Loader />
        ) : (
          <Form form={form} colon={false}>
            <Row gutter={24}>
              <Col span={18}>
                <Form.Item
                  name="isAllAccusedPresent"
                  label="All the accused present ?"
                >
                  <Radio.Group
                    buttonStyle="solid"
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    style={{ marginLeft: 100 }}
                  >
                    <Radio value={"Yes"}>Yes</Radio>
                    <Radio value={"No"}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={18} style={{ marginTop: 20 }}>
                <Form.Item
                  name="isAllDocumentsVerified"
                  label="All documents verified in court ?"
                >
                  <Radio.Group
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    style={{ marginLeft: 50 }}
                  >
                    <Radio value={"Yes"}>Yes</Radio>
                    <Radio value={"No"}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10} style={{ marginTop: 20 }}>
                <Form.Item
                  name="isPropertyDeposited"
                  label="Property deposited ?"
                >
                  <Radio.Group
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    onChange={(e) => setDepositProperty(e.target.value)}
                    style={{ marginLeft: 133 }}
                  >
                    <Radio value={"Yes"}>Yes</Radio>
                    <Radio value={"No"}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={10}>
                {depositProperty === "Yes" ? (
                  <Form.Item name="propertyDeposited">
                    <Input
                      onChange={checkFields}
                      disabled={
                        disableForm ||
                        selectedCourtAndProsecution?.caseType !== "PRC"
                      }
                      style={{ width: 180, marginTop: 20 }}
                      placeholder="Please Enter CPR No."
                    />
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
            <Space style={{ width: "100%", marginTop: 20 }}>
              <p style={{ fontSize: "16px" }}>Sessions Court Name?</p>
              <Space style={{ marginLeft: "125px" }}>
                <Form.Item name="sessionsCourtName">
                  {renderFieldsWithDropDown(
                    courtNames,
                    (data) => {
                      handleSelect(data);
                      setSessionsCourtName(data);
                    },
                    handleSearch,
                    serchText,
                    200,
                    disableForm ||
                    selectedCourtAndProsecution?.caseType !== "PRC",
                    "",
                    "Select Court Name",
                    () => {
                      handleSelect("");
                      setSessionsCourtName("");
                    }
                  )}
                </Form.Item>
                <Form.Item>
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC" ||
                      disableCourt
                    }
                    placeholder="Select Date"
                    style={{
                      width: 150,
                      marginLeft: 10,
                    }}
                    value={dates?.sessionsCourtCommittalDate}
                    onChange={(date) => {
                      checkFields();
                      setDates({ ...dates, sessionsCourtCommittalDate: date });
                    }}
                  />
                </Form.Item>
                {displayUploadReports("upload_order", "Upload Order Copy")}
              </Space>
            </Space>

            <Divider />
            <Row gutter={24}>
              <Col style={{ marginTop: 20 }}>
                <Form.Item
                  name="sessionsCourtType"
                  label="Type of Case to be Committed?"
                >
                  <Radio.Group
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    onChange={(e) => {
                      checkFields();
                      setSessionsCourtTypeData(e.target.value);
                    }}
                    style={{ marginLeft: 50 }}
                  >
                    <Radio value={"SC"}>SC</Radio>
                    <Radio value={"Spl.SC"}>Spl.SC</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} style={{ marginTop: 20 }}>
                <Form.Item label="Date of issue of SC No.">
                  <DatePicker
                    format={DATE_FORMAT}
                    value={dates?.scNoIssueDate}
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    placeholder="Date of issue of SC No"
                    style={{ width: 200, marginLeft: 114 }}
                    onChange={(date) => {
                      checkFields();
                      setDates({ ...dates, scNoIssueDate: date });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} style={{ marginTop: 20 }}>
                <Form.Item name="scNo" label="Enter SC No.">
                  <Input
                    onChange={(e) => {
                      checkFields();
                      setSessionsSCNumber(e.target?.value);
                    }}
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    style={{ width: 200, marginLeft: 190 }}
                    placeholder="Enter Sc No"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} style={{ marginTop: 20 }}>
                <Form.Item
                  name="remarksCommittal"
                  label="Remarks"
                  rules={[textAreaRules.textAreaMaxLength]}
                >
                  <TextArea
                    style={{
                      height: 100,
                      width: 500,
                      marginLeft: 220,
                    }}
                    placeholder="Reasons for Non Commital"
                    maxLength={textAreaRules.maxLength}
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8} style={{ marginTop: 20 }}>
                <Form.Item label="Next Date of Posting">
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={
                      disableForm ||
                      selectedCourtAndProsecution?.caseType !== "PRC"
                    }
                    value={dates?.committalNextDatePosting}
                    placeholder="Next Date of Posting"
                    style={{ width: 200, marginLeft: 130 }}
                    onChange={(date) => {
                      checkFields();
                      setDates({ ...dates, committalNextDatePosting: date });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </CourtAndProsecutionWrapper>
  );
}
