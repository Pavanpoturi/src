/* eslint-disable array-callback-return */
import * as React from "react";
import { Row, Col } from "antd";
import moment from "moment";
import { first, isEmpty, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT_WITHOUT_SECONDS,
  showPSName,
  getPersonPersonalAddress,
} from "@containers/FirDetails/fir-util";
import AllPagesPDFViewer from "../../NewFir/AllPagesPDFViewer";

export class ComponentToPrint extends React.PureComponent {
  render() {
    const templateLogo = loadState("templatesLogo");
    const savedData = this.props.savedFir;
    const selectedCrimeLocation = this.props.selectedCrimeLocation;
    const panchWitnessList = this.props.panchWitnessList;
    const crimeSceneDate = this.props.crimeSceneDate;
    const materialObjectList = this.props.materialObjectList;
    const roughSketchPhotos = this.props.roughSketchPhotos;
    const victimDetails = savedData?.victimDetails;
    const automobilesDetails =
      savedData?.stolenProperties &&
      !isEmpty(savedData?.stolenProperties) &&
      savedData?.stolenProperties.filter(
        (s) => s.propertytCategoryName !== "Automobiles"
      );
    const automobiles =
      savedData?.stolenProperties &&
      !isEmpty(savedData?.stolenProperties) &&
      savedData?.stolenProperties.filter(
        (s) => s.propertytCategoryName === "Automobiles"
      );
    const personDetails = savedData?.preCrime?.crimeShown[0]?.person;
    const personalDetails = personDetails?.personalDetails;
    const name = personalDetails?.name ? personalDetails?.name : "";
    const surname = personalDetails?.surname ? personalDetails?.surname : "";
    const fullName = `${name} ${surname}`;
    const fatherName = personalDetails?.fatherHusbandGuardianName
      ? personalDetails?.fatherHusbandGuardianName
      : "";
    const presentAddress =
      !isUndefined(personDetails) && personDetails?.presentAddress;
    const address = getPersonPersonalAddress(presentAddress);
    const staffList = this.props.staffListData;
    const actList = this.props.actList;
    const firDetail = savedData?.firDetail;
    const briefFacts = firDetail?.briefFacts;
    const occurrenceOfOffence = firDetail?.occurenceOfOffence;
    const stolenProperties = savedData?.stolenProperties;

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
    if (firDetail?.firNum) {
      let yeararray = firDetail?.firNum.split("/");
      year = yeararray[1] ? yeararray[1] : "";
    }

    const physicalStyle = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 10,
      fontSize: 21,
      fontFamily: "Times New Roman",
    };

    const physicalStyleBody = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 10,
      fontSize: 21,
      fontFamily: "Arial",
    };

    const physicalStyleHead = {
      border: "1px solid #262626",
      borderCollapse: "collapse",
      textAlign: "center",
      padding: 10,
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
    const resultTemp = firDetail?.actsAndSections.reduce(
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
              <u>CRIME DETAIL FORM</u>
            </div>
            <div
              style={{
                fontFamily: "Times New Roman",
                color: "#010203",
                fontSize: 21,
                fontWeight: 600,
              }}
            >
              <b>( A.P.P.M. Order No : 829(1), 512,515,516 )</b>
            </div>
          </Col>
        </Row>

        {/* Print Row-1 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>1.</td>
              <td style={{ ...leftStyle, width: "8%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {firDetail?.district ? firDetail?.district : ""}
              </td>
              <td style={{ ...leftStyle, width: "4%" }}>P.S.</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {firDetail?.psName ? showPSName(firDetail?.psName) : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Year</td>
              <td style={{ ...rightContentStyle, width: "7%" }}>{year}</td>
              <td style={{ ...leftStyle, width: "9%" }}>FIR No.</td>
              <td style={{ ...rightContentStyle, width: "9%" }}>
                {firDetail?.firNum ? firDetail?.firNum : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Date</td>
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
              <td style={{ ...leftStyle, width: "2%" }}>2.</td>
              <td style={{ ...leftStyle, width: "20%" }}>
                Acts and Sections :
              </td>
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
              <td style={{ ...leftStyle, width: "32%" }}>
                Place of occurrence shown by :
              </td>
              <td style={{ ...rightContentStyle, width: "65%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-4 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "4%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>{fullName}</td>
              <td style={{ ...leftStyle, width: "22%" }}>
                Father’s / Husband’s name
              </td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {fatherName}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-5 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "10%" }}>Address :</td>
              <td style={{ ...rightContentStyle, width: "90%" }}>{address}</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-6 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>4.</td>
              <td style={{ ...leftStyle, width: "100%" }}>Type of Crime :</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-7 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "14%" }}>(i) Major Head</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {firDetail?.majorMinorClassification[0]?.majorHead
                  ? firDetail?.majorMinorClassification[0]?.majorHead
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "15%" }}>(ii) Minor Head</td>
              <td style={{ ...rightContentStyle, width: "30%" }}>
                {firDetail?.majorMinorClassification[0]?.minorHead
                  ? firDetail?.majorMinorClassification[0]?.minorHead
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-8 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(iii)</td>
              <td style={{ ...leftStyle, width: "6%" }}>Methods</td>
              <td style={{ ...rightContentStyle, width: "75%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-9 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(iv)</td>
              <td style={{ ...leftStyle, width: "20%" }}>
                Conveyance(s) used :
              </td>
              <td style={{ ...rightContentStyle, width: "60%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-10 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(v)</td>
              <td style={{ ...leftStyle, width: "20%" }}>
                Character assumed :
              </td>
              <td style={{ ...rightContentStyle, width: "70%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-11 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(vi)</td>
              <td style={{ ...leftStyle, width: "26%" }}>
                Language / Dialect used :
              </td>
              <td style={{ ...rightContentStyle, width: "70%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-12 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(vii)</td>
              <td style={{ ...leftStyle, width: "16%" }}>Special feature :</td>
              <td style={{ ...rightContentStyle, width: "70%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-13 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(viii)</td>
              <td style={{ ...leftStyle, width: "30%" }}>
                Type of Place of occurrence :{" "}
              </td>
              <td style={{ ...rightContentStyle, width: "65%" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-14 */}
        <table
          style={{
            ...tableContainerChild,
            marginLeft: "2.5%",
            marginTop: "1%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>(ix)</td>
              <td style={{ ...leftStyle, width: "67%" }}>
                Type of property stolen [4 types] (Major head of the property to
                be filled) :
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />

        {/* Print Row-15 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>5.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Particulars of the victim(s) (Attach separate sheet, if
                required).
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-16 */}
        <table
          style={{ border: "1px solid #ccc", width: "93%", marginLeft: "3%" }}
        >
          <tbody>
            <tr style={{ ...physicalStyleHead, display: "contents" }}>
              <td style={physicalStyle}>S.No.</td>
              <td style={physicalStyle}>Name</td>
              <td style={physicalStyle}>Father's/ Husband's Name</td>
              <td style={physicalStyle}>Date/Year of Birth</td>
              <td style={physicalStyle}>Sex</td>
              <td style={physicalStyle}>Nationality</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>1</td>
              <td style={physicalStyle}>2</td>
              <td style={physicalStyle}>3</td>
              <td style={physicalStyle}>4</td>
              <td style={physicalStyle}>5</td>
              <td style={physicalStyle}>6</td>
            </tr>
            {victimDetails &&
              !isEmpty(victimDetails) &&
              victimDetails.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>{index + 1}</td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && fullvictimDetails
                        ? fullvictimDetails?.name
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && fullvictimDetails
                        ? fullvictimDetails?.fatherHusbandGuardianName
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) &&
                      fullvictimDetails &&
                      fullvictimDetails?.dateOfBirth
                        ? moment(fullvictimDetails?.dateOfBirth).format(
                            DATE_FORMAT
                          )
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && fullvictimDetails
                        ? fullvictimDetails?.gender
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {!isEmpty(data) && fullvictimDetails
                        ? fullvictimDetails?.nationality
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-17 */}
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
              <td style={physicalStyle}>Religion</td>
              <td style={physicalStyle}>Whether SC/ST/OBC</td>
              <td style={physicalStyle}>Occupation</td>
              <td style={physicalStyle}>Address</td>
              <td style={physicalStyle}>Injury (Grievous/ Simple)</td>
              <td style={physicalStyle}>Means of causing injury</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>7</td>
              <td style={physicalStyle}>8</td>
              <td style={physicalStyle}>9</td>
              <td style={physicalStyle}>10</td>
              <td style={physicalStyle}>11</td>
              <td style={physicalStyle}>12</td>
            </tr>
            {victimDetails &&
              !isEmpty(victimDetails) &&
              victimDetails.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                const presentAddress =
                  data?.person && data?.person?.presentAddress;
                const address = getPersonPersonalAddress(presentAddress);
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>
                      {fullvictimDetails ? fullvictimDetails?.religion : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {fullvictimDetails ? fullvictimDetails?.caste : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {fullvictimDetails ? fullvictimDetails?.occupation : ""}
                    </td>
                    <td style={physicalStyleBody}>{address ? address : ""}</td>
                    <td style={physicalStyleBody}>
                      {fullvictimDetails
                        ? fullvictimDetails?.otherBodyFeatures
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {fullvictimDetails
                        ? fullvictimDetails?.otherBodyFeatures
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-18 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>6.</td>
              <td style={{ ...leftStyle, width: "20%" }}>Motive of Crime :</td>
              <td style={rightContentStyle} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-19 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%", verticalAlign: "top" }}>
                7.
              </td>
              <td style={{ ...leftStyle, width: "78%" }}>
                Details of properties stolen/involved (Use appropriate
                prescribed form(s) and attach) :
              </td>
              <td style={rightContentStyle} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-20 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>8.</td>
              <td style={{ ...leftStyle, width: "47%" }}>
                Date and time of visit to the place of occurrence :
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-21 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1%" }}>Date</td>
              <td style={{ ...rightContentStyle, width: "8%" }}>
                {crimeSceneDate
                  ? moment(crimeSceneDate).format(DATE_FORMAT)
                  : ""}
              </td>
              <td style={{ ...leftStyle, width: "1%" }}>Time</td>
              <td style={{ ...rightContentStyle, width: "8%" }}>
                {crimeSceneDate
                  ? moment(crimeSceneDate).format(
                      DATE_TIME_FORMAT_WITHOUT_SECONDS
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-22 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}>9.</td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Description of the place of occurrence
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-23 */}
        <table style={{ ...tableContainerChild, marginLeft: "2%" }}>
          <tbody>
            <tr style={{ display: "contents", fontSize: 21 }}>
              <td>
                <div style={{ marginRight: 10, whiteSpace: "break-spaces" }}>
                  {selectedCrimeLocation?.address?.description
                    ? selectedCrimeLocation?.address?.description
                    : ""}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-24 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%", verticalAlign: "top" }}>
                10.
              </td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Description of the physical evidence from the scene of crime for
                the property recovered / seized for the purpose of
                investigation:
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-25 */}
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
              <td style={physicalStyle}>S.No.</td>
              <td style={physicalStyle}>Material Object type</td>
              <td style={physicalStyle}>Material Object Name</td>
              <td style={physicalStyle}>Remarks</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>1</td>
              <td style={physicalStyle}>2</td>
              <td style={physicalStyle}>3</td>
              <td style={physicalStyle}>4</td>
            </tr>
            {materialObjectList &&
              !isEmpty(materialObjectList) &&
              materialObjectList.map((data, index) => {
                const materialObjecttype = data?.type;
                const materialObjectSubType = data?.subType;
                const materialObjectDescription = data?.description;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>{index + 1}</td>
                    <td style={physicalStyleBody}>{materialObjecttype}</td>
                    <td style={physicalStyleBody}>{materialObjectSubType}</td>
                    <td style={physicalStyleBody}>
                      {materialObjectDescription}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-26 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            {panchWitnessList &&
              !isEmpty(panchWitnessList) &&
              panchWitnessList.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                const name = fullvictimDetails?.name;
                const surname = fullvictimDetails?.surname;
                const presentAddress =
                  data?.person && data?.person?.presentAddress;
                const address = getPersonPersonalAddress(presentAddress);
                return (
                  <>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>
                        {index + 1}.
                      </td>
                      <td style={{ ...leftStyle, width: "0%" }}>Witness :</td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(i)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Name:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {name ? name : ""} {surname ? surname : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(ii)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Address:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {address ? address : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}></td>
                      <td style={{ ...leftStyle, width: "6%" }}></td>
                      <td
                        style={{
                          ...leftStyle,
                          width: "25%",
                          float: "right",
                          marginTop: "50px",
                          marginBottom: "10px",
                        }}
                      >
                        Signature
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-27 */}
        <table style={{ ...tableContainer, marginTop: "1%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "1%", verticalAlign: "top" }}>
                11.
              </td>
              <td style={{ ...leftStyle, width: "41%" }}>
                Sketch Map of the place of occurrence (Attach sketch map with
                legends separately) If needed to scale, scale indicate so. May
                be certified and signed by witnesses if required.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-28 */}
        <table
          style={{
            ...tableContainerChild,
            marginLeft: "2.5%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: ".3%" }}></td>
              <td style={{ ...leftStyle, width: "20%" }}>
                Whether the Sketch/Map prepared by draftsman?
              </td>
            </tr>
          </tbody>
        </table>
        {!isEmpty(roughSketchPhotos) &&
          roughSketchPhotos.map((item, i) => {
            return item.mimeType === "application/pdf" ? (
              <AllPagesPDFViewer pdf={item?.imgUrl} />
            ) : (
              <img
                key={i}
                src={item?.imgUrl}
                alt={item.name}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "90%",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            );
          })}
        <br />

        <table
          style={{
            marginLeft: "3.5%",
            marginTop: "5px",
            width: "40%",
          }}
        >
          <tr style={{ display: "contents" }}>
            <td style={{ ...leftStyle, width: "90%" }}>
              <u>(Signature of Panchas)</u>
            </td>
          </tr>
          <tbody>
            {panchWitnessList &&
              !isEmpty(panchWitnessList) &&
              panchWitnessList.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                const name = fullvictimDetails?.name;
                const surname = fullvictimDetails?.surname;
                return (
                  <tr>
                    <td
                      style={{ ...leftStyle, width: "2%", marginTop: "20px" }}
                    >
                      {index + 1 + ")"}
                    </td>
                    <td style={{ width: "75%" }} />
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-29 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "5%",
            float: "right",
            width: "40%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={leftStyle}>Signature of Investigating Officer</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-30 */}
        <table
          style={{
            ...tableContainer,
            float: "right",
            width: "100%",
            marginTop: "1%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }} />
              <td style={{ ...leftStyle, width: "6%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "90%" }}>
                {briefFacts?.ioAssignedName ? briefFacts?.ioAssignedName : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-31 */}
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
                {checkRank(briefFacts?.ioAssignedName)}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>No</td>
              <td style={{ ...rightContentStyle, width: "15%" }}>
                {checkNo(briefFacts?.ioAssignedName)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-32 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "8%" }}>Place :</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {firDetail?.psName ? showPSName(firDetail?.psName) : ""}
              </td>
              <td style={{ width: "80%" }} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-33 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "8%" }}>Date :</td>
              <td style={{ ...rightContentStyle, width: "25%" }}>
                {crimeSceneDate
                  ? moment(crimeSceneDate).format(DATE_FORMAT)
                  : ""}
              </td>
              <td style={{ width: "80%" }} />
            </tr>
          </tbody>
        </table>

        {/* Print Row-34 */}
        <table style={{ ...tableContainer, pageBreakBefore: "always" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{ ...leftStyle, width: "2%", verticalAlign: "top" }}
              ></td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Details of Identifiable numbered or unnumbered property
                including fire arm seized/recovered/involved{" "}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-35 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}></td>
              <td style={{ ...leftStyle, width: "8%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {firDetail?.district ? firDetail?.district : ""}
              </td>
              <td style={{ ...leftStyle, width: "4%" }}>P.S.</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {firDetail?.psName ? showPSName(firDetail?.psName) : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Year</td>
              <td style={{ ...rightContentStyle, width: "7%" }}>{year}</td>
              <td style={{ ...leftStyle, width: "8%" }}>FIR No.</td>
              <td style={{ ...rightContentStyle, width: "9%" }}>
                {firDetail?.firNum ? firDetail?.firNum : ""}
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

        {/* Print Row-36 */}
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
              <td style={physicalStyle}>S.No.</td>
              <td style={physicalStyle}>Type of property</td>
              <td style={physicalStyle}>Estimated value in Rs.</td>
              <td style={physicalStyle}>Quantity</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>1</td>
              <td style={physicalStyle}>2</td>
              <td style={physicalStyle}>3</td>
              <td style={physicalStyle}>4</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobilesDetails) &&
              automobilesDetails.map((item, index) => {
                const estimateValue =
                  !isUndefined(item?.estimateValue) && item?.estimateValue;
                const propertytCategory =
                  !isUndefined(item?.propertytCategory) &&
                  item?.propertytCategory;
                const armsAndAmmunition =
                  !isUndefined(item?.armsAndAmmunition[0]) &&
                  item?.armsAndAmmunition[0];
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>{index + 1}</td>
                    <td style={physicalStyleBody}>{propertytCategory}</td>
                    <td style={physicalStyleBody}>{estimateValue}</td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition ? armsAndAmmunition.quantity : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-37 */}
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
              <td style={physicalStyle}>Make</td>
              <td style={physicalStyle}>Model/Bore</td>
              <td style={physicalStyle}>Number</td>
              <td style={physicalStyle}>Special marks of identification</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>5</td>
              <td style={physicalStyle}>6</td>
              <td style={physicalStyle}>7</td>
              <td style={physicalStyle}>8</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobilesDetails) &&
              automobilesDetails.map((item, index) => {
                const armsAndAmmunition =
                  !isUndefined(item?.armsAndAmmunition[0]) &&
                  item?.armsAndAmmunition[0];
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition ? armsAndAmmunition.made : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition ? armsAndAmmunition.model : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition ? armsAndAmmunition.quantity : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition
                        ? armsAndAmmunition.specialMarksOfIdentification
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-38 */}
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
              <td style={physicalStyle}>Country of Origin</td>
              <td style={physicalStyle}>Seized/Recovered/Stolen/Involved</td>
              <td style={physicalStyle}>
                Belonging to victim/accused/abandoned
              </td>
              <td style={physicalStyle}>Insurance Certificate No.</td>
              <td style={physicalStyle}>Name of Insurance Company</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>9</td>
              <td style={physicalStyle}>10</td>
              <td style={physicalStyle}>11</td>
              <td style={physicalStyle}>12</td>
              <td style={physicalStyle}>13</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobilesDetails) &&
              automobilesDetails.map((item, index) => {
                const armsAndAmmunition =
                  !isUndefined(item?.armsAndAmmunition[0]) &&
                  item?.armsAndAmmunition[0];
                const belongsToWhom =
                  !isUndefined(item?.belongsToWhom) && item?.belongsToWhom;
                const propertyStatus =
                  !isUndefined(item?.propertyStatus) && item?.propertyStatus;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition
                        ? armsAndAmmunition.countryOfDesign
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>{propertyStatus}</td>
                    <td style={physicalStyleBody}>{belongsToWhom}</td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition
                        ? armsAndAmmunition.insuranceCertificateNo
                        : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {armsAndAmmunition
                        ? armsAndAmmunition.nameOfInsuranceCompany
                        : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-39 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            {panchWitnessList &&
              !isEmpty(panchWitnessList) &&
              panchWitnessList.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                const name = fullvictimDetails?.name;
                const surname = fullvictimDetails?.surname;
                const presentAddress =
                  data?.person && data?.person?.presentAddress;
                const address = getPersonPersonalAddress(presentAddress);
                return (
                  <>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>
                        {index + 1}.
                      </td>
                      <td style={{ ...leftStyle, width: "0%" }}>Witness :</td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(i)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Name:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {name ? name : ""} {surname ? surname : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(ii)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Address:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {address ? address : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}></td>
                      <td style={{ ...leftStyle, width: "6%" }}></td>
                      <td
                        style={{
                          ...leftStyle,
                          width: "25%",
                          float: "right",
                          marginTop: "50px",
                          marginBottom: "10px",
                        }}
                      >
                        Signature
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-40 */}
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
              <td style={leftStyle}>Signature of Investigating Officer</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-41 */}
        <table
          style={{
            ...tableContainer,
            float: "right",
            width: "100%",
            marginTop: "2%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }} />
              <td style={{ ...leftStyle, width: "6%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "90%" }}>
                {briefFacts?.ioAssignedName ? briefFacts?.ioAssignedName : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-42 */}
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
                {checkRank(briefFacts?.ioAssignedName)}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>No</td>
              <td style={{ ...rightContentStyle, width: "15%" }}>
                {checkNo(briefFacts?.ioAssignedName)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-43 */}
        <table style={{ ...tableContainer, pageBreakBefore: "always" }}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td
                style={{ ...leftStyle, width: "2%", verticalAlign: "top" }}
              ></td>
              <td style={{ ...leftStyle, width: "90%" }}>
                Details of Automobile seized/recovered/involved
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-44 */}
        <table style={tableContainer}>
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "2%" }}></td>
              <td style={{ ...leftStyle, width: "8%" }}>District</td>
              <td style={{ ...rightContentStyle, width: "18%" }}>
                {firDetail?.district ? firDetail?.district : ""}
              </td>
              <td style={{ ...leftStyle, width: "4%" }}>P.S.</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {firDetail?.psName ? showPSName(firDetail?.psName) : ""}
              </td>
              <td style={{ ...leftStyle, width: "6%" }}>Year</td>
              <td style={{ ...rightContentStyle, width: "7%" }}>{year}</td>
              <td style={{ ...leftStyle, width: "8%" }}>FIR No.</td>
              <td style={{ ...rightContentStyle, width: "9%" }}>
                {firDetail?.firNum ? firDetail?.firNum : ""}
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

        {/* Print Row-45 */}
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
              <td style={physicalStyle}>S.No.</td>
              <td style={physicalStyle}>Type of Automobile</td>
              <td style={physicalStyle}>Estimated value in Rs.</td>
              <td style={physicalStyle}>Make</td>
              <td style={physicalStyle}>Color</td>
              <td style={physicalStyle}>Model( year)</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>1</td>
              <td style={physicalStyle}>2</td>
              <td style={physicalStyle}>3</td>
              <td style={physicalStyle}>4</td>
              <td style={physicalStyle}>5</td>
              <td style={physicalStyle}>6</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobiles) &&
              automobiles.map((item, index) => {
                const automobiles =
                  !isUndefined(item?.automobiles[0]) && item?.automobiles[0];
                const estimateValue =
                  !isUndefined(item?.estimateValue) && item?.estimateValue;
                const natureOfStolenProperty =
                  !isUndefined(item?.natureofStolen) && item?.natureofStolen;
                return (
                  <tr style={physicalStyleBody}>
                    <td style={physicalStyleBody}>{index + 1}</td>
                    <td style={physicalStyleBody}>
                      {natureOfStolenProperty ? natureOfStolenProperty : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {estimateValue ? estimateValue : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.made : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.color : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.model : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-46 */}
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
              <td style={physicalStyle}>Registration Number</td>
              <td style={physicalStyle}>Chassis No</td>
              <td style={physicalStyle}>Engine No</td>
              <td style={physicalStyle}>Seized/Recovered/Stolen/Involved</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>7</td>
              <td style={physicalStyle}>8</td>
              <td style={physicalStyle}>9</td>
              <td style={physicalStyle}>10</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobiles) &&
              automobiles.map((item, index) => {
                const automobiles =
                  !isUndefined(item?.automobiles[0]) && item?.automobiles[0];
                const propertyStatus =
                  !isUndefined(item?.propertyStatus) && item?.propertyStatus;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.registrationNumber : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.made : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.made : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {propertyStatus ? propertyStatus : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-47 */}
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
                Belonging to victim/accused/abandoned
              </td>
              <td style={physicalStyle}>Insurance Certificate No.</td>
              <td style={physicalStyle}>Name of Insurance Company</td>
            </tr>
            <tr style={physicalStyle}>
              <td style={physicalStyle}>11</td>
              <td style={physicalStyle}>12</td>
              <td style={physicalStyle}>13</td>
            </tr>
            {stolenProperties &&
              !isEmpty(automobiles) &&
              automobiles.map((item, index) => {
                const automobiles =
                  !isUndefined(item?.automobiles) && item?.automobiles;
                const belongsToWhom =
                  !isUndefined(item?.belongsToWhom) && item?.belongsToWhom;
                return (
                  <tr style={physicalStyleBody} key={index}>
                    <td style={physicalStyleBody}>
                      {belongsToWhom ? belongsToWhom : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.made : ""}
                    </td>
                    <td style={physicalStyleBody}>
                      {automobiles ? automobiles.made : ""}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-48 */}
        <table style={{ ...tableContainerChild, marginLeft: "2.5%" }}>
          <tbody>
            {panchWitnessList &&
              !isEmpty(panchWitnessList) &&
              panchWitnessList.map((data, index) => {
                const fullvictimDetails =
                  data?.person && data?.person?.personalDetails;
                const name = fullvictimDetails?.name;
                const surname = fullvictimDetails?.surname;
                const presentAddress =
                  data?.person && data?.person?.presentAddress;
                const address = getPersonPersonalAddress(presentAddress);
                return (
                  <>
                    <tr style={{ display: "contents" }}>
                      <td style={{ ...leftStyle, width: "2%" }}>
                        {index + 1}.
                      </td>
                      <td style={{ ...leftStyle, width: "0%" }}>Witness :</td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(i)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Name:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {name ? name : ""} {surname ? surname : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}>(ii)</td>
                      <td style={{ ...leftStyle, width: "6%" }}>Address:</td>
                      <td style={{ ...rightContentStyle, width: "75%" }}>
                        {address ? address : ""}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...leftStyle, width: "2%" }}></td>
                      <td style={{ ...leftStyle, width: "6%" }}></td>
                      <td
                        style={{
                          ...leftStyle,
                          width: "25%",
                          float: "right",
                          marginTop: "50px",
                          marginBottom: "10px",
                        }}
                      >
                        Signature
                      </td>
                    </tr>
                  </>
                );
              })}
          </tbody>
        </table>

        {/* Print Row-49 */}
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
              <td style={leftStyle}>Signature of Investigating Officer</td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-50 */}
        <table
          style={{
            ...tableContainer,
            float: "right",
            width: "100%",
            marginTop: "2%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }} />
              <td style={{ ...leftStyle, width: "6%" }}>Name</td>
              <td style={{ ...rightContentStyle, width: "90%" }}>
                {briefFacts?.ioAssignedName ? briefFacts?.ioAssignedName : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Print Row-51 */}
        <table
          style={{
            ...tableContainer,
            marginTop: "1%",
            width: "100%",
            marginBottom: "5%",
          }}
        >
          <tbody>
            <tr style={{ display: "contents" }}>
              <td style={{ ...leftStyle, width: "60%" }} />
              <td style={{ ...leftStyle, width: "6%" }}>Rank</td>
              <td style={{ ...rightContentStyle, width: "20%" }}>
                {checkRank(briefFacts?.ioAssignedName)}
              </td>
              <td style={{ ...leftStyle, width: "3%" }}>No</td>
              <td style={{ ...rightContentStyle, width: "15%" }}>
                {checkNo(briefFacts?.ioAssignedName)}
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
