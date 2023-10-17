import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, notification } from "antd";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import { isEmpty, uniqBy, first, isUndefined, isArray } from "lodash";
import interrogationReportActions from "@redux/investigations/interrogationReport/actions";
import ptWarrantActions from "@redux/investigations/ptWarrant/actions";
import firActions from "@redux/fir/actions";
import masterDataActions from "@redux/masterData/actions";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { DoubleRightOutlined } from "@ant-design/icons";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import InterrogationContentHeader from "./InterrogationContentHeader";
import { InterrogationModuleWrapper } from "./styles";
import {
  interrogationReportMenu,
  getHeaderTitle,
  NDPS_ACT_SHORT_CODES,
} from "./const";
import IndividualParticulars from "./IndividualParticulars";
import PhysicalFeatures from "./PhysicalFeatures";
import SocioEconomic from "./SocioEconomic";
import FamilyHistory from "./FamilyHistory";
import AssociateDetails from "./AssociateDetails";
import PeriodOfOffencForm from "./PeriodOfOffencForm";
import LocalContacts from "./LocalContacts";
import RegularHabits from "./RegularHabits";
import IndulganceBeforeOffence from "./IndulganceBeforeOffence";
import ModusOperandi from "./ModusOperandi";
import Shelter from "./Shelter";
import PropertyDisposal from "./PropertyDisposal";
import ShareOfAmountSpent from "./ShareOfAmountSpent";
import CasesConfessed from "./CasesConfessed";
import PtWarrantRegularization from "./PtWarrantRegularization";
import ExecutionOfNBW from "./ExecutionOfNBW";
import PendingNBW from "./PendingNBW";
import Sureties from "./Sureties";
import DefenceCounsel from "./DefenceCounsel";
import JailStayAndAcquintances from "./JailStayAndAcquintances";
import GangFormation from "./GangFormation";
import ConvictionAcquittal from "./ConvictionAcquittal";
import PresentWhereAbouts from "./PresentWhereAbouts";
import UploadInterrogationReport from "./UploadInterrogationReport";
import InterrogationPopUp from "./InterrogationPopUp";
import { subModules } from "./SubModules/const";
import { checkModuleMandatory } from "./SubModules/util";

const { Panel } = Collapse;

const optionType = {
  MAJOR_HEAD: "MAJOR_HEAD",
  MINOR_HEAD: "MINOR_HEAD",
  COURTS: "COURTS",
  JAILS: "JAILS",
  DEFORMITIES: "DEFORMITIES",
};

export default function InterrogationReport({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [editInterrogationObj, setEditInterrogationObj] = useState(null);
  const [viewInterrogationDetails, setViewInterrogationDetails] =
    useState(false);
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [is41ACRPC, setIs41ACRPC] = useState(true);
  const [isArrestRelated, setIsArrestRelated] = useState(false);
  const [interrogationPopUp, SetInterrogationPopUp] = useState(false);
  const [activeKey, setActiveKey] = useState(1);
  const accordElem = useRef(null);
  const crimeId = loadState("selectedFirId");
  const { fetchArrest } = firActions;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const disableButton = selectedAccusedValue === "" || viewInterrogationDetails;
  const { getAccusedList } = suspectAccusedAction;
  const { getPTWarrantList } = ptWarrantActions;
  const {
    getMajorHeadList,
    getMinorHeadList,
    getCourtsName,
    getJailsName,
    getDeformitiesList,
  } = masterDataActions;
  const {
    getInterrogationReportList,
    resetActionType,
    addInterrogationReportDetails,
    updateInterrogationReportDetails,
    deleteInterrogationReport,
  } = interrogationReportActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    successMessage,
    interrogationReportList,
  } = useSelector((state) => state.InterrogationReport);
  const { deformitiesList } = useSelector((state) => state.MasterData);
  const { createAuditHistory } = auditHistoryActions;
  const isSuccess =
    actionType === "ADD_INTERROGATION_REPORT_SUCCESS" ||
    actionType === "DELETE_REPORTS_SUCCESS" ||
    actionType === "UPDATE_INTERROGATION_REPORT_SUCCESS" ||
    actionType === "UPDATE_PERSON_MEDIA_SUCCESS";

  const isError =
    actionType === "ADD_INTERROGATION_REPORT_ERROR" ||
    actionType === "UPDATE_INTERROGATION_REPORT_ERROR" ||
    actionType === "DELETE_REPORTS_ERROR" ||
    actionType === "UPDATE_PERSON_MEDIA_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  console.log(is41ACRPC, "        onSearch={onSearch}  ");
  const getDeformitiesTypeList = () => {
    let arr = [];
    deformitiesList &&
      !isEmpty(deformitiesList) &&
      deformitiesList.map((item) => {
        const result = {
          label: item?.type,
          _id: item?._id,
        };
        arr.push(result);
      });
    return uniqBy(arr, "label");
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_INTERROGATION_REPORT_SUCCESS"
        ? "Interrogation Report Created"
        : "Interrogation Report Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/interrogationReport",
          auditType
        )
      )
    );
  };

  const handleMenuChange = (val) => {
    if (!accordElem.current) return;
    accordElem.current.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
    });
    setActiveKey(val);
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getDeformitiesList(`${url}/${optionType.DEFORMITIES}`));
    dispatch(getMajorHeadList(`${url}/${optionType.MAJOR_HEAD}`));
    dispatch(getMinorHeadList(`${url}/${optionType.MINOR_HEAD}`));
    dispatch(getCourtsName(`${config.getMasterData}/${optionType.COURTS}`));
    dispatch(getJailsName(`${url}/${optionType.JAILS}`));
  }, []);

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetchOtherList = () => {
    dispatch(getPTWarrantList(`${config.ptWarrant}?crimeId=${crimeId}`));
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
  };

  const fetchInterrogationReportList = () => {
    dispatch(
      getInterrogationReportList(`${config.interrogation}?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setViewInterrogationDetails(false);
        fetchInterrogationReportList();
        fetchAccusedList();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchAccusedList();
    fetchInterrogationReportList();
    fetchOtherList();
  }, []);

  function onSearch(val) {
    console.log("search:", val);
  }
  const handleEditInterrogation = (value) => {
    if (value) {
      console.log(value, "value");
      setEditInterrogationObj(value);
      setSelectedAccusedValue(value.person);
    }
  };

  const onGoingInterrogation =
    !isEmpty(interrogationReportList) &&
    isArray(interrogationReportList) &&
    first(
      interrogationReportList.filter((s) => s.person === selectedAccusedValue)
    );

  const showNotificationMessage = () => {
    let messages = [];
    if (isEmpty(onGoingInterrogation) || isUndefined(onGoingInterrogation)) {
      messages.push("Please Fill Mandatory Sections");
    } else {
      const photographs = onGoingInterrogation?.photographs;
      const familyHistory = onGoingInterrogation?.familyHistory;
      const regularHabits = onGoingInterrogation?.regularHabits;
      const socioEconomic = onGoingInterrogation?.socioEconomic;
      // socio Economic Profile
      if (
        (isUndefined(socioEconomic) || socioEconomic.livingStatus === "") &&
        is41ACRPC
      ) {
        messages.push("Please Fill Socio Economic Details");
      }
      // family history
      if (isUndefined(familyHistory) || familyHistory.length === 0) {
        messages.push("Please Fill Family history Details");
      }
      // regular Habits
      if (
        (isUndefined(regularHabits) || regularHabits.length === 0) &&
        is41ACRPC
      ) {
        messages.push("Please Fill Regular Habits Details");
      }
      //upload Documents
      if (isUndefined(photographs) || photographs?.length === 0) {
        messages.push("Please Upload Interrogation Reports");
      }
      if (isNDPS) {
        const NDPSMessages = checkModuleMandatory(onGoingInterrogation);
        messages = messages.concat(NDPSMessages);
      }
    }
    return messages;
  };

  const isNDPS = useMemo(() => {
    const { uniqActs = [] } = loadState("selectedActDetails") || {};
    return uniqActs.some(({ accShortName }) =>
      NDPS_ACT_SHORT_CODES.some((shortCode) => shortCode === accShortName)
    );
  }, []);

  return (
    <InterrogationModuleWrapper>
      <InterrogationContentHeader
        headerTitle="Interrogation Report"
        onSubmitClick={() => {
          const messages = showNotificationMessage();
          messages.length === 0
            ? setSelectedSiderMenu("investigation")
            : openNotificationWithIcon("error", messages.join("\n"));
        }}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        handleMenuChange={handleMenuChange}
        menuList={interrogationReportMenu}
        onSearch={onSearch}
        SetInterrogationPopUp={SetInterrogationPopUp}
        selectedAccusedValue={selectedAccusedValue}
        isInterrogationInitiated={
          !isEmpty(interrogationReportList) && onGoingInterrogation
        }
      />
      {isFetching ? (
        <Loader />
      ) : (
        <div ref={accordElem}>
          <InterrogationPopUp
            interrogationPopUp={interrogationPopUp}
            SetInterrogationPopUp={SetInterrogationPopUp}
            selectedRecord={onGoingInterrogation}
            selectedAccusedValue={selectedAccusedValue}
            suspectAccusedList={suspectAccusedList}
          />
          <Collapse
            accordion
            defaultActiveKey={[1]}
            activeKey={[activeKey]}
            expandIconPosition={"right"}
            expandIcon={({ isActive }) => (
              <DoubleRightOutlined rotate={isActive ? 90 : 0} />
            )}
            onChange={setActiveKey}
          >
            <div className="ant-collapse-item panelHeader">
              <div className="headerTextContainer ant-collapse-header">
                <div className="panelTitle">
                  Individual Particulars <span style={{ color: "red" }}>*</span>
                </div>
              </div>
              <IndividualParticulars
                selectedAccusedValue={selectedAccusedValue}
                setSelectedAccusedValue={setSelectedAccusedValue}
                editDetails={handleEditInterrogation}
                setViewDetails={setViewInterrogationDetails}
                selectedRecord={onGoingInterrogation}
                suspectAccusedList={suspectAccusedList}
                viewInterrogationDetails={viewInterrogationDetails}
                interrogationReportList={interrogationReportList}
                addPersonAction={() => setSelectedSiderMenu("suspectAccused")}
                setEditInterrogationObj={setEditInterrogationObj}
                disabled={disableButton}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
                selectedObjId={onGoingInterrogation?._id}
                setIs41ACRPC={setIs41ACRPC}
                setIsArrestRelated={setIsArrestRelated}
              />
            </div>
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Physical Features",
                  setActiveKey,
                  "2",
                  false
                )}
                key="2"
              >
                <PhysicalFeatures
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.physicalFeatures}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                  getDeformitiesTypeList={getDeformitiesTypeList}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Socio / Economic Profile",
                  setActiveKey,
                  "3",
                  true
                )}
                key="3"
              >
                <SocioEconomic
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.socioEconomic}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            <Panel
              className="panelHeader"
              header={getHeaderTitle("Family History", setActiveKey, "4", true)}
              key="4"
            >
              <FamilyHistory
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.familyHistory}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
              />
            </Panel>
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Relationship With Other Associates / Gang Members And Friends",
                  setActiveKey,
                  "5",
                  false
                )}
                key="5"
              >
                <AssociateDetails
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.associateDetails}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                  validationFields={["Relationship", "Gang"]}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Commission Of Offence",
                  setActiveKey,
                  "6",
                  false
                )}
                key="6"
              >
                <PeriodOfOffencForm
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.periodOfOffence}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                  validationCommisionOfOffence={true}
                />
              </Panel>
            ) : null}
            <Panel
              className="panelHeader"
              header={getHeaderTitle(
                "Local Contacts / Facilitators",
                setActiveKey,
                "7",
                false
              )}
              key="7"
            >
              <LocalContacts
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.localContacts}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
                editInterrogationObj={editInterrogationObj}
              />
            </Panel>
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Regular Habits",
                  setActiveKey,
                  "8",
                  true
                )}
                key="8"
              >
                <RegularHabits
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Indulgence Before Offence",
                  setActiveKey,
                  "9",
                  false
                )}
                key="9"
              >
                <IndulganceBeforeOffence
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.indulganceBeforeOffence}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Modus Operandi",
                  setActiveKey,
                  "10",
                  false
                )}
                key="10"
              >
                <ModusOperandi
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.modusOperandiList}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                  validationFieldsStatus={true}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle("Shelter", setActiveKey, "11", false)}
                key="11"
              >
                <Shelter
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.shelter}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Disposal Of Property",
                  setActiveKey,
                  "12",
                  false
                )}
                key="12"
              >
                <PropertyDisposal
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.propertyDisposal}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                  suspectAccusedList={suspectAccusedList}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "How his Share Of Amount Spent",
                  setActiveKey,
                  "13",
                  false
                )}
                key="13"
              >
                <ShareOfAmountSpent
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.shareOfAmount}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {/*                                                                       */}
            <Panel
              className="panelHeader"
              header={getHeaderTitle(
                "Previous Offences Confessed",
                setActiveKey,
                "14",
                false
              )}
              key="14"
            >
              <CasesConfessed
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.casesConfessed}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
              />
            </Panel>
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Regularization of Transit Warrant",
                  setActiveKey,
                  "15",
                  false
                )}
                key="15"
              >
                <PtWarrantRegularization
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.ptWarrantRegularization}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Execution of NBW",
                  setActiveKey,
                  "16",
                  false
                )}
                key="16"
              >
                <ExecutionOfNBW
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.executionNBW}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Pending NBW",
                  setActiveKey,
                  "17",
                  false
                )}
                key="17"
              >
                <PendingNBW
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.pendingNBW}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle("Sureties", setActiveKey, "18", false)}
                key="18"
              >
                <Sureties
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.sureties}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Defence Counsel",
                  setActiveKey,
                  "19",
                  false
                )}
                key="19"
              >
                <DefenceCounsel
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.defenceCounsel}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "Jail Sentence & Acquaintances",
                  setActiveKey,
                  "20",
                  false
                )}
                key="20"
              >
                <JailStayAndAcquintances
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.jailStay}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            {is41ACRPC ? (
              <Panel
                className="panelHeader"
                header={getHeaderTitle(
                  "New Gang Formation",
                  setActiveKey,
                  "21",
                  false
                )}
                key="21"
              >
                <GangFormation
                  disabled={disableButton}
                  selectedAccused={selectedAccusedValue}
                  selectedObjId={onGoingInterrogation?._id}
                  selectedRecord={onGoingInterrogation?.gangFormation}
                  disableForm={viewInterrogationDetails}
                  addDetails={addInterrogationReportDetails}
                  updateDetails={updateInterrogationReportDetails}
                />
              </Panel>
            ) : null}
            <Panel
              className="panelHeader"
              header={getHeaderTitle(
                "Conviction / Acquittal",
                setActiveKey,
                "22",
                false
              )}
              key="22"
            >
              <ConvictionAcquittal
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.convictionAcquittal}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
              />
            </Panel>

            {/*                                           */}
            <Panel
              className="panelHeader"
              header={getHeaderTitle(
                "Present Whereabouts",
                setActiveKey,
                "23",
                false
              )}
              key="23"
            >
              <PresentWhereAbouts
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.presentWhereAbouts}
                disableForm={viewInterrogationDetails}
                addDetails={addInterrogationReportDetails}
                updateDetails={updateInterrogationReportDetails}
              />
            </Panel>
            {/*                                        */}

            {isNDPS
              ? subModules.map((subModule) => {
                  const { Component } = subModule;
                  return (
                    <Panel
                      className="panelHeader"
                      header={getHeaderTitle(
                        subModule?.title,
                        setActiveKey,
                        subModule?.key,
                        subModule?.isRequired
                      )}
                      key={subModule?.key}
                    >
                      <Component
                        isViewOnlyMode={disableButton}
                        selectedAccused={selectedAccusedValue}
                        selectedInterrogation={onGoingInterrogation}
                      />
                    </Panel>
                  );
                })
              : null}
            <Panel
              className="panelHeader"
              header={getHeaderTitle(
                "Upload Interrogation Report",
                setActiveKey,
                "24",
                true
              )}
              key="24"
            >
              <UploadInterrogationReport
                disabled={disableButton}
                selectedAccused={selectedAccusedValue}
                selectedObjId={onGoingInterrogation?._id}
                selectedRecord={onGoingInterrogation?.photographs}
                addDetails={addInterrogationReportDetails}
                deleteInterrogationReport={deleteInterrogationReport}
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </InterrogationModuleWrapper>
  );
}
