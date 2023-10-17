import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Layout } from "antd";
import useWindowSize from "@lib/hooks/useWindowSize";
import appActions from "@redux/app/actions";
import Topbar from "./Topbar";
import { DashboardContainer, DashboardGlobalStyles } from "./styles";
import { variables } from "@assets/styles/variables";
import DashboardRouts from "./HIgherDashBordRouts";
import Widgets from "../Widgets/Widgets";

const { toggleAll } = appActions;
const { Content } = Layout;
const styles = {
  layout: { flexDirection: "column", overflowX: "scroll" },
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
};

export default function HigherOfficerModule() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isCustomTopBar } = useSelector((state) => state.FIR);
  const isDashboardPath = location.pathname === "/dashboard";
  const { width, height } = useWindowSize();
  const history = useHistory();

  useEffect(() => {
    dispatch(toggleAll(width, height));
  }, [width, height, dispatch]);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      history.go(1);
    });
  }, []);

  return (
    <DashboardContainer>
      <DashboardGlobalStyles />
      <Layout style={{ height: height }}>
        {!isCustomTopBar && <Topbar />}
        <Layout style={styles.layout}>
          <Content style={styles.content}>
            <DashboardRouts />
            {isDashboardPath ? <Widgets /> : null}
          </Content>
        </Layout>
      </Layout>
    </DashboardContainer>
  );
}
