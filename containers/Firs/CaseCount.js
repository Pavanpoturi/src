import { Row, Col, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Scrollbars from "@components/utility/customScrollBar";
import { config } from "@config/site.config";
import firActions from "@redux/fir/actions";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import { CaseCountWrapper } from "./caseCountStyle";
import { useEffect, useState } from "react";

export default function CaseCount({ taskList, caseStatus }) {
  const dispatch = useDispatch();
  const { fetchFIRList, getselectedYear } = firActions;
  const currentUser = loadState("currentUser");
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const { updatedPsCode, dropDownData } = useSelector((state) => state.FIR);
  const [storedCode, setStoredCode] = useState("");
  const IS_SHO_USER = currentUser.emp_role_name === IS_SHO;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");

  useEffect(() => {
    if (updatedPsCode) {
      setStoredCode(updatedPsCode);
    } else {
      setStoredCode(getpsCode);
    }
  }, [updatedPsCode]);

  const fetchRecentFirDetails = (year) => {
    if (IS_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${currentUser?.cctns_unit_id
          }&caseStatus=${caseStatus}&isDraft=${false}&year=${year}`
        )
      );
    } else if (
      IS_HIGHER_SHO_USER &&
      !!storedUser?.isIo === false &&
      !!storedUser?.isPersnolized === false
    ) {
      if (storedCode) {
        dispatch(
          fetchFIRList(
            `${config.getRecentFirList
            }/?psCode=${storedCode}&caseStatus=${caseStatus}&isDraft=${false}&year=${year}&page=1&limit=50&higherOfficer=true`
          )
        );
      }
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${currentUser?.cctns_unit_id
          }&userName=${currentUser?.pao_code
          }&caseStatus=${caseStatus}&isDraft=${false}&year=${year}`
        )
      );
    }
  };

  const displayTaskList = () =>
    taskList.map((task, i) => (
      <Row
        key={i}
        wrap={false}
        style={{
          borderRadius: 5,
          marginBottom: 8,
        }}
      >
        <Col flex="auto" span={8} style={{ color: "#7E7E7E", fontSize: 16 }}>
          {task?._id}
        </Col>
        <Col flex="none" span={12}>
          <div
            className="tableRowTextUl"
            style={{ padding: "0 16px", fontSize: 16, cursor: "pointer" }}
            onClick={() => {
              fetchRecentFirDetails(task?._id);
              dispatch(getselectedYear(task?._id));
            }}
          >
            {task?.Count}
          </div>
        </Col>
      </Row>
    ));

  return (
    <CaseCountWrapper
      style={{ boxShadow: `0px 27px 19px -28px`, padding: "10px" }}
    >
      <Row>
        <Col span={8} style={{ color: "#7E7E7E", fontSize: 15 }}>
          Year
        </Col>
        <Col span={12} style={{ color: "#7E7E7E", fontSize: 15 }}>
          No. of Cases
        </Col>
        <Divider style={{ marginTop: 10, marginBottom: 15 }} />
      </Row>
      <Scrollbars className="widgetContainer">{displayTaskList()}</Scrollbars>
    </CaseCountWrapper>
  );
}
