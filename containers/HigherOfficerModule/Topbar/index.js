import { useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { isUndefined, isNaN, isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Input, Dropdown, Menu, Layout, Modal, Alert } from "antd";
import {
  SearchOutlined,
  CaretDownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import basicStyle from "@assets/styles/constants";
import firActions from "@redux/fir/actions";
import WidgetsWrapper from "@containers/Widgets/WidgetsWrapper";
import StickerWidget from "@containers/Widgets/Sticker/StickerWidget";
import EscopLogo from "@assets/images/ecopLogo.png";
import UserIcon from "@assets/images/user-icon.png";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import authAction from "@redux/auth/actions";
import reportsActions from "@redux/reports/actions";
import TopbarWrapper from "./styles";
import { textFieldRules } from "@components/Common/formOptions";
import dashboardActions from "@redux/dashboard/actions";
import { config } from "@config/site.config";
import React, { useEffect, useState } from "react";
import advisoryActions from "@redux/advisoryMemo/actions";
import {
  DATE_FORMAT_MM,
  IS_IO,
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
} from "../../../containers/FirDetails/fir-util";
import moment from "moment";

const { getSelectedDashboard, isPersnolizedView } = dashboardActions;
const { Header } = Layout;
const {
  getGraveList,
  updatePsCode,
  fetchFIRList,
  getGraveCrimeCount,
  fetchGravecrimeData,
  fetchHigherFIRList,
  updateSelectedWidget,
  updateDashboardData,
  getselectedYear,
} = firActions;
const { getAdvisoryList } = advisoryActions;

const { logout } = authAction;

export default function Topbar() {
  const today = moment();
  const { resetReportAction } = reportsActions;
  const {
    isDashboard,
    selectedWidgetStatus,
    updatedPsCode,
    dropDownData,
    graveCrimeCount,
    caseMetrics,
  } = useSelector((state) => state.FIR);
  const { rowStyle } = basicStyle;
  const history = useHistory();
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { collapsed, openDrawer } = useSelector((state) => state.App);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const selectedCaseStatus = loadState("selectedCaseStatus");
  const ps_code = !isUndefined(updatedPsCode) ? updatedPsCode : getpsCode;
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const dispatch = useDispatch();
  const isNoAccess = isUndefined(activeUser?.cctns_unit_id);
  const isCollapsed = collapsed && !openDrawer;
  const roles = {
    ["CIRCLE INSPECTOR"]: "CI",
    ["INVESTIGATION OFFICER"]: "IO",
    ["SDPO/ACP"]: "ACP",
  };
  const styling = {
    position: "absolute",
    width: "100%",
    height: 100,
    minHeight: 100,
  };
  const isRole = activeUser?.emp_role_name_multiple;
  const IS_ROLE_MULTIPLE =
    !isUndefined(activeUser?.emp_role_name_multiple) &&
    isRole.includes("INVESTIGATION OFFICER") &&
    !isRole.includes("STATION HOUSE OFFICER (SHO)");

  const { data } = graveCrimeCount;

  const logOut = () => {
    dispatch(updateSelectedWidget(""));
    dispatch(logout(history));
    dispatch(resetReportAction());
    localStorage.clear();
    window.location.reload();
  };

  const handelRoleSwitch = (type) => {
    if (type?.key === "INVESTIGATION OFFICER") {
      Object.assign(storedUser, {
        isIo: true,
        refresh: true,
        isPersnolized: false,
        switchedRole: type?.key,
      });
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
      window.location.reload("/#/dashboard");
    }
  };

  useEffect(() => {
    dispatch(isPersnolizedView(false));
    history.push(`/dashboard`);
    //For count in "My Personal Investigation" widget
    dispatch(
      firActions.fetchCaseMetrics(
        `${config.getCaseMetricsByEMail}/?&userName=${activeUser?.pao_code}&page=1&limit=50&psCode=${activeUser?.cctns_unit_id}&higherOfficer=true`
      )
    );
  }, []);

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
    // <Menu
    //   style={{
    //     top: 15,
    //     width: "160px",
    //     marginTop: "5px",
    //   }}
    // >
    //   {IS_ROLE_MULTIPLE && IS_HIGHER_SHO_USER ? (
    //     <>
    //       <Menu.Item disabled>Select Role</Menu.Item>
    //       {activeUser["emp_role_name_multiple"].split(",").map((data, i) => {
    //         return (
    //           <Menu.Item
    //             key={data}
    //             onClick={(event) => {
    //               handelRoleSwitch(event);
    //             }}
    //           >
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
    //     onClick={confirm}
    //     style={{ borderTop: IS_ROLE_MULTIPLE ? "solid 1px gray" : "none" }}
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

  const mpiCount = useMemo(() => {
    if (!isEmpty(caseMetrics)) {
      const { caseCount = 0 } =
        caseMetrics.find((item) => item.caseStatus === "Total Cases") || {};
      return caseCount;
    }
    return 0;
  }, [caseMetrics]);

  const metricsList = [
    {
      key: "dsr-reports",
      title: "Daily Situation Report",
      fontColor: "#02599C",
      bgColor: "#FFF",
    },
    {
      key: "crime-core-dashboard",
      title: "Crime Core Dashboard",
      fontColor: "#02599C",
      bgColor: "#FFF",
    },
    {
      key: "jurisdiction-dashboard",
      title: "Jurisdiction Dashboard",
      fontColor: "#02599C",
      bgColor: "#FFF",
    },
    {
      key: "advisory-and-ack",
      title: "Advisory & Acknowledgement",
      fontColor: "#02599C",
      bgColor: "#FFF",
    },
    {
      key: "myPersonalInvestigation",
      title: "My Personal Investigation",
      fontColor: "#02599C",
      bgColor: "#FFF",
      value: mpiCount,
    },
    {
      key: "grave-crimes",
      title: "Grave and special cases",
      value:
        data?.counts?.bodily +
        data?.counts?.crimeSCST +
        data?.counts?.crimeWomen +
        data?.counts?.cyberCrime +
        data?.counts?.ndps +
        data?.counts?.pocso +
        data?.counts?.property,
      fontColor: "#D18D06",
      bgColor: "#FFF",
    },
    {
      key: "fsl-reports",
      title: "FSL Status Report",
      fontColor: "#02599C",
      bgColor: "#FFF",
    },
    // {
    //   key: "icjs-report",
    //   title: "ICJS Home",
    //   fontColor: "#02599C",
    //   bgColor: "#FFF",
    // },
  ];

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
    if (item === "jurisdiction-dashboard") {
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?psCode=${ps_code}&higherOfficer=true`
        )
      );
    } else if (item === "advisory-and-ack") {
      dispatch(
        getAdvisoryList(
          `${config.getAdvisoryFIRList}?ecopsv2_role=${activeUser?.ecopsv2_role}&ecopsv2_hierarchy_key=${activeUser?.ecopsv2_hierarchy_key}&cctns_unit_id=${activeUser?.cctns_unit_id}&pao_code=${activeUser?.pao_code}`
        )
      );
    }
  };

  React.useEffect(() => {
    dispatch(updatePsCode());
    if (getpsCode) {
      let payload = {
        ecopsv2_unit_id: activeUser?.ecopsv2_unit_id,
        ecopsv2_role: activeUser?.ecopsv2_role,
        ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
        pao_code: activeUser?.pao_code,
        search_ps_code: getpsCode,
        counts: true,
        dsr_category_type: true,
        category_type: true,
        from_date: "",
        to_date: today.format(DATE_FORMAT_MM),
        graveType: !selectedCaseStatus ? "Grave" : selectedCaseStatus,
        page: 1,
        limit: 50,
        higherOfficer: true,
      };
      dispatch(getGraveCrimeCount(config?.getGraveCrimeCount, payload));
      dispatch(getGraveList(config?.fetchGravecrimeData, payload));
    }
  }, [getpsCode]);

  // React.useEffect(() => {
  //   if (selectedDashboard === "jurisdiction-dashboard") {
  //     const selectedWidget =
  //       selectedWidgetStatus === "" ? "Total Cases" : selectedWidgetStatus;
  //     dispatch(
  //       fetchFIRList(
  //         `${config.getRecentFirList
  //         }/?psCode=${ps_code}&caseStatus=${selectedWidget}&firType=${"Regular"}&isDraft=${false}&page=1&limit=50&higherOfficer=true`
  //       )
  //     );
  //     dispatch(
  //       fetchHigherFIRList(
  //         `${config.getCaseMetricsByEMail}/?psCode=${ps_code}&higherOfficer=true`
  //       )
  //     );
  //   }
  // }, [ps_code]);

  return (
    <TopbarWrapper
      style={{
        height: isDashboard ? 250 : 100,
        minHeight: isDashboard ? 250 : 110,
      }}
    >
      <Header
        style={styling}
        className={isCollapsed ? "topbar collapsed" : "topbar"}
      >
        <div className="left">
          <Link
            to="/dashboard"
            className="topbarLogo"
            onClick={() => {
              dispatch(updateDashboardData(true));
              dispatch(updateSelectedWidget(""));
              dispatch(getSelectedDashboard(""));
            }}
          >
            <img src={EscopLogo} className="escopLogo" alt="escopLogo" />
            <span className="dashboardTitle">{`${activeUser.emp_role_name} HOMEPAGE`}</span>
          </Link>
        </div>
        <Row className="center" style={{ width: 600 }} gutter={24}>
          <Col span={20}>
            <Input
              placeholder="Search on FIR"
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
        </Row>
        <ul className="right">
          <li className="userDetails" style={{ cursor: "default" }}>
            <div className="userName">{activeUser.employee_name}</div>
            <div className="userName" style={{ marginTop: 2 }}>
              {activeUser.emp_role_name}
            </div>
            <div className="userInfo">
              {activeUser.unit_name ? activeUser.unit_name : ""}
              {activeUser.policestationcode
                ? `(${activeUser.policestationcode}`
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
      <div
        style={{
          width: "100%",
          padding: 10,
          marginTop: 90,
        }}
      >
        <Row style={rowStyle} gutter={0} justify="center">
          {metricsList.map(
            (item, idx) =>
              item?.title && (
                <Col
                  style={{
                    marginBottom: 16,
                    marginTop: 20,
                    width: "12%",
                    maxWidth: "12%",
                  }}
                  key={idx}
                >
                  <WidgetsWrapper>
                    <div className="widgetLayer1" style={{ width: "79%" }} />
                    <div className="widgetLayer2" style={{ width: "86%" }} />
                    <div
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 3,
                      }}
                      onClick={() => {
                        handelClick(item?.key);
                        localStorage.removeItem("disposalType");
                        localStorage.setItem(
                          "selectedCaseStatus",
                          "Total Cases"
                        );
                        dispatch(getselectedYear(""));
                        history.push(`/dashboard/${item?.key}`);
                      }}
                    >
                      <StickerWidget
                        value={!isNaN(item.value) ? item?.value : 0}
                        title={item.title}
                        fontColor={item.fontColor}
                        bgColor={
                          selectedDashboard === item?.key
                            ? "#FCFBDD"
                            : item?.bgColor
                        }
                        isHigherOfficer={true}
                      />
                    </div>
                  </WidgetsWrapper>
                </Col>
              )
          )}
        </Row>
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
    </TopbarWrapper>
  );
}
