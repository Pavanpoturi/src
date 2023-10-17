import { useState } from "react";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import reportsActions from "@redux/reports/actions";
import { DSRReportsContainer } from "./Styles";
import ReportsContainer from "./ReportsContainer";
import { siderMenu } from "./const";
import FilterComponent from "./FilterComponent";
import {
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "../../FirDetails/fir-util";
import { loadState } from "../../../lib/helpers/localStorage";

const { Content, Sider } = Layout;

export default function DSRReports() {
  const dispatch = useDispatch();
  const [selectedSiderMenu, setSelectedSiderMenu] = useState("reportedCases");
  const { resetReportAction } = reportsActions;
  const storedUser = loadState("currentUser");
  const { currentUser } = useSelector((state) => state.Auth);
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const ECOPSV2ROLE = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const displaySiderItems = () => {
    return siderMenu.map((item, index) => {
      return (
        <div
          className={
            selectedSiderMenu === item.value
              ? "siderItems"
              : "siderItemDisabled"
          }
          key={index}
          onClick={() => {
            setSelectedSiderMenu(item.value);
            dispatch(resetReportAction());
          }}
          style={{
            marginBottom: 10,
            cursor: "pointer",
            height: item.value === "missingUnknwon" ? 65 : 40,
          }}
        >
          {item.name}
        </div>
      );
    });
  };

  return (
    <DSRReportsContainer>
      <Layout>
        <Content>
          <Layout className="site-layout-background layout">
            <Sider className="site-layout-background" width={200}>
              <div className="siderContainer">{displaySiderItems()}</div>
            </Sider>
            <Content
              className="contentContainer"
              style={{ overflow: "hidden" }}
            >
              {IS_HIGHER_SHO_USER && !storedUser?.isIo ? (
                <FilterComponent />
              ) : null}
              <ReportsContainer
                selectedSiderMenu={selectedSiderMenu}
                setSelectedSiderMenu={setSelectedSiderMenu}
              />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </DSRReportsContainer>
  );
}
