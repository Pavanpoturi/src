import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import basicStyle from "@assets/styles/constants";
import WidgetsWrapper from "./WidgetsWrapper";
import TasksWidget from "./TasksWidget/TasksWidget";
import TableWidget from "./TableWidget/TableWidget";
import NotificationsWidget from "./NotificationsWidget";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "../FirDetails/fir-util";

export default function DefaultDashboard() {
  const { recentEditList } = useSelector((state) => state.Dashboard);
  const { advisoryList } = useSelector((state) => state.AdvisoryMemo);
  const { rowStyle, colStyle } = basicStyle;
  const { actList } = useSelector((state) => state.MasterData);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const ECOPSV2ROLE = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = ECOPSV2ROLE.includes(activeUser?.ecopsv2_role)
    ? false
    : true;

  const myTasksMock = [
    {
      name: "MC Report(s)",
      count: "",
    },
    {
      name: "FSL Report(s)",
      count: "",
    },
    {
      name: "PME Report(s)",
      count: "",
    },
    {
      name: "FPB Report(s)",
      count: "",
    },
    {
      name: "Bank Report(s)",
      count: "",
    },
    {
      name: "ROC",
      count: "",
    },
    {
      name: "Municipality Report(s)",
      count: "",
    },
  ];

  const overdueTasksMock = [
    {
      name: "MC Report(s)",
      count: "",
    },
    {
      name: "FSL Report(s)",
      count: "",
    },
  ];

  return (
    <Row style={rowStyle} gutter={0} justify="start">
      <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
        <WidgetsWrapper>
          <NotificationsWidget
            label="Notifications from Superior Officers"
            shadowColor="rgba(255,0,0,0.4)"
            dataSource={advisoryList}
          />
          <TasksWidget
            label="My Tasks"
            taskList={myTasksMock}
            bgColor="#F2F2F2"
            shadowColor="rgba(51,51,51,0.4)"
          />
        </WidgetsWrapper>
      </Col>

      <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
        <WidgetsWrapper>
          <TasksWidget
            label="Overdue Tasks"
            labelColor="#EC0D0D"
            taskList={overdueTasksMock}
            bgColor="#FFECEC"
            shadowColor="rgba(255,0,0,0.4)"
          />
        </WidgetsWrapper>
      </Col>

      <Col lg={8} md={12} sm={12} xs={24} style={colStyle}>
        <WidgetsWrapper>
          <TableWidget
            dataSource={recentEditList}
            label="Last Updated Cases"
            shadowColor="rgba(51,51,51,0.4)"
            actList={actList}
            ISHIGHERSHOUSER={IS_HIGHER_SHO_USER}
          />
        </WidgetsWrapper>
      </Col>
    </Row>
  );
}
