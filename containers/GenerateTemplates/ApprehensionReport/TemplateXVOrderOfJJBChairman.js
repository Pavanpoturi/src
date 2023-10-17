import { isUndefined } from "lodash";
import moment from "moment";
import { TIME_FORMAT, DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateXVOrderOfJJBChairman({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedName = "",
    personAddress = "",
    gender = "",
    occupation = "",
    fatherHusbandGuardianName = "",
    accusedAge = "",
    phone = "",
    caste = "",
    producedDateBeforeJJBoard = "",
    IOName = "",
    district = "",
    cclCode = "",
    intimationgivento,
    relationToCCL = "",
    accusedPersonalDetails = {},
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <b>
                <u>
                  INTIMATION OF APPREHENSION OF A CHILD IN CONFLICT WITH LAW TO
                  HIS/HER PARENTS GUARDIAN VIDE SECTION 13 (A) OF JUVENILE
                  JUSTICE ACT -2000
                </u>
              </b>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <br />
              Whereas (name of the Child):
              <br />
              <br />
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                    textAlign: "justify",
                  }}
                >
                  <tr>
                    <td colSpan="2">
                      Name and address of the Child in Conflict with Law <br />
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="10%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      {accusedPersonalDetails?.accusedCode || ""}
                      {","}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {`${accusedPersonalDetails?.personalDetails?.name}
                          ${
                            accusedPersonalDetails?.personalDetails
                              ?.fatherHusbandGuardianName
                              ? accusedPersonalDetails?.personalDetails
                                  ?.gender === "FeMale"
                                ? ", d/o : "
                                : ", s/o : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails
                          ?.fatherHusbandGuardianName || ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.gender
                              ? ","
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.gender || ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.age !==
                            " Years"
                              ? ", Age : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.age !==
                        " Years"
                          ? accusedPersonalDetails?.personalDetails?.age
                          : ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.occupation
                              ? ", occ : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.occupation ||
                        ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.caste
                              ? ", caste : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.caste || ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails
                              ?.nationality !== "  "
                              ? ", r/o : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.nationality ||
                        ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.phone
                              ? ", Contact No : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.phone || ""
                      }
                          `}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              </table>
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
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;Is apprehended in Cr.No{" "}
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
                </span>{" "}
                and has been kept in observation home at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>
                . He/She will be produced before the Juvenile Justice Board on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {producedDateBeforeJJBoard
                    ? moment(producedDateBeforeJJBoard).format(DATE_FORMAT)
                    : "__________"}
                </span>{" "}
                Hence you being parent / guardian of the CCL is hereby directed
                to be present at the Juvenile Justice Board{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {producedDateBeforeJJBoard
                    ? moment(producedDateBeforeJJBoard).format(DATE_FORMAT)
                    : "__________"}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {producedDateBeforeJJBoard
                    ? moment(producedDateBeforeJJBoard).format(TIME_FORMAT)
                    : "__________"}
                </span>{" "}
                hours.{" "}
              </p>
              <br />
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                  />
                </tbody>
              </table>
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
              {" "}
              <br />
              <br /> To ( parent / guardian of CCL)
              <table>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "100%",
                      }}
                    >
                      {`${
                        accusedPersonalDetails?.personalDetails
                          ?.fatherHusbandGuardianName || ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails
                              ?.fatherHusbandGuardianName
                              ? accusedPersonalDetails?.personalDetails
                                  ?.gender === "Female"
                                ? ", d/o : "
                                : ", s/o"
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails
                          ?.fatherHusbandGuardianName || ""
                      }   
                          ${
                            accusedPersonalDetails?.personalDetails?.occupation
                              ? ", occ : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.occupation ||
                        ""
                      }
                          ${
                            accusedPersonalDetails?.personalDetails?.caste
                              ? ", caste : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.caste || ""
                      }
                         
                          ${
                            accusedPersonalDetails?.nationality?.nationality ||
                            ""
                          }
                          ${
                            accusedPersonalDetails?.personalDetails?.phone
                              ? ", Contact No : "
                              : ""
                          } ${
                        accusedPersonalDetails?.personalDetails?.phone || ""
                      }
                          `}{" "}
                      - {relationToCCL}
                      <br />
                      <br />
                      <br />
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
