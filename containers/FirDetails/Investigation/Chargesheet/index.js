import { useState, useEffect, useMemo } from "react";
import { disableFuturePastFIRDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import RichTextEditorWithTable from "@components/Common/RichTextEditorWithTable";
import { getFileById } from "@containers/media-util";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  DatePicker,
  Button,
  notification,
  Input,
  Popconfirm,
  Modal,
  Table,
  Upload,
  Checkbox,
  Tag,
  Tabs,
  Radio,
} from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  shortAddress,
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
  getPersonPermanentAddressPrint,
  renderFieldsWithMultipleDropDown,
  getAccusedStatus,
  getCCLStatus,
  showPSName,
  getIONameAndRank,
  displayStatusDetailsAccused,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import masterDataActions from "@redux/masterData/actions";
import firActions from "@redux/fir/actions";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  isEmpty,
  isArray,
  first,
  filter,
  size,
  isNull,
  orderBy,
  uniqBy,
} from "lodash";
import {
  CaretDownOutlined,
  SaveOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import createFIRActions from "@redux/createFir/actions";
import Loader from "@components/utility/loader";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { isUndefined } from "lodash";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import axios from "axios";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import { folderName } from "@containers/FirDetails/fir-util";
import SavedRecords from "./SavedRecords";
import { getPayload } from "./chargeSheetPayloads";
import {
  ChargeSheetForm,
  chargetSheetTypes,
  accusedChargeTypes,
  ActsAndSection,
  LinkSection,
} from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import WitnessRearrangement from "./witnessRearrangement";
import { WitnessTableWrapper } from "./styles";
import PrintChargeSheet from "./PrintChargeSheet";
import reassignmentOfCaseActions from "@redux/investigations/reassignmentOfCase/actions";
const { TabPane } = Tabs;
const { confirm } = Modal;
const { TextArea } = Input;
const Option = Select.Option;

const optionType = {
  ACT: "ACT",
  SECTION: "SECTION",
};

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function Chargesheet({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [accusedForm] = Form.useForm();
  const [actsAndSectionsForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const complainantList = loadState("complainantList");
  const savedActDetails = loadState("selectedActDetails")["uniqActs"];
  const { getCourtsBasedonPsCode, getActList, getSectionList } =
    masterDataActions;
  const { courtsFromPSList, staffList } = useSelector(
    (state) => state.MasterData
  );
  const {
    witnessOrderActionType,
    witnessStatementListNew,
    witnessOrderErrorMessage,
    witnessOrderSuccessMessage,
    isWitnessFeatching,
    arrestList,
  } = useSelector((state) => state.FIR);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { getAccusedList } = suspectAccusedAction;
  const { uploadTemplates } = mediaManagerActions;
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const initialBriefFacts = savedFir?.initialBriefFacts;
  const currentIoDetails = getIONameAndRank(briefFacts);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [serchText, setSerchText] = useState("");
  const [accusedRecords, setAccusedRecords] = useState([]);
  const [isMoSeizedVisible, setIsMoSeizedVisible] = useState(false);
  const [totalAccusedOrCCLList, settotalAccusedOrCCLList] = useState([]);
  const [isEvidanceVisible, setIsEidanceVisible] = useState(false);
  const [isAccusedVisible, setIsAccusedVisible] = useState(false);
  const [chargedAccusedList, setChargedAccusedList] = useState([]);
  const [accusedModalFinalResultState, setaccusedModalFinalResultState] =
    useState([]);
  const [accusedModalaccusedResultState, setaccusedModalaccusedResultState] =
    useState([]);
  const [chargedAccusedDisplay, setChargedAccusedDisplay] = useState(false);
  const [richTextContent, setRichTextContent] = useState("");
  const [accusedChargedList, setAccusedChargedList] = useState([]);
  const [accusedNotChargedList, setAccusedNotChargedList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { createAuditHistory } = auditHistoryActions;
  const [witnessListData, setWitnessListData] = useState([]);
  const [chargedList, setChargedList] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTabChanged, setIsTabChanged] = useState(false);
  const [chargeSheetUploadFileListState, setChargeSheetUploadFileListState] =
    useState([]);
  const [actsAndSections, setActsAndSections] = useState([]);
  const [savedFiractsAndSectionsCopy, setsavedFirActsAndSectionsCopy] =
    useState([]);
  const [existingActsAndSections, setExistingActsAndSections] = useState([]);
  const [showNewSections, setShowNewSections] = useState(false);
  const [isCCLToPrint, setIsCCLToPrint] = useState(false);
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);
  useEffect(() => {
    dispatch(
      getJuvenileApprehensionList(
        `${config.cclApprehension}?crimeId=${crimeId}`
      )
    );
  }, [dispatch]);
  const onClickNewSections = () => {
    if (showNewSections === true) {
      setShowNewSections(false);
    } else {
      setShowNewSections(true);
    }
  };

  const [linkingOfActs, setLinkingOfActs] = useState([]);
  const [accusedChargedDropdownList, setAccusedChargedDropdownList] = useState(
    []
  );
  const [viewChargesheet, setViewChargesheet] = useState(false);
  const [editChargesheet, setEditChargesheet] = useState(null);
  const [selectedChargesheet, setSelectedChargesheet] = useState(null);
  const [selectedAct, setSelectedAct] = useState("");
  const { actList, sectionList } = useSelector((state) => state.MasterData);
  const isCCL = selectedTab === "2" ? true : false;

  const { getFIRData } = createFIRActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    fetchMaterialObjectList,
    updateWitnessOrder,
    resetWitnessOrderActionType,
    fetchWitnessStatementsList,
    fetchArrest,
  } = firActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    chargesheetList,
    moStolenList,
    successMessage,
  } = useSelector((state) => state.Chargesheet);

  const { reassignmentOfCaseList } = useSelector(
    (state) => state.ReassignmentOfCase
  );

  const filteredMOStolenList = useMemo(() => {
    if (isArray(moStolenList)) {
      return moStolenList.filter((item) => {
        const data = item.totalData.casePropertyId;
        if (data?.status === "Send To Court") return true;
        else if (data?.forwardingThrough === "Court") return true;
        else if (data?.status === "Handover to the owner on court directions")
          return true;
        return false;
      });
    }
    return [];
  }, [moStolenList]);

  const isSuccess =
    actionType === "ADD_CHARGESHEET_SUCCESS" ||
    actionType === "UPLOAD_CHARGESHEET_SUCCESS";
  const isError =
    actionType === "ADD_CHARGESHEET_ERROR" ||
    actionType === "UPLOAD_CHARGESHEET_ERROR";

  const isWitnessOrderSuccess =
    witnessOrderActionType === "UPDATE_WITNESS_ORDER_SUCCESS";
  const isWitnessOrderError =
    witnessOrderActionType === "UPDATE_WITNESS_ORDER_ERROR";

  const {
    addChargesheetDetails,
    getChargesheetList,
    getMoSeizedForChargeSheet,
    resetActionType,
    uploadChargesheet,
  } = chargesheetActions;

  const { getReassignmentOfCaseList } = reassignmentOfCaseActions;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CHARGESHEET_SUCCESS"
        ? "Chargesheet Created"
        : "Chargesheet Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/chargesheet", auditType)
      )
    );
  };

  const resetFormData = () => {
    setViewChargesheet(false);
    setShowNewSections(false);
    setEditChargesheet(null);
    form.resetFields();
    setRichTextContent("");
    setAccusedChargedList([]);
    setAccusedRecords([]);
    setAccusedNotChargedList([]);
    setLinkingOfActs([]);
    setFormValid(false);
    setChargedAccusedDisplay(false);
    setDataSource([]);
    setSelectedRow([]);
    setChargedList([]);
    !isEmpty(accusedRecords) &&
      accusedRecords.map((s) => {
        accusedForm.setFieldsValue({
          [`${s?.accusedPersonId?._id}_chargeStatus`]: "",
          [`${s?.accusedPersonId?._id}_reasonForNoCharge`]: "",
          [`${s?.accusedPersonId?._id}_requestedForNBW`]: "",
        });
      });
  };

  const changeTab = (activeKey) => {
    setSelectedTab(activeKey);
    !isEmpty(accusedRecords) &&
      accusedRecords.map((s) => {
        accusedForm.setFieldsValue({
          [`${s?.accusedPersonId?._id}_chargeStatus`]: "",
          [`${s?.accusedPersonId?._id}_reasonForNoCharge`]: "",
          [`${s?.accusedPersonId?._id}_requestedForNBW`]: "",
        });
      });
    setIsTabChanged(true);
    resetFormData();
    setFormValid(false);
    setChargedAccusedDisplay(false);
    setDataSource([]);
    setChargedList([]);
    setTimeout(() => {
      setIsTabChanged(false);
    }, 1000);
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        resetFormData();
        setSelectedTab("1");
        dispatch(
          getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`)
        );
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
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
        setDataSource([]);
        setSelectedRow([]);
        setChargedList([]);
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
    const url = config.getMasterData;
    dispatch(
      getMoSeizedForChargeSheet(
        `${config.getMoSeizedForChargeSheet}?crimeId=${crimeId}`
      )
    );
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
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
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
    dispatch(getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`));
    dispatch(getActList(`${url}/${optionType.ACT}`));
    dispatch(getSectionList(`${url}/${optionType.SECTION}`));
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
    dispatch(
      getReassignmentOfCaseList(
        `${config.getReAssigningOfCase}?crimeId=${crimeId}`
      )
    );

    setFormValid(false);
    setChargedAccusedDisplay(false);
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

  const handleEditChargesheet = (value) => {
    if (value) {
      if (
        !isEmpty(witnessStatementListNew) &&
        !isNull(witnessStatementListNew)
      ) {
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
                name: ` ${witnessList?.witnessId?.personalDetails?.name || ""}
                ${witnessList?.witnessId?.personalDetails?.surname || ""}
                ${witnessList?.witnessId?.personalDetails?.alias || ""}`,
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
              subTypeOfWitness:
                !isEmpty(witnessList?.statementDetails) &&
                witnessList?.statementDetails?.subTypeOfWitness
                  ? witnessList?.statementDetails?.subTypeOfWitness
                  : "",
              strengthOfEvidance:
                !isEmpty(witnessList?.statementDetails) &&
                witnessList?.statementDetails?.strengthOfWitness
                  ? witnessList?.statementDetails?.strengthOfWitness
                  : "",
            }))
          : [];
        const chargedList = [];
        const notChargedList = [];
        if (!isEmpty(evidanceResult) && !isNull(evidanceResult)) {
          for (let i = 0; i < evidanceResult.length; i++) {
            if (value?.memoOfEvidences.length !== 0) {
              setFormValid(true);
              for (let j = 0; j < value?.memoOfEvidences.length; j++) {
                if (
                  evidanceResult[i]?.person?._id ===
                  value?.memoOfEvidences[j]?.witnessId?._id
                ) {
                  if (
                    !chargedList?.some(
                      (item) =>
                        item?.person?._id === evidanceResult[i]?.person?._id
                    )
                  ) {
                    chargedList.push(evidanceResult[i]);
                  }
                } else {
                  if (
                    !notChargedList?.some(
                      (item) =>
                        item?.person?._id === evidanceResult[i]?.person?._id
                    )
                  ) {
                    notChargedList.push(evidanceResult[i]);
                  }
                }
              }
            }
          }
        }

        const chargedPersonList =
          !isEmpty(chargedList) && orderBy(chargedList, ["witnessCodeNumber"]);
        if (isEmpty(chargedList)) {
          setWitnessListData([]);
          setDataSource([]);
          setChargedList([]);
          setWitnessListData(evidanceResult);
        } else {
          setWitnessListData(notChargedList);
          setDataSource(chargedPersonList);
          setChargedList(chargedPersonList);
        }
      }
      setEditChargesheet(value);
      setSelectedChargesheet(value);
      setIsPrintEnabled(false);
      const cclData = value?.isCCL ? "2" : "1";
      setSelectedTab(cclData);
      const accusedParticulars = value?.accusedParticulars;
      let cclListArray = [];
      let accusedListArray = [];
      accusedParticulars?.forEach((ele) => {
        if (
          ele?.accusedPersonId?.personalDetails?.age &&
          Number(ele?.accusedPersonId?.personalDetails?.age) < 18
        ) {
          cclListArray.push(ele);
        } else {
          accusedListArray.push(ele);
        }
      });
      let filterdResultArray =
        cclData === "2" ? cclListArray : accusedListArray;
      const chargeList =
        !isEmpty(filterdResultArray) &&
        filterdResultArray.filter(
          (s) => s.chargeStatus === "Charged" || s.chargeStatus === "Absconding"
        );
      const notChargeList =
        !isEmpty(filterdResultArray) &&
        filterdResultArray.filter((s) => s.chargeStatus === "NotCharged");
      setChargedAccusedList(chargeList);
      const listCharged = [];
      !isEmpty(chargeList) &&
        chargeList.forEach((item) => {
          let selectedObj = suspectAccusedList.filter(
            (s) => s?.person?._id === item?.accusedPersonId?._id
          );
          var filteredChargedObj = !isEmpty(selectedObj) && first(selectedObj);
          if (
            typeof filteredChargedObj._id !== "undefined" &&
            !listCharged.some(
              (listChargedid) => listChargedid?.id === filteredChargedObj._id
            )
          ) {
            listCharged.push({
              id: filteredChargedObj._id,
              person: item.accusedPersonId,
              accusedCode: filteredChargedObj.accusedCode,
              isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
              status: filteredChargedObj.status,
              suspectCode: filteredChargedObj.suspectCode,
              approvalFromSrOfficer: filteredChargedObj?.approvalFromSrOfficer,
              arrestedDate: filteredChargedObj?.arrestedDate,
              dateOfIssue41CRPC: filteredChargedObj?.dateOfIssue41CRPC,
              is41ACRPC: filteredChargedObj?.is41ACRPC,
              isAbsconding: filteredChargedObj?.isAbsconding,
              is41ACRPCExplainationSubmitted:
                filteredChargedObj?.is41ACRPCExplainationSubmitted,
              isDied: filteredChargedObj?.isDied,
              isCCL: filteredChargedObj?.isCCL,
              isCCLApprehensionAndSureties:
                filteredChargedObj?.isCCLApprehensionAndSureties,
            });
          }
        });
      setAccusedChargedList(listCharged);

      const listNotCharged = [];
      !isEmpty(notChargeList) &&
        notChargeList.forEach((item) => {
          let selectedObj = suspectAccusedList.filter(
            (s) => s?.person?._id === item?.accusedPersonId?._id
          );
          var filteredChargedObj = !isEmpty(selectedObj) && first(selectedObj);
          if (
            typeof filteredChargedObj._id !== "undefined" &&
            !listNotCharged.some(
              (notChargeListid) => notChargeListid.id === filteredChargedObj._id
            )
          ) {
            listNotCharged.push({
              id: filteredChargedObj._id,
              person: item.accusedPersonId,
              accusedCode: filteredChargedObj.accusedCode,
              isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
              status: filteredChargedObj.status,
              suspectCode: filteredChargedObj.suspectCode,
              approvalFromSrOfficer: filteredChargedObj?.approvalFromSrOfficer,
              arrestedDate: filteredChargedObj?.arrestedDate,
              dateOfIssue41CRPC: filteredChargedObj?.dateOfIssue41CRPC,
              is41ACRPC: filteredChargedObj?.is41ACRPC,
              isAbsconding: filteredChargedObj?.isAbsconding,
              is41ACRPCExplainationSubmitted:
                filteredChargedObj?.is41ACRPCExplainationSubmitted,
              isDied: filteredChargedObj?.isDied,
              isCCL: filteredChargedObj?.isCCL,
              isCCLApprehensionAndSureties:
                filteredChargedObj?.isCCLApprehensionAndSureties,
            });
          }
        });
      setAccusedNotChargedList(listNotCharged);
      setRichTextContent(value?.richTextContent);
      isArray(value?.accusedParticulars) &&
        value?.accusedParticulars.forEach((acc1) => {
          if (acc1?.accusedPersonId?._id) {
            let x1 = suspectAccusedList.find(
              (s1) => s1?.person?._id === acc1?.accusedPersonId?._id
            );
            if (x1) {
              acc1["accusedCode"] = x1?.accusedCode;
              acc1["selectedRecord"] = x1?.person;
            }
          }
        });
      setAccusedRecords(value?.accusedParticulars);
      setActsAndSections(value?.actsAndSections);
      //reload
      let RWRequired = "";
      let reduced = value.linkingOfActs.reduce(function (filtered, option) {
        if (option.actsAndSections) {
          option.actsAndSections = option.actsAndSections.filter((val) => {
            if (val?.rwRequired) {
              RWRequired = "r/w ";
            } else {
              RWRequired = "";
            }
            val.section = val.section.map((entry) =>
              RWRequired === ""
                ? entry
                : entry.indexOf("r/w") === -1
                ? RWRequired + entry
                : entry
            );
            return val;
          });
          filtered.push(option);
        }
        return filtered;
      }, []);
      let reloadlinks = Object.values(reduced);
      setLinkingOfActs(value?.linkingOfActs);
      form.setFieldsValue({
        Charge_Sheet_No: value?.chargeSheet?.chargeSheetNo,
        Charge_Sheet_No_For_ICJS: value?.chargeSheetNoForICJS,
        Court_Name: value?.chargeSheet?.courtName,
        Charge_Sheet_Type: value?.chargeSheet?.chargeSheetType,
        richTextContent: value?.richTextContent,
        accusedPersonId: value?.linkingOfActs?.accusedPersonId,
        existingActsSection: value?.linkingOfActs?.existingActsSection,
        complaintName: value?.complaintName,
        Charge_Sheet_Date: moment(
          new Date(value?.chargeSheet?.chargeSheetDate)
        ).isValid()
          ? moment(new Date(value?.chargeSheet?.chargeSheetDate))
          : "",
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    // setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormValid(false);
    setChargedAccusedDisplay(false);
  };

  const showConfirm1 = () => {
    confirm({
      title: "Please map all accused to Act & Sections",
      icon: <ExclamationCircleOutlined />,
      width: 400,
    });
  };

  const res = accusedChargedDropdownList.map((e1) => ({
    _id: e1._id,
    match: linkingOfActs.some((e2) => e2.accusedPersonId === e1._id),
  }));
  const filteredData = !isEmpty(res) && res.filter((s) => s.match === false);

  const generateChargeSheet = async () => {
    if (filteredData.length === 0) {
      submit(false);
    } else {
      showConfirm1();
    }
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
    const Charge_Sheet_Date = moment(new Date(values.Charge_Sheet_Date));
    const accusedParticulars = [];
    !isEmpty(accusedRecords) &&
      accusedRecords.map((s) => {
        const result = {
          accusedPersonId: s?.accusedPersonId?._id,
          chargeStatus: s.chargeStatus,
          reasonForNoCharge: s.reasonForNoCharge,
          requestedForNBW: s.requestedForNBW ? true : false,
        };
        accusedParticulars.push(result);
      });
    let bb = [];
    for (var i = 0; i < linkingOfActs.length; i++) {
      bb = [...bb, ...linkingOfActs[i].actsAndSections];
    }
    let payloadlinkingOfActs = linkingOfActs.reduce(function (
      filtered,
      option
    ) {
      if (option.actsAndSections) {
        option.actsAndSections = option.actsAndSections.filter((val) => {
          val.section = val.section.map((entry) => entry.replace("r/w ", ""));
          return val;
        });
        filtered.push(option);
      }
      return filtered;
    },
    []);

    let actsAndSectionsPayload = [...savedFiractsAndSectionsCopy];

    if (!isDraft && payloadlinkingOfActs && payloadlinkingOfActs.length > 0) {
      if (savedFir?.isChargeSheetGenerated) {
        actsAndSectionsPayload = [...savedFiractsAndSectionsCopy];
      } else {
        actsAndSectionsPayload = [];
      }
      await payloadlinkingOfActs.forEach((ele) => {
        if (ele?.actsAndSections && ele?.actsAndSections.length > 0) {
          actsAndSectionsPayload = [
            ...actsAndSectionsPayload,
            ...ele?.actsAndSections,
          ];
        }
      });
      await setActsAndSections(actsAndSectionsPayload);
    }
    setLinkingOfActs(payloadlinkingOfActs);
    const witnessDetails = [];
    for (let i = 0; i < chargedList?.length; i++) {
      witnessDetails.push({ witnessId: chargedList[i]?.person?._id });
    }
    const addPayload = getPayload(
      values,
      crimeId,
      isDraft,
      accusedParticulars,
      Charge_Sheet_Date,
      richTextContent,
      linkingOfActs,
      actsAndSectionsPayload,
      isCCL,
      witnessDetails
    );
    const updatePayload = {
      chargeSheetId: editChargesheet?._id,
      ...addPayload,
    };

    if (editChargesheet?._id) {
      dispatch(
        addChargesheetDetails(config.addUpdateChargeSheet, updatePayload)
      );
    } else {
      dispatch(addChargesheetDetails(config.addUpdateChargeSheet, addPayload));
    }
  };
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true;
  const disableCSForm =
    (!isEmpty(chargesheetList) && editChargesheet?.isDraft === false) ||
    viewChargesheet ||
    disableForm;

  const disabledGenerateButtons =
    isEmpty(chargesheetList) ||
    (!isEmpty(chargesheetList) &&
      !isNull(editChargesheet) &&
      !editChargesheet?.isDraft) ||
    viewChargesheet ||
    isNull(editChargesheet) ||
    disableForm;

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayChargeSheetFields = (name) => {
    switch (name) {
      case "Charge_Sheet_Date":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 222 }}
            disabledDate={disableFuturePastFIRDates}
            disabled={disableCSForm}
          />
        );
      case "Court_Name":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          222,
          disableCSForm
        );
      case "Charge_Sheet_Type":
        return renderFieldsWithDropDown(
          chargetSheetTypes,
          null,
          handleSearch,
          serchText,
          222,
          disableCSForm
        );
      case "Charge_Sheet_No":
        return (
          <Input
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={true}
          />
        );

      default:
        if (name !== "Charge_Sheet_No_For_ICJS") {
          return (
            <Input
              onChange={checkFields}
              style={{ width: 222 }}
              maxLength={textFieldRules.maxLength}
              disabled={disableCSForm}
            />
          );
        }
    }
  };

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

  const displayChargeSheetState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          if (s.name !== "Charge_Sheet_No_For_ICJS") {
            return (
              <Col span={8} key={i} style={{ marginBottom: 20 }}>
                <Form.Item
                  name={s.name}
                  label={s.label}
                  rules={[
                    {
                      required: s.isRequired,
                      message: `Please Select ${s.label}!`,
                    },
                  ]}
                >
                  {actionName(s.name)}
                </Form.Item>
              </Col>
            );
          }
        })}
      </Row>
    );
  };

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
      title: `Property`,
      dataIndex: "",
      key: "",
      render: (_subType, item) => (
        <span className="tableRowText wordWrap">
          {item?.isMoObject ? item?.subType : item?.natureofStolen}
        </span>
      ),
    },
    {
      title: "Code",
      dataIndex: "moId",
      key: "moId",
      render: (_moId, item) => (
        <span className="tableRowText wordWrap">
          {item?.moId ? item?.moId : ""}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "",
      key: "",
      render: (_type, item) => (
        <span className="tableRowText wordWrap">
          {item?.isMoObject ? item?.type : item?.propertytCategory}
        </span>
      ),
    },
  ];

  const showConfirm = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const handleUpload = (options) => {
    if (chargeSheetUploadFileListState.length > 0) {
      const mediaFormData = new FormData();
      chargeSheetUploadFileListState.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append(
        "folderPath",
        `${crimeId}/${folderName.CHARGESHEET}/file`
      );
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setChargeSheetUploadFileListState([]);
          if (response.data.success) {
            hideModal();
            const { data } = response?.data;
            const payloadData = first(data);
            const tpayload = {
              crimeId: crimeId,
              action: folderName.CHARGESHEET,
              actionSubType: folderName.CHARGESHEET,
              templates: [
                {
                  category: "uploadChargesheet",
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
            if (!isEmpty(chargesheetList) && selectedChargesheet?._id) {
              const payload = {
                crimeId: crimeId,
                chargeSheetId: selectedChargesheet?._id,
                chargeSheetReport: {
                  category: "uploadChargesheet",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  fileId: payloadData?.id,
                },
              };
              dispatch(
                uploadChargesheet(config.uploadChargeSheetReport, payload)
              );
            }
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          setChargeSheetUploadFileListState([]);
          openNotificationWithIcon("error", "Uploading Went Wrong");
          options.onError("ok");
        });
    }
  };

  const moSeizedModal = () => {
    // const result = isArray(filteredMOStolenList)
    //   ? filteredMOStolenList.map((ele) => ({
    //       _id: ele?._id,
    //       crimeId: ele?.crimeId,
    //       type: ele?.type,
    //       subType: ele?.subType,
    //       moId: ele?.moId,
    //       propertyStatus: ele?.propertyStatus,
    //       propertytCategory: ele?.propertytCategory,
    //       propertytCategoryName: ele?.propertytCategoryName,
    //       natureOfStolen: ele?.natureofStolen,
    //       isMoObject: ele?.isMoObject,
    //     }))
    //   : [];

    return (
      <Modal
        title={`Case Property Details (${
          isArray(filteredMOStolenList) ? filteredMOStolenList.length : 0
        })`}
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
            dataSource={filteredMOStolenList}
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
              name: ` ${witnessList?.witnessId?.personalDetails?.name || ""}
              ${witnessList?.witnessId?.personalDetails?.surname || ""}
              ${witnessList?.witnessId?.personalDetails?.alias || ""}`,
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

      if (formValid !== true) {
        setWitnessListData(evidanceResult);
        if (chargedAccusedDisplay === true) {
          setWitnessListData(notChargedList);
          setDataSource(chargedPersonList);
          setChargedList(chargedPersonList);
        }
      }
    }
  }, [witnessStatementListNew, formValid]);

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
      setFormValid(false);
      setChargedAccusedDisplay(true);
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
      disabled: disableCSForm,
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
            className={disableCSForm ? "" : "saveButton"}
            onClick={evidanceHandleOk}
            disabled={
              disableCSForm || (isEmpty(chargedList) && isEmpty(dataSource))
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
                  disabled={disableCSForm}
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
                    disableCSForm
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
                  dataSource={orderBy(witnessListData, ["witnessCodeNumber"])}
                  pagination={false}
                />
              </WitnessTableWrapper>
            )}
          </div>
        )}
      </Modal>
    );
  };

  const accusedShowModal = () => {
    accusedModalFinalResult();
    setIsAccusedVisible(true);
  };

  const captureReason = (value, selectedItem, index, fieldName) => {
    const existingRecord =
      !isEmpty(accusedRecords) &&
      first(
        accusedRecords.filter(
          (s) => s.accusedPersonId?._id === selectedItem?.accusedPersonId?._id
        )
      );
    existingRecord[fieldName] = value;
    const updatedObj = {
      ...accusedRecords[index],
      ...existingRecord,
    };
    const updatedRecords = [
      ...accusedRecords.slice(0, index),
      updatedObj,
      ...accusedRecords.slice(index + 1),
    ];
    setAccusedRecords(updatedRecords);
  };

  const getValues = (index, selectedItem, val) => {
    if (isEmpty(accusedRecords)) {
      selectedItem.chargeStatus = val;
      setAccusedRecords([selectedItem]);
    } else {
      selectedItem.chargeStatus = val;
      const updatedObj = {
        ...accusedRecords[index],
        ...selectedItem,
      };
      const updatedRecords = [
        ...accusedRecords.slice(0, index),
        updatedObj,
        ...accusedRecords.slice(index + 1),
      ];
      setAccusedRecords(updatedRecords);
    }
  };

  const renderFieldsWithDropDownChargeSheet = (selectedItem, index) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: 222 }}
        onSelect={(item) => getValues(index, selectedItem, item)}
        disabled={disableCSForm}
      >
        {isArray(accusedChargeTypes) &&
          accusedChargeTypes.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const accusedHandleOk = async () => {
    accusedForm
      .validateFields()
      .then((values) => {
        // setFormValid(
        //   !Object.values(values).every((v) => v == null || v === "")
        // );
        //filtering ccl and accused
        let CCLList = [];
        let accusedList = [];
        let showA1MandatoryError = false;
        let showMandatoryStatusError = false;
        let messageStatus = "";
        let message = "";
        if (accusedRecords && accusedRecords.length > 0) {
          accusedRecords.forEach((ele, i) => {
            const accusedDetails =
              !isUndefined(ele?.selectedRecord?.person) &&
              ele?.selectedRecord?.person;
            const filteredArrestList =
              !isEmpty(arrestList) &&
              first(
                arrestList.filter(
                  (s) => s?.accusedId?._id === accusedDetails?._id
                )
              );
            const result = !filteredArrestList
              ? ele?.selectedRecord
              : filteredArrestList;

            const filteredjuvenileApprehensionList =
              !isEmpty(juvenileApprehensionList) &&
              first(
                juvenileApprehensionList.filter(
                  (s) => s?.accusedId?._id === accusedDetails?._id
                )
              );
            const result1 = !filteredjuvenileApprehensionList
              ? ele?.selectedRecord
              : filteredjuvenileApprehensionList;
            const dispayStatus =
              ele?.selectedRecord?.isSuspectOrAccused === "CCL"
                ? getCCLStatus(result1)
                : getAccusedStatus(result);

            if (
              ele?.accusedPersonId?.personalDetails?.age &&
              Number(ele?.accusedPersonId?.personalDetails?.age) < 18
            ) {
              CCLList.push(ele);
            } else {
              accusedList.push(ele);
            }
            if (
              dispayStatus === "Arrest By Police" ||
              dispayStatus === "Apprehension By Police"
            ) {
              showMandatoryStatusError = true;
              messageStatus = `Surety details (Or) Remand details are not submitted.`;
            }
          });
        }
        const filteredResult = isCCL ? CCLList : accusedList;

        isArray(accusedModalFinalResultState) &&
          accusedModalFinalResultState.forEach((ele) => {
            if (ele?.accusedCode === "A1" || ele?.accusedCode === "CCL1") {
              let accusedwithone = filteredResult.find(
                (f1) => f1?.accusedCode === "A1" || f1?.accusedCode === "CCL1"
              );
              if (accusedwithone) {
                showA1MandatoryError =
                  accusedwithone?.chargeStatus === "NotCharged" ? true : false;
              } else {
                showA1MandatoryError = true;
              }
              message = showA1MandatoryError
                ? `${
                    isCCL ? "CCL1" : "A1"
                  } must be mandatorily charged.Hence change the Accused code in Accused details screen`
                : "";
            }
          });

        let mandatoryError = showA1MandatoryError || showMandatoryStatusError;
        let messgeData = !!messageStatus ? messageStatus : message;
        if (mandatoryError) {
          openNotificationWithIcon("error", messgeData);
        } else {
          const chargeList =
            !isEmpty(filteredResult) &&
            filteredResult.filter(
              (s) =>
                s.chargeStatus === "Charged" || s.chargeStatus === "Absconding"
            );
          const notChargeList =
            !isEmpty(filteredResult) &&
            filteredResult.filter((s) => s.chargeStatus === "NotCharged");
          setChargedAccusedList(chargeList);
          const listCharged = [];
          !isEmpty(chargeList) &&
            chargeList.forEach((item) => {
              let selectedObj = suspectAccusedList.filter(
                (s) => s?.person?._id === item?.accusedPersonId?._id
              );
              var filteredChargedObj =
                !isEmpty(selectedObj) && first(selectedObj);
              if (
                typeof filteredChargedObj._id !== "undefined" &&
                !listCharged.some(
                  (listChargedid) =>
                    listChargedid?.id === filteredChargedObj._id
                )
              ) {
                listCharged.push({
                  id: filteredChargedObj._id,
                  person: item.accusedPersonId,
                  accusedCode: filteredChargedObj.accusedCode,
                  isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
                  status: filteredChargedObj.status,
                  suspectCode: filteredChargedObj.suspectCode,
                });
              }
            });
          setAccusedChargedList(listCharged);

          const listNotCharged = [];
          !isEmpty(notChargeList) &&
            notChargeList.forEach((item) => {
              let selectedObj = suspectAccusedList.filter(
                (s) => s?.person?._id === item?.accusedPersonId?._id
              );
              var filteredChargedObj =
                !isEmpty(selectedObj) && first(selectedObj);
              if (
                typeof filteredChargedObj._id !== "undefined" &&
                !listNotCharged.some(
                  (notChargeListid) =>
                    notChargeListid.id === filteredChargedObj._id
                )
              ) {
                listNotCharged.push({
                  id: filteredChargedObj._id,
                  person: item.accusedPersonId,
                  accusedCode: filteredChargedObj.accusedCode,
                  isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
                  status: filteredChargedObj.status,
                  suspectCode: filteredChargedObj.suspectCode,
                });
              }
            });
          setAccusedNotChargedList(listNotCharged);
          setIsAccusedVisible(false);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const accusedHandleCancel = () => {
    setIsAccusedVisible(false);
  };

  const accusedColumn = [
    {
      title: "Accused Code",
      dataIndex: "accusedCode",
      key: "accusedCode",
      render: (accusedCode) => (
        <span className="tableRowText wordWrap">
          {accusedCode ? accusedCode : ""}
        </span>
      ),
    },
    {
      title: "Name of the Accused",
      dataIndex: "name",
      key: "name",
      render: (_value, item, index) => {
        const personalDetails =
          !isUndefined(item?.accusedPersonId) &&
          !isNull(item?.accusedPersonId) &&
          item?.accusedPersonId?.personalDetails;
        const accusedName = `${personalDetails?.name || ""} ${
          personalDetails?.surname || ""
        }`;
        return (
          <span key={index} className="tableRowText wordWrap">
            {accusedName}
          </span>
        );
      },
    },
    {
      title: "Status of Accused",
      dataIndex: "status",
      key: "status",
      render: (_value, item, _index) => {
        const accusedDetails =
          !isUndefined(item?.selectedRecord?.person) &&
          item?.selectedRecord?.person;
        const filteredArrestList =
          !isEmpty(arrestList) &&
          first(
            arrestList.filter((s) => s?.accusedId?._id === accusedDetails?._id)
          );
        const result = !filteredArrestList
          ? item?.selectedRecord
          : filteredArrestList;

        const filteredjuvenileApprehensionList =
          !isEmpty(juvenileApprehensionList) &&
          first(
            juvenileApprehensionList.filter(
              (s) => s?.accusedId?._id === accusedDetails?._id
            )
          );
        const result1 = !filteredjuvenileApprehensionList
          ? item?.selectedRecord
          : filteredjuvenileApprehensionList;
        const dispayStatus =
          item?.selectedRecord?.isSuspectOrAccused === "CCL"
            ? getCCLStatus(result1)
            : getAccusedStatus(result);
        return displayStatusDetailsAccused(
          dispayStatus,
          item?.selectedRecord?.isDied
        );
      },
    },
    {
      title: "Charged/Not Charged/Absconding",
      dataIndex: "isSuspectOrAccused",
      key: "isSuspectOrAccused",
      render: (_value, item, index) => {
        const isChargedStatus =
          !isEmpty(accusedRecords) &&
          first(
            accusedRecords.filter(
              (s) => s.accusedPersonId?._id === item?.accusedPersonId?._id
            )
          );
        !isEmpty(accusedRecords) &&
          accusedRecords.map((s) => {
            accusedForm.setFieldsValue({
              [`${s?.accusedPersonId?._id}_chargeStatus`]: s?.chargeStatus,
              [`${s?.accusedPersonId?._id}_reasonForNoCharge`]:
                s?.reasonForNoCharge,
              [`${s?.accusedPersonId?._id}_requestedForNBW`]:
                s?.requestedForNBW,
            });
          });
        return (
          <div key={index}>
            <div style={{ marginBottom: 10 }}>
              <Form.Item name={`${item?.accusedPersonId?._id}_chargeStatus`}>
                {renderFieldsWithDropDownChargeSheet(item, index)}
              </Form.Item>
            </div>
            {isChargedStatus?.chargeStatus === "Absconding" ? (
              <Form.Item
                name={`${item?.accusedPersonId?._id}_requestedForNBW`}
                label="Requested For NBW"
              >
                <Radio.Group
                  onChange={(event) =>
                    captureReason(
                      event.target.value,
                      item,
                      index,
                      "requestedForNBW"
                    )
                  }
                >
                  {" "}
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            ) : null}
            {isChargedStatus?.chargeStatus === "NotCharged" ? (
              <Form.Item
                name={`${item?.accusedPersonId?._id}_reasonForNoCharge`}
                rules={[
                  {
                    required: true,
                    message: "Reason cannot be empty",
                  },
                ]}
              >
                <TextArea
                  rows={3}
                  onChange={(event) =>
                    captureReason(
                      event.target.value,
                      item,
                      index,
                      "reasonForNoCharge"
                    )
                  }
                  placeholder="Reason for not charge sheet"
                />
              </Form.Item>
            ) : null}
          </div>
        );
      },
    },
  ];

  const accusedModalFinalResult = () => {
    const CCLList =
      !isEmpty(suspectAccusedList) &&
      suspectAccusedList.filter((item) => item.isSuspectOrAccused === "CCL");
    const accusedList =
      !isEmpty(suspectAccusedList) &&
      suspectAccusedList.filter(
        (item) => item.isSuspectOrAccused === "Accused"
      );
    const filteredResult = isCCL ? CCLList : accusedList;
    // edit multiple chargesheets accused handling
    const prevExist =
      !isEmpty(editChargesheet) &&
      !isEmpty(chargesheetList) &&
      chargesheetList.filter((e) => e._id !== editChargesheet._id);
    var allSelectedAccused =
      !isEmpty(prevExist) &&
      prevExist.map(function (el) {
        if (
          !isEmpty(el.accusedParticulars) &&
          el.accusedParticulars.length > 0
        ) {
          return el.accusedParticulars;
        } else {
          return [];
        }
      });
    var flatAccuseds =
      !isEmpty(allSelectedAccused) && allSelectedAccused.flat();
    var removeEmptyAccuseds =
      !isEmpty(flatAccuseds) &&
      flatAccuseds.filter(
        (f) =>
          f.hasOwnProperty("accusedPersonId") && f.chargeStatus === "Charged"
      );
    var accusedIDs =
      !isEmpty(removeEmptyAccuseds) &&
      removeEmptyAccuseds.map((p) => {
        if (p.accusedPersonId?._id && !isUndefined(p.accusedPersonId?._id)) {
          return p.accusedPersonId._id;
        }
      });
    let resultAll =
      !isEmpty(accusedIDs) &&
      !isEmpty(filteredResult) &&
      filteredResult.filter((f) => !accusedIDs.includes(f.person._id));

    const prevExist2 =
      !isEmpty(editChargesheet) &&
      !isEmpty(chargesheetList) &&
      chargesheetList.filter((e) => e._id === editChargesheet._id);
    var allSelectedAccused2 =
      !isEmpty(prevExist2) &&
      prevExist2.map(function (el) {
        if (
          !isEmpty(el.accusedParticulars) &&
          el.accusedParticulars.length > 0
        ) {
          return el.accusedParticulars;
        } else {
          return [];
        }
      });
    var flatAccuseds2 =
      !isEmpty(allSelectedAccused2) && allSelectedAccused2.flat();
    var removeEmptyAccuseds2 =
      !isEmpty(flatAccuseds2) &&
      flatAccuseds2.filter(
        (f) =>
          f.hasOwnProperty("accusedPersonId") &&
          (f.chargeStatus === "Charged" || f.chargeStatus === "Absconding")
      );
    var accusedIDs2 =
      !isEmpty(removeEmptyAccuseds2) &&
      removeEmptyAccuseds2.map((p) => {
        if (p.accusedPersonId?._id && !isUndefined(p.accusedPersonId?._id)) {
          return p.accusedPersonId._id;
        }
      });
    let resultAll2 =
      !isEmpty(accusedIDs2) &&
      !isEmpty(filteredResult) &&
      filteredResult.filter((f) => accusedIDs2.includes(f.person._id));
    let fresultAll =
      isArray(resultAll) && resultAll.length > 0 ? resultAll : [];
    let fresultAll2 =
      isArray(resultAll2) && resultAll2.length > 0 ? resultAll2 : [];
    let result =
      !isEmpty(editChargesheet) && isEmpty(prevExist)
        ? filteredResult
        : uniqBy([...fresultAll2, ...fresultAll], "person._id");

    // new chargesheet accused handling
    var allSheetSelectedAccused =
      !isEmpty(chargesheetList) &&
      chargesheetList.map(function (el) {
        if (
          !isEmpty(el.accusedParticulars) &&
          el.accusedParticulars.length > 0
        ) {
          return el.accusedParticulars;
        } else {
          return [];
        }
      });
    var allSheetFlatAccuseds =
      !isEmpty(allSheetSelectedAccused) && allSheetSelectedAccused.flat();
    var allSheetRemoveEmptyAccuseds =
      !isEmpty(allSheetFlatAccuseds) &&
      allSheetFlatAccuseds.filter(
        (f) =>
          f.hasOwnProperty("accusedPersonId") && f.chargeStatus === "Charged"
      );
    var allSheetAccusedIDs =
      !isEmpty(allSheetRemoveEmptyAccuseds) &&
      allSheetRemoveEmptyAccuseds.map((p) => {
        if (p.accusedPersonId?._id && !isUndefined(p.accusedPersonId?._id)) {
          return p.accusedPersonId._id;
        }
      });
    let resultCond =
      !isEmpty(allSheetAccusedIDs) &&
      !isEmpty(filteredResult) &&
      filteredResult.filter((f) => !allSheetAccusedIDs.includes(f.person._id));

    let freshList =
      !isEmpty(allSheetRemoveEmptyAccuseds) && filteredResult
        ? resultCond
        : filteredResult;
    let DraftData = [];
    [...result, ...freshList].forEach((item) => {
      if (!DraftData.some((val) => item._id === val._id)) {
        DraftData.push(item);
      }
    });
    let finalList =
      !isEmpty(editChargesheet) && !!editChargesheet?.isDraft
        ? DraftData
        : !isEmpty(editChargesheet) && !editChargesheet?.isDraft
        ? result
        : freshList;
    let finalListWithAccusedCode =
      !isEmpty(finalList) && finalList.filter((ele) => ele?.accusedCode);

    var accusedResult = !isEmpty(finalListWithAccusedCode)
      ? finalListWithAccusedCode.map((accusedList) => ({
          id: accusedList?._id,
          chargeStatus: "",
          reasonForNoCharge: "",
          requestedForNBW: "",
          accusedPersonId: accusedList?.person,
          suspectCode: accusedList?.suspectCode,
          status: accusedList?.status,
          accusedCode: accusedList?.accusedCode,
          selectedRecord: accusedList,
          isAbsconding: accusedList?.isAbsconding,
          // arrestedDate: accusedList?.arrestedDate,
          // dateOfIssue41CRPC: accusedList?.dateOfIssue41CRPC,
          // isArrestRelated: accusedList?.isArrestRelated,
          // isCCL: accusedList?.isCCL,
          // isCCLApprehension: accusedList?.isCCLApprehension,
        }))
      : [];
    let sortedData = [];

    !isEmpty(accusedResult) &&
      accusedResult.map((item) => {
        const codeName =
          item?.selectedRecord?.isSuspectOrAccused === "CCL" ? "CCL" : "A";
        const result = {
          ...item,
          codeNumber:
            item?.accusedCode &&
            parseInt(item?.accusedCode?.replace(codeName, "")),
        };
        // if (
        //   (item?.isArrestRelated && !item?.isAbsconding && !item?.isCCL) ||
        //   (item?.isCCL && item?.isCCLApprehension && !item?.isAbsconding) ||
        //   !isEmpty(item?.dateOfIssue41CRPC)
        // ) {
        sortedData.push(result);
        // }
      });
    const finalResult =
      !isEmpty(sortedData) && orderBy(sortedData, ["codeNumber"]);
    setaccusedModalaccusedResultState(accusedResult);
    setaccusedModalFinalResultState(finalResult);
  };

  const accusedModal = () => {
    let uniqAccusedCodes = {};
    let duplicateAccusedCodes = "";
    isArray(accusedModalFinalResultState) &&
      accusedModalFinalResultState.forEach((val) => {
        if (uniqAccusedCodes[val.accusedCode]) {
          // we have already found this same id
          duplicateAccusedCodes += val.accusedCode + ",";
        } else {
          uniqAccusedCodes[val.accusedCode] = true;
        }
      });

    return (
      <Modal
        title="Accused Persons List"
        width={1000}
        visible={isAccusedVisible}
        onOk={accusedHandleOk}
        onCancel={accusedHandleCancel}
        className="accusedPersonListModal"
        okText="Save & Close"
        footer={[
          <span
            type="primary"
            style={{ marginRight: 10 }}
            onClick={accusedHandleCancel}
            className="popupLink"
          >
            Cancel
          </span>,
          <Button
            key="cancel"
            type="primary"
            className={disableCSForm ? "" : "saveButton"}
            onClick={accusedHandleOk}
            disabled={
              disableCSForm ||
              isEmpty(accusedModalaccusedResultState) ||
              duplicateAccusedCodes
            }
          >
            Save & Close
          </Button>,
        ]}
      >
        <div className="widgetContainer chargeContainer">
          <Form form={accusedForm} layout="vertical">
            <div
              className="chargeModal"
              style={{
                cursor: duplicateAccusedCodes ? "not-allowed" : "default",
              }}
            >
              <TableWrapper
                dataSource={accusedModalFinalResultState}
                columns={accusedColumn}
                pagination={false}
                style={{
                  pointerEvents: duplicateAccusedCodes ? "none" : "auto",
                }}
                size="small"
              />
              {duplicateAccusedCodes ? (
                <div className="overlay">
                  <small className="innerText">
                    Accused code should be unique. Please change the code in
                    Accused details page.
                  </small>
                </div>
              ) : (
                ""
              )}
            </div>
          </Form>
        </div>
      </Modal>
    );
  };

  const renderSelectedAccusedDetails = (itemList) => (
    <Card style={{ minHeight: 80 }}>
      {isEmpty(itemList) ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#A8A8A8",
          }}
        >
          Click 'Edit Accused Charge sheet particulars' button.
        </div>
      ) : (
        itemList.map((item, i) => {
          // if (!accusedDetails?.some((value) => value === item?.id)) {
          const accusedCode =
            !isUndefined(item?.accusedCode) && item?.accusedCode;
          const status = !isUndefined(item?.status) && item?.status;
          const personalDetails =
            !isUndefined(item?.person) && item?.person?.personalDetails;
          const presentAddress =
            !isUndefined(item?.person) && item?.person?.presentAddress;
          const permanentAddress =
            !isUndefined(item?.person) && item?.person?.permanentAddress;
          return (
            <div key={i}>
              <span>
                <b>{accusedCode ? accusedCode + " " : " "}</b>
              </span>
              <span>{getPersonPersonalDetailsPrint(personalDetails)}</span>
              <span>{getPersonPersonalAddressPrint(presentAddress)}</span>
              <span>{getPersonPermanentAddressPrint(permanentAddress)}</span>
              <br />
              <span>
                <b>{item?.status ? ` Status of Accused: ` : ""}</b>
                {status}
              </span>
            </div>
          );
          // }
        })
      )}
    </Card>
  );

  const renderComplainantNames = (itemList) => (
    <Card style={{ minHeight: 80 }}>
      {!isEmpty(itemList) &&
        itemList.map((item, i) => {
          const personalDetails =
            !isUndefined(item?.person) && item?.person?.personalDetails;
          const phoneNumber =
            !isUndefined(item?.person?.contactDetails) &&
            item?.person?.contactDetails[0]?.phoneNumber;
          const presentAddress =
            !isUndefined(item?.person) && item?.person?.presentAddress;
          const permanentAddress =
            !isUndefined(item?.person) && item?.person?.permanentAddress;
          return (
            <div key={i}>
              <span>{getPersonPersonalDetailsPrint(personalDetails)}</span>
              <span>{phoneNumber ? `contact no: ${phoneNumber},` : ""}</span>
              <span>{getPersonPersonalAddressPrint(presentAddress)}</span>
              <span>{getPersonPermanentAddressPrint(permanentAddress)}</span>
            </div>
          );
        })}
    </Card>
  );

  useEffect(() => {
    let accusedChargedDropdown = [];
    let cclChargedDropdown = [];
    chargedAccusedList &&
      chargedAccusedList.length &&
      chargedAccusedList.forEach((pw) => {
        if (pw.accusedPersonId) {
          const { personalDetails } = pw?.accusedPersonId;
          const label =
            personalDetails &&
            `${personalDetails.name} ${personalDetails.surname || ""}`;
          if (
            personalDetails?.age &&
            Number(personalDetails?.age) < 18 &&
            !cclChargedDropdown.some(
              (value) => value?._id === pw.accusedPersonId?._id
            )
          ) {
            cclChargedDropdown.push({
              _id: pw.accusedPersonId?._id,
              label: label,
            });
          } else {
            if (
              !accusedChargedDropdown.some(
                (value) => value?._id === pw.accusedPersonId?._id
              )
            ) {
              accusedChargedDropdown.push({
                _id: pw.accusedPersonId?._id,
                label: label,
              });
            }
          }
        }
      });
    if (Number(selectedTab) === 1) {
      setAccusedChargedDropdownList(accusedChargedDropdown);
    } else {
      setAccusedChargedDropdownList(cclChargedDropdown);
    }
  }, [chargedAccusedList, selectedTab]);

  const actListData = actList.map((item) => {
    const container = {
      label: item.ACT_LONG,
      ACT_LONG: item.ACT_LONG,
      ACT_SHORT: item.ACT_SHORT,
      name: item.ACT_CD,
    };
    return container;
  });

  const sectionListData = sectionList.map((item) => {
    const container = {
      name: item.SECTION,
      label: item.SECTION,
      ACT_SEC_CD: item.ACT_SEC_CD,
      sectionDescription: item.SHORT_DESC,
      sectionCode: item.SECTION_CD,
    };
    return container;
  });

  const [selectedLinkAccused, setSelectedLinkAccused] = useState("");

  useEffect(() => {
    if (savedFir) {
      const existingSections = [];
      !isEmpty(savedFir?.nonChargeSheetActs) &&
        savedFir?.nonChargeSheetActs.map((s, i) => {
          s.section.length > 0 &&
            s.section.forEach((sectionElement) => {
              let rwTrue = s?.rwRequired === true ? "r/w" : "";
              const actName =
                !isEmpty(actList) &&
                first(actList.filter((k) => k?.ACT_LONG === s?.actDescription));
              var act =
                !isUndefined(actName?.ACT_SHORT) && actName?.ACT_SHORT !== ""
                  ? actName?.ACT_SHORT
                  : "";
              existingSections.push({
                label: rwTrue
                  ? `${rwTrue} ${sectionElement} ${act}`
                  : `${sectionElement} ${act}`,
                actDescription: act,
                section: sectionElement,
                rwRequired: rwTrue ? true : false,
              });
            });
        });
      setsavedFirActsAndSectionsCopy(savedFir?.firDetail?.actsAndSections);
      setExistingActsAndSections(existingSections.flat());
    }
  }, [savedFir, actList, selectedLinkAccused, linkingOfActs]);

  const onChangeLinkAccused = (val) => {
    setSelectedLinkAccused(val);
  };

  const submitActs = async () => {
    const mainFormValues = await form.validateFields();
    const matchingAccused = linkingOfActs.filter(
      (item) => item.accusedPersonId === mainFormValues.accusedPersonId
    );

    let accusedActs = {
      accusedPersonId: mainFormValues.accusedPersonId,
      existingActsSection: "",
      actsAndSections: [],
    };

    let accusedActsTemp = [];
    if (mainFormValues.existingActsSection) {
      mainFormValues.existingActsSection.map((s) => {
        let end = "";
        let start = "";
        let [firsts, ...rest] = s.split(" ");
        let rwValue = firsts.indexOf("r/w");
        if (rwValue === 0) {
          var n = 2;
          let list = s.split(" ");
          end = list.slice(n).join(" ");
          start = list.slice(0, n).join(" ");
        } else {
          start = firsts;
          end = rest.join(" ");
          var arr1 = [firsts];
        }
        if (!isEmpty(end)) {
          const actName =
            !isEmpty(actListData) &&
            first(
              actListData.filter((k) => {
                if (end.includes(k.ACT_SHORT)) {
                  if (
                    savedActDetails.some(
                      (val) => val.actDescription === k.ACT_LONG
                    )
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              })
            );
          // k.ACT_SHORT === end));
          const act =
            !isUndefined(actName?.label) && actName?.label !== ""
              ? actName?.label
              : "";

          const sectionData = s
            .split(" ")
            .filter(
              (item) =>
                !actName.ACT_SHORT.split(" ").some((val) => val === item)
            );
          const existingSections = {
            actDescription: act,
            section: !isEmpty(sectionData) ? [sectionData.join(" ")] : [],
            sectionDescription:
              !isEmpty(filteredSectionList) &&
              first(filteredSectionList.filter((s) => s.label === start))
                ?.sectionDescription,
            graveParticulars: "",
            rwRequired: rwValue === 0 ? true : false,
          };
          accusedActsTemp.push(existingSections);
          accusedActsTemp = accusedActsTemp.reduce((unique, o) => {
            if (
              !unique.some(
                (obj) => obj.section.toString() === o.section.toString()
              )
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          accusedActs.actsAndSections.push(existingSections);
          const uniques = [
            ...new Set(
              [...actsAndSections, existingSections].map((x) =>
                JSON.stringify(
                  ((o) => ({
                    actDescription: o.actDescription,
                    graveParticulars: o.graveParticulars,
                    rwRequired: o.rwRequired,
                    section: o.section,
                    sectionDescription: o.sectionDescription,
                  }))(x)
                )
              )
            ),
          ].map(JSON.parse);
          setActsAndSections((actsAndSections) => [
            ...actsAndSections,
            uniques,
          ]);
        } else {
          const actName =
            !isEmpty(actListData) &&
            first(actListData.filter((k) => k.ACT_SHORT === end));
          const actData =
            !isUndefined(actName?.label) && actName?.label !== ""
              ? actName?.label
              : "";
          const existingSectionsData = {
            actDescription: actData,
            section: start ? [start] : [],
            sectionDescription:
              !isEmpty(filteredSectionList) &&
              first(filteredSectionList.filter((s) => s.label === start))
                ?.sectionDescription,
            graveParticulars: "",
            rwRequired: rwValue === 0 ? true : false,
          };
          accusedActsTemp.push(existingSectionsData);
          accusedActsTemp = accusedActsTemp.reduce((unique, o) => {
            if (
              !unique.some(
                (obj) => obj.section.toString() === o.section.toString()
              )
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          accusedActs.actsAndSections.push(existingSectionsData);
          const uniques = [
            ...new Set(
              [...actsAndSections, existingSectionsData].map((x) =>
                JSON.stringify(
                  ((o) => ({
                    actDescription: o.actDescription,
                    graveParticulars: o.graveParticulars,
                    rwRequired: o.rwRequired,
                    section: o.section,
                    sectionDescription: o.sectionDescription,
                  }))(x)
                )
              )
            ),
          ].map(JSON.parse);
          form.setFieldsValue({ existingActsSection: "" });
          setActsAndSections((actsAndSections) => [
            ...actsAndSections,
            uniques,
          ]);
        }
      });
    }

    const actsValues = await actsAndSectionsForm.validateFields();

    let actsAndSectionsData = {};

    if (actsValues.Section || actsValues.Act || actsValues.RWrequired) {
      var sectiondata = actsValues.Section.toString();
      var splitdata = sectiondata.split(",");
      var array = [];
      for (var i = 0; i < splitdata.length; i++) {
        if (actsValues.RWrequired === true) {
          array.push("r/w " + splitdata[i]);
        } else {
          array.push(splitdata[i]);
        }
      }
      actsAndSectionsData.actDescription = actsValues?.Act;
      actsAndSectionsData.section = array;
      actsAndSectionsData.sectionDescription =
        !isEmpty(filteredSectionList) &&
        first(filteredSectionList.filter((s) => s.label === actsValues.Section))
          ?.sectionDescription;
      actsAndSectionsData.rwRequired = actsValues?.RWrequired;
    }
    if (!isEmpty(actsAndSectionsData) && actsAndSections.length >= 0) {
      accusedActs.actsAndSections.push(actsAndSectionsData);
      setActsAndSections((actsAndSections) => [
        ...actsAndSections,
        actsAndSectionsData,
      ]);
    }
    if (!isEmpty(matchingAccused) && accusedActs.actsAndSections.length > 0) {
      matchingAccused[0].actsAndSections = [
        ...matchingAccused[0].actsAndSections,
        ...accusedActs.actsAndSections,
      ];
    } else {
      if (
        !isEmpty(mainFormValues.accusedPersonId) &&
        !isUndefined(mainFormValues.accusedPersonId) &&
        accusedActs.actsAndSections.length > 0
      ) {
        setLinkingOfActs((linkingOfActs) => [...linkingOfActs, accusedActs]);
      }
    }
    actsAndSectionsForm.resetFields();
    form.resetFields(["accusedPersonId"]);
    form.resetFields(["existingActsSection"]);
    setSelectedLinkAccused("");
  };

  const selectedActDetails =
    !isEmpty(actListData) &&
    first(actListData.filter((s) => s.label === selectedAct));

  const filteredSectionList =
    selectedActDetails &&
    !isEmpty(sectionListData) &&
    sectionListData.filter((s) => s.ACT_SEC_CD === selectedActDetails?.name);

  const onActChange = (val) => {
    setSelectedAct(val);
    checkFields();
  };

  const removeSection = (accusedId, section) => {
    let valueToRemove = section.label.split(" ");
    let end = "";
    let start = "";
    var n = 2;
    let list;
    let [firsts, ...rest] = valueToRemove.filter(
      (entry) => entry.trim() !== ""
    );
    let rwValue = firsts.indexOf("r/w");
    if (rwValue === 0) {
      list = section.label.split(" ");
      end = list.slice(n).join(" ");
      start = list.slice(1, n).join(" ");
    } else {
      start = firsts;
      end = rest.join(" ");
    }

    const matchingAccused = linkingOfActs.filter(
      (item) => item.accusedPersonId === accusedId
    );

    matchingAccused.map((acts) => {
      acts.actsAndSections.map((s) => {
        const actName =
          !isEmpty(actListData) &&
          first(
            actListData.filter((k) => {
              if (end.includes(k.ACT_SHORT)) {
                if (s.actDescription === k.ACT_LONG) {
                  return true;
                } else {
                  return false;
                }
              }
            })
          );
        if (!!actName?.ACT_SHORT) {
          const act =
            !isUndefined(actName?.ACT_SHORT) && !!actName?.ACT_SHORT
              ? actName?.ACT_SHORT
              : "";
          const sectionData = section.label
            .split(" ")
            .filter(
              (item) =>
                !actName.ACT_SHORT.split(" ").some((val) => val === item)
            )
            .join(" ");
          if (s.section.includes(sectionData) && end.includes(act)) {
            let removeTemp =
              rwValue === 0 ? list.slice(0, n).join(" ") : firsts;
            let ss = s.section.map((entry) => {
              return entry.trim();
            });
            var index = ss.findIndex((item) => item.includes(removeTemp));
            if (index !== -1) {
              s.section.splice(index, 1);
            }
          }
        }
      });
    });

    const result = matchingAccused.map((acts) => {
      const draftResult = acts.actsAndSections.filter(
        (item) => item.section.length !== 0
      );
      if (!isEmpty(acts.actsAndSections) && acts.actsAndSections.length > 0) {
        const result = {
          _id: acts._id,
          accusedPersonId: acts.accusedPersonId,
          existingActsSection: "",
          actsAndSections: draftResult,
        };
        return result;
      }
    });

    result.forEach((element) => {
      const itemIndex = linkingOfActs.findIndex(
        (o) => o.accusedPersonId === element.accusedPersonId
      );
      if (itemIndex > -1) {
        linkingOfActs[itemIndex] = element;
        setLinkingOfActs(
          linkingOfActs.filter((item) => item.actsAndSections.length !== 0)
        );
      }
    });
    callToUpdateActsNSection(accusedId, valueToRemove);
  };

  const callToUpdateActsNSection = (accusedId, valueToRemove) => {
    valueToRemove = valueToRemove.filter((entry) => entry.trim() != "");
    if (accusedId && !isEmpty(valueToRemove[0])) {
      actsAndSections.map((s) => {
        const actName =
          !isEmpty(actListData) &&
          first(actListData.filter((k) => k.label === s?.actDescription));
        var act =
          !isUndefined(actName?.ACT_SHORT) && actName?.ACT_SHORT !== ""
            ? actName?.ACT_SHORT
            : "";
        let valueToRemoveLength = valueToRemove.filter(
          (entry) => entry.trim() !== ""
        );

        let compareValue =
          valueToRemoveLength.length === 3
            ? valueToRemove[2]
            : valueToRemove[1];
        let removeValue =
          valueToRemoveLength.length === 3
            ? valueToRemove[1]
            : valueToRemove[0];

        if (compareValue && act === compareValue) {
          return s.section.filter(function (ele) {
            return ele !== removeValue;
          });
        }
      });
      setActsAndSections(
        actsAndSections.filter((item) => item.section.length !== 0)
      );
    }
  };

  const actSectionColumn = [
    {
      title: "S. NO",
      dataIndex: "index",
      key: "index",
      render: (_value, _item, index) => (
        <span className="tableRowText wordWrap">{++index}</span>
      ),
    },
    {
      title: "Accused Name",
      dataIndex: "accusedName",
      key: "accusedName",
      render: (i, item) => {
        const accusedName = accusedChargedDropdownList.filter(
          (s) => s._id === item?.accusedPersonId
        );
        return (
          <>
            <span className="tableRowText wordWrap">
              {first(accusedName)?.label ? first(accusedName)?.label : ""}
            </span>
          </>
        );
      },
    },
    {
      title: "R/W Required",
      dataIndex: "rwRequired",
      key: "rwRequired",
      render: (i, item) => {
        let oneTrue =
          !isUndefined(item.actsAndSections) &&
          item.actsAndSections.find((o) => o.rwRequired === true);
        return (
          <span className="tableRowText wordWrap">
            {oneTrue && !isEmpty(oneTrue) && !isUndefined(oneTrue) ? "Y" : "N"}
          </span>
        );
      },
    },
    {
      title: "Sections",
      dataIndex: "section",
      key: "section",
      render: (_value, item, _index) => {
        const actsAndSections = item.actsAndSections && item?.actsAndSections;
        const existingSections = [];
        actsAndSections &&
          !isEmpty(actsAndSections) &&
          actsAndSections.map((s) => {
            const actName =
              !isEmpty(actListData) &&
              first(actListData.filter((k) => k.label === s?.actDescription));
            var act =
              !isUndefined(actName?.ACT_SHORT) && actName?.ACT_SHORT !== ""
                ? actName?.ACT_SHORT
                : "";
            s &&
              !isEmpty(s.section) &&
              s?.section.map((item) => {
                // existingSections.push({ label: item });
                existingSections.push({ label: act ? item + " " + act : item });
              });
          });
        return (
          <>
            {!isUndefined(existingSections) &&
              isArray(existingSections) &&
              uniqBy(existingSections, "label").map((section, i) => {
                return (
                  <Tag
                    key={i}
                    color="success"
                    closable={viewChargesheet ? false : true}
                    onClose={(e) => {
                      e.preventDefault();
                      removeSection(item?.accusedPersonId, section);
                    }}
                  >
                    {section.label}
                  </Tag>
                );
              })}
          </>
        );
      },
    },
  ];

  const renderActsFieldsWithDropDown = (
    menuOptions,
    selectAction,
    handleSearch,
    disabled = false
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        style={{ width: 200 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const renderAccusedFieldsWithDropDown = (
    menuOptions,
    selectAction,
    handleSearch,
    disabled = false
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        style={{ width: 180 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item._id} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayActsAndSectionFields = (name) => {
    switch (name) {
      case "Act":
        return renderActsFieldsWithDropDown(
          actListData,
          onActChange,
          handleSearch,
          disableCSForm
        );
      case "Section":
        return renderFieldsWithMultipleDropDown(
          filteredSectionList,
          null,
          handleSearch,
          serchText,
          null,
          disableCSForm
        );
      case "accusedPersonId":
        return renderAccusedFieldsWithDropDown(
          accusedChargedDropdownList,
          onChangeLinkAccused,
          handleSearch,
          disableCSForm
        );
      case "existingActsSection":
        return renderFieldsWithMultipleDropDown(
          existingActsAndSections,
          null,
          handleSearch,
          serchText,
          null,
          disableCSForm
        );
      default:
        return <Input onChange={checkFields} />;
    }
  };

  const displayActsSectionState = (data, actionName, spanIndex) => {
    return data.map((s, i) => {
      return (
        <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const displayEmptyCard = () => {
    return (
      <Card style={{ minHeight: 80 }}>
        <div
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#A8A8A8",
          }}
        >
          Click 'Edit Accused Charge sheet particulars' button.
        </div>
      </Card>
    );
  };

  const displayChargesheetContent = () => {
    return (
      <Form form={form} layout="vertical">
        <Col>
          {displayChargeSheetState(ChargeSheetForm, displayChargeSheetFields)}
        </Col>
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
              Case Property Details ({filteredMOStolenList?.length || 0})
            </span>
            {moSeizedModal()}
          </Col>
        </Row>
        <div style={{ margin: "24px 0" }} />
        <Col style={{ marginLeft: "25%" }}>
          <Button
            type="primary"
            onClick={accusedShowModal}
            className="saveButton"
            style={{ width: 300, marginBottom: 10 }}
          >
            Edit Accused Charge sheet particulars
          </Button>
          {accusedModal()}
        </Col>
        <Row>
          <Col span={6} style={{ fontSize: 16 }}>
            <span>Particulars of Accused Charge Sheeted</span>
          </Col>
          <Col span={18}>
            {isPrintEnabled
              ? displayEmptyCard()
              : renderSelectedAccusedDetails(accusedChargedList)}
          </Col>
        </Row>
        <div style={{ margin: "24px 0" }} />
        <Row>
          <Col span={6} style={{ fontSize: 16 }}>
            <span>Particulars of accused not Charge Sheeted</span>
          </Col>
          <Col span={18}>
            {isPrintEnabled
              ? displayEmptyCard()
              : renderSelectedAccusedDetails(accusedNotChargedList)}
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
        <div style={{ margin: "24px 0" }} />
        <Row gutter={24}>
          <Col span={12} style={{ fontSize: 16 }}>
            <span>Linking of Acts and Sections</span>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} style={{ fontSize: 16 }}>
            <Card className="card-style">
              <Row gutter={24}>
                {displayActsSectionState(
                  LinkSection,
                  displayActsAndSectionFields,
                  6
                )}
                {showNewSections === false ? (
                  <Col>
                    <Form.Item>
                      <Button
                        type="primary"
                        className="saveButton"
                        style={{ marginTop: 20, width: 120 }}
                        disabled={disableCSForm || isFetching}
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={submitActs}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                ) : (
                  ""
                )}
                <Col>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="saveButton"
                      style={{ marginTop: 20, width: 200 }}
                      disabled={disableCSForm || isFetching}
                      icon={<PlusOutlined className="saveButtonIcon" />}
                      onClick={onClickNewSections}
                    >
                      Add New Sections
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              {showNewSections === true ? (
                <Col span={24}>
                  <Form
                    form={actsAndSectionsForm}
                    layout="vertical"
                    onFinish={submitActs}
                  >
                    <Row gutter={24}>
                      {displayActsSectionState(
                        ActsAndSection,
                        displayActsAndSectionFields,
                        8
                      )}
                      <Col>
                        <Form.Item>
                          <Button
                            type="primary"
                            className="saveButton"
                            style={{ marginTop: 20 }}
                            disabled={disableCSForm || isFetching}
                            icon={<SaveOutlined className="saveButtonIcon" />}
                            onClick={submitActs}
                          >
                            Save
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24} style={{ marginBottom: 10 }}>
                      <Col span={24}>
                        <Form.Item name="RWrequired" valuePropName="checked">
                          <Checkbox disabled={disableCSForm}>
                            R/W required
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              ) : (
                ""
              )}
              {!isEmpty(linkingOfActs) && !isPrintEnabled ? (
                <div className="widgetContainer">
                  <TableWrapper
                    dataSource={linkingOfActs}
                    columns={actSectionColumn}
                    pagination={false}
                    rowKey={(_obj, index) => `${index}_key`}
                    size="small"
                  />
                </div>
              ) : null}
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 20, marginBottom: 10 }}>
          <Col span={24} style={{ marginBottom: 10, fontSize: 16 }}>
            <label>
              <span style={{ color: "red" }}> * </span>Brief facts of the case
            </label>
          </Col>
          <Col span={24} style={{ minHeight: "48vh" }}>
            <RichTextEditorWithTable
              onChange={setRichTextContent}
              readOnly={disableCSForm}
              value={richTextContent || ""}
              height="40vh"
            />
          </Col>
        </Row>
      </Form>
    );
  };

  const onPrintChargesheet = (item) => {
    form.resetFields();
    setSelectedChargesheet(item);
    setIsPrintEnabled(true);
    setEditChargesheet(null);
    setViewChargesheet(false);
    setDataSource([]);
    setChargedList([]);
    setRichTextContent("");
    setIsModalVisible(true);
    const accusedParticulars = item?.accusedParticulars;
    const chargeList =
      !isEmpty(accusedParticulars) &&
      accusedParticulars.filter(
        (s) => s.chargeStatus === "Charged" || s.chargeStatus === "Absconding"
      );
    const notChargeList =
      !isEmpty(accusedParticulars) &&
      accusedParticulars.filter((s) => s.chargeStatus === "NotCharged");
    setChargedAccusedList(chargeList);
    const listCharged = [];
    !isEmpty(chargeList) &&
      chargeList.forEach((item) => {
        let selectedObj = suspectAccusedList.filter(
          (s) => s?.person?._id === item?.accusedPersonId?._id
        );
        var filteredChargedObj = !isEmpty(selectedObj) && first(selectedObj);
        if (
          typeof filteredChargedObj._id !== "undefined" &&
          !listCharged.some(
            (listChargedid) => listChargedid?.id === filteredChargedObj._id
          )
        ) {
          listCharged.push({
            id: filteredChargedObj._id,
            person: item.accusedPersonId,
            accusedCode: filteredChargedObj.accusedCode,
            isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
            status: filteredChargedObj.status,
            suspectCode: filteredChargedObj.suspectCode,
            approvalFromSrOfficer: filteredChargedObj?.approvalFromSrOfficer,
            arrestedDate: filteredChargedObj?.arrestedDate,
            dateOfIssue41CRPC: filteredChargedObj?.dateOfIssue41CRPC,
            is41ACRPC: filteredChargedObj?.is41ACRPC,
            isAbsconding: filteredChargedObj?.isAbsconding,
            is41ACRPCExplainationSubmitted:
              filteredChargedObj?.is41ACRPCExplainationSubmitted,
            isDied: filteredChargedObj?.isDied,
            isCCL: filteredChargedObj?.isCCL,
            isCCLApprehensionAndSureties:
              filteredChargedObj?.isCCLApprehensionAndSureties,
          });
        }
      });
    setAccusedChargedList(listCharged);
    const listNotCharged = [];
    !isEmpty(notChargeList) &&
      notChargeList.map((item) => {
        let selectedObj = suspectAccusedList.filter(
          (s) => s?.person?._id === item?.accusedPersonId?._id
        );
        var filteredChargedObj = !isEmpty(selectedObj) && first(selectedObj);
        if (
          typeof filteredChargedObj._id !== "undefined" &&
          !listNotCharged.some(
            (notChargeListid) => notChargeListid.id === filteredChargedObj._id
          )
        ) {
          listNotCharged.push({
            id: filteredChargedObj._id,
            person: item.accusedPersonId,
            accusedCode: filteredChargedObj.accusedCode,
            isSuspectOrAccused: filteredChargedObj.isSuspectOrAccused,
            status: filteredChargedObj.status,
            suspectCode: filteredChargedObj.suspectCode,
            approvalFromSrOfficer: filteredChargedObj?.approvalFromSrOfficer,
            arrestedDate: filteredChargedObj?.arrestedDate,
            dateOfIssue41CRPC: filteredChargedObj?.dateOfIssue41CRPC,
            is41ACRPC: filteredChargedObj?.is41ACRPC,
            isAbsconding: filteredChargedObj?.isAbsconding,
            is41ACRPCExplainationSubmitted:
              filteredChargedObj?.is41ACRPCExplainationSubmitted,
            isDied: filteredChargedObj?.isDied,
            isCCL: filteredChargedObj?.isCCL,
            isCCLApprehensionAndSureties:
              filteredChargedObj?.isCCLApprehensionAndSureties,
          });
        }
      });
    setAccusedNotChargedList(listNotCharged);
    const cclDetail = item.isCCL ? true : false;
    setIsCCLToPrint(cclDetail);
    let witnessStatementData = JSON.parse(
      JSON.stringify(witnessStatementListNew)
    );
    let memoOfEvidences = [];
    for (let i = 0; i < witnessStatementData?.length; i++) {
      for (let j = 0; j < item?.memoOfEvidences?.length; j++) {
        if (
          witnessStatementData[i]?.witnessId?._id ===
          item?.memoOfEvidences[j]?.witnessId?._id
        ) {
          Object.assign(witnessStatementData[i], { isChargeSheet: true });
          Object.assign(witnessStatementData[i]?.statementDetails, {
            witnessCode: `LW${j + 1}`,
          });
          memoOfEvidences?.push(witnessStatementData[i]);
        }
      }
    }
    settotalAccusedOrCCLList(memoOfEvidences);
  };

  const fileData =
    !isNull(chargesheetList) &&
    !isUndefined(editChargesheet?.uploadChargeSheet) &&
    editChargesheet?.uploadChargeSheet?.url !== ""
      ? [editChargesheet?.uploadChargeSheet]
      : undefined;

  return (
    <ModuleWrapper>
      <div className="contentHeaderContainer">
        <div style={styles.widgetPageStyle}>
          <h2 className="pageTitle">Chargesheet</h2>
        </div>
        <div style={{ display: "flex", marginTop: 10 }}>
          <Button
            className="stepsButtonInActive"
            onClick={() => setSelectedSiderMenu("investigation")}
          >
            Cancel
          </Button>
          {!isNull(editChargesheet) && !editChargesheet?.isDraft ? (
            <>
              <Button
                type="primary"
                className="saveButton"
                style={{ width: 180, marginRight: 5 }}
                onClick={showConfirm}
                disabled={
                  isFetching ||
                  (!isUndefined(editChargesheet?.uploadChargeSheet) &&
                    (editChargesheet?.uploadChargeSheet?.url !== "" ||
                      editChargesheet?.uploadChargeSheet?.fileId !== ""))
                }
              >
                Upload Chargesheet
              </Button>
              {!isUndefined(editChargesheet?.uploadChargeSheet) ? (
                <span
                  onClick={() =>
                    getFileById(
                      editChargesheet?.uploadChargeSheet?.fileId,
                      editChargesheet?.uploadChargeSheet?.name,
                      editChargesheet?.uploadChargeSheet?.url
                    )
                  }
                  className="tableRowTextFir"
                  style={{
                    color: "#033c68",
                    cursor: "pointer",
                    position: "absolute",
                    marginTop: 40,
                    marginLeft: 100,
                  }}
                >
                  {editChargesheet?.uploadChargeSheet?.name && (
                    <PaperClipOutlined />
                  )}
                  {editChargesheet?.uploadChargeSheet?.name}
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
                      await setChargeSheetUploadFileListState(info.fileList);
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
                    Are you sure you want to upload Chargesheet? This process
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
            disabled={disableCSForm || isFetching}
          >
            Save Draft
          </Button>
          {disabledGenerateButtons || isFetching ? (
            <Button
              type="primary"
              className={disabledGenerateButtons ? "" : "stepsButtonActive"}
              style={{ width: 200 }}
              disabled={disabledGenerateButtons || isFetching}
            >
              Generate Chargesheet
            </Button>
          ) : (
            <Popconfirm
              title="Are you sure to send it to court?"
              onConfirm={generateChargeSheet}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                className={disabledGenerateButtons ? "" : "stepsButtonActive"}
                style={{ width: 200, marginBottom: 10 }}
                disabled={disabledGenerateButtons || isFetching}
              >
                Generate Chargesheet
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <Row style={{ minHeight: 550, marginTop: !isEmpty(fileData) ? 25 : 5 }}>
          <Card className="cardLeftStyle" style={{ width: "70%", padding: 10 }}>
            <Tabs
              defaultActiveKey={selectedTab}
              activeKey={selectedTab}
              onChange={changeTab}
            >
              <TabPane tab="Chargesheet Accused" key="1">
                {isTabChanged ? <Loader /> : displayChargesheetContent()}
              </TabPane>
              <TabPane tab="Final Report (JCS)" key="2">
                {isTabChanged ? <Loader /> : displayChargesheetContent()}
              </TabPane>
            </Tabs>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            {!isEmpty(chargesheetList) && (
              <SavedRecords
                dataSource={chargesheetList}
                editDetails={handleEditChargesheet}
                setViewDetails={setViewChargesheet}
                selectedRecord={editChargesheet}
                onPrintChargesheet={onPrintChargesheet}
              />
            )}
          </Card>
        </Row>
      )}
      <PrintChargeSheet
        title={
          !selectedChargesheet?.isDraft
            ? "Charge Sheet Preview"
            : "Draft Charge Sheet Preview"
        }
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        isChargeSheetGenerated={!selectedChargesheet?.isDraft}
        chargesheetList={selectedChargesheet}
        chargedAccusedList={accusedChargedList}
        notChargedAccusedList={accusedNotChargedList}
        witnessStatementList={totalAccusedOrCCLList}
        actListData={actListData}
        isCCLToPrint={isCCLToPrint}
        arrestList={arrestList}
        juvenileApprehensionList={juvenileApprehensionList}
        filteredIODetails={filteredIODetails}
        reassignmentOfCaseList={reassignmentOfCaseList}
        initialBriefFacts={initialBriefFacts}
      />
    </ModuleWrapper>
  );
}
