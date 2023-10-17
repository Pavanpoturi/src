/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  Space,
  Drawer,
  notification,
  Result,
  Button,
  Badge,
} from "antd";
import { isUndefined, isEmpty, first, isArray } from "lodash";
import { SmileOutlined, DoubleRightOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  addDefenseWitnessExaminationPayload,
  updateDefenseWitnessExaminationPayload,
} from "./Payload/defenseWitnessExamination";
import {
  IS_SHO,
  IS_IO,
  getMediaUploadError,
  getPersonDetails,
  masterDataType,
  folderName,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { useDispatch, useSelector } from "react-redux";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import CourtCaseDiaryAction from "@redux/CourtAndProsecution/CourtCaseDiary/action";
import firActions from "@redux/fir/actions";
import { displayFormsInDrawer } from "./const";
import { CourtAndProsecutionWrapper } from "../styles";
import {
  addAppearanceOfAccusedPayload,
  updateAppearanceOfAccusedPayload,
} from "./Payload/appearanceOfAccused";
import { addJugmentPayload, updateJugmentPayload } from "./Payload/jugment";
import moment from "moment";
import {
  addFramingOfChargesPayload,
  updateFramingOfChargesPayload,
} from "./Payload/framingOfCharges";
import {
  add313CrPCExaminationOfAccusedPayload,
  update313CrPCExaminationOfAccusedPayload,
} from "./Payload/313 Cr.P.CExaminationOfAccused";
import {
  addWitnessExaminationPayload,
  updateWitnessExaminationPayload,
} from "./Payload/witnessExamination";
import {
  addArgumentsPayload,
  updateArgumentsPayload,
} from "./Payload/arguments";
import {
  addIoExaminationPayload,
  updateIoExaminationPayload,
} from "./Payload/ioExamination";
import ContentHeader from "./ContentHeader";
import AppearanceOfAccused from "./AppearanceOfAccused";
import FramingOfCharges from "./FramingOfCharges";
import Arguments from "./Arguments";
import Judgement from "./Judgement";
import CRPC313Examination from "./CRPC313Examination";
import DefenceWitnessExamination from "./DefenceWitnessExamination";
import AccusedDisposalFormAction from "@redux/CourtAndProsecution/AccusedDisposalForm/actions.js";
import WitnessExamination from "./WitnessExamination";
import IOExamination from "./IOExamination";
import PrintCCDModal from "./PrintCCDModal";

export default function CourtCaseDiary({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerFormName, setDrawerFormName] = useState("");
  const [drawerFormItem, setDrawerFormItem] = useState({});
  const currentUser = loadState("currentUser");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const [serchText, setSerchText] = useState("");
  const [iODetails, setIODetails] = useState({});
  const [postedFor, setPostedFor] = useState("");
  const [ioPresent, setIOPresent] = useState("");
  const [ppPresent, setPPPresent] = useState("");
  const [defenseCounsel, setDefenseCounsel] = useState("");
  const [rank, setRank] = useState("");
  const [inputList, setInputList] = useState([]);
  const [disble, setdisble] = useState(false);
  const [addAddressDetails, setAddAddressDetails] = useState({});
  const [
    editAppearanceOfAccusedCaseDiaryObj,
    setEditAppearanceOfAccusedCaseDiaryObj,
  ] = useState({});
  const [age, setAge] = useState("");
  const [selectedPerson, setSelectedPerson] = useState({});
  const [selectedAccusedDetails, setSelectedAccusedDetails] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [ccdDate, setccdDate] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [error, setError] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [nextHearing, setNextHearing] = useState(false);
  const [witnessDataSource, setWitnessDataSource] = useState([]);
  const { getAccusedList } = suspectAccusedAction;
  const [trialFor, setTrialFor] = useState("Appearance of Accused");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ioExaminationIoData, setIoExaminationIoData] = useState([]);
  const { fetchWitnessStatementsList } = firActions;
  const { witnessStatementListNew } = useSelector((state) => state.FIR);
  const [ioExaminationAccusedData, setIoExaminationAccusedData] = useState([]);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  // const [evidanceResult, setEvidanceResult] = useState([]);
  const {
    getCourtCaseDiary,
    createCourtCaseDiary,
    updateCourtCaseDiary,
    resetCourtCaseDiaryAction,
  } = CourtCaseDiaryAction;
  const {
    courtCaseDiaryList,
    caseDiaryData,
    isFetching,
    successMessage,
    errorMessage,
    stateSatus,
    actionType,
  } = useSelector((state) => state.CourtCaseDiary);

  const { getAccusedDisposalFormList } = AccusedDisposalFormAction;

  const { accusedDisposalFormList } = useSelector(
    (state) => state.AccusedDisposalForm
  );
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)
  const { staffList } = useSelector((state) => state.MasterData);
  const { getCourtsBasedonPsCode, getStaffList } = masterDataActions;
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    !!editAppearanceOfAccusedCaseDiaryObj?._id || selectedCourtAndProsecution.isCourtDisposal;
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const isSuccess =
    actionType === "ADD_COURT_CASE_DIARY_SUCCESS" ||
    actionType === "UPDATE_COURT_CASE_DIARY_SUCCESS";

  const isError =
    actionType === "ADD_COURT_CASE_DIARY_ERROR" ||
    actionType === "UPDATE_COURT_CASE_DIARY_ERROR";

  const handleReset = () => {
    if (courtCaseDiaryList?.length !== 0) {
      resetStateData();
      dispatch(resetCourtCaseDiaryAction());
      form.resetFields();
      const lastTrialRecord =
        !isEmpty(courtCaseDiaryList) &&
        !isUndefined(courtCaseDiaryList) &&
        isArray(courtCaseDiaryList) &&
        courtCaseDiaryList[courtCaseDiaryList.length - 1];
      const ccd = lastTrialRecord?.dateOfNextHearing
        ? moment(new Date(lastTrialRecord?.dateOfNextHearing))
        : "";
      form.setFieldsValue({
        ccdDate: ccd,
      });
      setTrialDate(ccd);
      const CasePostedForNextHearing =
        !!lastTrialRecord?.isCasePostedForNextHearing &&
          lastTrialRecord?.isCasePostedForNextHearing === "No"
          ? true
          : false;
      setTrialFor(
        CasePostedForNextHearing
          ? lastTrialRecord?.trialFor
          : lastTrialRecord?.postedFor
      );
    }
  };

  useEffect(() => {
    resetStateData();
  }, []);

  const fetchDetails = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getCourtCaseDiary(
        `${config.courtCaseDiary}/all?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}`
      )
    );
    dispatch(
      fetchWitnessStatementsList(
        `${config.getWitnessStatements}/?crimeId=${crimeId}`
      )
    );
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  };

  const getAccusedDetails = () => {
    dispatch(
      getAccusedDisposalFormList(
        `${config.accusedDisposal}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  };

  useEffect(() => {
    fetchDetails();
    getAccusedDetails();
  }, []);

  useEffect(() => {
    if (stateSatus) {
      dispatch(
        getAccusedList(
          `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
        )
      );
    }
  }, [stateSatus]);

  const evidanceResultData = [];
  !isEmpty(witnessStatementListNew) &&
    witnessStatementListNew.forEach((witnessList, i) => {
      evidanceResultData.push({
        isChargeSheet: witnessList?.isChargeSheet,
        statementId: witnessList?._id,
        witnessCode: witnessList?.statementDetails?.witnessCode,
        person: witnessList?.witnessId?._id,
        witnessStatements: witnessList,
        typeOfwitness:
          !isEmpty(witnessList?.statementDetails) &&
            witnessList?.statementDetails?.typeOfWitness
            ? witnessList?.statementDetails?.typeOfWitness
            : "",
        subTypeOfWitness: !isEmpty(witnessList?.statementDetails)
          ? witnessList?.statementDetails?.typeOfWitness === "Panch witness" &&
            !isUndefined(witnessList?.statementDetails?.panchSubTypeOfWitness)
            ? witnessList?.statementDetails?.panchSubTypeOfWitness.join()
            : witnessList?.statementDetails?.subTypeOfWitness
          : "",
      });
    });

  useEffect(() => {
    if (
      !!caseDiaryData
        ? Object.keys(!!caseDiaryData ? caseDiaryData : {})?.length !== 0
        : false
    ) {
      const dateOfTrial = caseDiaryData?.dateOfTrial
        ? moment(new Date(caseDiaryData?.dateOfTrial))
        : "";
      form.setFieldsValue({
        summonsIssuedAccused: caseDiaryData?.isAccusedSummonsIssued,
        ccdDate: dateOfTrial,
        presentIO: caseDiaryData?.isIOPresent,
        presentPP: caseDiaryData?.isPPPresent,
        APPOName: caseDiaryData?.ppName,
        rank: caseDiaryData?.ppRank,
        defenseCounselPresent: caseDiaryData?.isDefenseCounselPresent,
        courtProceedings: caseDiaryData?.courtProceedings,
        postedFor: caseDiaryData?.postedFor,
        isCaseDisposed: caseDiaryData?.isCaseDisposed,
        disposalForAccused: caseDiaryData?.disposalOfAllAccused,
        isCasePostedForNext: caseDiaryData?.isCasePostedForNextHearing,
        reasonForPending: caseDiaryData?.reasonPending,
        argumentsDone: caseDiaryData?.isArgumentsDone,
        argumentsType: caseDiaryData?.isArgumentsType,
        judgementGivenOnSameDay: caseDiaryData?.isJudgementGiven,
        nextHearingDate: !!caseDiaryData?.dateOfNextHearing
          ? moment(new Date(caseDiaryData?.dateOfNextHearing))
          : "",
      });
      setPostedFor(caseDiaryData?.postedFor);
      setTrialFor(caseDiaryData?.trialFor);
      setEditAppearanceOfAccusedCaseDiaryObj({
        ...caseDiaryData,
        ["trialno"]:
          trialFor === "Appearance of Accused" ? 1 : courtCaseDiaryList?.length,
      });
      setTrialDate(dateOfTrial);
    }
  }, [caseDiaryData]);

  const resetStateData = () => {
    setccdDate("");
    setTrialFor("Appearance of Accused");
    setDataSource([]);
    setWitnessDataSource([]);
    setIOPresent("");
    setPPPresent("");
    setDefenseCounsel("");
    setRank("");
    setIoExaminationAccusedData([]);
    setIoExaminationIoData([]);
    setEditAppearanceOfAccusedCaseDiaryObj({});
    setError(false);
  };
  useEffect(() => {
    if (
      courtCaseDiaryList?.length !== 0 &&
      Object.keys(!!caseDiaryData ? caseDiaryData : {})?.length === 0
    ) {
      const lastTrialRecord =
        !isEmpty(courtCaseDiaryList) &&
        !isUndefined(courtCaseDiaryList) &&
        isArray(courtCaseDiaryList) &&
        courtCaseDiaryList[courtCaseDiaryList.length - 1];
      const ccd = lastTrialRecord?.dateOfNextHearing
        ? moment(new Date(lastTrialRecord?.dateOfNextHearing))
        : "";
      setTrialDate(ccd);
      form.setFieldsValue({
        ccdDate: ccd,
      });
      const CasePostedForNextHearing =
        !!lastTrialRecord?.isCasePostedForNextHearing &&
          lastTrialRecord?.isCasePostedForNextHearing === "No"
          ? true
          : false;
      setTrialFor(
        CasePostedForNextHearing
          ? lastTrialRecord?.trialFor
          : lastTrialRecord?.postedFor
      );

      const accusedDetails = [];
      for (let i = 0; i < courtCaseDiaryList?.length; i++) {
        for (
          let j = 0;
          j < courtCaseDiaryList[i]?.accusedDetails?.length;
          j++
        ) {
          if (
            !accusedDetails.some(
              (item) =>
                item?.person?._id ===
                courtCaseDiaryList[i]?.accusedDetails[j]?.person?._id
            )
          ) {
            accusedDetails.push(courtCaseDiaryList[i]?.accusedDetails[j]);
          }
        }
      }
      setSelectedAccusedDetails(accusedDetails);
    } else {
      form.resetFields();
      dispatch(resetCourtCaseDiaryAction());
      setccdDate("");
      setDataSource([]);
      setWitnessDataSource([]);
      setIOPresent("");
      setPPPresent("");
      setDefenseCounsel("");
      setRank("");
      setIoExaminationAccusedData([]);
      setIoExaminationIoData([]);
      setTrialFor("Appearance of Accused");
      setEditAppearanceOfAccusedCaseDiaryObj({});
    }
  }, [courtCaseDiaryList]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        dispatch(resetCourtCaseDiaryAction());
        fetchDetails();
        form.resetFields();
        setTrialFor(nextHearing ? trialFor : postedFor);
        resetStateData();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetCourtCaseDiaryAction());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    if (
      !!values?.nextHearingDate &&
      !!values?.isCasePostedForNext &&
      trialFor !== "Judgement" &&
      trialFor !== "Appearance of Accused"
    ) {
      setFormValid(true);
    }
    if (trialFor === "Judgement") {
      setFormValid(true);
    }
    if (trialFor === "Appearance of Accused") {
      setFormValid(true);
    }
  };

  const accusedData = (item) => {
    const filterSuspectAccusedList = [];
    for (let i = 0; i < suspectAccusedList?.length; i++) {
      const suspectAccusedResult = suspectAccusedList[i];
      if (
        suspectAccusedResult?.person?._id === item?.person &&
        !filterSuspectAccusedList?.some((data) => data?.person === item?.person)
      ) {
        filterSuspectAccusedList.push({
          _id: suspectAccusedResult?._id,
          isIssueOfWarrants: suspectAccusedResult?.isIssueOfWarrants,
          isNoticeToSurety: suspectAccusedResult?.isNoticeToSurety,
          isProclamation: suspectAccusedResult?.isProclamation,
          isArrestByPolice: suspectAccusedResult?.isArrestByPolice,
          person: suspectAccusedResult?.person?._id,
          accusedCode: suspectAccusedResult?.accusedCode,
        });
      }
    }
    const filteredList = first(filterSuspectAccusedList);
    return filteredList;
  };

  const JudgementTrial = (values, dataSource) => {
    let accusedDetails = [];
    values["iODetails"] = { ...iODetails };
    dataSource?.forEach((item) => {
      const filteredList = accusedData(item);
      accusedDetails.push({
        person: item?.person,
        presence: item?.accusedPresence,
        isDefenseCounselPetitionFiled: item?.petitionFiledByDefenseCouncil,
        judgement: values[`judgement_${item?.person}`],
        isIssueOfWarrants: filteredList?.isIssueOfWarrants,
        isNoticeToSurety: filteredList?.isNoticeToSurety,
        isProclamation: filteredList?.isProclamation,
      });
    });
    const addJugmentChargesPayload = addJugmentPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      trialFor
    );
    const updateJugmentChargesPayload = updateJugmentPayload(
      values,
      crimeId,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      editAppearanceOfAccusedCaseDiaryObj?._id
    );
    if (
      editAppearanceOfAccusedCaseDiaryObj &&
      editAppearanceOfAccusedCaseDiaryObj?._id
    ) {
      dispatch(
        updateCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/judgement?crimeId=${crimeId}`,
          updateJugmentChargesPayload
        )
      );
    } else {
      dispatch(
        createCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/judgement?crimeId=${crimeId}`,
          addJugmentChargesPayload
        )
      );
    }
  };

  const Argument = (values, dataSource) => {
    let accusedDetails = [];
    values["iODetails"] = iODetails;
    dataSource?.forEach((item) => {
      const filteredList = accusedData(item);
      accusedDetails.push({
        person: item?.person,
        presence: item?.accusedPresence,
        isDefenseCounselPetitionFiled: item?.petitionFiledByDefenseCouncil,
        isPleadingGuilty: item?.accusedPleadedGuilty,
        isCaseDocumentsFurnished: item?.furnishedToTheAccused,
        isIssueOfWarrants: filteredList?.isIssueOfWarrants,
        isNoticeToSurety: filteredList?.isNoticeToSurety,
        isProclamation: filteredList?.isProclamation,
        statusExamination: item?.examinationStatus,
        judgement: values[`judgement_${item?.person}`],
      });
    });
    const addArgumentsChargesPayload = addArgumentsPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      trialFor
    );
    const updateArgumentsChargesPayload = updateArgumentsPayload(
      values,
      crimeId,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      editAppearanceOfAccusedCaseDiaryObj?._id
    );
    if (
      editAppearanceOfAccusedCaseDiaryObj &&
      editAppearanceOfAccusedCaseDiaryObj?._id
    ) {
      dispatch(
        updateCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/arguments`,
          updateArgumentsChargesPayload
        )
      );
    } else {
      dispatch(
        createCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/arguments`,
          addArgumentsChargesPayload
        )
      );
    }
  };

  const CrPCExaminationOfAccused = (values, dataSource) => {
    if (isEmpty(dataSource) || isUndefined(dataSource)) {
      form.setFields({
        isCaseDisposed: "",
      });
    }

    let accusedPresenceCount = 0;
    dataSource?.forEach((acc) => {
      if (
        accusedDisposalFormList?.some(
          (value) => value?.accusedId?._id === acc.person
        )
      ) {
        accusedPresenceCount = accusedPresenceCount + 1;
      }
    });

    if (
      values?.isCaseDisposed === "Yes" &&
      dataSource.length !== accusedPresenceCount
    ) {
      openNotificationWithIcon(
        "error",
        "Please Fill All Accused Disposal Forms"
      );
    } else {
      let accusedDetails = [];
      values["iODetails"] = iODetails;
      dataSource?.forEach((item) => {
        const filteredList = accusedData(item);
        accusedDetails.push({
          person: item?.person,
          presence: item?.accusedPresence,
          isDefenseCounselPetitionFiled: item?.petitionFiledByDefenseCouncil,
          isPleadingGuilty: item?.accusedPleadedGuilty,
          isCaseDocumentsFurnished: item?.furnishedToTheAccused,
          isIssueOfWarrants: filteredList?.isIssueOfWarrants,
          isNoticeToSurety: filteredList?.isNoticeToSurety,
          isProclamation: filteredList?.isProclamation,
          statusExamination: item?.examinationStatus,
        });
      });
      const addFramingChargesPayload = add313CrPCExaminationOfAccusedPayload(
        values,
        crimeId,
        selectedCourtAndProsecution?.updateChargesheetId,
        selectedCourtAndProsecution?._id,
        accusedDetails,
        !isUndefined(selectedPerson) &&
          Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
          ? getPersonDetails(selectedPerson, inputList)
          : {},
        trialFor
      );

      const updateFramingChargesPayload =
        update313CrPCExaminationOfAccusedPayload(
          values,
          crimeId,
          accusedDetails,
          !isUndefined(selectedPerson) &&
            Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
            ? getPersonDetails(selectedPerson, inputList)
            : {},
          editAppearanceOfAccusedCaseDiaryObj?._id
        );

      if (
        editAppearanceOfAccusedCaseDiaryObj &&
        editAppearanceOfAccusedCaseDiaryObj?._id
      ) {
        dispatch(
          updateCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/313Crpc`,
            updateFramingChargesPayload
          )
        );
      } else {
        dispatch(
          createCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/313Crpc`,
            addFramingChargesPayload
          )
        );
      }
    }
  };

  console.log("accusedDisposalFormList", accusedDisposalFormList);

  const framingOfCharges = (values, dataSource) => {
    if (isEmpty(dataSource) || isUndefined(dataSource)) {
      form.setFields({
        isCaseDisposed: "",
      });
    }

    let accusedPresenceCount = 0;
    dataSource?.forEach((acc) => {
      if (
        accusedDisposalFormList?.some(
          (value) => value?.accusedId?._id === acc.person
        )
      ) {
        accusedPresenceCount = accusedPresenceCount + 1;
      }
    });

    if (
      values?.isCaseDisposed === "Yes" &&
      dataSource.length !== accusedPresenceCount
    ) {
      openNotificationWithIcon(
        "error",
        "Please Fill All Accused Disposal Forms"
      );
    } else {
      let accusedDetails = [];
      values["iODetails"] = iODetails;
      dataSource?.forEach((item) => {
        const filteredList = accusedData(item);
        accusedDetails.push({
          person: item?.person,
          presence: item?.accusedPresence,
          isDefenseCounselPetitionFiled: item?.petitionFiledByDefenseCouncil,
          isPleadingGuilty: item?.accusedPleadedGuilty,
          isCaseDocumentsFurnished: item?.furnishedToTheAccused,
          isIssueOfWarrants: filteredList?.isIssueOfWarrants,
          isNoticeToSurety: filteredList?.isNoticeToSurety,
          isProclamation: filteredList?.isProclamation,
          statusExamination: item?.examinationStatus,
        });
      });
      const addFramingChargesPayload = addFramingOfChargesPayload(
        values,
        crimeId,
        selectedCourtAndProsecution?.updateChargesheetId,
        selectedCourtAndProsecution?._id,
        accusedDetails,
        !isUndefined(selectedPerson) && !isEmpty(selectedPerson)
          ? getPersonDetails(selectedPerson, inputList)
          : {},
        trialFor
      );
      const updateFramingChargesPayload = updateFramingOfChargesPayload(
        values,
        crimeId,
        accusedDetails,
        !isUndefined(selectedPerson) &&
          Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
          ? getPersonDetails(selectedPerson, inputList)
          : {},
        editAppearanceOfAccusedCaseDiaryObj?._id
      );
      if (
        editAppearanceOfAccusedCaseDiaryObj &&
        editAppearanceOfAccusedCaseDiaryObj?._id
      ) {
        dispatch(
          updateCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/framing-of-charges?crimeId=${crimeId}`,
            updateFramingChargesPayload
          )
        );
      } else {
        dispatch(
          createCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/framing-of-charges?crimeId=${crimeId}`,
            addFramingChargesPayload
          )
        );
      }
    }
  };

  const appearanceofAccused = (values, dataSource) => {
    let accusedDetails = [];
    values["iODetails"] = iODetails;
    dataSource?.forEach((item) => {
      const filteredList = accusedData(item);
      accusedDetails.push({
        person: item?.person,
        presence: item?.accusedPresence,
        isDefenseCounselPetitionFiled: item?.petitionFiledByDefenseCouncil,
        isPleadingGuilty: item?.accusedPleadedGuilty,
        isCaseDocumentsFurnished: item?.furnishedToTheAccused,
        isIssueOfWarrants: filteredList?.isIssueOfWarrants,
        isNoticeToSurety: filteredList?.isNoticeToSurety,
        isProclamation: filteredList?.isProclamation,
        statusExamination: "",
      });
    });

    const addAccusedPayload = addAppearanceOfAccusedPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      trialFor
    );
    const updateAccusedPayload = updateAppearanceOfAccusedPayload(
      values,
      crimeId,
      accusedDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      editAppearanceOfAccusedCaseDiaryObj?._id
    );
    if (
      editAppearanceOfAccusedCaseDiaryObj &&
      editAppearanceOfAccusedCaseDiaryObj?._id
    ) {
      dispatch(
        updateCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/appearance-accused`,
          updateAccusedPayload
        )
      );
    } else {
      dispatch(
        createCourtCaseDiary(
          `${config.appearanCourtCaseDiary}/appearance-accused`,
          addAccusedPayload
        )
      );
    }
  };

  const ioExaminationSubmit = async (values) => {
    let isNotUploaded = false;
    if (ioExaminationIoData && Array.isArray(ioExaminationIoData)) {
      for (let i = 0; i < ioExaminationIoData.length; i++) {
        const doc = ioExaminationIoData[i];
        //as we are only uploading one document for one IO
        const file = doc?.statement?.fileList[0]?.originFileObj;
        if (file) {
          let formData = new FormData();
          formData.append("file", file);
          formData.append("prefixFolder", crimeId);
          const folderPath = `${crimeId}${crimeId}${crimeId}/CourtsAndProsecution/IOExamination`;
          formData.append("folderPath", folderPath);
          await axios
            .post(`${config.fileUpload}/upload`, formData)
            .then((res) => {
              if (res?.data?.success) {
                //assigning to doc
                doc.statement = [];
                res?.data?.data?.forEach((ele) => {
                  let n1 = {
                    mimeType: ele.mimeType,
                    name: ele.name,
                    fileId: ele.id,
                  };
                  doc.statement.push(n1);
                });
              }
            })
            .catch((err) => {
              if (err && err?.response?.status === 400) {
                isNotUploaded = true;
                const errorDetails = JSON.parse(
                  err.response?.data?.error.description
                );
                const errorKey = errorDetails?.error?.errorKey;
                openNotificationWithIcon("error", errorKey);
              }
            });
          //deleting antd uploadWitness formats
          delete doc.uploadWitnessStatement;
        }
      }
    }
    const ioExaminationIoDetails = [];
    ioExaminationIoData.forEach((item) => {
      ioExaminationIoDetails.push({
        ioCode: item?.ioCode,
        ioName: item?.ioName,
        ioRank: item?.ioRank,
        ioRole: item?.ioRole,
        ioUnitId: item?.ioUnitId,
        ioMobileNo: item?.ioMobileNo,
        ioEmail: item?.ioEmail,
        presence: item?.ioPresence,
        statusExamination: item?.ioExaminationStatus,
        statusCrossExamination: item?.ioCrossExaminationStatus,
        statement: item?.statement,
      });
    });
    const ioExaminationAccusedDetails = [];
    ioExaminationAccusedData?.forEach((item) => {
      const filteredList = accusedData(item);
      ioExaminationAccusedDetails?.push({
        person: item?.person,
        presence: item?.accusedPresence,
        isDefenseCounselPetitionFiled: item?.isDefenseCounselPetitionFiled,
        isIssueOfWarrants: filteredList?.isIssueOfWarrants,
        isNoticeToSurety: filteredList?.isNoticeToSurety,
        isProclamation: filteredList?.isProclamation,
      });
    });
    const addIoExaminationPayloadData = addIoExaminationPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      ioExaminationAccusedDetails,
      ioExaminationIoDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      trialFor
    );

    const updateIoExaminationPayloadData = updateIoExaminationPayload(
      values,
      crimeId,
      ioExaminationAccusedDetails,
      ioExaminationIoDetails,
      !isUndefined(selectedPerson) &&
        Object.keys(!!selectedPerson ? selectedPerson : {})?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      editAppearanceOfAccusedCaseDiaryObj?._id
    );
    if (!isNotUploaded) {
      if (
        editAppearanceOfAccusedCaseDiaryObj &&
        editAppearanceOfAccusedCaseDiaryObj?._id
      ) {
        dispatch(
          updateCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/io-examination?crimeId=${crimeId}`,
            updateIoExaminationPayloadData
          )
        );
      } else {
        dispatch(
          createCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/io-examination?crimeId=${crimeId}`,
            addIoExaminationPayloadData
          )
        );
      }
    }
  };

  const uploadedFiles = async (uploadwitness) => {
    const uploadFileDetails = [];
    for (let i = 0; i < uploadwitness?.length; i++) {
      const mediaFormData = new FormData();
      mediaFormData.append("file", uploadwitness[i]?.originFileObj);
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append(
        "folderPath",
        `${crimeId}/${folderName.DEFENSE_WITNESS_STATEMENT}/file`
      );
      await axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          if (response.data.success) {
            const { data } = response?.data;
            const payloadData = first(data);
            const payload = {
              mimeType: payloadData.mimeType,
              name: payloadData.name,
              url: payloadData.url,
              fileId: payloadData.id,
            };
            uploadFileDetails.push(payload);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
          setError(true);
        });
    }
    return uploadFileDetails;
  };

  const defenseWitnessExamination = async (
    values,
    dataSource,
    witnessDataSource
  ) => {
    console.log("dataSourceweee", dataSource);
    let accusedDetails = [];
    values["iODetails"] = iODetails;
    dataSource?.forEach((item) => {
      const filteredList = accusedData(item);
      accusedDetails.push({
        person: item?.person,
        presence: item?.accusedPresence,
        isDefenseCounselPetitionFiled: item?.petitionFiledByDefenceCouncil,
        isIssueOfWarrants: filteredList?.isIssueOfWarrants,
        isNoticeToSurety: filteredList?.isNoticeToSurety,
        isProclamation: filteredList?.isProclamation,
      });
    });

    let witnessDetails = [];

    for (let i = 0; i < witnessDataSource?.length; i++) {
      const eachItem = witnessDataSource[i];
      witnessDetails.push({
        name: eachItem?.witnessName,
        fatherName: eachItem?.fatherName,
        gender: eachItem?.gender,
        age: eachItem?.age,
        occupation: eachItem?.occupation,
        address:
          Object.keys(addAddressDetails).length === 0
            ? eachItem?.address
            : addAddressDetails,
        ppExaminationStatus:
          eachItem?.examinationStatus === "Present" ? "Yes" : "No",
        statusDefenseCouncilExamination:
          eachItem?.councilExaminationStatus !== "" ? "Yes" : "No",
        statement: !isEmpty(eachItem?.uploadWitnessStatement)
          ? await uploadedFiles(eachItem?.uploadWitnessStatement)
          : [],
      });
    }

    const addDefensePayload = addDefenseWitnessExaminationPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      accusedDetails,
      selectedPerson,
      trialFor,
      witnessDetails
    );

    const updateDefensePayload = updateDefenseWitnessExaminationPayload(
      values,
      crimeId,
      accusedDetails,
      selectedPerson,
      editAppearanceOfAccusedCaseDiaryObj?._id,
      witnessDetails
    );
    if (!error) {
      if (
        editAppearanceOfAccusedCaseDiaryObj &&
        editAppearanceOfAccusedCaseDiaryObj?._id
      ) {
        dispatch(
          updateCourtCaseDiary(
            `${config.defenseWitnessExamination}?crimeId=${crimeId}`,
            updateDefensePayload
          )
        );
      } else {
        dispatch(
          createCourtCaseDiary(
            `${config.defenseWitnessExamination}?crimeId=${crimeId}`,
            addDefensePayload
          )
        );
      }
    }
  };

  const witnessExamination = async (values, commonPayload) => {
    if (
      editAppearanceOfAccusedCaseDiaryObj &&
      editAppearanceOfAccusedCaseDiaryObj?._id
    ) {
      const updatePayload = await updateWitnessExaminationPayload(
        values,
        staffList,
        selectedPerson,
        inputList,
        commonPayload,
        dataSource,
        witnessDataSource,
        editAppearanceOfAccusedCaseDiaryObj?._id,
        setError,
        accusedData
      );
      if (!error) {
        dispatch(
          updateCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/witness-examination`,
            updatePayload
          )
        );
      }
    } else {
      const addPayload = await addWitnessExaminationPayload(
        values,
        staffList,
        selectedPerson,
        inputList,
        commonPayload,
        dataSource,
        witnessDataSource,
        setError,
        accusedData
      );
      if (!error) {
        dispatch(
          createCourtCaseDiary(
            `${config.appearanCourtCaseDiary}/witness-examination`,
            addPayload
          )
        );
      }
    }
  };

  const submit = async (trial) => {
    const values = await form.validateFields();
    const commonPayload = {
      crimeId: crimeId,
      updateChargesheetId: selectedCourtAndProsecution?.updateChargesheetId,
      chargesheetId: selectedCourtAndProsecution?._id,
    };
    setNextHearing(
      !!values?.isCasePostedForNextHearing &&
        values?.isCasePostedForNextHearing === "No"
        ? true
        : false
    );
    if (trial === "Appearance of Accused") {
      appearanceofAccused(values, dataSource);
    }
    if (trial === "Framing of Charges") {
      framingOfCharges(values, dataSource);
    }
    if (trial === "313 Cr.P.C Examination of Accused") {
      CrPCExaminationOfAccused(values, dataSource);
    }
    if (trial === "Judgement") {
      JudgementTrial(values, dataSource);
    }
    if (trial === "Arguments") {
      Argument(values, dataSource);
    }
    if (trial === "IO Examination") {
      ioExaminationSubmit(values);
    }
    if (trial === "Defense Witness Examination") {
      defenseWitnessExamination(values, dataSource, witnessDataSource);
    }
    if (trial === "Witness Examination") {
      witnessExamination(values, commonPayload);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const generateCCDForm = async () => {
    setIsModalVisible(true);
  };

  const staffMembersList = staffList?.filter(
    (item) => item?.paoCode === briefFacts?.ioAssigned
  );

  const staffListData = staffMembersList.map((item) => {
    const container = {
      ioCode: item?.paoCode,
      ioName: item?.employeeName,
      ioRank: item?.rankName,
      ioRole: item?.empRoleName,
      ioUnitId: item?.cctns_unit_id,
      ioMobileNo: item?.mobileNo,
      ioEmail: !!item?.email ? item?.email : "",
    };
    return container;
  });

  const handelIssueOfSummons = () => {
    setOpenDrawer(true);
    setDrawerFormName("issuedOfSummons");
    setDrawerFormItem({});
    setdisble(!isEmpty(caseDiaryData));
  };

  const displayTrialForms = () => {
    // eslint-disable-next-line default-case
    switch (trialFor) {
      case "Appearance of Accused":
        return (
          <AppearanceOfAccused
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            tableData={setDataSource}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            postedFor={postedFor}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            setTrialDate={setTrialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
          />
        );
      case "Framing of Charges":
        return (
          <FramingOfCharges
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            tableData={setDataSource}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "313 Cr.P.C Examination of Accused":
        return (
          <CRPC313Examination
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            tableData={setDataSource}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "Arguments":
        return (
          <Arguments
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            tableData={setDataSource}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "Judgement":
        return (
          <Judgement
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            tableData={setDataSource}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "Defense Witness Examination":
        return (
          <DefenceWitnessExamination
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            setIODetails={setIODetails}
            selectedPerson={selectedPerson}
            witnessDataSource={witnessDataSource}
            setWitnessDataSource={setWitnessDataSource}
            dataSource={dataSource}
            setDataSource={setDataSource}
            setAddAddressDetails={setAddAddressDetails}
            caseDiaryData={caseDiaryData}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            setPostedFor={setPostedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "Witness Examination":
        return (
          <WitnessExamination
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            caseDiaryData={caseDiaryData}
            dataSource={dataSource}
            setDataSource={setDataSource}
            witnessDataSource={witnessDataSource}
            setWitnessDataSource={setWitnessDataSource}
            setIODetails={setIODetails}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            evidanceResult={evidanceResultData}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            setPostedFor={setPostedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
      case "IO Examination":
        return (
          <IOExamination
            trialFor={trialFor}
            form={form}
            disableForm={disableForm}
            setSelectedPerson={setSelectedPerson}
            age={age}
            setAge={setAge}
            setInputList={setInputList}
            serchText={serchText}
            handleSearch={handleSearch}
            setDrawerFormName={setDrawerFormName}
            setDrawerFormItem={setDrawerFormItem}
            setOpenDrawer={setOpenDrawer}
            staffListData={staffListData}
            ioExaminationIoData={ioExaminationIoData}
            setIoExaminationIoData={setIoExaminationIoData}
            ioExaminationAccusedData={ioExaminationAccusedData}
            setIoExaminationAccusedData={setIoExaminationAccusedData}
            tableData={setDataSource}
            selectedPerson={selectedPerson}
            setPostedFor={setPostedFor}
            caseDiaryData={caseDiaryData}
            checkFields={checkFields}
            selectedAccusedDetails={
              !!editAppearanceOfAccusedCaseDiaryObj?._id === false
                ? selectedAccusedDetails
                : []
            }
            trialDate={trialDate}
            ioPresent={ioPresent}
            setIOPresent={setIOPresent}
            ppPresent={ppPresent}
            setPPPresent={setPPPresent}
            defenseCounsel={defenseCounsel}
            setDefenseCounsel={setDefenseCounsel}
            rank={rank}
            setRank={setRank}
            setdisble={setdisble}
            postedFor={postedFor}
            handelIssueOfSummons={handelIssueOfSummons}
          />
        );
    }
  };

  const displayRibben = () => {
    return (
      <Badge.Ribbon
        text={selectedCourtAndProsecution?.chargesheetNo}
        color="#248C0A"
      />
    );
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Court Case Diary"
        onSubmitClick={() => submit(trialFor)}
        disableButton={disableForm}
        onCancel={() => {
          setSelectedSiderMenu("courtandprosecution");
          form.resetFields();
          resetStateData();
        }}
        onReset={() => handleReset()}
        pastData={courtCaseDiaryList}
        showPastData={
          !isUndefined(courtCaseDiaryList) && !isEmpty(courtCaseDiaryList)
        }
        handleSearch={handleSearch}
        ccdDate={ccdDate}
        setccdDate={setccdDate}
        generateCCDForm={generateCCDForm}
        updateChargesheetId={selectedCourtAndProsecution?.updateChargesheetId}
        isTrialDone={!!trialFor}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          {!!trialFor ? (
            <>
              <CourtAndProsecutionWrapper>
                {openDrawer && (
                  <Drawer
                    placement="right"
                    size="large"
                    width="60%"
                    onClose={() => setOpenDrawer(false)}
                    visible={openDrawer}
                  >
                    {displayFormsInDrawer(
                      drawerFormName,
                      setOpenDrawer,
                      disble,
                      drawerFormItem,
                      getAccusedDetails
                    )}
                  </Drawer>
                )}
                <Card style={{ width: "100%", padding: 10 }}>
                  <Form form={form} colon={false} layout="vertical">
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Row gutter={24}>
                        <Col span={18}>
                          <h6 style={{ fontSize: 18 }}>
                            Trial For: {trialFor}
                          </h6>
                        </Col>
                      </Row>
                      {displayTrialForms()}
                    </Space>
                  </Form>
                </Card>
              </CourtAndProsecutionWrapper>
            </>
          ) : (
            <Card style={{ height: 400 }}>
              <Result
                icon={
                  <SmileOutlined style={{ color: "#258C0B", fontSize: 50 }} />
                }
                style={{ marginTop: 30 }}
                title={
                  <div style={{ display: "inline-flex" }}>
                    <span
                      style={{ fontSize: 16, marginTop: 5, marginRight: 50 }}
                    >
                      Great, Court Case Diary is Completed for Charge Sheet
                      Number
                    </span>
                    <span>{displayRibben()}</span>
                  </div>
                }
                extra={
                  <Button
                    type="primary"
                    className="stepsButtonActive"
                    style={{
                      backgroundColor: "#258C0B",
                      marginLeft: 15,
                      borderColor: "#258C0B",
                    }}
                    onClick={() => setSelectedSiderMenu("courtandprosecution")}
                  >
                    Next
                    <DoubleRightOutlined style={{ marginTop: 3.5 }} />
                  </Button>
                }
              />
            </Card>
          )}
        </>
      )}
      {isModalVisible && (
        <PrintCCDModal
          title="Generate CCD"
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          selectedCourtAndProsecution={selectedCourtAndProsecution}
          setSelectedPerson={setSelectedPerson}
          caseDiaryData={editAppearanceOfAccusedCaseDiaryObj}
        />
      )}
    </ModuleWrapper>
  );
}
