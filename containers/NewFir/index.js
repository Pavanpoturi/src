import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import createFIRActions from "@redux/createFir/actions";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import { isEmpty, isUndefined, first, isNull } from "lodash";
import { config } from "@config/site.config";
import {
  Row,
  Form,
  Collapse,
  Radio,
  Popconfirm,
  Button,
  Col,
  Upload,
  Modal,
  notification,
} from "antd";
import {
  DoubleRightOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import Loader from "@components/utility/loader";
import dashboardActions from "@redux/dashboard/actions";
import firActions from "@redux/fir/actions";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import masterDataActions from "@redux/masterData/actions";
import axios from "axios";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import { folderName } from "@containers/FirDetails/fir-util";
import { FirDetailsModuleWrapper } from "./styles";
import ActsSections from "./ActsSections";
import OccurrenceOfOffence from "./OccurrenceOfOffence";
import ComplainantDetails from "./ComplainantDetails";
import AccusedDetails from "./AccusedDetails";
import VictimDetails from "./VictimDetails";
import PropertyDetails from "./PropertyDetails";
import { useHistory } from "react-router-dom";
import BriefFacts from "./BriefFacts";
import UploadDocuments from "./UploadDocuments";
import { getCommonPayload } from "./createFIRPayload";
import PrintFIRModal from "./PrintFIRModal";
import {
  FIR_MASTER_DATA_LIST,
  isUpdateSuccess,
  isUpdateError,
  accordionTitle,
} from "./const";
import { getFileById } from "@containers/media-util";

const { uploadTemplates } = mediaManagerActions;

const { Panel } = Collapse;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

const optionType = {
  MAJOR_HEAD: "MAJOR_HEAD",
  MINOR_HEAD: "MINOR_HEAD",
  ACT: "ACT",
  SECTION: "SECTION",
  FIR: "FIR",
};

export default function NewFir() {
  const history = useHistory();
  const currentUser = loadState("currentUser");
  const { fetchDashboardDetails } = dashboardActions;
  const selectedDraftedFirId = loadState("selectedDraftedFirId");
  const selectedFirId = loadState("selectedFirId");
  const isConsumed = loadStringState("isConsumed");
  const dispatch = useDispatch();
  const {
    actionType,
    updateActionType,
    uploadActionType,
    errorMessage,
    successMessage,
    uploadErrorMessage,
    uploadSuccessMessage,
    updateSuccessMessage,
    updateErrorMessage,
    isFetching,
    savedFir,
  } = useSelector((state) => state.createFIR);
  const { recentFirNumList } = useSelector((state) => state.FIR);
  const {
    updateFIR,
    getFIRData,
    resetActionType,
    resetUpdateFir,
    getFirMasterData,
    uploadFIR,
  } = createFIRActions;
  const {
    updateDashboardData,
    fetchFIRList,
    fetchRecentFIRNumList,
    updateSelectedWidget,
  } = firActions;
  let crimeId = "";
  if (!isUndefined(selectedDraftedFirId) && isUndefined(isConsumed)) {
    crimeId = selectedDraftedFirId;
  } else if (isUndefined(selectedDraftedFirId) && !isUndefined(isConsumed)) {
    crimeId = selectedFirId;
  } else {
    crimeId = savedFir?._id;
  }
  const [firType, setfirType] = useState("Regular");
  const [previousFirNum, setPreviousFirNum] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [briefFactsForm] = Form.useForm();
  const [actsForm] = Form.useForm();
  const [actsAndArtsForm] = Form.useForm();
  const [majorMinorForm] = Form.useForm();
  const [occurenceForm] = Form.useForm();
  const [propertyForm] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const isFirGenerated =
    !isEmpty(savedFir) && !isUndefined(savedFir) && savedFir?.isDraft === false;
  const [placeOfOffence, setPlaceOfOffence] = useState("inside");
  const [actsAndSections, setActsAndSections] = useState([]);
  const [majorAndMinor, setMajorAndMinor] = useState([]);
  const [showError, setShowError] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { createAuditHistory } = auditHistoryActions;
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  const {
    getMajorHeadList,
    getMinorHeadList,
    getActList,
    getSectionList,
    getFIRMasterList,
  } = masterDataActions;

  const [firUploadFileListState, setFIRUploadFileListState] = useState([]);
  const disableGenerateFirButton =
    isEmpty(savedFir?.firDetail?.uploadDocuments) ||
    (!isEmpty(savedFir) && savedFir?.isDraft === false);

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getFIRMasterList(`${url}/${optionType.FIR}`));
    dispatch(getMajorHeadList(`${url}/${optionType.MAJOR_HEAD}`));
    dispatch(getMinorHeadList(`${url}/${optionType.MINOR_HEAD}`));
    dispatch(getActList(`${url}/${optionType.ACT}`));
    dispatch(getSectionList(`${url}/${optionType.SECTION}`));
    getPreviousFirNum();
  }, []);

  const getPreviousFirNum = () => {
    dispatch(
      fetchRecentFIRNumList(
        `${config.getRecentFirNum}/?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  const fetchDraftFir = () => {
    dispatch(
      fetchFIRList(
        `${config.getRecentFirList}/?psCode=${
          currentUser?.cctns_unit_id
        }&caseStatus=New&isDraft=${true}`
      )
    );
  };

  useEffect(() => {
    if (
      !isEmpty(recentFirNumList) &&
      first(recentFirNumList)?.firDetail?.firNum
    ) {
      setPreviousFirNum(first(recentFirNumList)?.firDetail?.firNum);
    } else {
      setPreviousFirNum("");
    }
  }, [recentFirNumList]);

  const getFirMasterDataList = () => {
    const payload = {
      masterUnits: FIR_MASTER_DATA_LIST,
    };
    dispatch(getFirMasterData(config.getMasterDataMultiple, payload));
  };

  useEffect(() => {
    if (!isUndefined(selectedDraftedFirId) || !isUndefined(isConsumed)) {
      dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
    }
    if (
      (!isUndefined(selectedFirId) || savedFir?.isDraft === false) &&
      isUndefined(isConsumed)
    ) {
      dispatch(getFIRData(`${config.getInitialFIR}?crimeId=${selectedFirId}`));
    }
    getFirMasterDataList();
  }, []);

  const isSuccess = actionType === "ADD_GENERATE_FIR_SUCCESS";
  const isError = actionType === "ADD_GENERATE_FIR_ERROR";
  const isUploadSuccess = uploadActionType === "UPLOAD_FIR_SUCCESS";
  const isUploadError = uploadActionType === "UPLOAD_FIR_ERROR";

  const auditHistoryEntry = () => {
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "FIR/newFIR", "New FIR Updated")
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
          localStorage.setItem(
            "selectedDraftedFirId",
            JSON.stringify(savedFir?._id)
          );
          history.push(`/dashboard/draft-fir/${savedFir?._id}`);
          dispatch(getFIRData(`${config.getFIR}?crimeId=${savedFir?._id}`));
        }
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        getPreviousFirNum();
        fetchDraftFir();
        uploadForm.resetFields();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType, savedFir]);

  useEffect(() => {
    if (isUpdateSuccess(updateActionType) || isUpdateError(updateActionType)) {
      if (updateSuccessMessage !== "") {
        openNotificationWithIcon("success", updateSuccessMessage);
        auditHistoryEntry();
        uploadForm.resetFields();
        if (savedFir?.isDraft === true) {
          dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
        } else {
          localStorage.removeItem("isConsumed");
        }
        getPreviousFirNum();
        fetchDraftFir();
        dispatch(resetUpdateFir());
      } else if (updateErrorMessage) {
        openNotificationWithIcon("error", updateErrorMessage);
        dispatch(resetUpdateFir());
      }
    }
  }, [updateActionType, savedFir, selectedFirId]);

  useEffect(() => {
    if (isUploadSuccess || isUploadError) {
      if (uploadSuccessMessage !== "") {
        openNotificationWithIcon("success", uploadSuccessMessage);
        auditHistoryEntry();
        const crimeID = isUndefined(selectedDraftedFirId)
          ? selectedFirId
          : selectedDraftedFirId;
        dispatch(getFIRData(`${config.getInitialFIR}?crimeId=${crimeID}`));
        dispatch(resetUpdateFir());
      } else if (uploadErrorMessage) {
        openNotificationWithIcon("error", uploadErrorMessage);
        dispatch(resetUpdateFir());
      }
    }
  }, [uploadActionType]);

  useEffect(() => {
    if (!currentUser.isPersnolized) {
      dispatch(updateDashboardData(false));
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      setfirType(savedFir?.firType);
      if (savedFir?.firType === "Zero") {
        if (isConsumed === "true") {
          //if we click consume zero FIR, It should be Regular
          setfirType("Regular");
        }
        setPlaceOfOffence("outside");
        if (isConsumed === "true") {
          //if we click consume zero FIR, It should be Regular
          setfirType("Regular");
        }
      } else if (savedFir?.firType === "Regular") {
        setPlaceOfOffence("inside");
      }
    }
  }, [savedFir]);

  const generateFIR = () => {
    if (!isEmpty(savedFir) && savedFir?._id) {
      const isBriefFacts = savedFir?.firDetail?.briefFacts?.courtName;
      //after Transfer Zero, while consuming -> briefFacts?.ioAssignedName validation
      let ioAssignedNameNotFound = false;
      if (
        savedFir?.firDetail?.briefFacts?.actionTaken !== "Refused" &&
        !savedFir?.firDetail?.briefFacts?.ioAssignedName
      ) {
        ioAssignedNameNotFound = true;
      }
      if (
        isNull(savedFir?.firDetail?.occurenceOfOffence) ||
        isUndefined(isBriefFacts) ||
        isEmpty(savedFir?.accusedDetails) ||
        isEmpty(savedFir?.complainantDetails) ||
        ioAssignedNameNotFound
      ) {
        setShowError(true);
      } else {
        setShowError(false);
        const payload = getCommonPayload(savedFir, firType, false);
        localStorage.removeItem("selectedDraftedFirId");
        dispatch(updateFIR(config.updateFIR, payload));
      }
    }
  };

  const saveDraft = () => {
    if (!isEmpty(savedFir) && savedFir?._id) {
      const payload = getCommonPayload(savedFir, firType, true);
      dispatch(updateFIR(config.updateFIR, payload));
    }
  };

  const selectFirType = (val) => {
    setfirType(val);
    if (val === "Zero") {
      setPlaceOfOffence("outside");
      occurenceForm.resetFields();
    } else if (val === "Regular") {
      setPlaceOfOffence("inside");
      occurenceForm.resetFields();
    } else {
      setPlaceOfOffence("inside");
      occurenceForm.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch(getSectionList(`${config.getMasterData}/${optionType.SECTION}`));
  };

  const showConfirm = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const handleUpload = (options) => {
    if (firUploadFileListState.length > 0) {
      const mediaFormData = new FormData();
      firUploadFileListState.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      const crimeID = isUndefined(selectedDraftedFirId)
        ? selectedFirId
        : selectedDraftedFirId;
      mediaFormData.append("prefixFolder", crimeID);
      mediaFormData.append("folderPath", `${crimeID}/${folderName.FIR}/file`);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setFIRUploadFileListState([]);
          if (response.data.success) {
            hideModal();
            const { data } = response?.data;
            const payloadData = first(data);
            const tpayload = {
              crimeId: crimeID,
              action: folderName.FIR,
              actionSubType: folderName.FIR,
              templates: [
                {
                  category: "printFIR",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  templateCode: payloadData.name,
                  templateName: payloadData.name,
                  fileId: payloadData?.id,
                },
              ],
            };
            dispatch(uploadTemplates(config.templatesUpload, tpayload));
            if (!isEmpty(savedFir) && !savedFir?.isDraft) {
              const payload = {
                crimeId: crimeID,
                firReport: {
                  category: "printFIR",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  fileId: payloadData?.id,
                },
              };
              dispatch(uploadFIR(config.uploadFirReport, payload));
            }
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          console.log(err);
          setFIRUploadFileListState([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const fetchDataDetails = () => {
    dispatch(
      fetchDashboardDetails(
        `${config.getCaseMetricsByEMail}/?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  const getValidationError = (message) => {
    return (
      <Row gutter={24}>
        <Col span={2} style={{ fontSize: 20 }}>
          <ExclamationCircleOutlined style={{ color: "red" }} />
        </Col>
        <Col span={22} style={{ fontSize: 16, marginTop: 8 }}>
          {message}
        </Col>
      </Row>
    );
  };

  const getErrorDetails = () => {
    //after Transfer Zero, while consuming -> briefFacts?.ioAssignedName validation
    let ioAssignedNameNotFound = false;
    if (
      savedFir?.firDetail?.briefFacts?.actionTaken !== "Refused" &&
      !savedFir?.firDetail?.briefFacts?.ioAssignedName
    ) {
      ioAssignedNameNotFound = true;
    }
    return (
      <div>
        {isNull(savedFir?.firDetail?.occurenceOfOffence) &&
          getValidationError("Please Fill Occurrence Of Offence")}
        {isEmpty(savedFir?.complainantDetails) &&
          getValidationError("Please Fill Complainant Details")}
        {isEmpty(savedFir?.accusedDetails) &&
          getValidationError("Please Fill Accused Details")}
        {
          // isUndefined(savedFir?.firDetail?.briefFacts?.courtName) ||
          !!savedFir?.firDetail?.briefFacts?.courtName === false &&
            getValidationError("Please Fill Details in Brief Facts")
        }
        {ioAssignedNameNotFound &&
          !isUndefined(isConsumed) &&
          getValidationError(
            'Please change the "Investigation Assigned to", "FIR Issued by" and "FIR Entered by" fields according to your police station data in "Brief Facts" Section.'
          )}
      </div>
    );
  };

  const uploadFirReport =
    !isNull(savedFir) && savedFir?.firDetail?.uploadFirReport;

  const fileData =
    !isNull(savedFir) &&
    !isUndefined(uploadFirReport) &&
    uploadFirReport.url !== ""
      ? [uploadFirReport]
      : undefined;

  return (
    <FirDetailsModuleWrapper>
      <div style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 10 }}>
        <div className="contentHeaderContainer">
          <div style={styles.widgetPageStyle}>
            <h2 className="pageTitle">FIR </h2>
          </div>
          <div style={{ display: "flex", marginTop: 10 }}>
            <Button
              className="stepsButtonInActive"
              style={{ marginRight: 5 }}
              onClick={() => {
                dispatch(updateDashboardData(true));
                dispatch(updateSelectedWidget(""));
                localStorage.removeItem("selectedFirId");
                localStorage.removeItem("selectedDraftedFirId");
                localStorage.removeItem("isConsumed");
                fetchDataDetails();
                history.push("/dashboard");
              }}
            >
              Cancel
            </Button>
            {isFirGenerated && isUndefined(isConsumed) ? (
              <>
                <Button
                  type="primary"
                  className="saveButton"
                  style={{ width: 180, marginRight: 5 }}
                  onClick={showConfirm}
                  disabled={
                    !isFirGenerated ||
                    isFetching ||
                    (!isUndefined(uploadFirReport) &&
                      uploadFirReport?.url &&
                      uploadFirReport?.url !== "")
                  }
                >
                  Upload FIR
                </Button>
                {!isUndefined(uploadFirReport) && uploadFirReport?.url ? (
                  <div
                    style={{
                      color: "#033c68",
                      cursor: "pointer",
                      position: "absolute",
                      marginTop: 40,
                      marginLeft: 100,
                    }}
                    onClick={() =>
                      getFileById(
                        uploadFirReport?.fileId,
                        uploadFirReport?.name,
                        uploadFirReport?.url
                      )
                    }
                  >
                    <PaperClipOutlined />
                    {uploadFirReport?.name}
                  </div>
                ) : null}
                <Modal
                  header={null}
                  visible={confirmModalVisible}
                  onOk={hideModal}
                  onCancel={hideModal}
                  footer={[
                    <span
                      type="primary"
                      onClick={hideModal}
                      style={{ marginRight: 10 }}
                      className="popupLink"
                    >
                      Cancel
                    </span>,
                    <Upload
                      fileList={fileData}
                      accept="application/msword, application/pdf, image/*"
                      onChange={async (info) => {
                        await setFIRUploadFileListState(info.fileList);
                      }}
                      customRequest={(options) => handleUpload(options)}
                      multiple={false}
                      maxCount={1}
                    >
                      <Button
                        type="primary"
                        className="saveButton"
                        style={{ width: 180, marginRight: 5 }}
                      >
                        Select File
                      </Button>
                    </Upload>,
                  ]}
                >
                  <Row gutter={24}>
                    <Col span={2} style={{ fontSize: 25 }}>
                      <ExclamationCircleOutlined style={{ color: "#FAB428" }} />
                    </Col>
                    <Col span={20} style={{ fontSize: 16 }}>
                      Are you sure you want to upload FIR Report? This process
                      can not be reverted.
                    </Col>
                  </Row>
                </Modal>
              </>
            ) : null}
            {!isEmpty(savedFir) ? (
              <>
                {!savedFir?.isDraft &&
                savedFir?.firType === "Zero" &&
                isConsumed ? (
                  ""
                ) : (
                  <Button
                    type="primary"
                    className="submitButton"
                    style={{ width: 150, marginRight: 5 }}
                    onClick={() => setIsModalVisible(true)}
                    disabled={isFetching}
                  >
                    {isFirGenerated ? "Print FIR" : "Print Draft Copy"}
                  </Button>
                )}
              </>
            ) : null}
            {!isFirGenerated || !isUndefined(isConsumed) ? (
              <Button
                type="primary"
                className="submitButton"
                style={{ width: 100, marginRight: 5 }}
                disabled={
                  isEmpty(savedFir) ||
                  (isFirGenerated && isUndefined(isConsumed)) ||
                  isFetching
                }
                onClick={saveDraft}
              >
                Save Draft
              </Button>
            ) : null}
            {!savedFir?.isDraft &&
            savedFir?.firType === "Zero" &&
            isConsumed ? (
              ""
            ) : (
              <Popconfirm
                title="Are you sure?"
                onConfirm={generateFIR}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  className={
                    disableGenerateFirButton ? "" : "stepsButtonActive"
                  }
                  style={{ width: 150 }}
                  disabled={disableGenerateFirButton}
                >
                  Generate FIR
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>
        <Row style={{ marginLeft: "150px", marginTop: "-35px" }}>
          <Col span={8}>
            <span style={{ marginRight: "20px", fontSize: 16 }}>FIR Type</span>
            <Radio.Group
              name="radiogroup"
              style={{ fontSize: 16 }}
              onChange={(e) => {
                selectFirType(e.target.value);
              }}
              disabled={isFirGenerated && isUndefined(isConsumed)}
              value={firType}
            >
              <Radio value="Regular">REGULAR FIR</Radio>
              <Radio value="Zero">ZERO FIR</Radio>
            </Radio.Group>
          </Col>

          <Col span={8} style={{ textAlign: "center" }}>
            {!savedFir?.isDraft &&
            savedFir?.firType === "Zero" &&
            isConsumed ? (
              ""
            ) : (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginRight: "120px",
                }}
              >
                {isFirGenerated && isUndefined(isConsumed)
                  ? savedFir?.firDetail?.firNum
                  : previousFirNum
                  ? `Previous FIR : ${previousFirNum}`
                  : ""}
              </span>
            )}
          </Col>
        </Row>
        {isFetching && !isModalVisible ? (
          <Loader />
        ) : (
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            expandIconPosition={"right"}
            style={{ marginTop: 35 }}
            expandIcon={({ isActive }) => (
              <DoubleRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel
              style={{ padding: "2" }}
              className="panelHeader"
              header={accordionTitle("Acts & Sections", true)}
              key="1"
            >
              <ActsSections
                actsForm={actsForm}
                actsAndArtsForm={actsAndArtsForm}
                majorMinorForm={majorMinorForm}
                firType={firType}
                currentUser={currentUser}
                actsAndSections={actsAndSections}
                setActsAndSections={setActsAndSections}
                majorAndMinor={majorAndMinor}
                setMajorAndMinor={setMajorAndMinor}
                disable={isFirGenerated && isUndefined(isConsumed)}
                isConsumed={isConsumed}
              />
            </Panel>
            {!isEmpty(savedFir) ? (
              <>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Occurrence Of Offence", true)}
                  key="2"
                >
                  <OccurrenceOfOffence
                    occurenceForm={occurenceForm}
                    placeOfOffence={placeOfOffence}
                    setPlaceOfOffence={setPlaceOfOffence}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Complainant Details", true)}
                  key="3"
                >
                  <ComplainantDetails
                    isInvestigation={false}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    crimeId={crimeId}
                    openNotificationWithIcon={openNotificationWithIcon}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Accused Details", true)}
                  key="4"
                >
                  <AccusedDetails
                    crimeId={crimeId}
                    isInvestigation={false}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  className="panelHeader"
                  header={accordionTitle("Victim Details", false)}
                  key="5"
                >
                  <VictimDetails
                    crimeId={crimeId}
                    isInvestigation={false}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Property Details", false)}
                  key="6"
                >
                  <PropertyDetails
                    crimeId={crimeId}
                    propertyForm={propertyForm}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Brief Facts", true)}
                  key="7"
                >
                  <BriefFacts
                    briefFactsForm={briefFactsForm}
                    disable={isFirGenerated && isUndefined(isConsumed)}
                    firType={firType}
                    isConsumed={isConsumed}
                  />
                </Panel>
                <Panel
                  style={{ padding: "3" }}
                  className="panelHeader"
                  header={accordionTitle("Upload Documents", true)}
                  key="8"
                >
                  <div style={styles.widgetPageStyle}>
                    <Col span={18}>
                      <UploadDocuments
                        crimeId={crimeId}
                        uploadForm={uploadForm}
                        disable={isFirGenerated && isUndefined(isConsumed)}
                        firType={firType}
                        isConsumed={isConsumed}
                      />
                    </Col>
                  </div>
                </Panel>
              </>
            ) : null}
          </Collapse>
        )}
        {isModalVisible && (
          <PrintFIRModal
            title={isFirGenerated ? "FIR Preview" : "Draft FIR Preview"}
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            isFirGenerated={isFirGenerated}
          />
        )}
        {showError ? (
          <Modal
            header={null}
            visible={showError}
            onOk={() => setShowError(false)}
            onCancel={() => setShowError(false)}
            footer={null}
          >
            {getErrorDetails()}
          </Modal>
        ) : null}
      </div>
    </FirDetailsModuleWrapper>
  );
}
