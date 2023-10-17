import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateNightCustodyRequisitionToObservationHome({
  fileName,
  data,
}) {
  console.log("data21", data);
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate = "",
    accusedName = "",
    personAddress = "",
    district = "",
    IOName = "",
    cclCode = "",
    gender = "",
    occupation = "",
    fatherHusbandGuardianName = "",
    accusedAge = "",
    phone = "",
    caste = "",
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
              The Incharge
              <br />
              Government Observation Home for boys
              <br />
              _________
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
                        {district}{" "}
                      </span>
                      - P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}{" "}
                      </span>
                      - Night custody of the Child in Conflict with law - reg.{" "}
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
                      PS
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
                cited, the below mentioned Child in Conflict with Law was
                apprehended in the above referred case. As the CCL could not be
                produced before the concerned court, it is requested to keep the
                CCL in your observation for the night.
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
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td colSpan="2">
                      NAME AND ADDRESS OF CHILD IN CONFLICT WITH LAW{" "}
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
                      {" "}
                      {accusedPersonalDetails?.accusedCode || " "}
                      {","}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        lineHeight: "20px",
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
                        }
                        ${
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
            <td>Escort : PC ---------------</td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
