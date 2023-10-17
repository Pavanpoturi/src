/* eslint-disable array-callback-return */
import * as React from "react";
import { Row, Col } from "antd";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_WITHOUT_SECONDS,
  showPSName,
} from "@containers/FirDetails/fir-util";
import { first, isEmpty, isUndefined, sumBy, isNull, isArray } from "lodash";
import { filteredDataList, getDataForActs } from "../const";
import AllPagesPDFViewer from "./AllPagesPDFViewer";

const { Component } = React;

class WaterMark extends Component {
  constructor(props) {
    super(props);
    this.imgUrl = this.getImgUrl();
    this.id = "watermark";
  }

  componentDidMount = () => {
    this.parent = this.watermark.parentNode;
    this.initAttribute(this.watermark);
    this.parentObserver = this.observeParent();
    this.selfObserver = this.observeSelf(this.watermark);
  };

  componentWillUnmount = () => {
    this.parentObserver.disconnect();
    this.selfObserver.disconnect();
  };

  getImgUrl = () => {
    const content = "DRAFT";

    const WIDTH = 900;
    const HEIGHT = 700;
    const RATIO = 0.7;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", WIDTH);
    canvas.setAttribute("height", HEIGHT);

    var ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "80px monospace";
    ctx.fillStyle = "rgba(120, 120, 120, 0.4)";
    ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
    ctx.lineWidth = 5;

    // rotate
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.rotate(-(Math.PI / 180) * 30);
    ctx.translate(-WIDTH / 2, -HEIGHT / 2);

    // * Stamp
    ctx.beginPath();
    ctx.moveTo((WIDTH * (1 - RATIO)) / 2, HEIGHT / 2);
    ctx.stroke();
    ctx.fillText(content, WIDTH / 2, (HEIGHT * 2) / 3);
    return canvas.toDataURL();
  };

  observeParent = () => {
    const options = {
      childList: true,
    };
    const callback = (mutationsList) => {
      for (var mutation of mutationsList) {
        let removed = mutation.removedNodes[0];
        if (removed && removed.dataset.watermarkid === this.id) {
          this.selfObserver.disconnect();
          let target = mutation.target;
          this.insertClone(target);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.parent, options);

    return observer;
  };

  observeSelf = (node) => {
    const options = {
      attributes: true,
      attributeOldValue: true,
    };
    const callback = (mutationsList, observer) => {
      for (var mutation of mutationsList) {
        observer.disconnect();
        this.initAttribute(mutation.target);
        observer.observe(node, options);
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(node, options);

    return observer;
  };

  initAttribute = (target) => {
    target.dataset.watermarkid = this.id;
    target.setAttribute(
      "style",
      `position: absolute!important;
      top: 0!important;
      bottom: 0!important;
      left: 0!important;
      right: 0!important;
      margin: 0!important;
      padding: 0!important;
      transform: none!important;
      width: auto!important;
      height: auto!important;
      scale: 1!important;
      display: block!important;
      visibility: visible!important;
      opacity: 1!important;
      z-index: 99999999999999!important;
      pointer-events: none;
      background-repeat: repeat!important;
      background-image: url(${this.imgUrl})!important;
      background-size: auto!important;`
    );
  };

  insertClone = (target) => {
    let clonedWaterMark = this.watermark.cloneNode(true);
    this.selfObserver = this.observeSelf(clonedWaterMark);
    target.appendChild(clonedWaterMark);
  };

  render() {
    return (
      <div
        id={this.id}
        data-watermarkid={this.id}
        ref={(element) => (this.watermark = element)}
      />
    );
  }
}

export class ComponentToPrint extends React.PureComponent {
  render() {
    const templateLogo = loadState("templatesLogo");
    const savedData = this.props.savedFir;
    const petitionDataUrls = this.props.petitionDataUrls;
    const placeOfOccurence = savedData?.firDetail?.placeOfOccurence;
    const cityDistricts =
      savedData?.firType === "Regular"
        ? savedData?.firDetail?.district
        : placeOfOccurence?.cityDistrict;
    const stateName =
      savedData?.firType === "Regular" ? "Telangana" : placeOfOccurence?.state;
    const filterAccusedDetails =
      savedData?.accusedDetails &&
      !isEmpty(savedData?.accusedDetails) &&
      savedData?.accusedDetails.filter(
        (s) => s.isSuspectOrAccused !== "No Accused"
      );
    let distanceAndDirection = "";
    if (
      placeOfOccurence?.psLimits === "inside" &&
      placeOfOccurence?.distanceFromPS &&
      placeOfOccurence?.directionsFromPS
    ) {
      distanceAndDirection = `${placeOfOccurence?.distanceFromPS}, ${placeOfOccurence?.directionsFromPS}`;
    } else if (
      placeOfOccurence?.psLimits === "inside" &&
      !placeOfOccurence?.distanceFromPS &&
      placeOfOccurence?.directionsFromPS
    ) {
      distanceAndDirection = placeOfOccurence?.directionsFromPS;
    } else if (
      placeOfOccurence?.psLimits === "inside" &&
      !placeOfOccurence?.distanceFromPS &&
      !placeOfOccurence?.directionsFromPS
    ) {
      distanceAndDirection = "";
    }
    const complainantDetails =
      !isEmpty(savedData?.complainantDetails) &&
      first(savedData?.complainantDetails)?.person;
    const complainantPersonalDetails = complainantDetails?.personalDetails;
    const complainantContactDetails = complainantDetails?.contactDetails;
    const complainantName = complainantPersonalDetails?.name
      ? complainantPersonalDetails?.name
      : "";
    const complainantSurname = complainantPersonalDetails?.surname
      ? complainantPersonalDetails?.surname
      : "";
    const conmlainantFullName = `${complainantName} ${complainantSurname}`;
    const complainantDoB = complainantPersonalDetails?.dateOfBirth
      ? `${moment().diff(
          complainantPersonalDetails?.dateOfBirth,
          "years"
        )} Years `
      : "";
    const complainantAge = complainantPersonalDetails?.age
      ? `${complainantPersonalDetails?.age} Years`
      : complainantDoB;
    const staffList = this.props.staffListData;
    const actList = this.props.actList;
    const actsAndSections = savedData?.firDetail?.actsAndSections;
    const getActName = (actDescription) =>
      !isEmpty(actList) &&
      first(actList.filter((s) => s.ACT_LONG === actDescription))?.ACT_SHORT;
    let uniqActs = [];
    let diffActs = [];
    let uniqActName = [];
    !isEmpty(actsAndSections) &&
      actsAndSections.map((actSection, _index) => {
        const filteredList = filteredDataList(
          actsAndSections,
          actSection?.actDescription
        );
        getDataForActs(
          filteredList,
          actSection?.actDescription,
          getActName,
          uniqActName,
          uniqActs,
          diffActs
        );
      });
    const briefFacts = savedData?.firDetail?.briefFacts;
    const occurrenceOfOffence = savedData?.firDetail?.occurenceOfOffence;
    const fromDate = occurrenceOfOffence?.fromDate;
    const toDate = occurrenceOfOffence?.toDate;
    const priorToDate = occurrenceOfOffence?.priorToDate;
    let occurrenceOfOffenceDay = "";
    if (fromDate && toDate) {
      occurrenceOfOffenceDay = moment(toDate).format("dddd");
    } else if (!toDate && fromDate) {
      occurrenceOfOffenceDay = moment(fromDate).format("dddd");
    } else if (toDate && !fromDate) {
      occurrenceOfOffenceDay = moment(toDate).format("dddd");
    } else if (!isUndefined(priorToDate) && !isNull(priorToDate)) {
      occurrenceOfOffenceDay = moment(priorToDate).format("dddd");
    } else {
      occurrenceOfOffenceDay = "";
    }
    const stolenProperties = savedData?.stolenProperties;
    const stolenValues =
      isArray(stolenProperties) &&
      stolenProperties.length > 0 &&
      stolenProperties.filter(
        (s) =>
          s.propertyStatus === "Lost" ||
          s.propertyStatus === "Seized" ||
          s.propertyStatus === "Stolen" ||
          s.propertyStatus === "Others"
      );
    const estimatedValue =
      stolenValues.length === 1
        ? parseInt(first(stolenValues)?.estimateValue)
        : sumBy(stolenValues, function (o) {
            return parseInt(o?.estimateValue);
          });
    const checkRank = (user) => {
      if (!isEmpty(user) && !isUndefined(user)) {
        var res = staffList.find((o) => o.employeeName === user);
        if (res?.rankName) {
          return (
            <div>
              <span>{res?.rankName}</span>
            </div>
          );
        } else {
          return (
            <div>
              <span></span>
            </div>
          );
        }
      }
    };
    const checkNo = (user) => {
      if (!isEmpty(user) && !isUndefined(user)) {
        var res = staffList.find((o) => o.employeeName === user);
        if (res?.generalNo) {
          return (
            <div>
              <span>{res?.generalNo}</span>
            </div>
          );
        } else {
          return (
            <div>
              <span></span>
            </div>
          );
        }
      }
    };
    let year = "";
    if (savedData?.firDetail?.firNum) {
      let yeararray = savedData?.firDetail?.firNum.split("/");
      year = yeararray[1] ? yeararray[1] : "";
    }

    const physicalStyle = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 15,
      fontSize: 21,
      fontFamily: "Times New Roman",
    };

    const physicalStyleBody = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 15,
      fontSize: 21,
      fontFamily: "Arial",
    };

    const physicalStyleHead = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 15,
      fontWeight: "bold",
      fontSize: 21,
      fontFamily: "Times New Roman",
    };

    const leftStyle = {
      fontSize: 21,
      fontFamily: "Times New Roman",
      fontWeight: "bold",
      color: "#010203",
    };

    const rightContentStyle = {
      borderBottom: "1px dashed #262626",
      fontSize: 21,
      fontFamily: "Arial",
      color: "#010203",
    };

    const tableContainer = {
      width: "97%",
      borderCollapse: "separate",
      borderSpacing: "0 0.5em",
    };

    const tableContainerChild = {
      width: "97%",
      borderCollapse: "separate",
      borderSpacing: "0 0.5em",
    };

    let RWRequired = "";
    const resultTemp = savedData?.firDetail?.actsAndSections.reduce(
      (acc, { actDescription, section, rwRequired, accShortName }) => {
        if (rwRequired) {
          RWRequired = "r/w ";
        } else {
          RWRequired = "";
        }

        var namesWithGreeting = (arr) => {
          return arr.map((name) => RWRequired + name);
        };
        const getActName = (actDescription) =>
          !isEmpty(actList) &&
          first(actList.filter((s) => s.ACT_LONG === actDescription))
            ?.ACT_SHORT;
        section = namesWithGreeting(section);

        acc[actDescription] = {
          actDescription: actDescription ? actDescription : "",
          accShortName: getActName(actDescription)
            ? getActName(actDescription)
            : "",
          section:
            typeof acc[actDescription] !== "undefined"
              ? acc[actDescription].section.concat(section)
              : section,
        };
        acc[actDescription].section = acc[actDescription].section.filter(
          (item, index) => acc[actDescription].section.indexOf(item) === index
        );
        return acc;
      },
      {}
    );
    let resp = Object.values(resultTemp);

    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <style type="text/css" media="print">
          {"\
   @page { size: portrait; }\
"}
        </style>
        {this.props.isFirGenerated === false ? <WaterMark /> : null}
        <Row gutter={24} style={{ marginBottom: 10 }}>
          <Col span={6} style={{ textAlign: "center" }}>
            <img
              src={templateLogo}
              alt="escopLogo"
              style={{ minHeight: 80, minWidth: 80 }}
            />
          </Col>
          <Col span={11} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Times New Roman",
                color: "#010203",
                fontSize: 24,
                fontWeight: "600",
              }}
            >
              <u>FIRST INFORMATION REPORT</u>
            </div>
            <div
              style={{
                fontFamily: "Times New Roman",
                color: "#010203",
                fontSize: 21,
                fontWeight: 600,
              }}
            >
              <b>(Under Section 154 and 157 Cr.P.C)</b>
            </div>
          </Col>
          <Col
            span={6}
            style={{
              textAlign: "center",
              fontFamily: "Times New Roman",
              fontSize: 21,
              fontWeight: 600,
              color: "#010203",
            }}
          >
            T.S.P.M. Orders 470,500
          </Col>
        </Row>
        {/* Print Row-1 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>1.</td>
              <td style={{ ...leftStyle, width: "8%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {savedData?.firDetail?.district
                  ? savedData?.firDetail?.district
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "4%" }}>P.S.</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {savedData?.firDetail?.psName
                  ? showPSName(savedData?.firDetail?.psName)
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Year</td>
              <td style={{ ...rightContentStyle, width: "7%" }}>{year}</td>
              <td style={{ ...leftStyle, width: "8%" }}>FIR No.</td>
              <td style={{ ...rightContentStyle, width: "9%" }}>
                {savedData?.firDetail?.firNum
                  ? savedData?.firDetail?.firNum
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Date</td>
              <td style={{ ...rightContentStyle, width: "15%" }}>
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
              <td style={{ ...leftStyle, width: "2%" }}>2.</td>
              <td style={{ ...leftStyle, width: "18%" }}>Acts & Section(s):</td>
              <td style={{ ...rightContentStyle, width: "80%" }}>
                {resp.map((t, index) => (
                  <span key={index}>
                    {t.section + " " + t.accShortName + ", "}
                  </span>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-3 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>3.</td>
              <td style={{ ...leftStyle, width: "25%" }}>
                a) Occurrence of Offence:
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>Day</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {occurrenceOfOffenceDay}
              </td>
              <td style={{ ...leftStyle, width: "18%" }}>Date & Time From</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {occurrenceOfOffence?.fromDate
                  ? moment(occurrenceOfOffence?.fromDate).format(
                      DATE_TIME_FORMAT
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-4 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "18%" }}>Date & Time To</td>
              <td style={{ ...rightContentStyle, width: "22%" }}>
                {occurrenceOfOffence?.toDate
                  ? moment(occurrenceOfOffence?.toDate).format(DATE_TIME_FORMAT)
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "10%" }}>Prior To</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {occurrenceOfOffence?.priorToDate
                  ? moment(occurrenceOfOffence?.priorToDate).format(
                      DATE_TIME_FORMAT
                    )
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "12%" }}>Time Period</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {occurrenceOfOffence?.timePeriod
                  ? occurrenceOfOffence?.timePeriod
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-5 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "15%" }}>
                b) Information Received at P.S.:
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Date & Time</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {occurrenceOfOffence?.informationReceivedAtPS
                  ? moment(occurrenceOfOffence?.informationReceivedAtPS).format(
                      DATE_TIME_FORMAT_WITHOUT_SECONDS
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-6 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "22%" }}>
                General Diary Reference:
              </td>
              <td style={{ ...leftStyle, width: "9%" }}>Entry No</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {occurrenceOfOffence?.gdNumber
                  ? occurrenceOfOffence?.gdNumber
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "12%" }}>Date & Time</td>
              <td style={{ ...rightContentStyle, width: "28%" }}>
                {occurrenceOfOffence?.gdDate
                  ? moment(occurrenceOfOffence?.gdDate).format(
                      DATE_TIME_FORMAT_WITHOUT_SECONDS
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-7 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>4.</td>
              <td style={{ ...leftStyle, width: "20%" }}>
                Type of Information:
              </td>
              <td style={{ ...rightContentStyle, width: "88%" }}>
                {occurrenceOfOffence?.informationType
                  ? occurrenceOfOffence?.informationType
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-8 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>5.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Place of Occurrence:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-9 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "25%" }}>
                a) Distance and Direction From P.S.:
              </td>
              <td style={{ ...rightContentStyle, width: "19%" }}>
                {distanceAndDirection || ""}
              </td>
              <td style={{ ...leftStyle, width: "7%" }}>Beat No.</td>
              <td style={{ ...rightContentStyle, width: "19%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "inside" &&
                placeOfOccurence?.beatNo
                  ? placeOfOccurence?.beatNo
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-10 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "12%" }}>b) Address</td>
              <td style={{ ...leftStyle, width: "6%" }}>Place</td>
              <td style={{ ...rightContentStyle, width: "16%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "inside" &&
                placeOfOccurence?.houseNo
                  ? placeOfOccurence?.houseNo
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "14%" }}>Area/Mandal</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "inside" &&
                placeOfOccurence?.areaMandal
                  ? placeOfOccurence?.areaMandal
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "14%" }}>Street/Village</td>
              <td style={{ ...rightContentStyle, width: "24%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "inside" &&
                placeOfOccurence?.wardColony
                  ? placeOfOccurence?.wardColony
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-11 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1.5%" }} />
              <td style={{ ...leftStyle, width: "10%" }}>City/District</td>
              <td style={{ ...rightContentStyle, width: "22%" }}>
                {cityDistricts}
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>State</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {stateName}
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>PIN</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "inside" &&
                placeOfOccurence?.pinCode
                  ? placeOfOccurence?.pinCode
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-12 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }}>
                c) In case, outside the limit of this Police Station, then
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-13 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "8%" }}>Name of P.S.</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "outside" &&
                placeOfOccurence?.ps
                  ? placeOfOccurence?.ps
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {placeOfOccurence &&
                placeOfOccurence?.psLimits === "outside" &&
                placeOfOccurence?.state
                  ? placeOfOccurence?.cityDistrict
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-14 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>6.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Complainant / Informant:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-15 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>a)</td>
              <td style={{ ...leftStyle, width: "6%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "75%" }}>
                {conmlainantFullName}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-16 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>b)</td>
              <td style={{ ...leftStyle, width: "23%" }}>
                Father's /Husband's Name
              </td>
              <td style={{ ...rightContentStyle, width: "60%" }}>
                {complainantPersonalDetails &&
                complainantPersonalDetails?.fatherHusbandGuardianName
                  ? complainantPersonalDetails?.fatherHusbandGuardianName
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-17 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>c)</td>
              <td style={{ ...leftStyle, width: "16%" }}>Date/Year of Birth</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantPersonalDetails &&
                complainantPersonalDetails?.dateOfBirth
                  ? moment(complainantPersonalDetails?.dateOfBirth).format(
                      DATE_FORMAT
                    )
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>Age</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantAge || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-18 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>d)</td>
              <td style={{ ...leftStyle, width: "9%" }}>Nationality</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantPersonalDetails &&
                complainantPersonalDetails?.nationality
                  ? complainantPersonalDetails?.nationality
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "7%" }}>e) Caste</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantPersonalDetails && complainantPersonalDetails?.caste
                  ? complainantPersonalDetails?.caste
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-19 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>f)</td>
              <td style={{ ...leftStyle, width: "12%" }}>Passport No</td>
              <td style={{ ...rightContentStyle, width: "20%" }} />
              <td style={{ ...leftStyle, width: "12%" }}>Date of Issue</td>
              <td style={{ ...rightContentStyle, width: "20%" }} />
              <td style={{ ...leftStyle, width: "14%" }}>Place of Issue</td>
              <td style={{ ...rightContentStyle, width: "18%" }} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-20 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>g)</td>
              <td style={{ ...leftStyle, width: "9%" }}>Occupation</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantPersonalDetails &&
                complainantPersonalDetails?.occupation
                  ? complainantPersonalDetails?.occupation
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "9%" }}>Mobile No.</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {complainantContactDetails &&
                first(complainantContactDetails)?.phoneNumber
                  ? first(complainantContactDetails).phoneNumber
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-21 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2.3%" }}>h)</td>
              <td style={{ ...leftStyle, width: "12%" }}>Address</td>
              <td style={{ ...leftStyle, width: "10%" }}>House No</td>
              <td style={{ ...rightContentStyle, width: "14%" }}>
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.houseNo
                  ? complainantDetails?.presentAddress?.houseNo
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "14%" }}>Area/Mandal</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {" "}
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.areaMandal
                  ? complainantDetails?.presentAddress?.areaMandal
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "14%" }}>Street/Village</td>
              <td style={{ ...rightContentStyle, width: "22%" }}>
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.localityVillage
                  ? complainantDetails?.presentAddress?.localityVillage
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-22 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1.5%" }} />
              <td style={{ ...leftStyle, width: "5%" }}>City/District</td>
              <td style={{ ...rightContentStyle, width: "22%" }}>
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.district
                  ? complainantDetails?.presentAddress?.district
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>State</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.stateUt
                  ? complainantDetails?.presentAddress?.stateUt
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>PIN</td>
              <td style={{ ...rightContentStyle, width: "10%" }}>
                {complainantDetails &&
                complainantDetails?.presentAddress &&
                complainantDetails?.presentAddress?.pinCode
                  ? complainantDetails?.presentAddress?.pinCode
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-23 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>7.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Details of known/suspected/unknown accused with full
                particulars:
              </td>
            </tr>
          </tbody>
        </table>

        {filterAccusedDetails &&
          !isEmpty(filterAccusedDetails) &&
          filterAccusedDetails.map((data, index) => {
            const accusedPersonalDetails =
              !isUndefined(data?.person) && data?.person?.personalDetails;
            const accusedName = accusedPersonalDetails?.name
              ? accusedPersonalDetails?.name
              : "";
            const accusedSurname = accusedPersonalDetails?.surname
              ? accusedPersonalDetails?.surname
              : "";
            const accusedFullName = `${accusedName} ${accusedSurname}`;
            const accusedDoB = accusedPersonalDetails?.dateOfBirth
              ? `${moment().diff(
                  accusedPersonalDetails?.dateOfBirth,
                  "years"
                )} Years `
              : "";
            const accusedAge = accusedPersonalDetails?.age
              ? `${accusedPersonalDetails?.age} Years`
              : accusedDoB;
            const presentAddress = data?.person?.presentAddress;
            const contactDetails = data?.person?.contactDetails;
            return (
              <>
                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "11%" }}>
                        Serial No :
                      </td>
                      <td style={{ ...rightContentStyle, width: "10%" }}>
                        {index + 1}
                      </td>
                      <td style={{ width: "80%" }} />
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>a)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Name</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {data?.isSuspectOrAccused === "Unknown"
                          ? "Unknown"
                          : accusedFullName}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>b)</td>
                      <td style={{ ...leftStyle, width: "22%" }}>
                        Father's /Husband's Name
                      </td>
                      <td style={{ ...rightContentStyle, width: "60%" }}>
                        {accusedPersonalDetails?.fatherHusbandGuardianName
                          ? accusedPersonalDetails?.fatherHusbandGuardianName
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>c)</td>
                      <td style={{ ...leftStyle, width: "10%" }}>Occupation</td>
                      <td style={{ ...rightContentStyle, width: "20%" }}>
                        {accusedPersonalDetails?.occupation
                          ? accusedPersonalDetails?.occupation
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "8%" }}>d) Caste</td>
                      <td style={{ ...rightContentStyle, width: "18%" }}>
                        {accusedPersonalDetails?.caste
                          ? accusedPersonalDetails?.caste
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "10%" }}>e) Gender</td>
                      <td style={{ ...rightContentStyle, width: "18%" }}>
                        {accusedPersonalDetails?.gender
                          ? accusedPersonalDetails?.gender
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>f)</td>
                      <td style={{ ...leftStyle, width: "4%" }}>Age</td>
                      <td style={{ ...rightContentStyle, width: "30%" }}>
                        {accusedAge || ""}
                      </td>
                      <td style={{ ...leftStyle, width: "8%" }}>Nationality</td>
                      <td style={{ ...rightContentStyle, width: "30%" }}>
                        {accusedPersonalDetails?.nationality
                          ? accusedPersonalDetails?.nationality
                          : ""}
                      </td>
                      <td style={{ ...rightContentStyle, width: "10%" }} />
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>g)</td>
                      <td style={{ ...leftStyle, width: "4%" }}>Address</td>
                      <td style={{ width: "80%" }} />
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }} />
                      <td style={{ ...leftStyle, width: "10%" }}>House No</td>
                      <td style={{ ...rightContentStyle, width: "12%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.houseNo
                          ? presentAddress?.houseNo
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "14%" }}>
                        Street/Village
                      </td>
                      <td style={{ ...rightContentStyle, width: "24%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.localityVillage
                          ? presentAddress?.localityVillage
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "14%" }}>
                        Area/Mandal
                      </td>
                      <td style={{ ...rightContentStyle, width: "24%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.areaMandal
                          ? presentAddress?.areaMandal
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }} />
                      <td style={{ ...leftStyle, width: "12%" }}>
                        City/District
                      </td>
                      <td style={{ ...rightContentStyle, width: "25%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.district
                          ? presentAddress?.district
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "6%" }}>State</td>
                      <td style={{ ...rightContentStyle, width: "25%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.stateUt
                          ? presentAddress?.stateUt
                          : ""}
                      </td>
                      <td style={{ ...leftStyle, width: "5%" }}>PIN</td>
                      <td style={{ ...rightContentStyle, width: "18%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        presentAddress &&
                        presentAddress?.pinCode
                          ? presentAddress?.pinCode
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>h)</td>
                      <td style={{ ...leftStyle, width: "10%" }}>Phone(Off)</td>
                      <td style={{ ...rightContentStyle, width: "20%" }} />
                      <td style={{ ...leftStyle, width: "8%" }}>Phone(Resi)</td>
                      <td style={{ ...rightContentStyle, width: "20%" }} />
                      <td style={{ ...leftStyle, width: "8%" }}>Cell No</td>
                      <td style={{ ...rightContentStyle, width: "20%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        contactDetails &&
                        contactDetails[0]?.phoneNumber
                          ? contactDetails[0]?.phoneNumber
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
                  <tbody>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>i)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Email</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {!isEmpty(data) &&
                        data?.person &&
                        contactDetails &&
                        contactDetails[0]?.emailId
                          ? contactDetails[0]?.emailId
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            );
          })}

        {/* Print Row-24 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "90%" }}>
                Physical features, deformities and other details of the Suspect:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-25 */}
        <table
          style={{ border: "1px solid #ccc", width: "93%", marginLeft: "3%" }}
        >
          <tbody>
            <tr style={{ ...physicalStyleHead, display: "contents" }}>
              <td style={physicalStyle}>S. No.</td>
              <td style={physicalStyle}>Sex</td>
              <td style={physicalStyle}>Date/Year of Birth</td>
              <td style={physicalStyle}>Build</td>
              <td style={physicalStyle}>Height (cms)</td>
              <td style={physicalStyle}>Complexion</td>
              <td style={physicalStyle}>Identification Marks(s)</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>1</td>
              <td style={physicalStyle}>2</td>
              <td style={physicalStyle}>3</td>
              <td style={physicalStyle}>4</td>
              <td style={physicalStyle}>5</td>
              <td style={physicalStyle}>6</td>
              <td style={physicalStyle}>7</td>
            </tr>
            {filterAccusedDetails &&
              !isEmpty(filterAccusedDetails) &&
              filterAccusedDetails.map((data, index) => {
                const physicalFeatures = data?.physicalFeatures;
                const personalDetails =
                  data?.person && data?.person?.personalDetails;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>{index + 1}</td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && physicalFeatures
                        ? physicalFeatures.gender
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) &&
                      personalDetails &&
                      personalDetails?.dateOfBirth
                        ? moment(personalDetails?.dateOfBirth).format(
                            DATE_FORMAT
                          )
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && physicalFeatures
                        ? physicalFeatures.build
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && physicalFeatures
                        ? physicalFeatures.height
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && physicalFeatures
                        ? physicalFeatures.color
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && physicalFeatures
                        ? physicalFeatures.otherBodyFeatures
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-26 */}
        <table
          style={{
            border: "1px solid #ccc",
            width: "93%",
            marginLeft: "3%",
            marginTop: "2%",
          }}
        >
          <tbody>
            <tr style={{ ...physicalStyleHead, display: "contents" }}>
              <td style={physicalStyle}>
                Deformalities/
                <br /> Peculiarities
              </td>
              <td style={physicalStyle}>Teeth</td>
              <td style={physicalStyle}>Hair</td>
              <td style={physicalStyle}>Eyes</td>
              <td style={physicalStyle}>Habbit(s)</td>
              <td style={physicalStyle}>Dress Habit(s)</td>
              <td style={physicalStyle}>Languages/ Dialect</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>8</td>
              <td style={physicalStyle}>9</td>
              <td style={physicalStyle}>10</td>
              <td style={physicalStyle}>11</td>
              <td style={physicalStyle}>12</td>
              <td style={physicalStyle}>13</td>
              <td style={physicalStyle}>14</td>
            </tr>
            {filterAccusedDetails &&
              !isEmpty(filterAccusedDetails) &&
              filterAccusedDetails.map((data) => {
                const physicalFeatures = data?.physicalFeatures;
                return (
                  <tr style={physicalStyleBody}>
                    <td style={physicalStyleBody}>
                      {physicalFeatures
                        ? physicalFeatures.otherBodyFeatures
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures ? physicalFeatures.teeth : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures ? physicalFeatures.hair : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures ? physicalFeatures.eyes : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures
                        ? physicalFeatures.otherBodyFeatures
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures
                        ? physicalFeatures.otherBodyFeatures
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures
                        ? physicalFeatures.otherBodyFeatures
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-27 */}
        <table
          style={{
            border: "1px solid #262626",
            width: "93%",
            marginLeft: "3%",
            marginTop: "2%",
            marginBottom: "1%",
          }}
        >
          <tbody>
            <tr style={{ ...physicalStyle, display: "contents" }}>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: 5,
                  fontWeight: "bold",
                  fontSize: 21,
                  fontFamily: "Times New Roman",
                }}
              >
                Place Of Offence
              </td>
            </tr>
            <tr style={physicalStyleHead}>
              <td style={physicalStyle}>Burn Mark</td>
              <td style={physicalStyle}>Leucoderma</td>
              <td style={physicalStyle}>Mole</td>
              <td style={physicalStyle}>Scar</td>
              <td style={physicalStyle}>Tattoo</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>15</td>
              <td style={physicalStyle}>16</td>
              <td style={physicalStyle}>17</td>
              <td style={physicalStyle}>18</td>
              <td style={physicalStyle}>19</td>
            </tr>
            {filterAccusedDetails &&
              !isEmpty(filterAccusedDetails) &&
              filterAccusedDetails.map((data) => {
                const physicalFeatures = data?.physicalFeatures;
                return (
                  <tr style={physicalStyleBody}>
                    <td style={physicalStyleBody}>
                      {physicalFeatures && physicalFeatures?.burnMark
                        ? physicalFeatures?.burnMark
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures && physicalFeatures?.leucodema
                        ? physicalFeatures?.leucodema
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures && physicalFeatures?.mole
                        ? physicalFeatures?.mole
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures && physicalFeatures?.scar
                        ? physicalFeatures?.scar
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {physicalFeatures && physicalFeatures?.tatto
                        ? physicalFeatures?.tatto
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-28 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>8.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Reasons for delay in reporting by the complainant / informant:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-29 */}
        <table style={{ ...tableContainerChild, marginLeft: "2%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={rightContentStyle}>
                <div
                  style={{
                    marginRight: 10,
                    whiteSpace: "break-spaces",
                    wordBreak: "break-all",
                  }}
                >
                  {occurrenceOfOffence?.reasonForDelay
                    ? occurrenceOfOffence?.reasonForDelay
                    : ""}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-30 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>9.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Particulars of properties stolen/involved (Attach separate
                sheet, if necessary):
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-31 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...rightContentStyle, width: "100%" }}>
                {isArray(stolenProperties) &&
                stolenProperties.length > 0 &&
                stolenProperties[0]?.particularOfProperty ? (
                  <span style={{ fontSize: 21 }}>
                    {" "}
                    {stolenProperties[0]?.particularOfProperty}
                  </span>
                ) : (
                  isArray(stolenProperties) &&
                  stolenProperties.length > 0 &&
                  stolenProperties.map((s, i) => {
                    return (
                      <span style={{ fontSize: 21 }}>
                        {`${s.natureofStolen}${
                          i !== stolenProperties.length - 1 ? ", " : " "
                        }`}
                      </span>
                    );
                  })
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-32 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>10.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Total value of property stolen:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-33 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...rightContentStyle, width: "100%" }}>
                {estimatedValue || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-34 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>11.</td>
              <td style={{ ...leftStyle, width: "25%" }}>
                Inquest Report/ U.D. Case
              </td>
              <td style={rightContentStyle} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-35 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>12.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Contents of the complaint / statement of the complainant or
                informant:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-36 */}
        <table style={{ ...tableContainerChild, marginLeft: "2%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={rightContentStyle}>
                <div
                  style={{
                    marginRight: 10,
                    whiteSpace: "break-spaces",
                    fontSize: 21,
                    wordBreak: "break-all",
                  }}
                >
                  {briefFacts?.factsOfComplainant
                    ? briefFacts?.factsOfComplainant
                    : ""}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-37 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>13.</td>
              <td style={{ ...leftStyle, width: "90%" }}>Action taken:</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-38 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "78%" }}>
                Since The above information reveals commission of offence(s) U/s
                as mentioned at item No:
              </td>
              <td style={{ ...rightContentStyle, width: "12%" }} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-39 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1%" }}>1)</td>
              <td style={{ ...leftStyle, width: "45%" }}>
                Registered the case and took up the investigation or
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {briefFacts?.ioAssignedName ? briefFacts?.ioAssignedName : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-40 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1%" }}>2)</td>
              <td style={{ ...leftStyle, width: "42%" }}>
                Directed to take up the Investigation or
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>Rank:</td>
              <td style={{ ...rightContentStyle, width: "8%" }}>
                {checkRank(briefFacts?.ioAssignedName)}
              </td>
              <td style={{ ...leftStyle, width: "5%" }}>No.</td>
              <td style={{ ...rightContentStyle, width: "5%" }}>
                {checkNo(briefFacts?.ioAssignedName)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-41 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2.2%" }}>3)</td>
              <td style={{ ...leftStyle, width: "28%" }}>
                Refused investigation due to
              </td>
              <td style={{ ...rightContentStyle, width: "68%" }}>
                {briefFacts?.refusedReason ? briefFacts?.refusedReason : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-42 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1%" }}>4)</td>
              <td style={{ ...leftStyle, width: "12%" }}>Transferred to P.S</td>
              <td style={{ ...rightContentStyle, width: "7%" }} />
              <td style={{ ...rightContentStyle, width: "8%" }} />
              <td style={{ ...leftStyle, width: "5%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "14%" }} />
              <td style={{ ...leftStyle, width: "16%" }}>
                on point of jurisdiction.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-43 */}
        <table
          style={{
            ...tableContainer,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }} />
              <td style={leftStyle}>
                F.I.R. read over to the complainant / informant, admitted to be
                correctly recorded and
                <br /> a copy given to the complainant /informant, free of cost.
                <br />
                R.O.A.C
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-44 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "2%",
            float: "left",
            width: "60%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "6%" }}>14.</td>
              <td style={leftStyle}>
                Signature / Thumb impression of the
                <br /> complainant / informant.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-45 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "2%",
            float: "right",
            width: "40%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={leftStyle}>
                Signature of Officer in charge, Police Station
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-46 */}
        <table
          style={{
            ...tableContainer,
            float: "right",
            width: "40%",
            marginTop: "5%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "15%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "90%" }}>
                {briefFacts?.firIssuedBy ? briefFacts?.firIssuedBy : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-47 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "1%",
            width: "100%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }} />
              <td style={{ ...leftStyle, width: "6%" }}>Rank</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {checkRank(briefFacts?.firIssuedBy)}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>No</td>
              <td style={{ ...rightContentStyle, width: "15%" }}>
                {checkNo(briefFacts?.firIssuedBy)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-48 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "1%",
            marginBottom: "3%",
            pageBreakAfter: "always",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "3%" }}>15.</td>
              <td style={{ ...leftStyle, width: "38%" }}>
                Date and time of dispatch to the court:
              </td>
              <td style={rightContentStyle}>
                {briefFacts?.dateOfCourtDispatch
                  ? moment(briefFacts?.dateOfCourtDispatch).format(
                      DATE_TIME_FORMAT
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {!isEmpty(petitionDataUrls) &&
          petitionDataUrls.map((item, i) => {
            return item.mimeType === "application/pdf" ? (
              <AllPagesPDFViewer pdf={item?.imgUrl} />
            ) : (
              <img
                src={item?.imgUrl}
                alt={item.team}
                style={{ width: "100%" }}
              />
            );
          })}
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
