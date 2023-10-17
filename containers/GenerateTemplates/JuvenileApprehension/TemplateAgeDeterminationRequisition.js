import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateHeader from "../TemplateHeader";
import TemplateSignature from "../TemplateSignature";

export default function TemplateAgeDeterminationRequisition({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate = "",
    accusedName = "",
    personAddress = "",
    gender = "",
    occupation = "",
    fatherHusbandGuardianName = "",
    accusedAge = "",
    phone = "",
    caste = "",
    hospitalName = "",
    district = "",
    IOName = "",
    cclCode = "",
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
              }}
            >
              <br />
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                GOVERNMENT OF TELANGANA
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                (POLICE DEPARTMENT)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={currentDate}
              />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              {" "}
              To,
              <br />
              The Professor
              <br />
              Department of Forensic Medicine
              <br />
              {hospitalName || "_________"} Medical College
              <br />
              _________
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}> Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>
                      - P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      - Potency test of the Child in Conflict with law u/s 53-A
                      Cr.P.C. - reg.{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      Cr.No{" "}
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
                        {" "}
                        {sectionOfLaw}{" "}
                      </span>
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      .
                    </td>
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
                &emsp;&emsp;&emsp;&nbsp;&nbsp;With reference to the subject
                cited, the below mentioned Child in Conflict with Law who is
                apprehended in the above referred rape case is herewith
                forwarded and it is requested to conduct potency test and
                furnish the report for the purpose of investigation.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      colSpan="2"
                      style={{ fontSize: 16, fontFamily: "Arial" }}
                    >
                      NAME AND ADDRESS OF CHILD IN CONFLICT WITH LAW <br />
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="10%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        lineHeight: "20px",
                      }}
                    >
                      {cclCode || " "} &nbsp;&nbsp;&nbsp;
                    </td>
                    <td
                      width="60%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        lineHeight: "20px",
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
                            ?.nationality !== " "
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
                </tbody>
              </table>
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
                  />
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Escort : PC ---------------
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
