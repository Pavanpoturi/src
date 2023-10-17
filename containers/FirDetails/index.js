import { useState, useEffect, useMemo } from "react";
import { Layout } from "antd";
import moment from "moment";
import { isEmpty, first, isUndefined, isNull } from "lodash";
import { config } from "@config/site.config";
import { useSelector, useDispatch } from "react-redux";
import firActions from "@redux/fir/actions";
import createFIRActions from "@redux/createFir/actions";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import CustomTopbar from "../CustomTopbar";
import { FirDetailsContainer } from "./FirDetails.styles";
import FirDetailFormsContent from "./FirDetailFormsContent";
import { siderMenu } from "./Constants";
import { HIgherSHOsiderMenu } from "./Constants";
import {
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
  DATE_FORMAT,
  getSectionsData,
  showPSName,
} from "@containers/FirDetails/fir-util";
import CourtDisposalFormAction from "@redux/CourtAndProsecution/CourtDisposalForm/actions.js";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import CourtCaseDiaryAction from "@redux/CourtAndProsecution/CourtCaseDiary/action";
import advisoryActions from "@redux/advisoryMemo/actions";

const { Content, Sider } = Layout;
const {
  updateDashboardTopBar,
  fetchComplainantList,
  fetchCrimeClassification,
} = firActions;
const { getFIRData } = createFIRActions;

export default function FirDetails() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const { chargeSheetData } = useSelector((state) => state.ChargeSheetData);
  const selectedFir = loadState("selectedFir");
  const crimeId = loadState("selectedFirId");
  const { courtDisposalFormList } = useSelector(
    (state) => state.CourtDisposalForm
  );
  const { isPersnolized } = useSelector((state) => state.Dashboard);
  const { resetCourtCaseDiaryAction } = CourtCaseDiaryAction;
  const { getCourtDisposalFormList } = CourtDisposalFormAction;
  const { getChargesheetList } = chargesheetActions;
  const { getNotificationTo, getCrimeAdvisory } = advisoryActions;
  const Chargesheet = useSelector((state) => state.Chargesheet);
  const iscourtAndProsecutionVisible = loadState(
    "iscourtAndProsecutionVisible"
  );
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const isCourt = loadState("isCourt");
  const selectedFirPsCode = loadState("selectedFir");
  const selectedActsData = loadState("selectedActDetails");
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const [selectedSiderMenu, setSelectedSiderMenu] = useState("preCrimeScene");
  const { crimeclassification, crimeclassification_ } = useSelector(
    (state) => state.FIR
  );
  const [selectedInvestigationFormObj, setSelectedInvestigationFormObj] =
    useState("");

  const {
    firNum,
    actsAndSections,
    majorMinorClassification,
    district,
    psName,
    crimeType,
    occurenceOfOffence,
  } = !isUndefined(selectedFir) && selectedFir;
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const isIo = storedUser?.isIo;
  const getSiderMenu =
    !userRole?.includes(activeUser?.ecopsv2_role) &&
    !!isIo === false &&
    !!isPersnolized === false
      ? HIgherSHOsiderMenu
      : siderMenu;

  const getDateOfOffence = () => {
    let date = "";
    const dateOfOffence =
      !isUndefined(selectedFir?.occurenceOfOffence) &&
      selectedFir?.occurenceOfOffence;
    if (
      !isUndefined(dateOfOffence?.fromDate) &&
      !isNull(dateOfOffence?.fromDate) &&
      !isUndefined(dateOfOffence?.toDate) &&
      !isNull(dateOfOffence?.toDate)
    ) {
      date = moment(dateOfOffence?.toDate).format(DATE_FORMAT);
    } else if (
      !isUndefined(dateOfOffence?.toDate) &&
      !isNull(dateOfOffence?.toDate)
    ) {
      date = moment(dateOfOffence?.toDate).format(DATE_FORMAT);
    } else if (
      !isUndefined(dateOfOffence?.fromDate) &&
      !isNull(dateOfOffence?.fromDate)
    ) {
      date = moment(dateOfOffence?.fromDate).format(DATE_FORMAT);
    } else if (
      !isUndefined(dateOfOffence?.priorToDate) &&
      !isNull(dateOfOffence?.priorToDate)
    ) {
      date = moment(dateOfOffence?.priorToDate).format(DATE_FORMAT);
    } else {
      date = "";
    }
    return date;
  };

  useEffect(() => {
    dispatch(updateDashboardTopBar(true));
    dispatch(resetCourtCaseDiaryAction());
    dispatch(
      getNotificationTo(
        `${config.getNotificationTo}?ps_code=${selectedFirPsCode?.psCode}&emp_role_name=${storedUser?.emp_role_name}`
      )
    );
    dispatch(getCrimeAdvisory(`${config.getCrimeAdvisory}?crimeId=${crimeId}`));
    dispatch(
      getCourtDisposalFormList(`${config.CourtDisposal}?crimeId=${crimeId}`)
    );
    dispatch(getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`));
    dispatch(
      fetchComplainantList(
        `${config.getPostCrimeSceneDetails}/COMPLAINANT/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchCrimeClassification(
        `${config.getPostCrimeSceneDetails}/CLASSIFICATION?crimeId=${crimeId}`
      )
    );
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
    if (
      !userRole?.includes(activeUser?.ecopsv2_role) &&
      !iscourtAndProsecutionVisible &&
      !!isIo === false &&
      !!isPersnolized === false
    ) {
      setSelectedSiderMenu("miniInvestigatinReport");
    } else if (iscourtAndProsecutionVisible) {
      setSelectedSiderMenu("courtandprosecution");
      localStorage.setItem("isCourt", true);
    } else {
      setSelectedSiderMenu("preCrimeScene");
      localStorage.setItem("isCourt", false);
    }
  }, []);

  const [majorHead, minorHead, classification] = useMemo(() => {
    let classification = "",
      majorHead = "",
      minorHead = "";
    // when present in crime scene change according to selected "scene of offence".
    // when present in other screens, show latest "scene of offence" data.
    // by default show local storage data(no "scene of offence" is present)

    //Classification Type
    if (
      !isEmpty(crimeclassification_?.classification) &&
      selectedSiderMenu === "crimeScene" &&
      !savedFir.isAlteration
    )
      classification = crimeclassification_?.classification;
    else if (
      !isEmpty(crimeclassification?.classification) &&
      !savedFir.isAlteration
    )
      classification = crimeclassification?.classification;
    else if (!isEmpty(crimeType)) classification = crimeType;

    // MajorHead
    if (
      !isEmpty(crimeclassification_?.majorHead) &&
      selectedSiderMenu === "crimeScene" &&
      !savedFir.isAlteration
    )
      majorHead = crimeclassification_?.majorHead;
    else if (!isEmpty(crimeclassification?.majorHead) && !savedFir.isAlteration)
      majorHead = crimeclassification?.majorHead;
    else if (!isEmpty(majorMinorClassification))
      majorHead = first(majorMinorClassification)?.majorHead;

    // MinorHead
    if (
      !isEmpty(crimeclassification_?.minorHead) &&
      selectedSiderMenu === "crimeScene" &&
      !savedFir.isAlteration
    )
      minorHead = crimeclassification_?.minorHead;
    else if (!isEmpty(crimeclassification?.minorHead) && !savedFir.isAlteration)
      minorHead = crimeclassification?.minorHead;
    else if (!isEmpty(majorMinorClassification))
      minorHead = first(majorMinorClassification)?.minorHead;
    return [majorHead, minorHead, classification];
  }, [crimeclassification, crimeclassification_, selectedSiderMenu, savedFir]);
  const headerData = [
    {
      value: firNum,
      title: "FIR Number",
    },
    {
      value: !isEmpty(actsAndSections)
        ? getSectionsData(selectedActsData?.uniqActs)
        : selectedFir?.section,
      title: "Section of Law",
    },
    {
      value: district,
      title: "Unit Name",
    },
    {
      value: savedFir?.caseStatus,
      title: "Status",
    },
    {
      value: psName !== "" && showPSName(psName),
      title: "PS Name",
    },
    {
      value: moment(occurenceOfOffence?.firDate).format(DATE_FORMAT),
      title: "Date of Report",
    },
    {
      value: getDateOfOffence(),
      title: "Date of Offence",
    },
    {
      // value: isUndefined(crimeType)
      //   ? selectedFir?.crimeClassification
      //   : crimeType,
      value: classification,
      title: "Crime Classification",
    },
    {
      value: majorHead,
      title: "Major Head",
    },
    {
      value: minorHead,
      title: "Minor Head",
    },
  ];

  const courtAndProsecutionHeaderData = [
    {
      value: firNum,
      title: "FIR Number",
    },
    {
      value: !isEmpty(actsAndSections)
        ? getSectionsData(selectedActsData?.uniqActs)
        : selectedFir?.section,
      title: "Section of Law",
    },
    {
      value: savedFir?.isChargeSheetGenerated
        ? savedFir?.caseStatus
        : selectedCaseStatus,
      title: "Status",
    },
    {
      value: district,
      title: "District",
    },
    {
      value: psName !== "" && showPSName(psName),
      title: "PS Name",
    },
    {
      value: selectedCourtAndProsecution?.chargesheetNo,
      title: "Charge Sheet No",
    },
    {
      value: moment(selectedCourtAndProsecution?.chargesheetDate).format(
        DATE_FORMAT
      ),
      title: "Charge Sheet Date",
    },
    {
      value:
        !isUndefined(chargeSheetData?.caseType) &&
        !isEmpty(chargeSheetData?.caseType)
          ? chargeSheetData?.caseType
          : selectedCourtAndProsecution?.caseType,
      title: "Case Type",
    },
    {
      value: !isEmpty(chargeSheetData?.courtCaseNo)
        ? chargeSheetData?.courtCaseNo
        : selectedCourtAndProsecution?.courtCaseNo,
      title: "Court Case No",
    },
    {
      value: !isEmpty(chargeSheetData?.courtName)
        ? chargeSheetData?.courtName
        : selectedCourtAndProsecution?.courtName,
      title: "Name Of The Court",
    },
  ];

  const displaySiderItems = () => {
    return getSiderMenu.map((item, index) => {
      return item?.value !== "courtandprosecution" ? (
        <div
          className={
            selectedSiderMenu === item.value
              ? "siderItems"
              : "siderItemDisabled"
          }
          key={index}
          onClick={() => {
            if (item?.value !== "planOfAction") {
              if (item?.value === "courtandprosecution") {
                if (iscourtAndProsecutionVisible === true) {
                  localStorage.setItem("isCourt", true);
                  setSelectedSiderMenu(item.value);
                }
              } else if (item?.value !== "viewFir") {
                setSelectedSiderMenu(item.value);
                setIsModalVisible(false);
              } else {
                localStorage.setItem("isCourt", false);
                setSelectedSiderMenu(item.value);
                setIsModalVisible(true);
              }
            }
          }}
          style={{
            marginBottom: 10,
            cursor:
              item?.value === "planOfAction" ||
              (iscourtAndProsecutionVisible === false &&
                item?.value === "courtandprosecution")
                ? "not-allowed"
                : "pointer",
          }}
        >
          {item.name}
        </div>
      ) : item?.value === "courtandprosecution" &&
        iscourtAndProsecutionVisible === true ? (
        <div
          className={
            selectedSiderMenu === item.value
              ? "siderItems"
              : "siderItemDisabled"
          }
          key={index}
          onClick={() => {
            if (item?.value !== "planOfAction") {
              if (item?.value === "courtandprosecution") {
                if (iscourtAndProsecutionVisible === true) {
                  localStorage.setItem("isCourt", true);
                  setSelectedSiderMenu(item.value);
                }
              } else {
                localStorage.setItem("isCourt", false);
                setSelectedSiderMenu(item.value);
              }
            }
          }}
          style={{
            marginBottom: 10,
            cursor:
              item?.value === "planOfAction" ||
              (iscourtAndProsecutionVisible === false &&
                item?.value === "courtandprosecution")
                ? "not-allowed"
                : "pointer",
          }}
        >
          {item.name}
        </div>
      ) : null;
    });
  };

  return (
    <FirDetailsContainer>
      <Layout>
        <Content className="content">
          <CustomTopbar
            headerData={
              !!isCourt === false ? headerData : courtAndProsecutionHeaderData
            }
          />
          <Layout
            className="site-layout-background layout"
            style={{ marginTop: 30 }}
          >
            <Sider className="site-layout-background" width={225}>
              <div className="siderContainer">{displaySiderItems()}</div>
            </Sider>
            <Content className="contentContainer">
              <FirDetailFormsContent
                selectedSiderMenu={selectedSiderMenu}
                setSelectedSiderMenu={setSelectedSiderMenu}
                selectedInvestigationFormObj={selectedInvestigationFormObj}
                setSelectedInvestigationFormObj={
                  setSelectedInvestigationFormObj
                }
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
              />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </FirDetailsContainer>
  );
}
