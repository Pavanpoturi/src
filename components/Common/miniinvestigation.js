import { useEffect, useState } from "react";
import { Row, Card, Col } from "antd";
import moment from "moment";
import {
  getPlaceOfOccurrence,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import { isUndefined, isNull } from "lodash";
import { Link } from "react-router-dom";

export default function MiniInvestigationForm(props) {
  const [occurrenceOfOffenceDate, setOccurrenceOfOffenceDate] = useState("");
  const selectedFirData = props?.selectedFirData;
  const firDetail = selectedFirData?.firDetail;
  const fromDate = firDetail?.occurenceOfOffence?.fromDate;
  const toDate = firDetail?.occurenceOfOffence?.toDate;
  const priorToDate = firDetail?.occurenceOfOffence?.priorToDate;
  const placeOfOccurence = firDetail?.placeOfOccurence;

  useEffect(() => {
    if (fromDate && toDate) {
      var occurrenceOfOffenceDay = moment(toDate).format(DATE_TIME_FORMAT);
    } else if (!toDate && fromDate) {
      occurrenceOfOffenceDay = moment(fromDate).format(DATE_TIME_FORMAT);
    } else if (toDate && !fromDate) {
      occurrenceOfOffenceDay = moment(toDate).format(DATE_TIME_FORMAT);
    } else if (!isUndefined(priorToDate) && !isNull(priorToDate)) {
      occurrenceOfOffenceDay = moment(priorToDate).format(DATE_TIME_FORMAT);
    } else {
      occurrenceOfOffenceDay = "";
    }
    setOccurrenceOfOffenceDate(occurrenceOfOffenceDay);
  });

  return (
    <div style={{ marginBottom: 15 }}>
      <Col span={24}>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>FIR No</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {!!selectedFirData?._id === true ? (
              <Link
                to={{
                  pathname: `./generated-fir/${selectedFirData?._id}`,
                }}
                onClick={() => [
                  localStorage.setItem(
                    "selectedFirId",
                    JSON.stringify(selectedFirData?._id)
                  ),
                  localStorage.removeItem("selectedCaseStatus"),
                ]}
              >
                <u>{firDetail?.firNum}</u>
              </Link>
            ) : (
              <a>
                <u>{firDetail?.firNum}</u>
              </a>
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>PS Name</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${!!firDetail?.psName ? firDetail?.psName : "NA"}`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Section of Law</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${
              !!firDetail?.actsAndSections ? firDetail?.actsAndSections : "NA"
            }`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Date & Time of Occurence</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>{`${occurrenceOfOffenceDate}`}</Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Date & time of Report</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${!!firDetail?.dateOfReport ? firDetail?.dateOfReport : "NA"}`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Place of Occurence</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${getPlaceOfOccurrence(placeOfOccurence, fromDate)}`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Complainant Name</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${
              Array.isArray(selectedFirData?.complainantDetails)
                ? selectedFirData?.complainantDetails[0]?.name
                : "NA"
            }`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Victim Details</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {Array.isArray(selectedFirData?.victimDetails) &&
            selectedFirData?.victimDetails?.length !== 0 ? (
              <Card>
                {selectedFirData?.victimDetails.map((a, i) => (
                  <p>
                    {i +
                      1 +
                      "  " +
                      Object.values(a)
                        .filter((item) => !!item === true)
                        .join(", ")}
                  </p>
                ))}
              </Card>
            ) : (
              "NA"
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Accused Details</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {Array.isArray(selectedFirData?.accusedDetails) &&
            selectedFirData?.accusedDetails?.length !== 0 ? (
              <Card>
                {selectedFirData?.accusedDetails.map((a, i) => (
                  <p>
                    {i +
                      1 +
                      "  " +
                      Object.values(a)
                        .filter((item) => !!item === true)
                        .join(", ")}
                  </p>
                ))}
              </Card>
            ) : (
              "NA"
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Witness Details</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {Array.isArray(selectedFirData?.witnessDetails) &&
            selectedFirData?.witnessDetails?.length !== 0 ? (
              <Card>
                {selectedFirData?.witnessDetails.map((a, i) => (
                  <p>
                    {i +
                      1 +
                      "  " +
                      Object.values(a)
                        .filter((item) => !!item === true)
                        .join(", ")}
                  </p>
                ))}
              </Card>
            ) : (
              "NA"
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Stage of Case</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${
              !!selectedFirData?.stageOfCase
                ? selectedFirData?.stageOfCase
                : "NA"
            }`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Chargesheet Sheet Date</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${
              !!selectedFirData?.chargeSheetDate
                ? selectedFirData?.chargeSheetDate
                : "NA"
            }`}
          </Col>
        </Row>
        <Row style={{ marginBottom: 25 }}>
          <Col span={5}>
            <p>Court Name</p>
          </Col>
          <Col span={1}>: </Col>
          <Col span={18}>
            {`${
              !!selectedFirData?.courtName ? selectedFirData?.courtName : "NA"
            }`}
          </Col>
        </Row>
      </Col>
    </div>
  );
}
