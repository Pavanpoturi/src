import { useState, useEffect } from "react";
import { Row, Col, Tag, Divider, Typography, Space } from "antd";
import { FirsContainer } from "../../Firs/Firs.styles";
import { isArray } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { useSelector } from "react-redux";
import { AdvisoryWrapper } from "./AdvisoryWrapper.style";
import NotificationsFromSuperiorOfficers from "../../NotificationsFromSuperiorOfficers";
import {
  IS_SHO,
  IS_IO,
  IS_INVESTIGATION_OFFICER,
} from "../../FirDetails/fir-util";
import NotificationsWidget from "../../Widgets/NotificationsWidget";

export default function AdvisoryAckDashboard() {
  const [returnedRemarksCount, setReturnedRemarksCount] = useState();
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { advisoryList } = useSelector((state) => state.AdvisoryMemo);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);

  useEffect(() => {
    if (advisoryList) {
      let open = isArray(advisoryList?.Open) ? advisoryList?.Open : "";
      let closed = isArray(advisoryList?.Closed) ? advisoryList?.Closed : "";
      let advisoryData = open.concat(closed);

      if (isArray(advisoryData)) {
        const status = advisoryData.filter(
          (item) => item?.advisory?.workflow?.status === "Returned with Remarks"
        );
        setReturnedRemarksCount(status?.length);
      }
    }
  }, [advisoryList]);

  const displayTags = (colorCode, status, count) => {
    return (
      <Col>
        <Tag
          color={colorCode}
          style={{
            width: "45px",
            height: "35px",
            fontSize: "12px",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            cursor: count > 0 ? "pointer" : "not-allowed",
          }}
        >
          <span style={{ marginLeft: 5, fontWeight: "bold" }}>{count}</span>
        </Tag>
      </Col>
    );
  };

  return (
    selectedDashboard === "advisory-and-ack" && (
      <Row>
        <Col span={20}>
          <NotificationsFromSuperiorOfficers
            ISHIGHERSHOUSER={IS_HIGHER_SHO_USER}
          />
        </Col>

        <Col span={4}>
          <AdvisoryWrapper>
            <Typography.Text>Advisory Memo</Typography.Text>
            <Divider />
            <NotificationsWidget dataSource={advisoryList} />
            <Space>
              <Typography.Text>Returned With Remarks</Typography.Text>
              <Tag
                color="magenta"
                style={{
                  width: "45px",
                  textAlign: "center",
                  cursor: returnedRemarksCount > 0 ? "pointer" : "not-allowed",
                }}
              >
                {returnedRemarksCount}
              </Tag>
            </Space>
          </AdvisoryWrapper>
        </Col>
      </Row>
    )
  );
}
