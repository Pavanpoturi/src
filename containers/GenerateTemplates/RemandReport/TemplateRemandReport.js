import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";
import {
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
} from "@containers/FirDetails/fir-util";

export default function TemplateRemandReport({ fileName, data }) {
  const {
    accusedName = "",
    personAddress = "",
    afatherHusbandGuardianName = "",
    aoccupation = "",
    accusedAge = "",
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    IOName = "",
    district = "",
    accusedList = [],
    victimDetails = [],
    datetimeofcoourance = "",
    placeofoccurance = "",
    datetimeofFIR = "",
    complainantname = "",
    producedDateTime = "",
    complainantaddress = "",
    propertystolen = "",
    propertyrecovred = "",
    courtName = "",
    dateOfReport = "",
    timeofreport = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <h5>REMAND CASE DIARY</h5>
              <h4>PART.I</h4>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ paddingLeft: "3rem" }}>
                      Police station{" "}
                      <u>
                        <b>
                          PS:{" "}
                          <span
                            style={{
                              padding: "0 10px",
                              width: "200px",
                            }}
                          >
                            {" "}
                            {policeStation}{" "}
                          </span>
                        </b>
                      </u>
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                        float: "right",
                      }}
                    >
                      District:{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%">
                <tbody>
                  <tr>
                    <td width="50%">
                      First Information report{" "}
                      <b>
                        <u>
                          <i>
                            No
                            <span
                              style={{
                                padding: "0 10px",
                                width: "200px",
                              }}
                            >
                              {firNumber}
                            </span>
                          </i>
                        </u>
                      </b>
                    </td>
                    <td width="50%">
                      Date, time and place of occurrence :{" "}
                      {datetimeofcoourance || "__________"} {" , "}{" "}
                      {placeofoccurance || "_________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                        float: "right",
                        paddingLeft: "3rem",
                      }}
                    ></td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                        float: "right",
                      }}
                    >
                      <b>C.D.DATED</b>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {producedDateTime}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              <b>
                {" "}
                OFFENCE u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {sectionOfLaw}
                </span>{" "}
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ paddingLeft: "3rem" }}>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                      width="2%"
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Date (hour) on which action was taken
                    </td>

                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {datetimeofFIR}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      2
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Name of the complainant{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        textAlign: "justify",
                        width: "200px",
                      }}
                    >
                      {complainantname || "________"}{" "}
                      {complainantaddress || "__________"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      3
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Names of accused, known if any
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {accusedList.map((item, index) => {
                        const personalDetails = getPersonPersonalDetailsPrint(
                          item?.personalDetails
                        );
                        const personalAddress = getPersonPersonalAddressPrint(
                          item?.presentAddress
                        );
                        return (
                          <div key={index} style={{ marginBottom: 5 }}>
                            {personalDetails} {personalAddress}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      4
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Property lost
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {propertystolen}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      5
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Property recovered
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {propertyrecovred}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      6
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Date and time of last case diary if the case diary is not
                      the first one.{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="2%"
                    >
                      7
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Name and address of the deceased if any.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        textAlign: "justify",
                        width: "200px",
                      }}
                    >
                      {victimDetails.map((accEle, index) => {
                        return (
                          <span>{`${
                            accEle?.victimType === "Deceased"
                              ? accEle.person?.personalDetails?.name
                              : ""
                          } ${
                            accEle?.victimType === "Deceased" &&
                            accEle.person?.personalDetails?.gender
                              ? `${accEle.person?.personalDetails?.gender} ,`
                              : ""
                          } 
                      ${
                        accEle?.victimType === "Deceased" &&
                        accEle.person?.presentAddress?.houseNo
                          ? `${accEle.person?.presentAddress?.houseNo} ,`
                          : ""
                      } 
                      ${
                        accEle?.victimType === "Deceased" &&
                        accEle.person?.presentAddress?.wardColony
                          ? `${accEle.person?.presentAddress?.wardColony} ,`
                          : ""
                      } 
                      ${
                        accEle?.victimType === "Deceased" &&
                        accEle.person?.presentAddress?.streetRoadNo
                          ? `${accEle.person?.presentAddress?.streetRoadNo} ,`
                          : ""
                      }
                      ${
                        accEle?.victimType === "Deceased" &&
                        accEle.person?.presentAddress?.district
                          ? `${accEle.person?.presentAddress?.district} `
                          : ""
                      } 
                      `}</span>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                      width="2%"
                    >
                      8
                    </td>
                    <td
                      style={{
                        padding: "0 10px",

                        width: "200px",
                      }}
                    >
                      Names of the witnesses.{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",

                        width: "200px",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ paddingLeft: "3rem" }}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      L W 1
                    </td>
                    <td
                      width="80%"
                      style={{
                        padding: "0 10px",
                        textAlign: "justify",
                      }}
                    >
                      {complainantname || "_________"}
                      {complainantaddress}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      L W 1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      L W 1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>
              <h5>
                <u>IN THE COURT OF HONOURABLE {courtName || "_____________"}</u>
                <br />
              </h5>
            </td>
          </tr>
          <tr>
            <td>Honoured Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp; This is a case of{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                occurred at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {datetimeofFIR}
                </span>{" "}
                which falls under PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                within the territorial jurisdiction of Honourable Court.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp; The facts of the case are that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                at hrs{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>
                LW1 herein presented a report stating that <br />
                <br />
                <div
                  style={{
                    padding: "0 10px",
                  }}
                ></div>
                <br />
                <div
                  style={{
                    padding: "0 10px",
                  }}
                ></div>
                <br />.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp; As per contents of report L.W.{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                registered a case in C.No.
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {firNumber}
                </span>{" "}
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {sectionOfLaw}
                </span>
                and L.W. took up investigation.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of investigation
                L.W. examined and recorded statement witnesses who were all well
                acquainted with facts and circumstances of the case.
              </p>
              <ul style={{ listStyle: "none" }}>
                <li>
                  <u>L W 1</u> :{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  ></span>
                  Speaks to contents of FIR
                </li>
                <li>
                  <u>L W 2</u> :{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  ></span>{" "}
                  Speaks to
                </li>
                <li>
                  <u>L W 3</u> :{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  ></span>{" "}
                  Speaks to
                </li>
                <li>
                  <u>L W 4</u> :{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  ></span>{" "}
                  Speaks to
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Further L.W.
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                also visited scene of offence and issued crime detail form in
                presence of two mediators L.Ws.5 and 6.
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Thereafter, the IO made efforts
                for accused and on
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfReport}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {timeofreport}
                </span>{" "}
                hrs apprehended the accused
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {accusedName}
                </span>{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {afatherHusbandGuardianName}
                </span>{" "}
                age{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {accusedAge}
                </span>{" "}
                yrs occ:{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {aoccupation}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {personAddress}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                and brought him to PS. The IO questioned the accused. As the
                accused is in a mood to confess the offence the IO secured two
                mediators L.Ws.7 and 8 and recorded detailed confessional
                statement of accused. The accused confessed to have committed
                the offence. In pursuance of the confession the IO seized
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                under cover of confessional cum seizure panchanama.
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Further the accused is involved in
                following criminal cases:
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Sl.No.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Police station{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Crime No
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Section of Law
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Date of report
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Stage
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {policeStation}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {firNumber}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {sectionOfLaw}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {dateOfReport}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    ></td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              It is essential to arrest the accused as:
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <ul>
                <li>
                  <i>
                    To prevent hims from committing any further offence or,{" "}
                  </i>
                </li>
                <li>
                  <i>For proper investigation of the offence or , </i>
                </li>
                <li>
                  <i>
                    To prevent him from causing the evidence of the offence to
                    disappear or tampering with such evidence in any manner; or
                  </i>
                </li>
                <li>
                  <i>
                    To prevent him from making any inducement, threat or promise
                    to any person acquainted with the facts of the case so as to
                    dissuade him from disclosing such facts to the Court or to
                    the police officer; or
                  </i>
                </li>
                <li>
                  <i>
                    to prevent himsuch person making any inducement, threat of
                    promise to any person acquainted with the facts of the case
                    so as to dissuade him from disclosing such facts to the
                    court,{" "}
                  </i>
                </li>
                <li>
                  <i>
                    As unless such person is arrested, his presence in the court
                    whenever required cannot be ensured
                  </i>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence, arrested the accused on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                hrs and issued card against the accused. Procedure laid down u/s
                41B followed while affecting the arrest. Notice u/s 50 Cr.P.C.
                issued to the accused and notice u/s 50A CrP.C. issued to their
                known persons.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;The accused was also subjected to
                medical examination u/s 54 Cr.P.C.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Thus, the investigation disclosed
                that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;The arrested accused are herewith
                produced alongwith this remand report and it is prayed that the
                Honourable court may kindly remand them to judicial custody
                pending completion of investigation.
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={"2"}
                  />
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
