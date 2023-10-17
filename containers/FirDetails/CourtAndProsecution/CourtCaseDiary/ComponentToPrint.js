/* eslint-disable array-callback-return */
import * as React from "react";
import { Row, Col } from "antd";
import moment from "moment";
import { isArray, isEmpty, startCase } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { DATE_FORMAT, showPSName } from "@containers/FirDetails/fir-util";

export class ComponentToPrint extends React.PureComponent {
  render() {
    const templateLogo = loadState("templatesLogo");
    const savedData = this.props.savedFir;
    const selectedCourtAndProsecution = this.props.selectedCourtAndProsecution;
    const firDetail = savedData?.firDetail;
    const occurrenceOfOffence = firDetail?.occurenceOfOffence;
    const caseType = selectedCourtAndProsecution?.caseType;
    const chargesheetNo = selectedCourtAndProsecution?.chargesheetNo;
    const chargesheetDate = selectedCourtAndProsecution?.chargesheetDate;
    const courtName = selectedCourtAndProsecution?.courtName;
    const complainantName = firDetail?.crimeShownBy;
    const stolenPropertiesValue =
      savedData?.stolenProperties[0]?.totalEstimatedValue;
    const recoveredValue = savedData?.stolenProperties[0]?.recoveredValue;
    const caseDiaryData = this.props.caseDiaryData;
    const courtCaseNo = selectedCourtAndProsecution?.courtCaseNo;
    const {
      accusedDetails = [],
      witnessDetails = [],
      defenseWitness = [],
    } = caseDiaryData;

    const getName = (name = "", surname = "") => {
      if (!isEmpty(name) && isEmpty(surname)) {
        return startCase(name);
      }
      return startCase(name + " " + surname);
    };

    const leftStyle = {
      fontSize: 16,
      fontFamily: "Times New Roman",
      fontWeight: "bold",
      color: "#010203",
    };

    const rightContentStyle = {
      borderBottom: "1px dashed #262626",
      fontSize: 16,
      fontFamily: "Arial",
      color: "#010203",
    };

    const tableContainer = {
      width: "97%",
      borderCollapse: "separate",
      borderSpacing: "0 0.5em",
    };

    const midPointData = {
      fontSize: 16,
      fontFamily: "Times New Roman",
      fontWeight: "bold",
      color: "#010203",
      width: "4%",
    };

    const dashStyle = {
      display: "inline-block",
      minWidth: 40,
      borderBottom: "1px dashed #262626",
      fontSize: 16,
      fontFamily: "Arial",
      color: "#010203",
      margin: "0 15px 0 10px",
    };

    const labelStyle = {
      fontSize: 16,
      fontFamily: "Times New Roman",
      fontWeight: "bold",
      color: "#010203",
    };

    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <style type="text/css" media="print">
          {
            "\
   @page { size: portrait; }\
"
          }
        </style>
        <Row gutter={24} style={{ marginBottom: 10 }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <img
              src={templateLogo}
              alt="escopLogo"
              style={{ minHeight: 80, minWidth: 80 }}
            />
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Times New Roman",
                color: "#010203",
                fontSize: 24,
                fontWeight: "600",
              }}
            >
              <u>COURT CASE DIARY</u>
            </div>
          </Col>
        </Row>

        {/* Print Row-1 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "10%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {firDetail?.district ? firDetail?.district : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>P.S.</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {firDetail?.psName ? showPSName(firDetail?.psName) : ""}
              </td>
              <td style={{ ...leftStyle, width: "10%" }}>FIR No.</td>
              <td style={{ ...rightContentStyle, width: "11%" }}>
                {firDetail?.firNum ? firDetail?.firNum : ""}
              </td>
              <td style={{ ...leftStyle, width: "12%" }}>FIR Date</td>
              <td style={{ ...rightContentStyle, width: "19%" }}>
                {occurrenceOfOffence?.firDate
                  ? moment(occurrenceOfOffence?.firDate).format(DATE_FORMAT)
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-2 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "21%" }}>Charge Sheet Date</td>
              <td style={{ ...rightContentStyle, width: "14%" }}>
                {chargesheetDate
                  ? moment(chargesheetDate).format(DATE_FORMAT)
                  : ""}{" "}
              </td>
              <td style={{ ...leftStyle, width: "20%" }}>Charge Sheet No.</td>
              <td style={{ ...rightContentStyle, width: "9%" }}>
                {chargesheetNo ? chargesheetNo : ""}
              </td>
              <td style={{ ...leftStyle, width: "12%" }}>Case Type</td>
              <td style={{ ...rightContentStyle, width: "10%" }}>
                {caseType ? caseType : ""}
              </td>
              <td style={{ ...leftStyle, width: "9%" }}>CC No.</td>
              <td style={{ ...rightContentStyle, width: "6%" }}>
                {courtCaseNo ? courtCaseNo : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-3 */}
        <p style={{ ...tableContainer, lineHeight: "30px" }}>
          <span style={{ ...labelStyle }}>Court Name</span>
          <span style={{ ...dashStyle }}>{courtName ? courtName : ""} </span>
          <span style={{ ...labelStyle }}>Name of Complainant</span>
          <span style={{ ...dashStyle }}>
            {complainantName ? complainantName : ""}
          </span>
          <span style={{ ...labelStyle }}>Property Lost</span>
          <span style={{ ...dashStyle }}>
            {stolenPropertiesValue ? stolenPropertiesValue : ""}
          </span>
          <span style={{ ...labelStyle, marginTop: "8px" }}>
            Property Recovered
          </span>
          <span style={{ ...dashStyle, marginTop: "8px" }}>
            {recoveredValue ? recoveredValue : ""}
          </span>
        </p>
        <br />

        {/* Print Row-4 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Names of Accused</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {isArray(accusedDetails) &&
                  accusedDetails.map((item, index) => (
                    <>
                      {index !== 0 ? ", " : ""}
                      {getName(
                        item?.person?.personalDetails?.name,
                        item?.person?.personalDetails?.surname
                      )}
                    </>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-5 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Names of Witness</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {isArray(witnessDetails) &&
                  witnessDetails.map((item, index) => (
                    <>
                      {index !== 0 ? ", " : ""}
                      {getName(
                        item?.person?.personalDetails?.name,
                        item?.person?.personalDetails?.surname
                      )}
                    </>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-5 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Names of Defence</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {isArray(defenseWitness) &&
                  defenseWitness.map((item, index) => (
                    <>
                      {index !== 0 ? ", " : ""}
                      {getName(item?.name)}
                    </>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* Print Row-6 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Adj No</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.trialno}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-7 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Adjournment Date</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.dateOfTrial
                  ? moment(caseDiaryData?.dateOfTrial).format(DATE_FORMAT)
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-8 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>
                Next Adjournment Date
              </td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.dateOfNextHearing
                  ? moment(caseDiaryData?.dateOfNextHearing).format(DATE_FORMAT)
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-9 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Stage of the Case</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.trialFor ? caseDiaryData?.trialFor : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-10 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>
                Name of Court Const.
              </td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-11 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>PP/APP</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.ppName ? caseDiaryData?.ppName : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-12 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Defence Counsel</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.personDefenseCounsel?.personalDetails?.name
                  ? caseDiaryData?.personDefenseCounsel?.personalDetails?.name
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-13 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "26%" }}>Court Proceedings</td>
              <td style={midPointData}>:</td>
              <td style={{ ...rightContentStyle, width: "70%" }}>
                {caseDiaryData?.courtProceedings
                  ? caseDiaryData?.courtProceedings
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <ComponentToPrint
      ref={ref}
      text={props.text}
      isFirGenerated={props.isFirGenerated}
    />
  );
});
