/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import RichTextEditorWithTable from "@components/Common/RichTextEditorWithTable";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Button,
  notification,
  Input,
  Popconfirm,
  Modal,
  Upload,
  Table,
} from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  shortAddress,
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
  getPersonPermanentAddressPrint,
  showPSName,
  getIONameAndRank,
  folderName,
} from "@containers/FirDetails/fir-util";
import {
  ExclamationCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import finalReportActions from "@redux/investigations/finalReport/actions";
import firActions from "@redux/fir/actions";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  isEmpty,
  first,
  isNull,
  filter,
  size,
  orderBy,
  isUndefined,
} from "lodash";
import Loader from "@components/utility/loader";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import createFIRActions from "@redux/createFir/actions";
// import "react-quill/dist/quill.snow.css";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import axios from "axios";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import { getFileById } from "@containers/media-util";
import WitnessRearrangement from "./witnessRearrangement";
import { WitnessTableWrapper } from "./styles";
import SavedRecords from "./SavedRecords";
import { getPayload } from "./payloads";
import {
  finalReportTypes,
  actionDroppedTypes,
  resonforSuicideDroppedTypes,
} from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import PrintFinalReport from "./PrintFinalReport";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function FinalReport({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const crimeId = loadState("selectedFirId");
  const complainantList = loadState("complainantList");
  const { savedFir } = useSelector((state) => state.createFIR);
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const currentIoDetails = getIONameAndRank(briefFacts);
  const {
    materialObjectList,
    witnessOrderActionType,
    witnessStatementListNew,
    witnessOrderErrorMessage,
    witnessOrderSuccessMessage,
    isWitnessFeatching,
  } = useSelector((state) => state.FIR);
  const { staffList } = useSelector((state) => state.MasterData);
  const { getAccusedList } = suspectAccusedAction;
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const [accusedRecords, setAccusedRecords] = useState([]);
  const [isMoSeizedVisible, setIsMoSeizedVisible] = useState(false);
  const [isEvidanceVisible, setIsEidanceVisible] = useState(false);
  const [richTextContent, setRichTextContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [chargedList, setChargedList] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [viewFinalReport, setViewFinalReport] = useState(false);
  const [editFinalReport, setEditFinalReport] = useState(null);
  const [selectedFinalReport, setSelectedFinalReport] = useState(null);
  const [witnessListData, setWitnessListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finalReportUploadFileListState, setFinalReportUploadFileListState] =
    useState([]);
  const [selectedFinalReportType, setSelectedFinalReportType] = useState("");
  const [selectedActionDroppedType, setSelectedActionDroppedType] =
    useState("");
  const [ActionDroppedTypes, setActionDroppedTypes] = useState([]);
  const { getFIRData } = createFIRActions;

  const onChangeFinalReportType = (val) => {
    setSelectedFinalReportType(val);
    setSelectedActionDroppedType("");
    form.setFieldsValue({ actionDroppedType: null, reasonsForSuicide: null });
    setActionDroppedTypes([]);
    if (val === "Action Dropped") {
      setActionDroppedTypes(actionDroppedTypes);
    }
    checkFields();
  };

  const { createAuditHistory } = auditHistoryActions;
  const { uploadTemplates } = mediaManagerActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    fetchMaterialObjectList,
    fetchWitnessStatementsList,
    updateWitnessOrder,
    resetWitnessOrderActionType,
  } = firActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    finalReportList,
    successMessage,
  } = useSelector((state) => state.FinalReport);

  const isSuccess =
    actionType === "ADD_FINALREPORT_SUCCESS" ||
    actionType === "UPLOAD_FINALREPORT_SUCCESS";
  const isError =
    actionType === "ADD_FINALREPORT_ERROR" ||
    actionType === "UPLOAD_FINALREPORT_ERROR";

  const isWitnessOrderSuccess =
    witnessOrderActionType === "UPDATE_WITNESS_ORDER_SUCCESS";
  const isWitnessOrderError =
    witnessOrderActionType === "UPDATE_WITNESS_ORDER_ERROR";

  const {
    addFinalReportDetails,
    getFinalReportList,
    resetActionType,
    finalReportUpload,
  } = finalReportActions;
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.caseStatus === "PT Cases";
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_FINALREPORT_SUCCESS"
        ? "Final Report Created"
        : "Final Report Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/finalReport", auditType)
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        dispatch(
          getFinalReportList(`${config.getFinalReport}?crimeId=${crimeId}`)
        );
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
        form.resetFields();
        setRichTextContent("");
        setViewFinalReport(false);
        setEditFinalReport(null);
        setSelectedFinalReportType("");
        setSelectedActionDroppedType("");
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (isWitnessOrderSuccess || isWitnessOrderError) {
      if (witnessOrderSuccessMessage === "Witness order successfully updated") {
        openNotificationWithIcon("success", witnessOrderSuccessMessage);
        dispatch(
          fetchWitnessStatementsList(
            `${config.getWitnessStatements}/?crimeId=${crimeId}`
          )
        );
        dispatch(resetWitnessOrderActionType());
      } else if (witnessOrderErrorMessage) {
        openNotificationWithIcon("error", witnessOrderErrorMessage);
        dispatch(resetWitnessOrderActionType());
      }
    }
  }, [witnessOrderActionType]);

  useEffect(() => {
    dispatch(
      fetchMaterialObjectList(
        `${config.getPostCrimeSceneDetails}/MATERIALOBJECTS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessStatementsList(
        `${config.getWitnessStatements}/?crimeId=${crimeId}`
      )
    );
    dispatch(getFinalReportList(`${config.getFinalReport}?crimeId=${crimeId}`));
  }, []);

  useEffect(() => {
    if (isEvidanceVisible) {
      dispatch(
        fetchWitnessStatementsList(
          `${config.getWitnessStatements}/?crimeId=${crimeId}`
        )
      );
    }
  }, [isEvidanceVisible]);

  const handleEditFinalReport = (value) => {
    if (value) {
      setEditFinalReport(value);
      setSelectedFinalReport(value);
      setRichTextContent(value?.richTextContent);
      setAccusedRecords(value?.accusedParticulars);
      const finalReport = value?.finalReport;
      setSelectedFinalReportType(finalReport?.finalReportType);
      setSelectedActionDroppedType(finalReport?.actionDroppedType);
      form.setFieldsValue({
        finalReportNo: finalReport?.finalReportNo,
        finalReportType: finalReport?.finalReportType,
        actionDroppedType: finalReport?.actionDroppedType,
        actionTaken: finalReport?.actionTaken,
        richTextContent: value?.richTextContent,
        reasonsForSuicide: finalReport?.reasonsForSuicide,
        complaintName: value?.complaintName,
        finalReportDate: moment(
          new Date(finalReport?.finalReportDate)
        ).isValid()
          ? moment(new Date(finalReport?.finalReportDate))
          : "",
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const generateFinalReport = async () => {
    submit(false);
  };

  const saveDraft = async () => {
    if (
      richTextContent === "" ||
      richTextContent.length === 0 ||
      richTextContent === "<p><br></p>"
    ) {
      openNotificationWithIcon(
        "error",
        " Required to fill Brief facts of the case"
      );
    } else {
      submit(true);
    }
  };

  const submit = async (isDraft) => {
    const values = await form.validateFields();
    const accusedParticulars = [];
    !isEmpty(accusedRecords) &&
      accusedRecords.map((s) => {
        const result = {
          accusedPersonId: s._id ? s.accusedPersonId?._id : s.id,
          chargeStatus: s.chargeStatus,
          reasonForNoCharge: s.reasonForNoCharge,
        };
        accusedParticulars.push(result);
      });
    const addPayload = getPayload(
      values,
      crimeId,
      isDraft,
      accusedParticulars,
      richTextContent
    );
    const updatePayload = {
      finalReportId: editFinalReport?._id,
      ...addPayload,
    };

    if (editFinalReport?._id) {
      dispatch(
        addFinalReportDetails(config.addUpdateFinalReport, updatePayload)
      );
    } else {
      dispatch(addFinalReportDetails(config.addUpdateFinalReport, addPayload));
    }
  };

  const disableFinalReportForm =
    (!isEmpty(finalReportList) && editFinalReport?.isDraft === false) ||
    viewFinalReport ||
    disableForm;

  const disabledGenerateButtons =
    isEmpty(finalReportList) ||
    (!isEmpty(finalReportList) &&
      !isNull(editFinalReport) &&
      !editFinalReport?.isDraft) ||
    viewFinalReport ||
    isNull(editFinalReport) ||
    disableForm;

  const filteredIODetails =
    !isEmpty(staffList) &&
    staffList.filter(
      (item) => item?.employeeName === briefFacts?.ioAssignedName
    );
  const psName =
    filteredIODetails && showPSName(first(filteredIODetails)?.unitName);

  const investigatingOfficierList = [
    {
      iONameRank: currentIoDetails,
      psName: psName,
      startEndDate: "",
    },
  ];

  const investigatingOfficierColums = [
    {
      title: "IO Name & Rank",
      dataIndex: "iONameRank",
      key: "iONameRank",
      render: (iONameRank) => (
        <span className="tableRowText wordWrap">{iONameRank}</span>
      ),
    },
    {
      title: "PS Name",
      dataIndex: "psName",
      key: "psName",
      render: (psName) => (
        <span className="tableRowText wordWrap">{psName}</span>
      ),
    },
    {
      title: "Start & End Date",
      dataIndex: "startEndDate",
      key: "startEndDate",
      render: (startEndDate) => (
        <span className="tableRowText wordWrap">{startEndDate}</span>
      ),
    },
  ];

  const seizedShowModal = () => {
    setIsMoSeizedVisible(true);
  };

  const seizedHandleOk = () => {
    setIsMoSeizedVisible(false);
  };

  const seizedHandleCancel = () => {
    setIsMoSeizedVisible(false);
  };

  const MoSeizedColumn = [
    {
      title: `MO Seized ${
        !isEmpty(materialObjectList) ? materialObjectList.length : ""
      }`,
      dataIndex: "subType",
      key: "subType",
      render: (subType) => (
        <span className="tableRowText wordWrap">
          {subType.imgUrl ? <img src={subType.imgUrl} alt="img" /> : ""}
          {subType.subType ? subType.subType : ""}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "mold",
      key: "mold",
      render: (mold) => (
        <span className="tableRowText wordWrap">{mold ? mold : ""}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className="tableRowText wordWrap">{type ? type : ""}</span>
      ),
    },
  ];

  const moSeizedModal = () => {
    var result =
      materialObjectList &&
      !isEmpty(materialObjectList) &&
      materialObjectList.map((materialObject) => ({
        type: materialObject.type,
        mold: materialObject?.moId,
        subType: {
          subType: materialObject.subType,
          imgUrl: materialObject.media?.url,
          moId: materialObject?.moId,
        },
      }));

    return (
      <Modal
        title="MO List"
        visible={isMoSeizedVisible}
        width={1000}
        onOk={seizedHandleOk}
        onCancel={seizedHandleCancel}
        okText="Close"
        footer={[
          <span
            type="primary"
            onClick={() => window.print()}
            className="popupLink resetLink"
          >
            Print
          </span>,
          <Button
            key="cancel"
            type="primary"
            className="saveButton"
            onClick={() => seizedHandleCancel(false)}
          >
            Close
          </Button>,
        ]}
      >
        <div className="widgetContainer">
          <TableWrapper
            dataSource={result}
            columns={MoSeizedColumn}
            pagination={false}
            size="small"
          />
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    if (!isEmpty(witnessStatementListNew) && !isNull(witnessStatementListNew)) {
      let evidanceResult = !isEmpty(witnessStatementListNew)
        ? witnessStatementListNew.map((witnessList, i) => ({
            key: i,
            index: i,
            isChargeSheet: witnessList?.isChargeSheet,
            statementId: witnessList?._id,
            witnessCode: witnessList?.statementDetails?.witnessCode,
            witnessCodeNumber:
              witnessList?.statementDetails?.witnessCode &&
              parseInt(
                witnessList?.statementDetails?.witnessCode?.replace("LW", "")
              ),
            witnessDetails: {
              name: `${witnessList?.witnessId?.personalDetails?.alias || ""} ${
                witnessList?.witnessId?.personalDetails?.name || ""
              }`,
              presentAddress:
                !isUndefined(witnessList?.witnessId?.permanentAddress) &&
                witnessList?.witnessId?.permanentAddress,
            },
            person: witnessList?.witnessId,
            typeOfwitness:
              !isEmpty(witnessList?.statementDetails) &&
              witnessList?.statementDetails?.typeOfWitness
                ? witnessList?.statementDetails?.typeOfWitness
                : "",
            subTypeOfWitness: !isEmpty(witnessList?.statementDetails)
              ? witnessList?.statementDetails?.typeOfWitness ===
                  "Panch witness" &&
                !isUndefined(
                  witnessList?.statementDetails?.panchSubTypeOfWitness
                )
                ? witnessList?.statementDetails?.panchSubTypeOfWitness.join()
                : witnessList?.statementDetails?.subTypeOfWitness
              : "",
            strengthOfEvidance:
              !isEmpty(witnessList?.statementDetails) &&
              witnessList?.statementDetails?.strengthOfWitness
                ? witnessList?.statementDetails?.strengthOfWitness
                : "",
          }))
        : [];
      const chargedList = evidanceResult.filter((s) => s.isChargeSheet);
      const notChargedList = evidanceResult.filter((s) => !s.isChargeSheet);
      const chargedPersonList =
        !isEmpty(chargedList) && orderBy(chargedList, ["witnessCodeNumber"]);
      if (isEmpty(chargedList)) {
        setWitnessListData(evidanceResult);
      } else {
        setWitnessListData(notChargedList);
        setDataSource(chargedPersonList);
        setChargedList(chargedPersonList);
      }
    }
  }, [witnessStatementListNew]);

  const evidanceShowModal = () => {
    setIsEidanceVisible(true);
  };

  const evidanceHandleOk = async () => {
    let pendingWitness = [];
    !isEmpty(witnessListData) &&
      witnessListData.map((item) => {
        const result = {
          index: item?.index,
          key: item?.key,
          person: item?.person,
          statementId: item?.statementId,
          isChargeSheet: false,
          strengthOfEvidance: item?.strengthOfEvidance,
          typeOfwitness: item?.typeOfwitness,
          subTypeOfWitness: item?.subTypeOfWitness,
          witnessCode: `LW${++chargedList.length}`,
          witnessDetails: item?.witnessDetails,
        };
        pendingWitness.push(result);
      });
    const finalRes = isEmpty(pendingWitness)
      ? chargedList
      : chargedList.concat(pendingWitness);
    const payloadResult = !isEmpty(finalRes) && filter(finalRes, size);
    if (!isEmpty(payloadResult)) {
      const dataSet = payloadResult.map((item) => {
        const resultSet = {
          witnessType: "WITNESS",
          witnessCode: item?.witnessCode,
          statementId: item?.statementId,
          witnessId: item?.person?._id,
          isChargeSheet: item?.isChargeSheet,
        };
        return resultSet;
      });
      const payload = {
        crimeId: crimeId,
        details: dataSet,
      };
      dispatch(updateWitnessOrder(config.updateWitnessOrder, payload));
      setIsEidanceVisible(false);
    }
  };

  const evidanceHandleCancel = () => {
    setIsEidanceVisible(false);
  };

  const evidanceColumn = [
    {
      title: "Sequence",
      dataIndex: "witnessCode",
      key: "witnessCode",
      render: (witnessCode) => (
        <span className="tableRowText wordWrap">{witnessCode}</span>
      ),
    },
    {
      title: "Witness Details",
      dataIndex: "witnessDetails",
      key: "witnessDetails",
      render: (witnessDetails) => (
        <span className="tableRowText wordWrap">
          {witnessDetails?.name} {shortAddress(witnessDetails?.presentAddress)}
        </span>
      ),
    },
    {
      title: "Type of Witness",
      dataIndex: "typeOfwitness",
      key: "typeOfwitness",
      render: (typeOfwitness, val) => {
        let label = "";
        console.log("testing final report");
        console.log(val?.subTypeOfWitness);
        if (typeOfwitness === "Official witnesses / Experts") {
          label = val?.subTypeOfWitness;
        } else if (val?.typeOfwitness === "Panch witness") {
          label = `${val?.typeOfwitness} ${val?.subTypeOfWitness}`;
        } else if (val?.typeOfwitness) {
          label = val?.typeOfwitness;
        } else {
          label = "";
        }
        return <span className="tableRowText wordWrap">{label}</span>;
      },
    },
    {
      title: "Strenght of Evidence",
      dataIndex: "strengthOfEvidance",
      key: "strengthOfEvidance",
      render: (strengthOfEvidance) => (
        <span className="tableRowText wordWrap">
          {strengthOfEvidance ? strengthOfEvidance : ""}
        </span>
      ),
    },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRow([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRow(selectedRowKeys);
  };

  const rowSelection = {
    selectedRow,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: disableFinalReportForm,
      key: record.key,
    }),
  };

  const removeItem = (item) => {
    const result = dataSource.filter((res) => res.key !== item.key);
    setDataSource(result);
    setChargedList(result);
    start();
    const dataRes = {
      index: item?.index,
      key: item?.key,
      person: item?.person,
      statementId: item?.statementId,
      isChargeSheet: false,
      strengthOfEvidance: item?.strengthOfEvidance,
      typeOfwitness: item?.typeOfwitness,
      subTypeOfWitness: item?.subTypeOfWitness,
      witnessCode: item?.oldWitnessCode,
      witnessDetails: item?.witnessDetails,
    };
    if (isEmpty(witnessListData)) {
      setWitnessListData([dataRes]);
    } else {
      setWitnessListData((oldArray) => [...oldArray, dataRes]);
    }
  };

  const moveSelectedWitnesses = () => {
    if (!isEmpty(selectedRow)) {
      let itemResult = [];
      selectedRow.map((key, i) => {
        const result = first(
          witnessListData.filter((item) => item.key === key)
        );
        const dataRes = {
          index: result?.index,
          key: result?.key,
          person: result?.person,
          statementId: result?.statementId,
          isChargeSheet: result?.isChargeSheet,
          strengthOfEvidance: result?.strengthOfEvidance,
          typeOfwitness: result?.typeOfwitness,
          subTypeOfWitness: result?.subTypeOfWitness,
          oldKey: result?.key,
          oldWitnessCode: result?.witnessCode,
          witnessCode: result?.witnessCode,
          witnessDetails: result?.witnessDetails,
        };
        itemResult.push(dataRes);
      });
      setDataSource((oldArray) => [...oldArray, ...itemResult]);
      setSelectedRow([]);
    }
  };

  useEffect(() => {
    if (!isEmpty(dataSource)) {
      const unchargedList =
        !isEmpty(witnessListData) &&
        witnessListData.filter(
          (ar) =>
            !isEmpty(dataSource) && !dataSource.find((rm) => ar.key === rm.key)
        );
      const result = !isEmpty(unchargedList) && filter(unchargedList, size);
      setWitnessListData(result);
    }
  }, [dataSource]);

  useEffect(() => {
    if (!isEmpty(dataSource)) {
      let arr = [];
      dataSource.map((result, i) => {
        const dataRes = {
          index: result?.index,
          key: result?.key,
          person: result?.person,
          isChargeSheet: true,
          statementId: result?.statementId,
          strengthOfEvidance: result?.strengthOfEvidance,
          typeOfwitness: result?.typeOfwitness,
          subTypeOfWitness: result?.subTypeOfWitness,
          oldKey: result?.key,
          oldWitnessCode: result?.witnessCode,
          witnessCode: `LW${i + 1}`,
          witnessDetails: result?.witnessDetails,
        };
        arr.push(dataRes);
      });
      setChargedList(arr);
    }
  }, [dataSource]);

  const memoOfEvidanceModal = () => {
    return (
      <Modal
        title="Memo of Evidence"
        width={1200}
        visible={isEvidanceVisible}
        onOk={evidanceHandleOk}
        onCancel={evidanceHandleCancel}
        okText="Save & Close"
        footer={[
          <span
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => window.print()}
            className="popupLink"
          >
            Print
          </span>,
          <span
            type="primary"
            style={{ marginRight: 15 }}
            onClick={evidanceHandleCancel}
            className="popupLink"
          >
            Cancel
          </span>,
          <Button
            key="cancel"
            type="primary"
            className={disableFinalReportForm ? "" : "saveButton"}
            onClick={evidanceHandleOk}
            disabled={
              disableFinalReportForm ||
              (isEmpty(chargedList) && isEmpty(dataSource))
            }
          >
            Save & Close
          </Button>,
        ]}
      >
        {isWitnessFeatching ? (
          <Loader />
        ) : (
          <div className="widgetContainer">
            {!isEmpty(chargedList) ? (
              <div style={{ marginBottom: 35 }}>
                <Col
                  span={12}
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
                >
                  Witnesses for Chargesheet
                </Col>
                <WitnessRearrangement
                  dataList={chargedList}
                  setChargedList={setChargedList}
                  removeItem={removeItem}
                  disabled={disableFinalReportForm}
                />
              </div>
            ) : null}
            <Row style={{ marginBottom: 20 }}>
              <Col span={12} style={{ fontSize: 16, fontWeight: "bold" }}>
                All Witnesses
              </Col>
              <Col span={12}>
                <Button
                  key="cancel"
                  type="primary"
                  className="saveButton"
                  style={{ float: "right" }}
                  disabled={
                    isEmpty(selectedRow) ||
                    isEmpty(witnessListData) ||
                    disableFinalReportForm
                  }
                  onClick={moveSelectedWitnesses}
                  loading={loading}
                >
                  Move Selected
                </Button>
              </Col>
            </Row>
            {loading ? (
              <WitnessTableWrapper>
                <Loader />
                <Table columns={[]} dataSource={[]} />
              </WitnessTableWrapper>
            ) : (
              <WitnessTableWrapper
                isCharged={!isEmpty(chargedList) && chargedList.length > 0}
              >
                <Table
                  rowSelection={rowSelection}
                  columns={evidanceColumn}
                  dataSource={witnessListData}
                  pagination={false}
                />
              </WitnessTableWrapper>
            )}
          </div>
        )}
      </Modal>
    );
  };

  const renderComplainantNames = (itemList) => (
    <Card style={{ minHeight: 80 }}>
      {!isEmpty(itemList) &&
        itemList.map((item, i) => {
          const personalDetails =
            !isUndefined(item?.person) &&
            !isUndefined(item?.person?.personalDetails) &&
            item?.person?.personalDetails;
          const contactDetails =
            !isUndefined(item?.person) &&
            !isUndefined(item?.person?.contactDetails) &&
            item?.person?.contactDetails;
          const presentAddress =
            !isUndefined(item?.person) &&
            !isUndefined(item?.person?.presentAddress) &&
            item?.person?.presentAddress;
          const permanentAddress =
            !isUndefined(item?.person) &&
            !isUndefined(item?.person?.permanentAddress) &&
            item?.person?.permanentAddress;
          return (
            <div key={i}>
              <span>{getPersonPersonalDetailsPrint(personalDetails)}</span>
              <span>{`contact no: ${
                contactDetails[0]?.phoneNumber
                  ? contactDetails[0]?.phoneNumber
                  : ""
              },`}</span>
              <span>{getPersonPersonalAddressPrint(presentAddress)}</span>
              <span>{getPersonPermanentAddressPrint(permanentAddress)}</span>
            </div>
          );
        })}
    </Card>
  );

  const showConfirm = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const handleUpload = (options) => {
    if (finalReportUploadFileListState.length > 0) {
      const mediaFormData = new FormData();
      finalReportUploadFileListState.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append(
        "folderPath",
        `${crimeId}/${folderName.FINALREPORT}/file`
      );
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setFinalReportUploadFileListState([]);
          if (response.data.success) {
            hideModal();
            const { data } = response?.data;
            const payloadData = first(data);
            const tpayload = {
              crimeId: crimeId,
              action: folderName.FINALREPORT,
              actionSubType: folderName.FINALREPORT,
              templates: [
                {
                  category: "uploadFinalReport",
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
            if (!isEmpty(finalReportList) && selectedFinalReport?._id) {
              const payload = {
                crimeId: crimeId,
                finalReportId: selectedFinalReport?._id,
                finalReport: {
                  category: "uploadFinalReport",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  fileId: payloadData?.id,
                },
              };
              dispatch(finalReportUpload(config.uploadFinalReport, payload));
            }
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          console.log(err);
          setFinalReportUploadFileListState([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const onPrintFinalReport = (item) => {
    form.resetFields();
    setSelectedFinalReport(item);
    setEditFinalReport(null);
    setViewFinalReport(false);
    setRichTextContent("");
    setIsModalVisible(true);
  };

  const fileData =
    !isNull(finalReportList) &&
    !isUndefined(editFinalReport?.uploadFinalReport) &&
    editFinalReport?.uploadFinalReport?.url !== ""
      ? [editFinalReport?.uploadFinalReport]
      : undefined;
  const onChangeActionDroppedType = (data) => {
    setSelectedActionDroppedType(data);
    form.setFieldsValue({ reasonsForSuicide: null });
  };

  return (
    <ModuleWrapper>
      <div className="contentHeaderContainer">
        <div style={styles.widgetPageStyle}>
          <h2 className="pageTitle">Final Report</h2>
        </div>
        <div style={{ display: "flex", marginTop: 10 }}>
          <Button
            className="stepsButtonInActive"
            onClick={() => setSelectedSiderMenu("investigation")}
          >
            Cancel
          </Button>
          {!isNull(editFinalReport) && !editFinalReport?.isDraft ? (
            <>
              {!(
                !isUndefined(editFinalReport?.uploadFinalReport) &&
                !isUndefined(editFinalReport?.uploadFinalReport?.url) &&
                editFinalReport?.uploadFinalReport?.url !== ""
              ) ? (
                <Col span={2} style={{ fontSize: 25 }}>
                  <ExclamationCircleOutlined style={{ color: "red" }} />
                </Col>
              ) : null}
              <Button
                type="primary"
                className="saveButton"
                style={{ width: 180, marginRight: 5 }}
                onClick={showConfirm}
                disabled={
                  isFetching ||
                  (!isUndefined(editFinalReport?.uploadFinalReport) &&
                    !isUndefined(editFinalReport?.uploadFinalReport?.url) &&
                    editFinalReport?.uploadFinalReport?.url !== "")
                }
              >
                Upload Final Report
              </Button>
              {!isUndefined(editFinalReport?.uploadFinalReport) ? (
                <span
                  onClick={() =>
                    getFileById(
                      editFinalReport?.uploadFinalReport?.fileId,
                      editFinalReport?.uploadFinalReport?.name,
                      editFinalReport?.uploadFinalReport?.url
                    )
                  }
                  className="tableRowTextFir"
                  style={{
                    color: "#033c68",
                    cursor: "pointer",
                    position: "absolute",
                    marginTop: 40,
                    marginLeft: 85,
                  }}
                >
                  {editFinalReport?.uploadFinalReport?.name && (
                    <PaperClipOutlined />
                  )}
                  {editFinalReport?.uploadFinalReport?.name}
                </span>
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
                      await setFinalReportUploadFileListState(info.fileList);
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
                    Are you sure you want to upload Final Report? This process
                    can not be reverted.
                  </Col>
                </Row>
              </Modal>
            </>
          ) : null}
          <Button
            type="primary"
            className="saveButton"
            style={{ width: 100, marginRight: 5 }}
            onClick={saveDraft}
            disabled={disableFinalReportForm}
          >
            Save Draft
          </Button>
          {disableFinalReportForm ? (
            <Button
              type="primary"
              className={disabledGenerateButtons ? "" : "stepsButtonActive"}
              style={{ width: 180 }}
              disabled={disabledGenerateButtons}
            >
              Generate Final Report
            </Button>
          ) : (
            <Popconfirm
              onConfirm={generateFinalReport}
              okText="Yes"
              cancelText="No"
              title={
                <>
                  <div
                    style={{
                      color: "red",
                      fontFamily: "bold",
                      fontSize: "20px",
                    }}
                  >
                    Upload Final Report after generating the Final report, for
                    case disposal
                  </div>
                </>
              }
            >
              <Button
                type="primary"
                className={disabledGenerateButtons ? "" : "stepsButtonActive"}
                style={{ width: 180, marginBottom: 10 }}
                disabled={disabledGenerateButtons}
              >
                Generate Final Report
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <Row style={{ minHeight: 550, marginTop: !isEmpty(fileData) ? 25 : 5 }}>
          <Card style={{ width: "70%", padding: 10 }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Row style={{ marginBottom: "20px" }}>
                <Col span={8}>
                  <Form.Item name="finalReportNo" label="Final Report No">
                    <Input
                      onChange={checkFields}
                      style={{ width: 222 }}
                      maxLength={textFieldRules.maxLength}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="finalReportDate"
                    label="Final Report Date"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      placeholder="Select Date"
                      onChange={checkFields}
                      style={{ width: 222 }}
                      disabledDate={disableFutureDates}
                      disabled={disableFinalReportForm}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="finalReportType"
                    label="Final Report Type"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      finalReportTypes,
                      onChangeFinalReportType,
                      handleSearch,
                      serchText,
                      222,
                      disableFinalReportForm
                    )}
                  </Form.Item>
                </Col>
                {selectedFinalReportType === "Action Dropped" ? (
                  <Col span={8}>
                    <Form.Item
                      name="actionDroppedType"
                      label="Action Dropped Type"
                    >
                      {renderFieldsWithDropDown(
                        ActionDroppedTypes,
                        onChangeActionDroppedType,
                        handleSearch,
                        serchText,
                        222,
                        disableFinalReportForm
                      )}
                    </Form.Item>
                  </Col>
                ) : null}
                {selectedActionDroppedType === "Suicidal Death" ? (
                  <Col span={8}>
                    <Form.Item
                      name="reasonsForSuicide"
                      label="Reasons for Suicide"
                    >
                      {renderFieldsWithDropDown(
                        resonforSuicideDroppedTypes,
                        null,
                        handleSearch,
                        serchText,
                        222,
                        disableFinalReportForm
                      )}
                    </Form.Item>
                  </Col>
                ) : null}
                {selectedFinalReportType === "False" ? (
                  <Col span={6}>
                    <Form.Item name="actionTaken" label="Action taken">
                      <Input
                        onChange={checkFields}
                        style={{ width: 222 }}
                        maxLength={textFieldRules.maxLength}
                        disabled={disableFinalReportForm}
                      />
                    </Form.Item>
                  </Col>
                ) : null}
              </Row>
              <Row>
                <Col span={6} style={{ fontSize: 16 }}>
                  <span>Name of Investigating Officer</span>
                </Col>
                <Col span={18}>
                  <div className="widgetContainer">
                    <TableWrapper
                      dataSource={investigatingOfficierList}
                      columns={investigatingOfficierColums}
                      pagination={false}
                      size="small"
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ margin: "24px 0" }} />
              <Row>
                <Col span={6} style={{ fontSize: 16 }}>
                  <span>Name of the Complainant</span>
                </Col>
                {!isEmpty(complainantList) ? (
                  <Col span={18}>{renderComplainantNames(complainantList)}</Col>
                ) : (
                  <Col span={18} />
                )}
              </Row>
              <div style={{ margin: "24px 0" }} />
              <Row>
                <Col span={6} style={{ fontSize: 16 }}>
                  <span>
                    Details Of Properties/Articles recovered/seized during
                    investigation
                  </span>
                </Col>
                <Col span={18} style={{ fontSize: 16 }}>
                  <span
                    type="primary"
                    onClick={seizedShowModal}
                    className="popupLink"
                  >
                    MO Seized ({Object.keys(materialObjectList).length})
                  </span>
                  {moSeizedModal()}
                </Col>
              </Row>
              <div style={{ margin: "24px 0" }} />
              <Row>
                <Col span={6} style={{ fontSize: 16 }}>
                  <span>Particulars of witnesses to be examined</span>
                </Col>
                <Col span={18} style={{ fontSize: 16 }}>
                  {" "}
                  <span
                    type="primary"
                    onClick={evidanceShowModal}
                    className="popupLink"
                  >
                    Memo of Evidence
                  </span>
                  {memoOfEvidanceModal()}
                </Col>
              </Row>
              <Row style={{ marginTop: 20, marginBottom: 10 }}>
                <Col span={24} style={{ marginBottom: 10, fontSize: 16 }}>
                  <label>
                    <span style={{ color: "red" }}> * </span>Brief facts of the
                    case
                  </label>
                </Col>
                <Col span={24} style={{ minHeight: "48vh" }}>
                  <RichTextEditorWithTable
                    onChange={setRichTextContent}
                    readOnly={disableFinalReportForm}
                    value={richTextContent || ""}
                    height="40vh"
                  />
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            {!isEmpty(finalReportList) && (
              <SavedRecords
                dataSource={finalReportList}
                editDetails={handleEditFinalReport}
                setViewDetails={setViewFinalReport}
                selectedRecord={editFinalReport}
                onPrintFinalReport={onPrintFinalReport}
              />
            )}
          </Card>
        </Row>
      )}
      <PrintFinalReport
        title={
          !selectedFinalReport?.isDraft
            ? "FinalReport Preview"
            : "Draft FinalReport Preview"
        }
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        isFinalReportGenerated={!selectedFinalReport?.isDraft}
        finalReportList={selectedFinalReport}
        witnessStatementList={witnessStatementListNew}
        filteredIODetails={filteredIODetails}
      />
    </ModuleWrapper>
  );
}
