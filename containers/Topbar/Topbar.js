import { useEffect, useCallback, useState, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { isEmpty, isUndefined } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Input,
  Dropdown,
  Button,
  Menu,
  Layout,
  Modal,
  Alert,
  message,
} from "antd";
import {
  SearchOutlined,
  CaretDownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import basicStyle from "@assets/styles/constants";
import firActions from "@redux/fir/actions";
import createFIRActions from "@redux/createFir/actions";
import WidgetsWrapper from "@containers/Widgets/WidgetsWrapper";
import StickerWidget from "@containers/Widgets/Sticker/StickerWidget";
import EscopLogo from "@assets/images/ecopLogo.png";
import UserIcon from "@assets/images/user-icon.png";
import { variables } from "@assets/styles/variables";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import dashboardActions from "@redux/dashboard/actions";
import authAction from "@redux/auth/actions";
import reportsActions from "@redux/reports/actions";
import form54Action from "@redux/investigations/form54/actions";
import appActions from "@redux/app/actions";
import TopbarWrapper from "./Topbar.styles";
import { textFieldRules } from "@components/Common/formOptions";
import {
  IS_IO,
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import advisoryActions from "@redux/advisoryMemo/actions";

const { Header } = Layout;
const {
  updateDashboardData,
  updateSelectedWidget,
  fetchFIRList,
  updatePsCode,
} = firActions;
const { fetchDashboardDetails, fetchCaseCountList } = dashboardActions;
const { resetFIRData } = createFIRActions;
const { resetAccidentInformationReport } = form54Action;

const { logout } = authAction;
const { toggleCollapsed, hideSideMenu } = appActions;

export default function Topbar() {
  const today = moment();
  const { resetReportAction } = reportsActions;
  const { dashboardDetails } = useSelector((state) => state.Dashboard);
  const { isDashboard, selectedWidgetStatus, updatedPsCode, caseMetrics } =
    useSelector((state) => state.FIR);
  const { getSelectedDashboard, isPersnolizedView } = dashboardActions;

  const { rowStyle } = basicStyle;
  const history = useHistory();
  const selectedDraftedFirId = loadState("selectedDraftedFirId");
  const warning = () => {
    message.warning(
      "Please continue with Draft FIR or delete Draft FIR to generate New FIR."
    );
  };
  const roles = {
    ["CIRCLE INSPECTOR"]: "CI",
    ["INVESTIGATION OFFICER"]: "IO",
    ["SDPO/ACP"]: "ACP",
  };
  const { collapsed, openDrawer } = useSelector((state) => state.App);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const dispatch = useDispatch();
  const handleToggle = useCallback(
    () => dispatch(toggleCollapsed()),
    [dispatch]
  );
  const isIO = storedUser?.isIo;
  const switchedRole = storedUser?.switchedRole;
  const location = useLocation();
  const isNoAccess = isUndefined(activeUser?.cctns_unit_id);
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const ECOPSV2ROLE = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = ECOPSV2ROLE.includes(activeUser?.ecopsv2_role)
    ? false
    : true;
  const isRole = activeUser?.emp_role_name_multiple;
  const IS_ROLE_MULTIPLE =
    !isUndefined(activeUser?.emp_role_name_multiple) &&
    isRole.includes("INVESTIGATION OFFICER") &&
    !isRole.includes("STATION HOUSE OFFICER (SHO)");
  useEffect(() => {
    dispatch(
      firActions.fetchCaseMetrics(
        `${config.getCaseMetricsByEMail}/?&userName=${activeUser?.pao_code}&psCode=${activeUser?.cctns_unit_id}`
      )
    );
  }, []);
  const nonSHO = ["Draft Cases"];
  const nonSHODashboard =
    !isEmpty(dashboardDetails) &&
    dashboardDetails.filter((item) => !nonSHO?.includes(item.caseStatus));
  const mpiCount = useMemo(() => {
    if (!isEmpty(caseMetrics)) {
      const { caseCount = 0 } =
        caseMetrics.find((item) => item.caseStatus === "Total Cases") || {};
      return caseCount;
    }
    return 0;
  }, [caseMetrics]);
  const filteredDashboard =
    IS_SHO_USER || IS_HIGHER_SHO_USER
      ? [
        ...dashboardDetails,
        {
          statusType: "crime-core-dashboard",
          caseCount: null,
          caseStatus: "Crime Core Dashboard",
          mobileType: "Crime Core Dashboard",
        },
        {
          statusType: "myPersonalInvestigation",
          caseCount: mpiCount,
          caseStatus: "My Personal Investigation",
          mobileType: "My Personal Investigation",
        },
      ]
      : nonSHODashboard;

  const isDashboardPath = location.pathname === "/dashboard";

  const dashboardStatsTransform =
    filteredDashboard &&
    filteredDashboard.length > 0 &&
    filteredDashboard.map(function (item) {
      let fontColor = "";
      let key = "";
      let title = "";
      let marginBottom = "";
      // eslint-disable-next-line default-case
      switch (item.caseStatus) {
        case "New":
          fontColor = "#349F30";
          key = "new-firs";
          title =
            item?.caseCount > 1
              ? "Newly ASSIGNED FIR(s)"
              : "Newly ASSIGNED FIR";
          break;
        case "UI Cases":
          fontColor = "#D69B24";
          key = "ui-cases";
          marginBottom = "16px";
          title = "UI CASES";
          break;
        case "CC Nos Awaited":
          fontColor = "#0081CC";
          key = "cc-nos-awaited";
          title = "CC Nos Awaited";
          break;
        case "Disposal":
          fontColor = "#0081CC";
          key = "disposed";
          marginBottom = "16px";
          title = "DISPOSAL";
          break;
        case "PT Cases":
          fontColor = "#D69B24";
          key = "pt-cases";
          marginBottom = "16px";
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
        case "Draft Cases":
          fontColor = "#349F30";
          key = "draft-cases";
          marginBottom = "16px";
          title = "DRAFT FIR";
          break;
        case "Zero FIRs":
          fontColor = "#349F30";
          key = "zeroCases";
          marginBottom = "16px";
          title = "Zero FIR(s)";
          break;
        case "Crime Core Dashboard":
          fontColor = "#349F30";
          key = "crime-core-dashboard";
          title = "Crime Core Dashboard";
          break;
        case "My Personal Investigation":
          fontColor = "#349F30";
          key = "myPersonalInvestigation";
          title = "My Personal Investigation";
          break;
      }
      return {
        key: key,
        title: title,
        caseStatus: item.caseStatus,
        value: item.caseCount,
        fontColor: fontColor,
        marginBottom: marginBottom,
        bgColor: variables.WHITE_COLOR,
      };
    });

  console.log(mpiCount, "mpiCount", caseMetrics);

  const fetchRecentFirDetails = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${activeUser?.cctns_unit_id
          }&caseStatus=New&isDraft=${true}`
        )
      );
    } else if (IS_HIGHER_SHO_USER && isIO === false) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?userName=${activeUser?.pao_code
          }&caseStatus=New&isDraft=${true}&page=1&limit=50&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${activeUser?.cctns_unit_id
          }&userName=${activeUser?.pao_code}&caseStatus=New&isDraft=${true}`
        )
      );
    }
    if (location.pathname.split("/").includes("myPersonalInvestigation")) {
      dispatch(getSelectedDashboard("myPersonalInvestigation"));
    }
  };
  useEffect(() => {
    fetchRecentFirDetails();
  }, []);

  // localStorage.removeItem("disposalType");

  // console.log(dashboardStatsTransform, "dashboardStatsTransform");
  const getCaseMetricsList = () => {
    let arr = [];
    if (IS_SHO_USER) {
      arr.push(dashboardStatsTransform[16]);
      arr.push(dashboardStatsTransform[5]);
      arr.push(dashboardStatsTransform[1]);
      arr.push(dashboardStatsTransform[0]);
      arr.push(dashboardStatsTransform[2]);
      arr.push(dashboardStatsTransform[4]);
      arr.push(dashboardStatsTransform[3]);
      arr.push(dashboardStatsTransform[10]);
      arr.push(dashboardStatsTransform[8]);
      localStorage.setItem(
        "draftCount",
        JSON.stringify(dashboardStatsTransform[8]?.value)
      );
      arr.push(dashboardStatsTransform[11]);
      arr.push(dashboardStatsTransform[17]);
    } else {
      arr.push(dashboardStatsTransform[5]);
      arr.push(dashboardStatsTransform[0]);
      arr.push(dashboardStatsTransform[2]);
      arr.push(dashboardStatsTransform[4]);
      arr.push(dashboardStatsTransform[3]);
      arr.push(dashboardStatsTransform[10]);
      arr.push(dashboardStatsTransform[11]);
    }
    return arr;
  };

  const checkIsDraft = () => {
    //checking isDraft is aviailable or not
    let isDraftConst = getCaseMetricsList().find(
      (ele) => ele?.key === "draft-cases"
    );
    if (isDraftConst && isDraftConst?.value >= 1) {
      return true;
    } else {
      return false;
    }
  };

  const fetchDataDetails = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?psCode=${activeUser?.cctns_unit_id}`
        )
      );
    } else if (IS_HIGHER_SHO_USER && isIO === false) {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?userName=${activeUser?.pao_code}&psCode=${activeUser?.cctns_unit_id}`
        )
      );
    } else {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?psCode=${activeUser?.cctns_unit_id}&userName=${activeUser?.pao_code}`
        )
      );
    }
  };

  useEffect(() => {
    fetchDataDetails();
  }, [dispatch]);

  const isCollapsed = collapsed && !openDrawer;
  const styling = {
    position: isDashboard ? "fixed" : "",
    width: "100%",
    height: 135,
    minHeight: 135,
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">FIR</Menu.Item>
    </Menu>
  );

  const logOut = () => {
    dispatch(updateSelectedWidget(""));
    dispatch(logout(history));
    dispatch(resetReportAction());
    localStorage.clear();
  };

  const handelRoleSwitch = (role) => {
    if (role !== "INVESTIGATION OFFICER") {
      Object.assign(storedUser, {
        isIo: false,
        refresh: false,
        isPersnolized: false,
      });
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
      window.location.reload("/#/dashboard");
    }
  };
  const confirm = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to Logout?",
      okText: "No",
      onCancel: logOut,
      cancelText: "Yes",
      okButtonProps: {
        type: "default",
      },
      cancelButtonProps: {
        type: "primary",
      },
    });
  };

  const menuRight = (
    // <Menu style={{ top: 15, width: "160px", marginTop: "5px" }}>
    //   {IS_ROLE_MULTIPLE && IS_HIGHER_SHO_USER ? (
    //     <>
    //       <Menu.Item disabled>Select Role</Menu.Item>
    //       {activeUser["emp_role_name_multiple"].split(",").map((data, i) => {
    //         return (
    //           <Menu.Item key={i} onClick={() => handelRoleSwitch(data)}>
    //             {roles[data]}
    //           </Menu.Item>
    //         );
    //       })}
    //     </>
    //   ) : null}
    //   <Menu.Item
    //     key={
    //       IS_ROLE_MULTIPLE && IS_HIGHER_SHO_USER
    //         ? activeUser["emp_role_name_multiple"].length - 1
    //         : 0
    //     }
    //     style={{ borderTop: IS_ROLE_MULTIPLE ? "solid 1px gray" : "none" }}
    //     onClick={confirm}
    //   >
    //     Logout
    //   </Menu.Item>
    // </Menu>
    <Menu style={{ top: 15 }}>
      <Menu.Item key="0" onClick={confirm}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const getCaseDetails = (caseStatus) => {
    const firType = caseStatus === "Zero FIRs" ? "Zero" : "Regular";
    const currentYear = new Date().getFullYear();
    const psCode = activeUser?.cctns_unit_id;
    const paoCode = activeUser?.pao_code;
    const baseUrl = config.getRecentFirList;
    localStorage.setItem("selectedCaseStatus", caseStatus);
    const SHOBaseUrl = `${baseUrl}/?psCode=${psCode}&caseStatus=${caseStatus}&firType=${firType}`;
    const HigherSHOBaseUrl = `${baseUrl}/?userName=${paoCode}&psCode=${psCode}&caseStatus=${caseStatus}&firType=${firType}`;
    const nonSHOBaseUrl = `${baseUrl}/?userName=${paoCode}&psCode=${psCode}&caseStatus=${caseStatus}`;
    dispatch(updateSelectedWidget(caseStatus));
    let url = "";
    if (IS_SHO_USER) {
      url = SHOBaseUrl;
    } else if (IS_HIGHER_SHO_USER && isIO === false) {
      url = HigherSHOBaseUrl;
    } else {
      url = nonSHOBaseUrl;
    }
    let urlWithYear = "";
    if (IS_SHO_USER) {
      urlWithYear = `${SHOBaseUrl}`;
    } else if (IS_HIGHER_SHO_USER && isIO === false) {
      urlWithYear = `${HigherSHOBaseUrl}`;
    } else {
      urlWithYear = `${nonSHOBaseUrl}`;
    }
    if (caseStatus === "New") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "Draft Cases") {
      let draftUrl = "";
      if (IS_SHO_USER) {
        draftUrl = `${baseUrl}/?psCode=${psCode}&caseStatus=New&isDraft=${true}`;
      } else if (IS_HIGHER_SHO_USER && isIO === false) {
        draftUrl = `${baseUrl}/?userName=${paoCode}&psCode=${psCode}&caseStatus=New&isDraft=${true}`;
      } else {
        draftUrl = `${baseUrl}/?userName=${paoCode}&psCode=${psCode}&caseStatus=New&isDraft=${true}`;
      }
      dispatch(fetchFIRList(draftUrl));
    } else if (caseStatus === "UI Cases") {
      // dispatch(fetchFIRList(`${urlWithYear}&isDraft=${false}`));
    } else if (caseStatus === "Disposal") {
      dispatch(fetchFIRList(`${urlWithYear}&isDraft=${false}`));
    } else if (caseStatus === "Disposal") {
      dispatch(fetchFIRList(`${urlWithYear}&isDraft=${false}`));
    } else if (caseStatus === "Total Cases") {
      dispatch(fetchFIRList(`${urlWithYear}&isDraft=${false}`));
    } else if (caseStatus === "Zero FIRs") {
      dispatch(
        fetchFIRList(
          `${baseUrl}/?psCode=${psCode}&isDraft=${false}&firType=${firType}`
        )
      );
    } else {
      dispatch(fetchFIRList(url));
    }

    if (IS_SHO_USER) {
      dispatch(
        fetchCaseCountList(
          `${config.getCasesCountByYear}/?psCode=${psCode}&caseStatus=${caseStatus}&isDraft=false`
        )
      );
    } else if (IS_HIGHER_SHO_USER && isIO === false) {
      dispatch(
        fetchCaseCountList(
          `${config.getCasesCountByYear}/?userName=${paoCode}&caseStatus=${caseStatus}&isDraft=false`
        )
      );
    } else {
      dispatch(
        fetchCaseCountList(
          `${config.getCasesCountByYear}/?userName=${paoCode}&psCode=${psCode}&caseStatus=${caseStatus}&isDraft=false`
        )
      );
    }
  };

  const getRoleBasedDashboard = () => {
    let name = "";
    if (IS_SHO_USER) {
      name = "SHO HOMEPAGE";
    } else {
      name = `${activeUser?.emp_role_name} HOMEPAGE`;
    }
    return name;
  };

  const handelClick = (item) => {
    Object.assign(storedUser, {
      isPersnolized: item === "myPersonalInvestigation" ? true : false,
    });
    localStorage.removeItem("currentUser");
    localStorage.setItem("currentUser", JSON.stringify(storedUser));
    dispatch(
      isPersnolizedView(item === "myPersonalInvestigation" ? true : false)
    );
    dispatch(getSelectedDashboard(item));
    dispatch(updatePsCode());
  };

  return (
    <TopbarWrapper
      style={{
        height: isDashboard && isDashboardPath ? 300 : 150,
        minHeight: isDashboard && isDashboardPath ? 300 : 150,
      }}
    >
      <Header
        style={styling}
        className={isCollapsed ? "topbar collapsed" : "topbar"}
      >
        <div className="left">
          <button
            className={
              isCollapsed ? "triggerBtn menuCollapsed" : "triggerBtn menuOpen"
            }
            style={{
              color: variables.WHITE_COLOR,
              cursor: "pointer",
            }}
            onClick={handleToggle}
          />
          <Link
            className="topbarLogo"
            to="/dashboard"
            onClick={() => {
              dispatch(updateDashboardData(true));
              dispatch(updateSelectedWidget(""));
              fetchDataDetails();
              localStorage.removeItem("selectedFir");
              localStorage.removeItem("selectedActDetails");
              localStorage.removeItem("selectedCaseStatus");
              localStorage.removeItem("selectedFirId");
              localStorage.removeItem("selectedDraftedFirId");
              localStorage.removeItem("isConsumed");
              localStorage.removeItem("selectedDate");
              dispatch(resetReportAction());
              dispatch(hideSideMenu());
              dispatch(resetAccidentInformationReport());
            }}
          >
            <img src={EscopLogo} className="escopLogo" alt="escopLogo" />
            <span className="dashboardTitle">
              {!!storedUser?.isIo === false
                ? getRoleBasedDashboard()
                : `${switchedRole} HOMEPAGE`}
            </span>
          </Link>
        </div>
        <Row className="center">
          <Col span={16}>
            <Input
              placeholder="Search FIR"
              maxLength={textFieldRules.maxLength}
              disabled={isNoAccess}
              suffix={
                <SearchOutlined
                  className="site-form-item-icon"
                  style={{ fontSize: 14, color: "gray" }}
                />
              }
            />
          </Col>
          {IS_SHO_USER && (
            <Col span={3} style={{ marginLeft: 5 }}>
              {checkIsDraft() || !!selectedDraftedFirId ? (
                <Button
                  disabled={isNoAccess || !!selectedDraftedFirId}
                  className={
                    isNoAccess || !!selectedDraftedFirId
                      ? "newFirInActive"
                      : "newFirActive"
                  }
                  style={{
                    cursor: `${isNoAccess || !!selectedDraftedFirId
                        ? "not-allowed"
                        : "pointer"
                      }`,
                  }}
                  onClick={() => {
                    warning();
                  }}
                >
                  NEW FIR
                </Button>
              ) : (
                <Link
                  to="/dashboard/new-fir"
                  onClick={() => {
                    dispatch(updateDashboardData(false));
                    dispatch(resetFIRData());
                    localStorage.removeItem("selectedFirId");
                    localStorage.removeItem("selectedDraftedFirId");
                    dispatch(hideSideMenu());
                    dispatch(resetAccidentInformationReport());
                  }}
                >
                  <Button
                    disabled={isNoAccess}
                    className={isNoAccess ? "newFirInActive" : "newFirActive"}
                  >
                    NEW FIR
                  </Button>
                </Link>
              )}
            </Col>
          )}
        </Row>
        <ul className="right">
          <li className="userDetails" style={{ cursor: "default" }}>
            <div className="userName">{activeUser.employee_name}</div>
            <div className="userName" style={{ marginTop: 2 }}>
              {activeUser.emp_role_name}
            </div>
            <div className="userInfo">
              {activeUser.unit_name ? activeUser.unit_name : ""}
              {activeUser?.policestationcode
                ? `(${activeUser?.policestationcode}`
                : ""}
            </div>
          </li>
          <li className="user" style={{ cursor: "default" }}>
            <div className="imgWrapper">
              <img alt="user" src={UserIcon} />
            </div>
          </li>
          <Dropdown overlay={menuRight} trigger={["click"]}>
            <li className="caretDown">
              <CaretDownOutlined />
            </li>
          </Dropdown>
        </ul>
      </Header>
      {isDashboard && isDashboardPath && (
        <div
          style={{
            width: "100%",
            padding: "20px",
            marginTop: "135px",
          }}
        >
          {!isEmpty(dashboardStatsTransform) && (
            <Row style={rowStyle} gutter={0} justify="center">
              {getCaseMetricsList().map(
                (item, idx) =>
                  item?.title && (
                    <Col
                      style={{
                        marginBottom: 16,
                        marginTop: 20,
                        width: "9%",
                        maxWidth: "9%",
                      }}
                      key={idx}
                    >
                      <WidgetsWrapper>
                        <div className="widgetLayer1" />
                        <div
                          className="widgetLayer2"
                          style={{ width: "83%" }}
                        />
                        {item.value > 0 ||
                          (item.value === 0 && item.caseStatus === "Zero FIRs") ||
                          (!!item.value === false &&
                            item.caseStatus === "ICJS Home") ||
                          (!!item.value === false &&
                            item.caseStatus === "Crime Core Dashboard") ||
                          (!!item.value &&
                            item.caseStatus === "My Personal Investigation") ? (
                          <div
                            style={{
                              cursor: "pointer",
                              position: "relative",
                              zIndex: 3,
                            }}
                            onClick={() => {
                              if (
                                item.caseStatus !== "ICJS Home" &&
                                item.caseStatus !== "Crime Core Dashboard" &&
                                item.caseStatus !== "My Personal Investigation"
                              ) {
                                localStorage.removeItem("selectedFirId");
                                localStorage.removeItem("selectedFir");
                                localStorage.removeItem("isConsumed");
                                localStorage.removeItem("disposalType");
                                getCaseDetails(item.caseStatus);
                                dispatch(hideSideMenu());
                                dispatch(resetAccidentInformationReport());
                                handelClick(item?.key);
                                history.push(`/dashboard`);
                              } else {
                                handelClick(item?.key);
                                localStorage.removeItem("disposalType");
                                localStorage.setItem(
                                  "selectedCaseStatus",
                                  "Total Cases"
                                );
                                // dispatch(updateDashboardData(true));
                                history.push(`/dashboard/${item.key}`);
                              }
                            }}
                          >
                            <StickerWidget
                              value={item?.value}
                              title={item?.title}
                              fontColor={item?.fontColor}
                              marginBottom={item?.marginBottom}
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
                            marginBottom={item?.marginBottom}
                            bgColor={item.bgColor}
                          />
                        )}
                      </WidgetsWrapper>
                    </Col>
                  )
              )}
            </Row>
          )}
          {isNoAccess ? (
            <Row
              gutter={24}
              style={{
                justifyContent: "center",
                zIndex: 20,
                position: "absolute",
                width: "100%",
              }}
            >
              <Col span={8}>
                <Alert
                  message="Insufficient Privileges"
                  description="You don't have the right to access other features."
                  type="warning"
                />
              </Col>
            </Row>
          ) : null}
        </div>
      )}
    </TopbarWrapper>
  );
}
