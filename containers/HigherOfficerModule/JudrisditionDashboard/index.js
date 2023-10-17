import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { config } from "@config/site.config";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import { isEmpty, isUndefined, isArray, isPlainObject, isString } from "lodash";
import { variables } from "@assets/styles/variables";
import { Row, Col, Layout } from "antd";
import WidgetsWrapper from "@containers/Widgets/WidgetsWrapper";
import StickerWidget from "@containers/Widgets/Sticker/StickerWidget";
import firActions from "@redux/fir/actions";
import dashboardActions from "@redux/dashboard/actions";
import DashboardIndex from "./JudrisditionDashboard";
import FilterComponent from "../../Reports/DSRReports/FilterComponent";
import {
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "../../FirDetails/fir-util";
import { TEMPLATE_LOGO_PNG_ID } from "@lib/helpers/utility";
import SimpleFilter from "../SharedComponents/SimpleFilter";

const {
  fetchHigherFIRList,
  fetchFIRList,
  updateSelectedWidget,
  getselectedYear,
} = firActions;
const { Header, Content } = Layout;

export default function JudrisditionDashboard() {
  const [isPersnolizedView, setIsPersonlizedView] = useState(false);
  const [psCode, setPsCode] = useState("");
  const fileId = TEMPLATE_LOGO_PNG_ID;
  const { currentUser } = useSelector((state) => state.Auth);
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const { fetchCaseCountList } = dashboardActions;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const isSimpleFilter = selectedDashboard === "myPersonalInvestigation";
  const dispatch = useDispatch();
  const {
    selectedWidgetStatus,
    higherfirList,
    updatedPsCode,
    dropDownData,
    isFetching,
    betweenDates,
  } = useSelector((state) => state.FIR);
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psData =
    isEmpty(updatedPsCode) || isUndefined(updatedPsCode)
      ? getpsCode
      : updatedPsCode;
  useEffect(() => {
    const datesParms = getDatesParms();
    let ps_code;
    if (storedUser?.isPersnolized === true) {
      ps_code = activeUser?.cctns_unit_id;
      setPsCode(ps_code);
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?&userName=${activeUser?.pao_code}&psCode=${ps_code}&higherOfficer=true${datesParms}`
        )
      );
    } else if (!!storedUser?.isPersnolized === false) {
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?psCode=${psData}&caseStatus=${selectedWidgetStatus}&higherOfficer=true${datesParms}`
        )
      );
    }
  }, [storedUser?.isPersnolized]);

  useEffect(() => {
    getCaseDetails("Total Cases");
  }, [storedUser?.isPersnolized]);
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;

  const dashboardStatsTransform =
    higherfirList &&
    higherfirList?.data?.length > 0 &&
    higherfirList?.data?.map(function (item) {
      let fontColor = "";
      let key = "";
      let title = "";
      // eslint-disable-next-line default-case
      switch (item.caseStatus) {
        case "New":
          fontColor = "#349F30";
          key = "new-firs";
          title = "NEW FIR ASSIGNED";
          //  item?.caseCount > 1 ? "Newly ASSIGNED FIR(s)" : "Newly ASSIGNED FIR";
          break;
        case "UI Cases":
          fontColor = "#D69B24";
          key = "ui-cases";
          title = "UI CASES";
          break;
        case "CC Nos Awaited":
          fontColor = "#0081CC";
          key = "cc-nos-awaited";
          title = "CC Nos AWAITED";
          break;
        case "Disposal":
          fontColor = "#0081CC";
          key = "disposed";
          title = "DISPOSAL";
          break;
        case "PT Cases":
          fontColor = "#D69B24";
          key = "pt-cases";
          title = "PT CASES";
          break;
        case "Trial of Cases for the day":
          fontColor = "#0081CC";
          key = "trial-of-cases";
          title = "TRIAL OF CASES FOR THE DAY";
          break;
        case "Total Cases":
          fontColor = "#0081CC";
          key = "total-cases";
          title = "TOTAL CASES";
          break;
        case "Zero FIRs":
          fontColor = "#349F30";
          key = "zeroCases";
          title = "ZERO FIRS";
      }
      return {
        key: key,
        title: title,
        caseStatus: item.caseStatus,
        value: item.caseCount,
        fontColor: fontColor,
        bgColor: variables.WHITE_COLOR,
      };
    });
  const getCaseMetricsList = () => {
    let arr = [];
    arr.push(dashboardStatsTransform[5]);
    arr.push(dashboardStatsTransform[1]);
    arr.push(dashboardStatsTransform[0]);
    arr.push(dashboardStatsTransform[2]);
    arr.push(dashboardStatsTransform[4]);
    arr.push(dashboardStatsTransform[3]);
    arr.push(dashboardStatsTransform[10]);
    arr.push(dashboardStatsTransform[11]);
    return arr;
  };
  // const handlePersnolizedView = (data) => {
  //   setIsPersonlizedView(data);
  // };
  const getDatesParms = (dates = null) => {
    dates = !isEmpty(dates) && isPlainObject(dates) ? dates : betweenDates;
    const { fromDate = null, toDate = null } =
      !isEmpty(dates) && isPlainObject(dates) ? dates : {};

    return (!isEmpty(fromDate) || fromDate === "") && !isEmpty(toDate)
      ? `&fromDate=${fromDate}&toDate=${toDate}`
      : "";
  };

  const getCaseDetails = (caseStatus, dates = null) => {
    const paoCode = activeUser?.pao_code;
    const firType = caseStatus === "Zero FIRs" ? "Zero" : "Regular";

    let datesParms;
    if (isString(dates)) datesParms = "&" + dates;
    else datesParms = getDatesParms(dates);

    const baseUrl = config.getRecentFirList;
    const HigherSHOBaseUrl = `${baseUrl}/?psCode=${psData}&caseStatus=${caseStatus}&firType=${firType}${datesParms}`;
    const nonSHOBaseUrl = `${baseUrl}/?userName=${paoCode}&psCode=${activeUser?.cctns_working_unit_id}&firType=${firType}&caseStatus=${caseStatus}${datesParms}`;
    localStorage.setItem("selectedCaseStatus", caseStatus);
    dispatch(updateSelectedWidget(caseStatus));
    let url;
    if (storedUser?.isPersnolized === true || IS_SHO_USER) {
      url = nonSHOBaseUrl;
    } else {
      url = `${HigherSHOBaseUrl}&higherOfficer=true`;
    }
    if (caseStatus === "New") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "UI Cases") {
      if (!IS_SHO_USER) {
        dispatch(fetchFIRList(`${url}&isDraft=${false}`));
      } else if (IS_SHO_USER) {
        dispatch(fetchFIRList(`${url}&isDraft=${false}`));
      }

      if (storedUser?.isPersnolized === false) {
        dispatch(
          fetchCaseCountList(
            `${config.getCasesCountByYear}/?psCode=${psData}&caseStatus=${caseStatus}&isDraft=false`
          )
        );
      }
    } else if (caseStatus === "Disposal") {
      if (storedUser?.isPersnolized === false) {
        dispatch(fetchFIRList(`${url}&isDraft=${false}`));
        dispatch(
          fetchCaseCountList(
            `${config.getCasesCountByYear}/?psCode=${psData}&caseStatus=${caseStatus}&isDraft=false`
          )
        );
      } else {
        dispatch(fetchFIRList(`${url}&isDraft=${false}`));
      }
    } else if (caseStatus === "Total Cases") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "Zero FIRs") {
      if (storedUser?.isPersnolized === false || IS_SHO_USER) {
        let url = `${baseUrl}/?psCode=${psData}&isDraft=${false}&firType=${firType}&higherOfficer=true${datesParms}`;
        if (selectedDashboard === "myPersonalInvestigation") {
          url = `${baseUrl}/?psCode=${psData}&isDraft=${false}&userName=${paoCode}&firType=${firType}&higherOfficer=true${datesParms}`;
        }
        dispatch(fetchFIRList(url));
      } else {
        dispatch(
          fetchFIRList(
            `${baseUrl}/?psCode=${
              activeUser?.cctns_unit_id
            }&isDraft=${false}&firType=${firType}&higherOfficer=true${datesParms}`
          )
        );
      }
    } else if (caseStatus === "CC Nos Awaited") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "PT Cases") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "Trial of Cases for the day") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else {
      dispatch(
        fetchFIRList(
          `${baseUrl}/?psCode=${psData}&caseStatus=${"Total Cases"}&firType=${firType}&isDraft=${false}`
        )
      );
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?psCode=${psData}&higherOfficer=true${datesParms}`
        )
      );
    }
    if (IS_HIGHER_SHO_USER && !!storedUser?.isPersnolized === false) {
      if (psData) {
        dispatch(
          fetchCaseCountList(
            `${config.getCasesCountByYear}/?psCode=${psData}&caseStatus=${caseStatus}&isDraft=false`
          )
        );
      }
    } else {
      dispatch(
        fetchCaseCountList(
          `${config.getCasesCountByYear}/?userName=${paoCode}&psCode=${activeUser?.cctns_working_unit_id}&caseStatus=${caseStatus}&isDraft=false`
        )
      );
    }
  };

  const onSimpleFilterChange = useCallback((params) => {
    const caseStatus = localStorage.getItem("selectedCaseStatus");
    // localStorage.removeItem("disposalType");
    dispatch(
      fetchHigherFIRList(
        `${config.getCaseMetricsByEMail}/?&userName=${activeUser?.pao_code}&psCode=${activeUser?.cctns_unit_id}&higherOfficer=true&${params}`
      )
    );
    getCaseDetails(caseStatus, params);
  }, []);

  return (
    <Layout className="contentMainLayout">
      <Header
        style={{
          backgroundColor: "#87b3d9",
          height: "180px",
        }}
      >
        <div style={{ marginBottom: 10 }}>
          {isSimpleFilter ? (
            <SimpleFilter onFilterChange={onSimpleFilterChange} />
          ) : (
            <FilterComponent
              // isPersnolized={handlePersnolizedView}
              getCaseDetails={getCaseDetails}
            />
          )}
        </div>
        <div>
          <Row gutter={0} justify="center">
            {getCaseMetricsList()?.map(
              (item, idx) =>
                item?.title && (
                  <Col
                    style={{
                      marginBottom: 16,
                      marginTop: 18,
                      width: "12%",
                      maxWidth: "12%",
                    }}
                    key={idx}
                  >
                    <WidgetsWrapper>
                      <div className="widgetLayer1" />
                      <div className="widgetLayer2" />
                      {item.value > 0 ||
                      (item.value === 0 && item.caseStatus === "Zero FIRs") ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            dispatch(getselectedYear(""));
                            getCaseDetails(item.caseStatus);
                          }}
                        >
                          <StickerWidget
                            value={item?.value}
                            title={item?.title}
                            fontColor={item?.fontColor}
                            bgColor={
                              selectedWidgetStatus === item.caseStatus
                                ? "#FCFBDD"
                                : item?.bgColor
                            }
                          />
                        </div>
                      ) : (
                        <StickerWidget
                          value={item.value}
                          title={item.title}
                          fontColor={item.fontColor}
                          bgColor={item.bgColor}
                        />
                      )}
                    </WidgetsWrapper>
                  </Col>
                )
            )}
          </Row>
        </div>
      </Header>
      <Content className="dashboardontent">
        <DashboardIndex />
      </Content>
    </Layout>
  );
}
