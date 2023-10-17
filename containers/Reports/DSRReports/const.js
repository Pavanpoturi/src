import { Row, Col } from "antd";
import moment from "moment";
import { isUndefined } from "lodash";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";

export const siderMenu = [
  { name: "Reported Cases", value: "reportedCases" },
  { name: "Case Status Details", value: "caseStatusDetails" },
  { name: "Missing Persons / Unknown Dead Bodies", value: "missingUnknwon" },
  { name: "Arrest/Wanted Persons", value: "arrestWantedPerson" },
];

export const getReportDate = (title, selectedDate) => {
  return (
    <Row gutter={24} style={{ marginBottom: 5 }}>
      <Col style={{ paddingRight: 2, fontSize: 15 }}>{title}</Col>
      <Col style={{ fontWeight: "bold", paddingLeft: 2, fontSize: 15 }}>
        {!isUndefined(selectedDate) && selectedDate !== ""
          ? moment(selectedDate).subtract(1, "days").format(DATE_FORMAT)
          : ""}
      </Col>
    </Row>
  );
};
