import * as React from "react";
import { isUndefined, isEmpty, isNull, last, isString } from "lodash";
import { Row, Col } from "antd";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  DATE_FORMAT,
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
  getPersonPermanentAddressPrint,
  getTemplatesSectionsData,
  showPSName,
  getPlaceOfOccurrence,
} from "@containers/FirDetails/fir-util";

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
    const content = "LookOut Notice";

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
    const savedData = this.props.savedFir;
    const caseDiaryList =
      !isEmpty(this.props.caseDiaryList) && this.props.caseDiaryList;
    const selectedCaseDiary = this.props.selectedRecord;
    const witnessStatementListNew = this.props.witnessStatementListNew;
    const suspectAccusedList = this.props.suspectAccusedList;
    const deceasedListDetails = this.props.deceasedListDetails;
    const stolenPropertyList = this.props.stolenPropertyList;
    const ioOfficer = savedData?.firDetail?.briefFacts?.ioAssignedName;
    const currentUser = loadState("currentUser");
    const complainantList = loadState("complainantList");
    const selectedActsData = loadState("selectedActDetails");
    const selectedFir = loadState("selectedFir");
    const knownList =
      !isEmpty(suspectAccusedList) &&
      suspectAccusedList.filter((k) => k.isSuspectOrAccused !== "Unknown");
    const lostProperties =
      stolenPropertyList &&
      stolenPropertyList.filter(
        (l) => l.propertyStatus === "Lost" || l.propertyStatus === "Stolen"
      );
    const recoveredProperties =
      stolenPropertyList &&
      stolenPropertyList.filter((r) => r.propertyStatus === "Recovered");

    const checkList = () => {
      const list = ["PC", "HC", "ASI"];
      if (list.includes(currentUser.rank_name)) {
        return (
          <div>
            <span
              style={{
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                fontSize: 23,
              }}
            >
              {currentUser?.rank_name} - {currentUser?.general_no}
            </span>
          </div>
        );
      } else {
        return (
          <div>
            <span
              style={{
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                fontSize: 23,
              }}
            >
              {currentUser?.rank_name}
            </span>
          </div>
        );
      }
    };

    var section = selectedFir?.actsAndSections.map(function (i) {
      return i.section;
    });
    var merged = [].concat.apply([], section);
    var actsSections = merged?.toString();

    const showHtml = () => {
      var myStringHTML = selectedCaseDiary?.gistInvestigation;
      return (
        <div
          dangerouslySetInnerHTML={{ __html: myStringHTML }}
          style={{
            fontSize: 23,
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            maxWidth: "900px",
          }}
        />
      );
    };

    const renderComplainantNames = (itemList) => (
      <div style={{ minHeight: "auto", marginRight: 20 }}>
        {!isEmpty(itemList) &&
          itemList.map((item, i) => {
            const personalDetails =
              !isUndefined(item?.person) && item?.person?.personalDetails;
            const phoneNumber =
              !isUndefined(item?.person?.contactDetails) &&
              item?.person?.contactDetails[0]?.phoneNumber;
            const presentAddress =
              !isUndefined(item?.person) && item?.person?.presentAddress;
            const permanentAddress =
              !isUndefined(item?.person) && item?.person?.permanentAddress;
            return (
              <div
                key={i}
                style={{
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                }}
              >
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {getPersonPersonalDetailsPrint(personalDetails)}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {phoneNumber ? `contact no: ${phoneNumber},` : ""}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {getPersonPersonalAddressPrint(presentAddress)}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {getPersonPermanentAddressPrint(permanentAddress)}
                </span>
              </div>
            );
          })}
      </div>
    );

    const renderAccusedDetails = (itemList) => (
      <div style={{ minHeight: "auto", marginRight: 20 }}>
        {isEmpty(itemList) ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 15,
              color: "#A8A8A8",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 23,
            }}
          ></div>
        ) : (
          itemList.map((item, i) => {
            const status = !isUndefined(item?.status) && item?.status;
            const personalDetails =
              !isUndefined(item?.person) && item?.person?.personalDetails;
            const presentAddress =
              !isUndefined(item?.person) && item?.person?.presentAddress;
            const permanentAddress =
              !isUndefined(item?.person) && item?.person?.permanentAddress;
            return (
              <tr>
                <td style={{ width: "4%" }}>{i + 1}. </td>
                <td>
                  {getPersonPersonalDetailsPrint(personalDetails)}
                  {getPersonPersonalAddressPrint(presentAddress)}
                  {getPersonPermanentAddressPrint(permanentAddress)}
                </td>
              </tr>
            );
          })
        )}
      </div>
    );

    const renderDeceasedDetails = (deceasedListDetails) => (
      <div style={{ minHeight: "auto", marginRight: 20 }}>
        {!isEmpty(deceasedListDetails) &&
          deceasedListDetails.map((item, i) => {
            const personDetails =
              !isUndefined(item?.person) &&
              !isNull(item?.person) &&
              item?.person;
            const personalDetails =
              !isUndefined(personDetails?.personalDetails) &&
              personDetails?.personalDetails;
            const phoneNumber =
              !isUndefined(item?.person?.contactDetails) &&
              item?.person?.contactDetails[0]?.phoneNumber;
            const presentAddress =
              !isUndefined(personDetails?.presentAddress) &&
              personDetails?.presentAddress;
            const permanentAddress =
              !isUndefined(personDetails?.permanentAddress) &&
              personDetails?.permanentAddress;
            return (
              <>
                <td style={{ width: "4%" }}>{i + 1}. </td>
                <td>
                  {getPersonPersonalDetailsPrint(personalDetails)}
                  {getPersonPersonalAddressPrint(presentAddress)}
                  {getPersonPermanentAddressPrint(permanentAddress)}
                </td>
              </>
            );
          })}
      </div>
    );
    const tableStyleWitnessdetails = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "left",
      width: "415px",
      padding: "5px",
      fontSize: 23,
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
    };

    const tableStyle = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "left",
      width: "200px",
      padding: "5px",
      fontSize: 23,
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
    };
    const tableStyleBody = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "left",
      padding: "5px",
      fontSize: 23,
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
      verticalAlign: "top",
    };
    const tableStyleHead = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: "5px",
      fontWeight: "bold",
      fontSize: 23,
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
      verticalAlign: "top",
    };

    const tableStyletop = {
      verticalAlign: "top",
    };

    const leftStyle = {
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
      fontSize: 23,
    };

    const rightStyle = {
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
      fontSize: 23,
      fontWeight: "bold",
    };

    const rightBodyStyle = {
      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
      fontSize: 23,
    };

    const filteredCaseDiary =
      !isEmpty(caseDiaryList) &&
      caseDiaryList.filter((s) => s.state === "generated" && s.cdNo !== 1);
    const dateResult = !isEmpty(filteredCaseDiary) && last(filteredCaseDiary);
    // const fromDate = savedData?.firDetail?.occurenceOfOffence?.fromDate;
    const placeOfOccurence = savedData?.firDetail?.placeOfOccurence;
    const occurenceOfOffence = savedData?.firDetail?.occurenceOfOffence;

    const date =
      isString(occurenceOfOffence?.fromDate) &&
      !isString(occurenceOfOffence?.toDate)
        ? occurenceOfOffence?.fromDate
        : !isString(occurenceOfOffence?.fromDate) &&
          isString(occurenceOfOffence?.toDate)
        ? occurenceOfOffence?.toDate
        : isString(occurenceOfOffence?.fromDate) &&
          isString(occurenceOfOffence?.toDate)
        ? occurenceOfOffence?.toDate
        : occurenceOfOffence?.priorToDate;

    return (
      <div
        style={{
          margin: 15,
          marginBottom: 30,
          marginTop: 20,
          fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          padding: "70px",
          display: "contents",
        }}
      >
        <style type="text/css" media="print">
          {
            "\
   @page { size: portrait; }\
"
          }
        </style>
        {this.props.isDisable === false ? <WaterMark /> : null}
        <Row gutter={24} style={{ marginBottom: 20 }}>
          <Col span={3}></Col>
          <Col
            span={18}
            style={{
              textAlign: "center",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              color: "black",
            }}
          >
            <h3
              style={{
                textDecoration: "underline",
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                marginTop: 10,
                color: "black",
                fontSize: 30,
                letterSpacing: 6,
                fontWeight: 700,
              }}
            >
              {`CASE ${" "} DIARY`}
            </h3>
            <h4
              style={{
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                marginTop: 10,
                color: "black",
                fontSize: 26,
                letterSpacing: 5,
                fontWeight: 700,
              }}
            >
              PART.I
            </h4>
          </Col>
        </Row>
        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  ...leftStyle,
                  width: "23%",
                }}
              >
                Police Station <b>:</b>
              </td>
              <td style={{ ...rightStyle, width: "15%" }}>
                {showPSName(currentUser?.unit_name)}
              </td>
              <td style={{ width: "27%" }} />
              <td
                style={{
                  ...leftStyle,
                  width: "15%",
                }}
              >
                District <b>:</b>
              </td>
              <td style={{ ...rightStyle, width: "42%" }}>
                {currentUser?.working_head_unit_name
                  ? currentUser?.working_head_unit_name
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: "1%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "15%",
                }}
              >
                FIR No :
              </td>
              <td style={{ ...rightStyle, width: "30%" }}>
                {savedData?.firDetail?.firNum
                  ? savedData?.firDetail?.firNum
                  : ""}
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "32%",
                }}
              >
                Date, time and place of occurrence :
              </td>
              <td style={{ ...rightStyle, width: "42%", verticalAlign: "top" }}>
                {getPlaceOfOccurrence(placeOfOccurence, date)}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: "2%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <div style={{ width: "35%", float: "right" }}>
                <td
                  style={{
                    ...leftStyle,
                    width: "8%",
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                >
                  {`C.D.Dated: ${
                    selectedCaseDiary?.cdPartOneDate
                      ? moment(selectedCaseDiary?.cdPartOneDate).format(
                          DATE_FORMAT
                        )
                      : ""
                  }`}
                </td>
              </div>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  textAlign: "center",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                }}
              >
                <hr
                  style={{
                    borderTop: "2px solid black",
                    height: ".1px ",
                    padding: "0 10px",
                  }}
                />
                <u>
                  <tr>
                    <td> Offence u/s :&nbsp;</td>
                    <td>
                      <b>
                        {!isEmpty(actsSections)
                          ? getTemplatesSectionsData(selectedActsData?.uniqActs)
                          : selectedFir?.section}
                      </b>
                    </td>
                  </tr>
                </u>
                <hr style={{ borderTop: "2px solid black", height: ".1px " }} />
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginBottom: "1%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                1.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Date (hour) on which action was taken
              </td>
              <td
                style={{
                  ...rightBodyStyle,
                  width: "38%",
                  verticalAlign: "top",
                }}
              >
                {selectedCaseDiary?.cdPartOneDate
                  ? moment(selectedCaseDiary?.cdPartOneDate).format(DATE_FORMAT)
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "45%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            float: "left",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "2%",
                  verticalAlign: "top",
                }}
              >
                2.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Name of the complainant
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "47%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            float: "right",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...rightBodyStyle, width: "38%" }}>
                {renderComplainantNames(complainantList)}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                3.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Names of accused known, if any
              </td>
              <td style={{ ...rightBodyStyle, width: "38%" }} />
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                }}
              />
              <td style={{ ...rightBodyStyle, width: "38%" }}>
                {renderAccusedDetails(knownList)}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                4.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Property lost
              </td>
              <td style={{ ...rightBodyStyle, width: "38%" }} />
            </tr>
          </tbody>
        </table>

        <table
          width="92%"
          style={{ border: "1px solid #ccc", marginTop: 15, marginLeft: 45 }}
        >
          <tbody>
            <tr style={tableStyleHead}>
              <td
                style={{
                  width: "10%",
                  textAlign: "left",
                  padding: "10px",
                }}
              >
                S.No
              </td>
              <td style={tableStyle}>Property category</td>
              <td style={tableStyle}>Property type</td>
              <td style={tableStyle}>Estimated value</td>
              <td style={tableStyle}>Property status</td>
            </tr>
            {recoveredProperties &&
              !isEmpty(lostProperties) &&
              lostProperties.map((item, i) => {
                const natureofStolen =
                  !isUndefined(item?.natureofStolen) && item?.natureofStolen;
                const propertytCategory =
                  !isUndefined(item?.propertytCategory) &&
                  item?.propertytCategory;
                const estimateValue =
                  !isUndefined(item?.estimateValue) && item?.estimateValue;
                const propertyStatus =
                  !isUndefined(item?.propertyStatus) && item?.propertyStatus;
                return (
                  <tr style={tableStyleBody} key={i}>
                    <td style={tableStyleBody}>{i + 1}</td>
                    <td style={tableStyleBody}>{`${propertytCategory}`}</td>
                    <td style={tableStyleBody}>{`${natureofStolen}`}</td>
                    <td style={tableStyleBody}>{`${estimateValue}`}</td>
                    <td style={tableStyleBody}>{`${propertyStatus}`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: 15,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                5.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Property recovered
              </td>
              <td style={{ ...rightBodyStyle, width: "38%" }} />
            </tr>
          </tbody>
        </table>

        <table
          width="92%"
          style={{ border: "1px solid #ccc", marginTop: 15, marginLeft: 45 }}
        >
          <tbody>
            <tr style={tableStyleHead}>
              <td
                style={{
                  width: "10%",
                  textAlign: "left",
                  padding: "10px",
                }}
              >
                S.No
              </td>
              <td style={tableStyle}>Property category</td>
              <td style={tableStyle}>Property type</td>
              <td style={tableStyle}>Estimated value (Rs)</td>
              <td style={tableStyle}>Recovered value (Rs)</td>
              <td style={tableStyle}>Property status</td>
            </tr>
            {recoveredProperties &&
              !isEmpty(recoveredProperties) &&
              recoveredProperties.map((item, i) => {
                const natureofStolen =
                  !isUndefined(item?.natureofStolen) && item?.natureofStolen;
                const propertytCategory =
                  !isUndefined(item?.propertytCategory) &&
                  item?.propertytCategory;
                const estimateValue =
                  !isUndefined(item?.estimateValue) && item?.estimateValue;
                const recoveredValue =
                  !isUndefined(item?.recoveredValue) && item?.recoveredValue;
                const propertyStatus =
                  !isUndefined(item?.propertyStatus) && item?.propertyStatus;
                return (
                  <tr style={tableStyleBody} key={i}>
                    <td style={tableStyleBody}>{i + 1}</td>
                    <td style={tableStyleBody}>{`${propertytCategory}`}</td>
                    <td style={tableStyleBody}>{`${natureofStolen}`}</td>
                    <td style={tableStyleBody}>{`${estimateValue}`}</td>
                    <td style={tableStyleBody}>{`${recoveredValue}`}</td>
                    <td style={tableStyleBody}>{`${propertyStatus}`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: 15,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                6.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Date and time of last case diary if the case diary is not the
                first one
              </td>
              <td
                style={{
                  ...rightBodyStyle,
                  width: "38%",
                  verticalAlign: "top",
                }}
              >
                {selectedCaseDiary?.cdDate
                  ? moment(selectedCaseDiary?.cdDate).format(DATE_FORMAT)
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: 15,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                7.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Name and address of the deceased if any
              </td>
              <td style={{ ...rightBodyStyle, width: "38%" }} />
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: 15,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                }}
              />
              <td style={{ ...rightBodyStyle, width: "38%" }}>
                {renderDeceasedDetails(deceasedListDetails)}
              </td>
            </tr>
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            marginTop: 15,
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  ...leftStyle,
                  width: "3%",
                  verticalAlign: "top",
                }}
              >
                8.
              </td>
              <td
                style={{
                  ...leftStyle,
                  width: "40%",
                }}
              >
                Names of the witnesses examined
              </td>
              <td style={{ ...rightBodyStyle, width: "38%" }} />
            </tr>
          </tbody>
        </table>

        <table
          width="93%"
          style={{ border: "1px solid #ccc", marginTop: 15, marginLeft: 30 }}
        >
          <tbody>
            <tr style={tableStyleHead}>
              <td
                style={{
                  width: 70,
                  textAlign: "left",
                  padding: "10px",
                }}
              >
                S. No.
              </td>
              <td style={tableStyleWitnessdetails}>Witness details</td>
              <td style={tableStyle}>Type of witness</td>
            </tr>
            {witnessStatementListNew &&
              !isEmpty(witnessStatementListNew) &&
              witnessStatementListNew.map((item, i) => {
                const personalDetails =
                  !isUndefined(item?.witnessId) &&
                  item?.witnessId?.personalDetails;
                const presentAddress =
                  !isUndefined(item?.witnessId) &&
                  item?.witnessId?.presentAddress;
                const permanentAddress =
                  !isUndefined(item?.witnessId) &&
                  item?.witnessId?.permanentAddress;
                const statementDetails =
                  !isUndefined(item?.statementDetails) &&
                  item?.statementDetails;
                const phoneNumber =
                  !isUndefined(item?.witnessId?.contactDetails) &&
                  item?.witnessId?.contactDetails[0]?.phoneNumber;
                let typeSubTypeOfWitness = "";
                if (
                  !isUndefined(statementDetails?.typeOfWitness) &&
                  !isUndefined(statementDetails?.subTypeOfWitness)
                ) {
                  typeSubTypeOfWitness = `${statementDetails?.typeOfWitness} ${statementDetails?.subTypeOfWitness}`;
                } else if (
                  !isUndefined(statementDetails?.typeOfWitness) &&
                  isUndefined(statementDetails?.subTypeOfWitness)
                ) {
                  typeSubTypeOfWitness = statementDetails?.typeOfWitness;
                } else if (
                  isUndefined(statementDetails?.typeOfWitness) &&
                  isUndefined(statementDetails?.subTypeOfWitness)
                ) {
                  typeSubTypeOfWitness = "";
                }
                return (
                  <tr style={tableStyleBody} key={i}>
                    <td style={tableStyleBody}>{i + 1}</td>
                    <td style={tableStyleBody}>
                      {getPersonPersonalDetailsPrint(personalDetails)}
                      {getPersonPersonalAddressPrint(presentAddress)}
                      {getPersonPersonalDetailsPrint(permanentAddress)}
                      <br />
                      {phoneNumber ? `Contact No: ${phoneNumber}` : ""}
                    </td>
                    <td style={tableStyleBody}>{typeSubTypeOfWitness}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: "center",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                }}
              >
                <br />
                <b>
                  <u>
                    C.D.DATED:{" "}
                    {selectedCaseDiary?.cdPartOneDate
                      ? moment(selectedCaseDiary?.cdPartOneDate).format(
                          DATE_FORMAT
                        )
                      : ""}
                  </u>
                </b>
              </td>
            </tr>

            <tr style={{ display: "contents" }}>
              <td>
                <div
                  className="ql-editor jodit-wysiwyg"
                  style={{ marginRight: 20, paddingLeft: 0 }}
                >
                  {showHtml()}
                </div>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "center",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                }}
              >
                <br />
                <br />
                <b>Closed CD for the day and next CD follows.</b>
              </td>
            </tr>
            <br />
            <br />

            <Row gutter={24}>
              <Col span={14}></Col>
              <Col span={10}>
                <b
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {!isUndefined(ioOfficer) && ioOfficer ? ioOfficer : ""}
                </b>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={14}></Col>
              <Col
                style={{
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                }}
              >
                <b>{checkList()}</b>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={14}></Col>
              <Col>
                <b
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                  }}
                >
                  {showPSName(currentUser?.unit_name)}{" "}
                </b>
              </Col>
            </Row>
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
      isDisable={props.isDisable}
      savedFir={props.savedFir}
      selectedRecord={props.selectedRecord}
    />
  );
});
