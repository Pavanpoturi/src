import * as React from "react";
import { Row, Col } from "antd";
import { isUndefined, isEmpty, orderBy, first, uniqBy } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  DATE_FORMAT,
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
  getPersonPermanentAddressPrint,
  getAccusedStatus,
  getCCLStatus,
  displayStatusDetails,
  actsSectionResult,
  showPSName,
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
        style={{ fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif" }}
      />
    );
  }
}

export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUserForHigerRole: "",
    };
  }

  componentDidMount() {
    let n1 = JSON.parse(localStorage.getItem("currentUser"));
    if (
      n1?.emp_role_name === "CIRCLE INSPECTOR" ||
      n1?.emp_role_name === "SDPO/ACP"
    ) {
      this.setState({
        currentUserForHigerRole: n1,
      });
    }
  }

  render() {
    const savedData = this.props.chargesheetList;
    const casePropertyList = savedData?.casePropertyList;
    const filteredCasePropertyList =
      !isEmpty(casePropertyList) &&
      casePropertyList.filter((item) => item.status === "Send To Court");
    const isCCLToPrint = this.props.isCCLToPrint;
    const actListData = this.props.actListData;
    const chargedAccusedList = this.props.chargedAccusedList;
    const cclChargedList =
      !isEmpty(chargedAccusedList) &&
      chargedAccusedList.filter((s) => s.isSuspectOrAccused === "CCL");
    const accusedChargedList =
      !isEmpty(chargedAccusedList) &&
      chargedAccusedList.filter((s) => s.isSuspectOrAccused === "Accused");
    const chargedList = isCCLToPrint ? cclChargedList : accusedChargedList;
    const notChargedList = this.props.notChargedAccusedList;
    const arrestList = this.props.arrestList;
    const reassignmentOfCaseList = this.props.reassignmentOfCaseList;
    const initialBriefFacts = this.props.initialBriefFacts;
    const juvenileApprehensionList = this?.props?.juvenileApprehensionList;
    const latestIoName =
      reassignmentOfCaseList[reassignmentOfCaseList.length - 1];
    const templateLogo = loadState("templatesLogo");
    let evidanceResult = !isEmpty(this.props.witnessStatementList)
      ? this.props.witnessStatementList.map((witnessList, i) => ({
          key: i,
          index: i,
          isChargeSheet: witnessList?.isChargeSheet,
          statementId: witnessList?._id,
          witnessCode: witnessList?.statementDetails?.witnessCode,
          witnessDetails: {
            name: ` ${witnessList?.witnessId?.personalDetails?.name || ""}
              ${witnessList?.witnessId?.personalDetails?.surname || ""}
              ${witnessList?.witnessId?.personalDetails?.alias || ""}`,
            presentAddress:
              !isUndefined(witnessList?.witnessId?.permanentAddress) &&
              witnessList?.witnessId?.permanentAddress,
          },
          person: witnessList?.witnessId,
          typeOfwitness:
            !isEmpty(witnessList?.statementDetails) &&
            witnessList?.statementDetails?.typeOfWitness
              ? witnessList?.statementDetails?.typeOfWitness
              : "",
          subTypeOfWitness: !isEmpty(witnessList?.statementDetails)
            ? witnessList?.statementDetails?.typeOfWitness ===
                "Panch witness" &&
              !isUndefined(witnessList?.statementDetails?.panchSubTypeOfWitness)
              ? witnessList?.statementDetails?.panchSubTypeOfWitness.join()
              : witnessList?.statementDetails?.subTypeOfWitness
            : "",
          strengthOfEvidance:
            !isEmpty(witnessList?.statementDetails) &&
            witnessList?.statementDetails?.strengthOfWitness
              ? witnessList?.statementDetails?.strengthOfWitness
              : "",
        }))
      : [];
    const chargedEvidanceList =
      !isEmpty(evidanceResult) && evidanceResult.filter((s) => s.isChargeSheet);
    const witnessListCopy =
      !isEmpty(chargedEvidanceList) &&
      orderBy(chargedEvidanceList, ["witnessCode"], ["asc"]);
    const witnessListUniq =
      !isEmpty(witnessListCopy) && uniqBy(witnessListCopy, "witnessCode");
    const witnessList =
      !isEmpty(witnessListUniq) &&
      witnessListUniq.sort(function (a, b) {
        //sorting number from string(LW1)
        return a.witnessCode.localeCompare(b.witnessCode, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });
    const complainantList = loadState("complainantList");
    const selectedFir = loadState("selectedFir");
    const filteredIODetails =
      this.props.filteredIODetails && first(this.props.filteredIODetails);

    const checkList = () => {
      const list = ["PC", "HC", "ASI"];
      if (
        !isEmpty(filteredIODetails) &&
        list.includes(filteredIODetails?.rankName)
      ) {
        const rankName = filteredIODetails?.rankName;
        const generalNo = filteredIODetails?.generalNo;
        return (
          <div>
            <span
              style={{
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                fontSize: 23,
                color: "black",
              }}
            >
              {rankName ? rankName : ""} - {generalNo ? generalNo : ""}
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
                color: "black",
              }}
            >
              {filteredIODetails?.rankName ? filteredIODetails?.rankName : ""}
            </span>
          </div>
        );
      }
    };

    const renderSelectedAccusedDetails = (itemList, showStatus) => (
      <div>
        {isEmpty(itemList) ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 15,
              color: "black",
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 23,
            }}
          />
        ) : (
          itemList.map((item, i) => {
            const accusedCode =
              !isUndefined(item?.accusedCode) && item?.accusedCode;
            const personalDetails =
              !isUndefined(item?.person) && item?.person?.personalDetails;
            const presentAddress =
              !isUndefined(item?.person) && item?.person?.presentAddress;
            const permanentAddress =
              !isUndefined(item?.person) && item?.person?.permanentAddress;
            const accusedDetails = !isUndefined(item?.person) && item?.person;
            const filteredArrestList =
              !isEmpty(arrestList) &&
              first(
                arrestList.filter(
                  (s) => s?.accusedId?._id === accusedDetails?._id
                )
              );
            const result = !filteredArrestList ? item : filteredArrestList;
            const filteredjuvenileApprehensionList =
              !isEmpty(juvenileApprehensionList) &&
              first(
                juvenileApprehensionList.filter(
                  (s) => s?.accusedId?._id === accusedDetails?._id
                )
              );
            const result1 = !filteredjuvenileApprehensionList
              ? item
              : filteredjuvenileApprehensionList;
            const dispayStatus =
              item?.isSuspectOrAccused === "CCL"
                ? getCCLStatus(result1)
                : getAccusedStatus(result);
            const accusedParticulars = savedData?.accusedParticulars;
            const abscondingResult =
              !isEmpty(accusedParticulars) &&
              first(
                accusedParticulars.filter(
                  (s) => s?.accusedPersonId?._id === item?.person?._id
                )
              );
            const statusDetails = displayStatusDetails(
              dispayStatus,
              item?.isDied
            );
            let status = "";
            if (abscondingResult?.chargeStatus === "Absconding") {
              status = "Absconding";
            } else if (isUndefined(statusDetails?.props?.children)) {
              status = "Absconding";
            } else {
              status = statusDetails;
            }
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <span
                  style={{
                    letterSpacing: 2,
                    borderBottom: "2px solid black",
                    color: "black",
                  }}
                >
                  <b>{accusedCode ? accusedCode : ""}</b>
                </span>
                <span style={{ color: "black" }}> {":"} </span>
                <span style={{ marginLeft: 5 }}>
                  {getPersonPersonalDetailsPrint(personalDetails)}
                </span>
                <span>{getPersonPersonalAddressPrint(presentAddress)}</span>
                <span>{getPersonPermanentAddressPrint(permanentAddress)}</span>
                <br />
                {showStatus ? (
                  <span
                    style={{
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      fontSize: 23,
                      color: "black",
                      marginTop: 15,
                      display: "block",
                    }}
                  >
                    <b>Status:</b>
                    <span style={{ marginLeft: 15 }}>{status}</span>
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    );

    const renderComplainantNames = (itemList) => (
      <div style={{ minHeight: 80 }}>
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
                  color: "black",
                }}
              >
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                  }}
                >
                  {getPersonPersonalDetailsPrint(personalDetails)}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                  }}
                >
                  {phoneNumber ? `contact no: ${phoneNumber},` : ""}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                  }}
                >
                  {getPersonPersonalAddressPrint(presentAddress)}
                </span>
                <span
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                  }}
                >
                  {getPersonPermanentAddressPrint(permanentAddress)}
                </span>
              </div>
            );
          })}
      </div>
    );

    const renderWitnessNames = (witnessDetails) => {
      return (
        <div style={{ minHeight: 40 }}>
          <span
            style={{
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 23,
              color: "black",
            }}
          >
            {getPersonPersonalDetailsPrint(witnessDetails?.personalDetails)}
          </span>
          <span
            style={{
              fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
              fontSize: 23,
              color: "black",
            }}
          >
            {getPersonPersonalAddressPrint(witnessDetails?.presentAddress)}
            {getPersonPermanentAddressPrint(witnessDetails?.permanentAddress)}
          </span>
        </div>
      );
    };

    const actsAndSectionsPrint = () => {
      let bb = [];
      let ll = savedData.linkingOfActs;
      for (var i = 0; i < ll.length; i++) {
        bb = [...bb, ...ll[i].actsAndSections];
      }
      let RWRequired = "";
      const result = actsSectionResult(bb, RWRequired, actListData);
      let resp = Object.values(result);
      const final = resp.map((t, _index) => {
        const resultDetails = !isUndefined(t.actDescription)
          ? `${t.section.toString()} ${t.accShortName}`
          : `${t.section.toString()}`;
        return resultDetails;
      });
      let finalresult = final
        .toString()
        .replace(/,*$/, ".")
        .replaceAll("r/w r/w", "r/w");
      return (
        <div
          className="tableRowText wordWrap"
          style={{
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            fontSize: 23,
            color: "black",
          }}
        >
          {finalresult}
        </div>
      );
    };

    let year = "";
    if (selectedFir?.firNum) {
      let yeararray = selectedFir?.firNum.split("/");
      year = yeararray[1] ? yeararray[1] : "";
    }

    const showHtml = () => {
      var myStringHTML = savedData?.richTextContent;
      return (
        <div
          dangerouslySetInnerHTML={{ __html: myStringHTML }}
          style={{
            fontSize: 23,
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            color: "black",
            maxWidth: "900px",
          }}
        />
      );
    };

    return (
      <div
        style={{
          margin: 15,
          marginBottom: 30,
          fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          fontSize: 23,
          color: "black",
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
        {this.props.isChargeSheetGenerated === false ? <WaterMark /> : null}
        <Row style={{ display: "contents" }}>
          <Col style={{ textAlign: "center" }}>
            <img
              src={templateLogo}
              alt="escopLogo"
              style={{ minHeight: 115, minWidth: 115 }}
            />
          </Col>
        </Row>
        <Row
          gutter={24}
          style={{
            marginBottom: 20,
            marginTop: 20,
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            color: "black",
          }}
        >
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
              {isCCLToPrint ? `FINAL ${" "} REPORT` : `CHARGE ${" "} SHEET`}
            </h3>
            <h6 style={{ marginTop: 15 }}>
              <span
                style={{
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontWeight: "bold",
                  fontSize: 26,
                  color: "black",
                }}
              >
                T.S.P.M. Order No : 480-1,480-2,481,482,487 & 609-5
              </span>
            </h6>
            <div
              style={{
                textDecoration: "underline",
                fontSize: 23,
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                fontWeight: "bold",
                color: "black",
                marginTop: 10,
              }}
            >
              (Under Section 173 Cr.P.C.)
            </div>
          </Col>
        </Row>
        <table
          style={{
            width: "100%",
            fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
            fontSize: 23,
            color: "black",
            display: "contents",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td>
                <table
                  style={{
                    width: "96%",
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    color: "black",
                    border: "1px dotted #262626",
                  }}
                >
                  <tbody>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        1.
                      </td>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                          width: 100,
                        }}
                      >
                        District{" "}
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                        }}
                      >
                        <b>
                          {selectedFir?.district ? selectedFir?.district : ""}
                        </b>
                      </td>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                          width: 200,
                        }}
                      >
                        Police Station
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                        }}
                      >
                        <b>{showPSName(selectedFir?.psName)}</b>
                      </td>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                        }}
                      >
                        Year
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                        }}
                      >
                        <b>{year}</b>
                      </td>
                    </tr>

                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      ></td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Cr. No.{"  "}{" "}
                        <b>{selectedFir?.firNum ? selectedFir?.firNum : ""}</b>
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          textAlign: "center",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        Dated : {"  "}
                        <b>
                          {selectedFir?.occurenceOfOffence?.firDate
                            ? moment(
                                selectedFir?.occurenceOfOffence?.firDate
                              ).format(DATE_FORMAT)
                            : ""}
                        </b>
                      </td>
                    </tr>

                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        2.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Charge sheet No.{" "}
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {savedData?.chargeSheet?.chargeSheetNo
                          ? savedData?.chargeSheet?.chargeSheetNo
                          : ""}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        3.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Date
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {savedData?.chargeSheet?.chargeSheetDate
                          ? moment(
                              savedData?.chargeSheet?.chargeSheetDate
                            ).format(DATE_FORMAT)
                          : ""}
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        color: "black",
                      }}
                    >
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        4.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Act/Sections
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          color: "black",
                          fontWeight: "bold",
                        }}
                        colspan="3"
                      >
                        {!isEmpty(savedData.linkingOfActs) &&
                          actsAndSectionsPrint()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        5.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Type of Final form/Report
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {isCCLToPrint ? "FINAL REPORT" : "CHARGE SHEET"}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        6.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        F.R. Un-Occurred
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {isCCLToPrint ? "FINAL REPORT" : "CHARGE SHEET"}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        7.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        If Charge sheet (Original/ Supplementary)
                      </td>
                      <td
                        style={{
                          padding: "0 10px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          textAlign: "center",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {savedData?.chargeSheet?.chargeSheetType
                          ? savedData?.chargeSheet?.chargeSheetType
                          : ""}
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        color: "black",
                      }}
                    >
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        8.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Name of the investigating Officer{" "}
                      </td>
                      <td
                        style={{
                          padding: "0 15px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        <>
                          <p>{initialBriefFacts?.ioAssignedName}</p>
                          <p>{initialBriefFacts?.ioAssignedRank}</p>
                          <p>{initialBriefFacts?.ioAssignedUnitName}</p>
                        </>
                        {!isEmpty(reassignmentOfCaseList) &&
                          reassignmentOfCaseList.map((item) => (
                            <>
                              <p>-------------------------------</p>
                              <p>{item?.newIOName}</p>
                              <p>{item?.newIORank}</p>
                              <p>{item?.newCctnsUnitName}</p>
                            </>
                          ))}
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        color: "black",
                      }}
                    >
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        9.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Name of the Complainant{" "}
                      </td>
                      <td
                        style={{
                          padding: "0 15px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          color: "black",
                        }}
                        colspan="3"
                      >
                        {renderComplainantNames(complainantList)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px dotted #262626" }}>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        10.
                      </td>
                      <td
                        colspan="3"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Details of Properties / articles recovered / seized
                        during investigation and relied upon
                      </td>
                      <td
                        style={{
                          padding: "0 15px",
                          width: 200,
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          borderLeft: "1px dotted #262626",
                          color: "black",
                          textAlign: "center",
                        }}
                        colspan="3"
                      >
                        {filteredCasePropertyList ? "As per form 60" : "-Nil-"}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        11.
                      </td>
                      <td
                        colspan="6"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Particulars of Accused charge sheeted:{" "}
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        color: "black",
                        display: "contents",
                      }}
                    >
                      <td></td>
                      <td
                        colspan="6"
                        style={{
                          borderLeft: "1px dotted #262626",
                          color: "black",
                          paddingLeft: 10,
                        }}
                      >
                        {renderSelectedAccusedDetails(chargedList, true)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        12.
                      </td>
                      <td
                        colspan="6"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Particulars of accused not charged:
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                        fontSize: 23,
                        color: "black",
                      }}
                    >
                      <td />
                      <td
                        colspan="6"
                        style={{
                          borderLeft: "1px dotted #262626",
                          color: "black",
                          paddingLeft: 10,
                        }}
                      >
                        {renderSelectedAccusedDetails(notChargedList, false)}
                      </td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px dotted #262626",
                        fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                        fontSize: 23,
                        color: "black",
                        display: "contents",
                      }}
                    >
                      <td
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          padding: 10,
                          borderRight: "1px dotted #262626",
                          color: "black",
                        }}
                      >
                        13.
                      </td>
                      <td
                        colspan="6"
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          paddingLeft: 10,
                          color: "black",
                        }}
                      >
                        Particulars of witnesses to be examined
                      </td>
                    </tr>
                  </tbody>
                </table>
                {!isEmpty(witnessList) && (
                  <tr
                    style={{
                      fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                      fontSize: 23,
                      color: "black",
                      marginTop: 10,
                      display: "contents",
                    }}
                  >
                    <td colspan="8">
                      <table
                        style={{
                          width: "97%",
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                          marginTop: 30,
                          border: "2px solid #262626",
                        }}
                      >
                        <tbody
                          style={{
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 23,
                            color: "black",
                          }}
                        >
                          {witnessList &&
                            witnessList.map((item, i) => {
                              let typeSubTypeOfWitness = "";
                              if (
                                item?.typeOfwitness ===
                                "Official witnesses / Experts"
                              ) {
                                typeSubTypeOfWitness = item?.subTypeOfWitness;
                              } else if (
                                item?.typeOfwitness === "Panch witness"
                              ) {
                                typeSubTypeOfWitness = `${item?.typeOfwitness} ${item?.subTypeOfWitness}`;
                              } else if (item?.typeOfwitness) {
                                typeSubTypeOfWitness = item?.typeOfwitness;
                              } else {
                                typeSubTypeOfWitness = "";
                              }
                              return (
                                <tr
                                  style={{
                                    borderBottom: "2px solid #262626",
                                    fontFamily:
                                      "Arial,Helvetica Neue,Helvetica,sans-serif",
                                    fontSize: 23,
                                    color: "black",
                                  }}
                                  key={i}
                                >
                                  <td
                                    colspan="2"
                                    style={{
                                      fontFamily:
                                        "Arial,Helvetica Neue,Helvetica,sans-serif",
                                      fontSize: 23,
                                      color: "black",
                                      padding: 10,
                                    }}
                                  >
                                    {item?.witnessCode}
                                  </td>
                                  <td
                                    colspan="2"
                                    style={{
                                      borderLeft: "2px solid #262626",
                                      fontFamily:
                                        "Arial,Helvetica Neue,Helvetica,sans-serif",
                                      fontSize: 23,
                                      color: "black",
                                      paddingLeft: 10,
                                    }}
                                  >
                                    {renderWitnessNames(item?.person)}
                                  </td>
                                  <td
                                    colspan="2"
                                    style={{
                                      borderLeft: "2px solid #262626",
                                      fontFamily:
                                        "Arial,Helvetica Neue,Helvetica,sans-serif",
                                      fontSize: 23,
                                      color: "black",
                                      paddingLeft: 10,
                                    }}
                                  >
                                    {typeSubTypeOfWitness || ""}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
                <tr
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                    marginTop: 10,
                  }}
                >
                  <td colspan="8" style={{ width: "5%" }}>
                    <table
                      style={{
                        width: "97%",
                        fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                        fontSize: 23,
                        color: "black",
                        marginTop: 30,
                        border: "1px dotted #262626",
                      }}
                    >
                      <tbody
                        style={{
                          fontFamily:
                            "Arial,Helvetica Neue,Helvetica,sans-serif",
                          fontSize: 23,
                          color: "black",
                        }}
                      >
                        <tr
                          style={{
                            borderBottom: "1px dotted #262626",
                            color: "black",
                            marginTop: 30,
                          }}
                        >
                          <td
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              padding: 10,
                              borderRight: "1px dotted #262626",
                              color: "black",
                            }}
                          >
                            14.
                          </td>
                          <td
                            colspan="3"
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              paddingLeft: 10,
                              color: "black",
                              borderRight: "1px dotted #262626",
                            }}
                          >
                            If F.R. is false, indicate action taken u/s 182 /
                            211 IPC.{" "}
                          </td>
                          <td
                            style={{
                              padding: "0 10px",
                              width: 200,
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              color: "black",
                              textAlign: "center",
                            }}
                            colspan="3"
                          >
                            -Nil-
                          </td>
                        </tr>

                        <tr
                          style={{
                            borderBottom: "1px dotted #262626",
                            fontFamily:
                              "Arial,Helvetica Neue,Helvetica,sans-serif",
                            fontSize: 23,
                            color: "black",
                          }}
                        >
                          <td
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              padding: 10,
                              borderRight: "1px dotted #262626",
                              color: "black",
                            }}
                          >
                            15.
                          </td>
                          <td
                            colspan="3"
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              paddingLeft: 10,
                              color: "black",
                              borderRight: "1px dotted #262626",
                            }}
                          >
                            Result of Laboratory analysis
                          </td>
                          <td
                            style={{
                              padding: "0 10px",
                              width: 200,
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              color: "black",
                              textAlign: "center",
                            }}
                            colspan="3"
                          >
                            -Nil-
                          </td>
                        </tr>

                        <tr style={{ borderBottom: "1px dotted #262626" }}>
                          <td
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              padding: 10,
                              borderRight: "1px dotted #262626",
                              color: "black",
                            }}
                          >
                            16.
                          </td>
                          <td
                            colspan="3"
                            style={{
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              paddingLeft: 10,
                              color: "black",
                              borderRight: "1px dotted #262626",
                            }}
                          >
                            Brief facts of the case{" "}
                          </td>
                          <td
                            style={{
                              padding: "0 10px",
                              width: 200,
                              fontFamily:
                                "Arial,Helvetica Neue,Helvetica,sans-serif",
                              fontSize: 23,
                              color: "black",
                              textAlign: "center",
                            }}
                            colspan="3"
                          />
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </td>
            </tr>

            <tr>
              <td
                style={{
                  textAlign: "center",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                  color: "black",
                  textDecoration: "underline",
                  fontWeight: "bold",
                }}
              >
                <br />
                IN THE COURT OF HONOURABLE{" "}
                {savedData?.chargeSheet?.courtName
                  ? (savedData?.chargeSheet?.courtName).toUpperCase()
                  : ""}
              </td>
            </tr>
            <tr style={{ display: "contents" }}>
              <td
                style={{
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                  color: "black",
                }}
              >
                <div
                  className="ql-editor jodit-wysiwyg"
                  style={{ marginRight: 20, paddingLeft: 0 }}
                >
                  {showHtml()}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <br />
                <br />
                <span
                  style={{
                    paddingLeft: "3rem",
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 23,
                    color: "black",
                  }}
                >
                  Hence, it is prayed that the Honourable Court may kindly try
                  the accused as per law.
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "center",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  fontSize: 23,
                  color: "black",
                }}
              >
                <br />
                <br />
                <b
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 25,
                    color: "black",
                  }}
                >
                  HENCE THE CHARGE.
                </b>
              </td>
            </tr>
            <Row gutter={24}>
              <Col span={14}></Col>
              <Col span={10} style={{ marginLeft: "450px" }}>
                <b
                  style={{
                    fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                    fontSize: 21,
                    color: "black",
                  }}
                >
                  {!isEmpty(reassignmentOfCaseList) &&
                  reassignmentOfCaseList.length > 0 ? (
                    <center>
                      <p>{latestIoName?.newIOName}</p>
                      <p>{latestIoName?.newIORank}</p>
                      <p>{latestIoName?.newCctnsUnitName}</p>
                    </center>
                  ) : (
                    <>
                      <p>{initialBriefFacts?.ioAssignedName}</p>
                      <p>{initialBriefFacts?.ioAssignedRank}</p>
                      <p>{initialBriefFacts?.ioAssignedUnitName}</p>
                    </>
                  )}
                </b>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={14}></Col>
              <Col>
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
                    color: "black",
                  }}
                >
                  {showPSName(filteredIODetails?.unitName)}
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
      isChargeSheetGenerated={props.isChargeSheetGenerated}
    />
  );
});
