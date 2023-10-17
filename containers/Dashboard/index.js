import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Layout } from "antd";
import { config } from "@config/site.config";
import useWindowSize from "@lib/hooks/useWindowSize";
import appActions from "@redux/app/actions";
import { variables } from "@assets/styles/variables";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import DashboardRoutes from "./DashboardRoutes";
import { DashboardContainer, DashboardGlobalStyles } from "./Dashboard.styles";
import firActions from "@redux/fir/actions";
import createFIRActions from "@redux/createFir/actions";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_SHO,
  IS_DSP,
  IS_CI,
  IS_SP,
  IS_DGP,
  IS_IO,
  IS_INVESTIGATION_OFFICER,
} from "../FirDetails/fir-util";
import HigherOfficerModule from "../HigherOfficerModule";

const { Content, Footer } = Layout;
const { toggleAll } = appActions;

const styles = {
  layout: { flexDirection: "row", overflowX: "hidden" },
  content: {
    flexShrink: "0",
    background: "#F8FBFF",
    position: "relative",
  },
  footer: {
    background: variables.PRIMARY_BLUE,
    textAlign: "center",
    borderTop: "1px solid #ededed",
    color: "#4F7796",
    fontWeight: "bold",
  },
  links: {
    width: "100%",
    display: "flex",
    backgroundColor: "#62a5cdf2",
    height: "100px",
  },
  buttons: {
    fontSize: 14,
    fontWeight: "500",
    height: "100%",
    width: "180px",
    borderWidth: "0px",
    backgroundColor: "#023760",
    color: "#fff",
    textTransform: "uppercase",
  },
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { isCustomTopBar, dropDownData } = useSelector((state) => state.FIR);
  const { updateDashboardData } = firActions;
  const { resetFIRData } = createFIRActions;
  const { width, height } = useWindowSize();
  const location = useLocation();
  const history = useHistory();
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const isIo = storedUser?.isIo;
  const refresh = storedUser?.refresh;
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const { fetchDropdownData, updatePsCode } = firActions;

  const getDropdownData = () => {
    let payload = {
      psCode: activeUser?.ecopsv2_unit_id,
      emp_role_name: activeUser?.emp_role_name,
      ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
      ecopsv2_role: activeUser?.ecopsv2_role,
      ecopsv2_unit_id: activeUser?.ecopsv2_unit_id,
      approvingOfficerUnits: activeUser?.approvingOfficerUnits,
    };
    dispatch(fetchDropdownData(config?.fetchDropdownData, payload));
  };

  useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [width, height, dispatch]);

  useEffect(() => {
    getDropdownData();
  }, [!userRole]);

  useEffect(() => {
    let getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
    if (getpsCode) dispatch(updatePsCode(getpsCode));
  }, [dropDownData]);

  const UserRoleSho = () => {
    let data;
    if (!!isIo) {
      data = true;
      if (!!refresh) {
        document.location.href = "/#/dashboard";
        Object.assign(storedUser, { refresh: false });
        localStorage.removeItem("currentUser");
        localStorage.setItem("currentUser", JSON.stringify(storedUser));
      }
    } else {
      data = false;
    }
    return data;
  };

  const displayDashboardContent = () => {
    return !userRole?.includes(activeUser?.ecopsv2_role) && !UserRoleSho() ? (
      <HigherOfficerModule />
    ) : (
      <Layout style={{ height: height }}>
        {!isCustomTopBar && <Topbar />}
        <Layout style={styles?.layout}>
          <Sidebar />
          <Layout className="contentMainLayout">
            <Content className="dashboardontent" style={styles?.content}>
              <DashboardRoutes />
            </Content>
            <Footer style={styles?.footer}>
              DESIGNED AND DEVELOPED BY{" "}
              <span style={{ color: "#C8527A" }}>WINC</span>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  };

  return (
    <DashboardContainer>
      <DashboardGlobalStyles />
      {displayDashboardContent()}
    </DashboardContainer>
  );
}
